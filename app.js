import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import httpErrors from "@uphold/http-errors";
const { NotFoundError } = httpErrors;

import experienceRouter from "./routers/experienceRouter.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log(`Connected to MongoDB`);
  })
  .catch((err) => {
    console.log("Error occured:", err);
  });

app.use(
  "*",
  cors({
    origin: "*",
    methods: "GET,HEAD,POST,PUT,PATCH,DELETE",
  })
);

app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});
app.use(express.json());

// routes
app.use("/api/v1/experience", experienceRouter);

// no endpoint
app.use((req, res, next) => {
  const error = new Error("Endpoint not found!");
  error.status = 404;
  next(error);
});

// error handler
app.use((error, req, res, next) => {
  console.log(error);
  res.status(error.status).json({
    error: error.error,
    status: error.status,
  });
});

app.listen(port, () => {
  console.log(`Connected to port: ${port}`);
});

import express from "express";
const router = express.Router();

import {
  getAllExperience,
  addNewExperience,
} from "../controllers/ExperienceConstroller.js";

router
  .route("/")
  .get(getAllExperience)
  .post(addNewExperience);

export default router;

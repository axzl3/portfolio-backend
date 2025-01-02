import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";
import httpErrors from "@uphold/http-errors";
const { BadRequestError } = httpErrors;

import Experience from "../models/Experience.js";

export const getAllExperience = async (
  req,
  res
) => {
  const experience = await Experience.find({});
  res.status(StatusCodes.OK).json({ experience });
};

export const addNewExperience = async (
  req,
  res,
  next
) => {
  const errorMessage = [];

  // session for commit and rollback
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // request body
    const {
      companyName,
      dateFrom,
      dateTo,
      isPresent,
    } = req.body;

    // check for empty values
    if (!companyName) {
      errorMessage.push({
        message: "Company name is required!",
        path: "companyName",
      });
    }

    if (!dateFrom) {
      errorMessage.push({
        message: "Date from is required!",
        path: "dateFrom",
      });
    }

    if (
      !dateTo &&
      (!isPresent ||
        isPresent === undefined ||
        isPresent === null)
    ) {
      errorMessage.push({
        message: "Date to is required!",
        path: "dateTo",
      });
    }

    if (
      isPresent === undefined ||
      isPresent === null
    ) {
      errorMessage.push({
        message: "This checkbox is required!",
        path: "isPresent",
      });
    }

    if (errorMessage.length !== 0) {
      throw new BadRequestError({
        error: errorMessage,
      });
    }

    // check if it's already exist
    const findExperience =
      await Experience.findOne({
        companyName,
        dateFrom,
        dateTo,
        isPresent,
      });
    if (findExperience) {
      throw new BadRequestError({
        error: "Already exists!",
      });
    }

    // mongoose add
    const addExperience = new Experience({
      companyName,
      dateFrom,
      dateTo,
      isPresent,
    });

    const savedExperience =
      await addExperience.save({ session });
    await session.commitTransaction();
    session.endSession();

    res.status(StatusCodes.CREATED).json({
      message: "Created",
      id: savedExperience._id,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

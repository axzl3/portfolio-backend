import mongoose from "mongoose";
const { Schema } = mongoose;

const experienceSchema = new Schema({
  companyName: {
    type: String,
    required: true,
  },
  dateFrom: {
    type: Date,
    required: true,
  },
  dateTo: {
    type: Date,
    required: false,
  },
  isPresent: {
    type: Boolean,
    required: true,
    default: "false",
  },
});

export default mongoose.model(
  "Experience",
  experienceSchema
);

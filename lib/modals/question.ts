import { Schema, model, models } from "mongoose";

const QuestionSchema = new Schema(
  {
    name: { type: String, required: true },
    link: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },
    tags: { type: [String], required: true },
  },
  {
    timestamps: true,
  }
);

const Question = models.Question || model("Question", QuestionSchema);

export default Question;

import { Schema, models, model, Types } from "mongoose";

interface IAnswer {
  questionId: Types.ObjectId;
  authorId: Types.ObjectId;
  content: string;
  upvotes?: number;
  downvotes?: number;
}

const answerSchema = new Schema<IAnswer>(
  {
    questionId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Question",
    },
    authorId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    content: { type: String, required: true },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Answer = models.answer || model<IAnswer>("Answer", answerSchema);

export default Answer;

import { Schema, models, model, Types, Document } from "mongoose";

interface IQuestion {
  title: string;
  content: string;
  tags?: Types.ObjectId[];
  views?: number;
  answers?: number;
  upvotes?: number;
  downvotes?: number;
  authorId: Types.ObjectId; // Use authorId to indicate it's an ID reference
}

export interface IQuestionDoc extends IQuestion, Document {}
const questionSchema = new Schema<IQuestion>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  tags: { type: [Schema.Types.ObjectId], ref: "Tag" },
  views: { type: Number, default: 0 },
  answers: { type: Number, default: 0 },
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
  authorId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
});

const Question =
  models?.Question || model<IQuestion>("Question", questionSchema);

export default Question;

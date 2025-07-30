import { Schema, models, model, Types, Document } from "mongoose";

interface ITagQuestion {
  tagId: Types.ObjectId;
  questionId: Types.ObjectId;
}

export interface ITagQuestionDoc extends ITagQuestion, Document {}
const tagQuestionSchema = new Schema<ITagQuestion>(
  {
    tagId: { type: Schema.Types.ObjectId, required: true, ref: "Tag" },
    questionId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Question",
    },
  },
  { timestamps: true }
);

const TagQuestion =
  models?.TagQuestion || model<ITagQuestion>("TagQuestion", tagQuestionSchema);

export default TagQuestion;

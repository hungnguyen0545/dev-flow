import { Schema, models, model, Types } from "mongoose";

interface ITagQuestion {
  tagId: Types.ObjectId;
  questionId: Types.ObjectId;
}

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
  models.tagQuestion || model<ITagQuestion>("TagQuestion", tagQuestionSchema);

export default TagQuestion;

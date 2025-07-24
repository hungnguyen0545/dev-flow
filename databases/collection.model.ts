import { Schema, models, model, Types } from "mongoose";

interface ICollection {
  authorId: Types.ObjectId;
  questionId: Types.ObjectId;
}

const collectionSchema = new Schema<ICollection>(
  {
    authorId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    questionId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Question",
    },
  },
  { timestamps: true }
);

const Collection =
  models.collection || model<ICollection>("Collection", collectionSchema);

export default Collection;

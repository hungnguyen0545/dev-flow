import { Schema, models, model, Types, Document } from "mongoose";

interface ICollection {
  authorId: Types.ObjectId;
  questionId: Types.ObjectId;
}

export interface ICollectionDoc extends ICollection, Document {}
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
  models.Collection || model<ICollection>("Collection", collectionSchema);

export default Collection;

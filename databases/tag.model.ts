import { Schema, models, model } from "mongoose";

interface ITag {
  name: string;
  questions?: number;
}

const tagSchema = new Schema<ITag>(
  {
    name: { type: String, required: true, unique: true },
    questions: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Tag = models.tag || model<ITag>("Tag", tagSchema);

export default Tag;

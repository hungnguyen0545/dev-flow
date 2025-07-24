import { Schema, models, model, Types } from "mongoose";

interface IVote {
  authorId: Types.ObjectId;
  contentId: Types.ObjectId;
  type: "upvote" | "downvote";
  content: "question" | "answer";
}

const voteSchema = new Schema<IVote>(
  {
    authorId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    contentId: { type: Schema.Types.ObjectId, required: true },
    type: { type: String, required: true, enum: ["upvote", "downvote"] },
    content: { type: String, required: true, enum: ["question", "answer"] },
  },
  { timestamps: true }
);

const Vote = models.vote || model<IVote>("Vote", voteSchema);

export default Vote;

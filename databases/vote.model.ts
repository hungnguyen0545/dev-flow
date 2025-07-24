import { Schema, models, model, Types, Document } from "mongoose";

interface IVote {
  authorId: Types.ObjectId;
  actionId: Types.ObjectId;
  type: "upvote" | "downvote";
  actionType: "question" | "answer";
}

export interface IVoteDoc extends IVote, Document {}
const voteSchema = new Schema<IVote>(
  {
    authorId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    actionId: { type: Schema.Types.ObjectId, required: true },
    type: { type: String, required: true, enum: ["upvote", "downvote"] },
    actionType: {
      type: String,
      required: true,
      enum: ["question", "answer"],
    },
  },
  { timestamps: true }
);

const Vote = models.Vote || model<IVote>("Vote", voteSchema);

export default Vote;

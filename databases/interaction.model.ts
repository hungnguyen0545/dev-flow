import { Schema, models, model, Types, Document } from "mongoose";

interface IInteraction {
  userId: Types.ObjectId;
  action: string;
  actionId: Types.ObjectId;
  actionType: "question" | "answer";
}

export interface IInteractionDoc extends IInteraction, Document {}
const interactionSchema = new Schema<IInteraction>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    action: { type: String, required: true }, // 'upvote', 'downvote', 'view', 'ask_question',
    actionId: { type: Schema.Types.ObjectId, required: true }, // questionId or answerId
    actionType: {
      type: String,
      required: true,
      enum: ["question", "answer"],
    },
  },
  { timestamps: true }
);

const Interaction =
  models.Interaction || model<IInteraction>("Interaction", interactionSchema);

export default Interaction;

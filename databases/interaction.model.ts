import { Schema, models, model, Types } from "mongoose";

interface IInteraction {
  userId: Types.ObjectId;
  action: string;
  actionId: Types.ObjectId;
  actionType: "question" | "answer";
}

const interactionSchema = new Schema<IInteraction>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    action: { type: String, required: true },
    actionId: { type: Schema.Types.ObjectId, required: true },
    actionType: {
      type: String,
      required: true,
      enum: ["question", "answer"],
    },
  },
  { timestamps: true }
);

const Interaction =
  models.interaction || model<IInteraction>("Interaction", interactionSchema);

export default Interaction;

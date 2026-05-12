import mongoose from "mongoose";
import { nanoid } from "nanoid";

const TodoSchema = new mongoose.Schema({
  _id: { type: String },
  name: { type: String, required: true },
  checked: { type: Boolean, required: true, default: false },
  userId: { type: String, required: true },
});

export const TodoModel = mongoose.model("todoss", TodoSchema);

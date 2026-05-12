import express from "express";
import { nanoid } from "nanoid";
import { TodoModel } from "../models/todo-model.js";
import { auth } from "../authmiddleware.js";
const router = express.Router();
router.get("/all", async (req, res) => {
  const todos = await TodoModel.find();
  return res.send(todos);
});

router.get("/", async (req, res) => {
  const todos = await TodoModel.find({ userId: req.user._id });
  return res.send(todos);
});

router.post("/api/todos", auth, async (req, res) => {
  const name = req.body?.name;
  if (!name) {
    return res.status(400).send({ message: "body must have name" });
  }
  const newTodo = await TodoModel.create({
    _id: nanoid(),
    userId: req.user._id,
    name,
  });
  return res.send(newTodo);
});

router.delete("/:id", auth, async (req, res) => {
  const id = req.params.id;
  const user = req.user;
  const deletingItem = await TodoModel.findOne({ _id: id });
  if (!deletingItem) {
    return res.status(404).send({ message: "Todo not found" });
  }
  if (user._id !== deletingItem.userId) {
    return res.status(403).send({ message: "forbidden" });
  }
  await TodoModel.deleteOne({ _id: deletingItem._id });

  return res.send(deletingItem);
});

router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const updatingItem = await TodoModel.findById(id);
  if (!updatingItem) {
    return res.status(404).send({ message: "Todo not found" });
  }
  const { name, checked } = req.body;
  if (name === undefined && checked === undefined) {
    return res
      .status(400)
      .send({ message: "Body must have atleast name or checked" });
  }
  const updatedTodo = {
    ...updatingItem.toJSON(),
    ...(name && { name }),
    ...(checked !== undefined && { checked }),
    new: true,
  };
  await TodoModel.updateOne({ _id: id }, updatedTodo);

  return res.send(updatedTodo);
});
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const item = await TodoModel.findById(id);
  if (!item) {
    return res.status(404).send({ message: "Todo not found" });
  }
  return res.send(item);
});
export default router;

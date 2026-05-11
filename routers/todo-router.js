import express from "express";
import fs from "fs";
import { nanoid } from "nanoid";
const router = express.Router();
const fileData = fs.readFileSync("./data.json", "utf-8");
let todos = JSON.parse(fileData);
const updateTodoFiles = () => {
  fs.writeFileSync("./data.json", JSON.stringify(todos), "utf-8");
};

router.get("/", (req, res) => {
  return res.send(todos);
});

router.post("/api/todos", (req, res) => {
  const name = req.body?.name;
  if (!name) {
    return res.status(400).send({ message: "Body must have name" });
  }
  const newTodo = {
    id: nanoid(),
    checked: false,
    name,
  };
  todos.push(newTodo);
  updateTodoFiles();
  return res.send(newTodo);
});

router.delete("/:id", (req, res) => {
  const id = req.params.id; //string
  const deletingItem = todos.find((todo) => todo.id == id);
  if (!deletingItem) {
    return res.status(404).send({ message: "Todo not found" });
  }
  todos = todos.filter((todo) => todo.id != id);
  updateTodoFiles();
  return res.send(deletingItem);
});

router.put("/:id", (req, res) => {
  const id = req.params.id;
  const updatingItem = todos.find((todo) => todo.id == id);
  if (!updatingItem) {
    return res.status(404).send({ message: "Todo not found" });
  }
  const { name, checked } = req.body;
  console.log({ name, checked });
  console.log(!name);
  console.log(checked === undefined);
  if (!name || checked !== undefined) {
    return res
      .status(400)
      .send({ message: "Body must have atleast name or checked" });
  }
  const updatedTodo = {
    ...updatingItem,
    ...(name && { name }),
    ...(checked !== undefined && { checked }),
  };
  todos = todos.map((todo) => {
    if (todo.id == id) {
      return updatedTodo;
    }
    return todo;
  });
  updateTodoFiles();
  return res.send(updatedTodo);
});
router.get("/:id", (req, res) => {
  const rawToken = req.headers.authorization;
  if (!rawToken.startsWith("Bearer")) {
    return res.status(401).send({ message: "Invalid token" });
  }
  const token = rawToken.split(" ")[1];
  let playload = null;
  try {
    playload = jwt.verify(token, "Blub123");
  } catch (e) {
    return res.status(401).send({ message: "Invalid token" });
  }
  const existingUser = users.find((user) => user.id === playload.id);
  return res.send(existingUser);
  const id = req.params.id;
  const item = todos.find((todo) => todo.id === id);
  if (!item) {
    return res.status(404).send({ message: "todo not found" });
  }
  return res.send(item);
});
export default router;

import express from "express";

const app = express();
app.use(express.json());

let todos = [{ id: 1, name: "Wake up", checked: false }];

app.get("/api/todos", (req, res) => {
  return res.send(todos);
});

app.post("/api/todos", (req, res) => {
  const name = req.body?.name;
  if (!name) {
    return res.status(400).send({ message: "Body must have name" });
  }
  const newTodo = {
    id: todos[todos.length - 1].id + 1,
    checked: false,
    name,
  };
  todos.push(newTodo);
  return res.send(newTodo);
});

app.delete("/api/todos/:id", (req, res) => {
  const id = req.params.id; //string
  const deletingItem = todos.find((todo) => todo.id == id);
  if (!deletingItem) {
    return res.status(404).send({ message: "Todo not found" });
  }
  todos = todos.filter((todo) => todo.id != id);
  return res.send(deletingItem);
});

app.put("/api/todos/:id", (req, res) => {
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
  return res.send(updatedTodo);
});

app.listen(5400, () => {
  console.log("Server is running on http://localhost:5400");
});

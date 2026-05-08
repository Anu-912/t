import express from "express";
import fs from "fs";
import { nanoid } from "nanoid";
import bcrypt from "bcrypt";
import todoRouter from "./routers/todo-router.js";
import authRouter from "./routers/auth-router.js";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/todos", todoRouter);
app.use("/api/auth", authRouter);

const userData = fs.readFileSync("./user.json", "utf-8");

let users = JSON.parse(userData);

const updateUserFile = () => {
  fs.writeFileSync("./user.json", JSON.stringify(users), "utf-8");
};

app.get("/api/user", (req, res) => {
  return res.send(users);
});

app.listen(5400, () => {
  console.log("Server is running on http://localhost:5400");
});

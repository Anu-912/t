import express from "express";
import cors from "cors";
import todoRouter from "./routers/todo-router.js";
import authRouter from "./routers/auth-router.js";
import mongoose from "mongoose";
import { userModel } from "./models/usermodel.js";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/todos", todoRouter);
app.use("/api/auth", authRouter);

app.get("/api/user", async (req, res) => {
  const user = await userModel.find;
  return res.send(user);
});

app.listen(5400, async () => {
  await mongoose.connect(
    "mongodb+srv://anudari:Anudari-0912@cluster0.g1fnxq4.mongodb.net/todo",
  );
  console.log("Server is running on http://localhost:5400");
});

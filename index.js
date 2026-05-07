import express from "express";
import fs from "fs";
import { nanoid } from "nanoid";
import bcrypt from "bcrypt";
import todoRouter from "./routers/todo-router.js";

const app = express();
app.use(express.json());

app.use("/api/todos", todoRouter);

const userData = fs.readFileSync("./user.json", "utf-8");

let users = JSON.parse(userData);

const updateUserFile = () => {
  fs.writeFileSync("./user.json", JSON.stringify(users), "utf-8");
};

app.get("/api/user", (req, res) => {
  return res.send(users);
});
app.post("/api/user/check", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .send({ message: "Body must have username and password" });
  }

  // testPassword.test(password);
  const existingUser = users.find((user) => user.username === username);
  const isMatching = bcrypt.compareSync(password, existingUser.password);
  return res.send(isMatching);
});
app.post("/api/user", (req, res) => {
  if (
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      password,
    )
  ) {
    return res.status(400).send({
      message:
        "Password must include at least 8 characters, upper case, lower case, special characters and numbers.",
    });
  }
  const hashedPassword = bcrypt.hashSync(password, 10);

  // ^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$ regex of password
  const newUser = {
    id: nanoid(),
    username,
    password: hashedPassword,
  };
  users.push(newUser);
  updateUserFile();
  return res.send(newUser);
});

app.listen(5400, () => {
  console.log("Server is running on http://localhost:5400");
});

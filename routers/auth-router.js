import express from "express";
import { nanoid } from "nanoid";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userModel } from "../models/user-model.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .send({ message: "Body must have username and password" });
  }

  const existingUser = await userModel.findOne({ username: username });

  if (existingUser) {
    return res.status(400).send({ message: "Username already exists" });
  }

  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])[A-Za-z\d@$!%*?&.#_-]{8,}$/;
  if (!regex.test(password)) {
    return res.status(400).send({
      message: `
Password must contain:
- At least 8 characters
- One uppercase letter
- One lowercase letter
- One number
- One special character
    `,
    });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  const newUser = await userModel.create({
    _id: nanoid(),
    username,
    password: hashedPassword,
  });
  return res.send(newUser);
});
router.post("/signin", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .send({ message: "Body must have username and password" });
  }
  const existingUser = await userModel.findOne({ username: username });
  if (!existingUser) {
    return res.status(401).send({ message: "wrong credentials" });
  }
  const isMatching = bcrypt.compareSync(password, existingUser.password);
  if (!isMatching) {
    return res.status(401).send({ message: "wrong credentials" });
  }
  const { password: hashedPassword, ...userWithoutPassword } =
    existingUser.toJSON();
  const accessToken = jwt.sign(userWithoutPassword, "Blub123", {
    expiresIn: "5m",
  });
  return res.send({ message: "successfully signed in", accessToken });
});
router.get("/me", (req, res) => {
  return res.send(req.user);
});
export default router;

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import User from "./models/user.js";

const uri = "mongodb://127.0.0.1:27017/myAppDB";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected successfully!"))
  .catch(err => console.error("MongoDB connection error:", err));

const PORT = 8000;
const app = express();

app.use(express.json());
app.use(cors());

// === REGISTER ===
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const newUser = new User({ name, email, password });
    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user: { id: newUser._id, name: newUser.name, email: newUser.email }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// === LOGIN ===
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.password !== password) return res.status(401).json({ message: "Invalid password" });

    res.status(200).json({
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// === GET TODOS ===
app.get("/todos/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ todos: user.todos });
  } catch (err) {
    console.error("Get todos error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// === ADD TODO ===
app.post("/todos/:userId", async (req, res) => {
  const { userId } = req.params;
  const { title } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.todos.push({ title });
    await user.save();

    res.status(201).json({ todos: user.todos });
  } catch (err) {
    console.error("Add todo error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// === TOGGLE TODO ===
app.patch("/todos/:userId/:todoId", async (req, res) => {
  const { userId, todoId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const todo = user.todos.id(todoId);
    if (!todo) return res.status(404).json({ message: "Todo not found" });

    todo.completed = !todo.completed;
    await user.save();

    res.status(200).json({ todos: user.todos });
  } catch (err) {
    console.error("Toggle todo error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// === DELETE TODO ===
app.delete("/todos/:userId/:todoId", async (req, res) => {
  const { userId, todoId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.todos.id(todoId).remove();
    await user.save();

    res.status(200).json({ todos: user.todos });
  } catch (err) {
    console.error("Delete todo error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

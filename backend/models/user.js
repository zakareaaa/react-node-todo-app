  import mongoose from "mongoose";

  const todoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  });

  const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    todos: [todoSchema]
  });

  const User = mongoose.model("User", userSchema);
  export default User;

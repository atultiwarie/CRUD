require("dotenv").config();
const express = require("express");
const app = express();
const connectDB = require("./config/db");
const PORT = process.env.PORT || 5000;
const User = require("./models/users");
const path = require("path");

connectDB();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// GET: Home Page - Display All Users
app.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.render("index", { users });
  } catch (err) {
    console.error("Error fetching users:", err.message);
    res.status(500).send("Server Error");
  }
});

// POST: Create a User
app.post("/create", async (req, res) => {
  try {
    const { name, username, email } = req.body;
    if (!name || !username || !email) {
      return res.status(400).send("All fields are required");
    }
    await User.create({ name, username, email });
    res.redirect("/");
  } catch (err) {
    console.error("Error creating user:", err.message);
    res.status(500).send("Server Error");
  }
});

// GET: Edit Page - Render Edit Form
app.get("/update/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.render("edit", { user });
  } catch (err) {
    console.error("Error loading edit form:", err.message);
    res.status(500).send("Server Error");
  }
});

// POST: Update User Info
app.post("/update/:id", async (req, res) => {
  try {
    const { name, username, email } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { name, username, email },
      { new: true }
    );
    if (!updated) {
      return res.status(404).send("User not found");
    }
    res.redirect("/");
  } catch (err) {
    console.error("Error updating user:", err.message);
    res.status(500).send("Server Error");
  }
});

// GET: Delete a User
app.get("/delete/:id", async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).send("User not found");
    }
    res.redirect("/");
  } catch (err) {
    console.error("Error deleting user:", err.message);
    res.status(500).send("Server Error");
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on: http://localhost:${PORT}`);
});

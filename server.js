const express = require("express"); // web framework for Node.js - module to create a server
const mongoose = require("mongoose"); // module to connect to MongoDB
const bodyParser = require("body-parser");
const path = require("path");
const ejs = require("ejs"); // template engine for rendering HTML pages
const Expense = require("./models/Expense");
const methodOverride = require('method-override');

const app = express();
app.use(express.json());
app.use(methodOverride('_method'));

const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/expense-tracker";

mongoose.connect(mongoURI).then(() => {
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.error("MongoDB connection error:", err);
});

app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});

app.get("/", (req, res) => {
  res.send("Home page");
});

app.get("/expenses", async (req, res) => {
    let expenses = await Expense.find({}); // Fetch all expenses from the database
    res.render("index.ejs", { expenses }); // Render the index page with the expenses data
});

app.get("/expenses/new", (req, res) => {
  res.render("new.ejs"); // Render the form to create a new expense
});

// Create a new expense
// The form submits to this route with POST method
app.post("/expenses", async (req, res) => {
  const { title, amount, date, category, notes } = req.body;

  // Set the date to the current date if it is not provided
  const expenseDate = date || new Date();

  const expense = new Expense({ 
    title, 
    amount, 
    date: expenseDate, 
    category, 
    notes 
  });

  try {
    await expense.save(); // Save the expense to the database
    // Redirect to the newly created expense's show page or render it directly
    res.status(201).render("show.ejs", { expense });
  } catch (error) {
    res.status(400).send(error);
  }
});

// Show a specific expense
app.get("/expenses/edit/:id", async (req, res) => {
  const id = req.params.id;
  const expense = await Expense.findById(id); // Find the expense by ID
  // If the expense is not found, send a 404 error
  if (!expense) {
    return res.status(404).send("Expense not found");
  }
  res.render("edit.ejs", { expense }); // Render the edit page with the expense data
});

// Update a specific expense
// The form submits to this route with PUT method
app.put("/expenses/:id", async (req, res) => {
  const { id } = req.params;
  const { title, amount, date, category, notes } = req.body;

  try {
    const expense = await Expense.findByIdAndUpdate(id, {
      title,
      amount,
      date,
      category,
      notes
    }, { new: true });

    // If the expense is not found, send a 404 error
    if (!expense) {
      return res.status(404).send("Expense not found");
    }

    res.status(200).render("show.ejs", { expense });
  } catch (error) {
    res.status(400).send(error);
  }
});
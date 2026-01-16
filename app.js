const express = require("express");
const fs = require("fs");
const app = express();
const PORT = 3000;

app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to Student API! ");
});

// Function to read students from JSON file
function readStudents() {
  const data = fs.readFileSync("students.json");
  return JSON.parse(data);
}

// Function to write students to JSON file
function writeStudents(data) {
  fs.writeFileSync("students.json", JSON.stringify(data, null, 2));
}

// GET all students
app.get("/students", (req, res) => {
  const students = readStudents();
  res.json(students);
});

// GET student by id
app.get("/student/:id", (req, res) => {
  const students = readStudents();
  const id = parseInt(req.params.id);

  const student = students.find(s => s.studentId === id);

  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  res.json(student);
});

// POST new student
app.post("/student", (req, res) => {
  const students = readStudents();
  const newStudent = req.body;

  newStudent.studentId = students.length ? students[students.length - 1].studentId + 1 : 1;

  students.push(newStudent);
  writeStudents(students);

  res.status(201).json(newStudent);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

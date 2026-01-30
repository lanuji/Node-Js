const express = require("express");
const fs = require("fs");
const app = express();
const PORT = 3000;

app.use(express.json());


app.get("/health", (req, res) => {
  return res.json({
    message:"Student API is Working! "});
});

function readStudents() {
  const data = fs.readFileSync("students.json");
  return JSON.parse(data);
}

function writeStudents(data) {
  fs.writeFileSync("students.json", JSON.stringify(data, null, 2));
}


app.get("/students", (req, res) => {
  const students = readStudents();
  res.json(students);
});


app.get("/student/:id", (req, res) => {
  const students = readStudents();
  const id = parseInt(req.params.id);

  const student = students.find(s => s.studentId === id);

  if (!student) {
    return res.status(404).json({ 
      status:404,
      message: "Student not found" });
  }

  res.json(student);
});


app.post("/student", (req, res) => {
  const students = readStudents();
  const {name , address,grade,subject} = req.body;

  if (!name){
      return res.status(400).json({
        status:400,
        message:"Bad Request:'name' field is required."
      });
  }

 const  newStudent ={studentId : students.length ? students[students.length - 1].studentId + 1 : 1 , name, address, grade, subject};

  students.push(newStudent);
  writeStudents(students);


  res.status(201).json({
    status:201,
    message: 'Student record created Successfully',
    data: newStudent
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

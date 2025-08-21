const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 4000;

// Path to students.json
const filePath = path.join(__dirname, "students.json");

// Middleware
app.use(bodyParser.json());
app.use(express.static("public")); // serves your frontend files

// --- Helper: Safe JSON Reader ---
function readStudentsFile(callback) {
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            console.error("❌ Error reading file:", err);
            return callback([]);
        }
        let students = [];
        try {
            students = JSON.parse(data || "[]");
        } catch (e) {
            console.error("⚠️ Invalid JSON in students.json, resetting to []");
            students = [];
        }
        callback(students);
    });
}

// --- GET: Fetch all students ---
app.get("/students", (req, res) => {
    readStudentsFile((students) => {
        res.json(students);
    });
});

// --- POST: Add a student ---
app.post("/students", (req, res) => {
    const newStudent = req.body;

    readStudentsFile((students) => {
        students.push(newStudent);

        fs.writeFile(filePath, JSON.stringify(students, null, 2), (err) => {
            if (err) {
                console.error("❌ Error writing file:", err);
                return res.status(500).send("Error saving student");
            }
            console.log("✅ Student added:", newStudent);
            res.json({ message: "Student added successfully!" });
        });
    });
});

// --- Start Server ---
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});

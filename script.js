const form = document.getElementById("studentForm");
const studentList = document.getElementById("studentList");

// Add student
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const roll = document.getElementById("roll").value;
  const dept = document.getElementById("dept").value;

  await fetch("/students", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, roll, dept })
  });

  form.reset();
  fetchStudents();
});

// Fetch & display students
async function fetchStudents() {
  const res = await fetch("/students");
  const students = await res.json();

  studentList.innerHTML = "";
  students.forEach(st => {
    const li = document.createElement("li");
    li.textContent = `${st.name} | Roll: ${st.roll} | Dept: ${st.dept}`;
    studentList.appendChild(li);
  });
}

// Load students on page load
fetchStudents();

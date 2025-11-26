const taskInput = document.getElementById("todo-task");
const addTaskBtn = document.getElementById("add-task-btn");
const pendingList = document.getElementById("pending-task");
const completedList = document.getElementById("completed-task");

function getTasks() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

function saveTasks(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function getCurrentTime() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = now.getMonth();
  const year = now.getFullYear();
  const hour = String(now.getHours()).padStart(2, "0");
  const minute = String(now.getMinutes()).padStart(2, "0");
  return `${day} ${month} ${year}, ${hour}:${minute}`;
}

function createTaskElement(task) {
  const li = document.createElement("li");
  const taskId = "task-" + Date.now();

  li.innerHTML = `
        <input type="checkbox" class="custom-checkbox" id="${taskId}" ${
    task.isCompleted ? "checked" : ""
  }>
        <label for="${taskId}" ">${task.task}</label>
        <span class="task-time">${task.status} on ${task.time}</span>
        <div class="task-actions">
            <button type="button" class="edit-btn">Edit</button>
            <button type="button" class="delete-btn">Delete</button>
        </div>
    `;

  return li;
}

function renderTasks() {
  pendingList.innerHTML = "";
  completedList.innerHTML = "";

  const tasks = getTasks();
  tasks.forEach((task) => {
    const newTask = createTaskElement(task);
    if (task.isCompleted) {
      completedList.appendChild(newTask);
    } else {
      pendingList.appendChild(newTask);
    }
  });
}

function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText === "") {
    alert("Please enter a task!");
    return;
  }

  const newTask = {
    task: taskText,
    time: getCurrentTime(),
    isCompleted: false,
    status: "created",
  };

  const tasks = getTasks();
  tasks.push(newTask);
  saveTasks(tasks);

  renderTasks();
  taskInput.value = "";
}
// NEED TO ADD MODIFED STATUS AND CHANGE TEXT SEARCH TO  ID SEACH (fix bugs of duplicate)
function handleClickEvents(event) {
  const target = event.target;
  const li = target.closest("li");
  if (!li) return;

  const label = li.querySelector("label");
  const taskText = label.innerText;

  let tasks = getTasks();

  if (target.classList.contains("delete-btn")) {
    tasks = tasks.filter((t) => t.task !== taskText);
    saveTasks(tasks);
    renderTasks();
  } else if (target.classList.contains("edit-btn")) {
    const currentText = taskText;
    const newText = prompt("Edit your task:", currentText);
    if (newText !== null && newText.trim() !== "") {
      tasks = tasks.map((t) =>
        t.task === currentText ? { ...t, task: newText.trim() } : t
      );
      saveTasks(tasks);
      renderTasks();
    }
  }
}

function handleCheckboxChange(event) {
  const target = event.target;
  const li = target.closest("li");
  if (!li || !target.classList.contains("custom-checkbox")) return;

  const label = li.querySelector("label");
  const taskText = label.innerText;

  let tasks = getTasks();
  tasks = tasks.map((t) =>
    t.task === taskText ? { ...t, isCompleted: target.checked } : t
  );
  saveTasks(tasks);

  renderTasks();
}

addTaskBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    addTask();
  }
});

pendingList.addEventListener("click", handleClickEvents);
completedList.addEventListener("click", handleClickEvents);

pendingList.addEventListener("change", handleCheckboxChange);
completedList.addEventListener("change", handleCheckboxChange);

renderTasks();



async function loadTodos() {
  const res = await fetch("/api/todos");
  const todos = await res.json();

  const tbody = document.getElementById("todoList");
  tbody.innerHTML = "";
  if (todos.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4">No task found</td></tr>';
    return;
  }

  todos.forEach(todo => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${todo.task}</td>
      <td>${todo.due_date ? todo.due_date.split("T")[0] : "N/A"}</td>
      <td>
        <input type="checkbox" ${todo.done ? "checked" : ""} 
          onchange="updateTodo(${todo.id}, this.checked)">
      </td>
      <td>
        <button onclick="deleteTodo(${todo.id})">Delete</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

async function addTodo() {
  const task = document.getElementById("todoInput").value;
  const due = document.getElementById("dueDate").value;
  if (!task.trim()) return;

  await fetch("/api/todos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ task, due_date: due })
  });
  document.getElementById("todoInput").value = "";
  document.getElementById("dueDate").value = "";
  loadTodos();
}

async function updateTodo(id, done) {
  await fetch("/api/todos", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, done })
  });
  loadTodos();
}

async function deleteTodo(id) {
  await fetch("/api/todos", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id })
  });
  loadTodos();
}

window.onload = loadTodos;

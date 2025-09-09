const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("./todos.db");

// bikin tabel kalau belum ada
db.run(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task TEXT,
    due_date TEXT,
    done INTEGER
  )
`);

// GET semua todo
app.get("/todos", (req, res) => {
  db.all("SELECT * FROM todos", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST tambah todo
app.post("/todos", (req, res) => {
  const { task, due_date } = req.body;
  db.run(
    "INSERT INTO todos (task, due_date, done) VALUES (?, ?, ?)",
    [task, due_date || null, 0],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, task, due_date, done: 0 });
    }
  );
});

// PUT update status
app.put("/todos/:id", (req, res) => {
  const { done } = req.body;
  db.run("UPDATE todos SET done = ? WHERE id = ?", [done, req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ updated: this.changes });
  });
});

// DELETE satu todo
app.delete("/todos/:id", (req, res) => {
  db.run("DELETE FROM todos WHERE id = ?", req.params.id, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

// DELETE semua todo
app.delete("/todos", (req, res) => {
  db.run("DELETE FROM todos", function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

// GET semua todos (dengan filter)
app.get("/todos", (req, res) => {
  const filter = req.query.filter || "all"; // default all
  let query = "SELECT * FROM todos";

  if (filter === "done") query += " WHERE done = 1";
  else if (filter === "havent") query += " WHERE done = 0";

  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.use(express.static(path.join(__dirname, "public")));
app.listen(5000, () => console.log("Server running on http://localhost:5000"));

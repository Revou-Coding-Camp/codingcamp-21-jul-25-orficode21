import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS todos (
      id SERIAL PRIMARY KEY,
      task TEXT NOT NULL,
      due_date DATE,
      done BOOLEAN DEFAULT false
    )
  `);
}

export default async function handler(req, res) {
  await initDB();

  if (req.method === "GET") {
    const result = await pool.query("SELECT * FROM todos ORDER BY id DESC");
    res.status(200).json(result.rows);
  } 
  else if (req.method === "POST") {
    const { task, due_date } = req.body;
    await pool.query("INSERT INTO todos (task, due_date) VALUES ($1, $2)", [
      task,
      due_date || null
    ]);
    res.status(201).json({ message: "Task added" });
  } 
  else if (req.method === "PUT") {
    const { id, done } = req.body;
    await pool.query("UPDATE todos SET done=$1 WHERE id=$2", [done, id]);
    res.status(200).json({ message: "Task updated" });
  } 
  else if (req.method === "DELETE") {
    const { id } = req.body;
    await pool.query("DELETE FROM todos WHERE id=$1", [id]);
    res.status(200).json({ message: "Task deleted" });
  } 
  else {
    res.status(405).end();
  }
}

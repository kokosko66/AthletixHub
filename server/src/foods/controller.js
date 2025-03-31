import { queries } from "./queries.js";
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "password",
  database: "ATHLETIXHUB",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const getFoods = async (req, res) => {
  try {
    const [rows] = await pool.query(queries.getFoods);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getFoodById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(queries.getFoodById, [id]);
    if (rows.length === 0)
      return res.status(404).json({ message: "Food not found" });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getFoodByName = async (req, res) => {
  try {
    const { name } = req.params;
    const [rows] = await pool.query(queries.getFoodByName, [name]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addFood = async (req, res) => {
  try {
    const { name, calories } = req.body;
    await pool.query(queries.addFood, [name, calories]);
    res.status(201).json({ message: "Food added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateFood = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, calories } = req.body;
    const [result] = await pool.query(queries.updateFood, [name, calories, id]);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Food not found" });
    res.json({ message: "Food updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteFood = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query(queries.deleteFood, [id]);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Food not found" });
    res.json({ message: "Food deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

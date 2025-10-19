const db = require("../config/database");

// Get all errors
async function getAllErrors() {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM errors ORDER BY created_at DESC"
    );
    return rows;
  } catch (error) {
    console.error("Model Error (getAll):", error);
    throw new Error("Failed to fetch errors");
  }
}

// Get error by ID
async function getErrorById(id) {
  try {
    const [rows] = await db.execute("SELECT * FROM errors WHERE id = ?", [id]);
    return rows[0];
  } catch (error) {
    console.error("Model Error (getById):", error);
    throw new Error("Failed to fetch error");
  }
}

// Create error (used by search and manual add)
async function createError(error_message, solution) {
  try {
    // FIX: Use 'query' column name instead of 'error_message'
    const [result] = await db.execute(
      "INSERT INTO errors (query, solution) VALUES (?, ?)",
      [error_message, solution]
    );

    // Fetch the inserted row to get the exact DB timestamp and full row
    const [rows] = await db.execute("SELECT * FROM errors WHERE id = ?", [
      result.insertId,
    ]);
    return rows[0];
  } catch (error) {
    console.error("Model Error (create):", error);
    throw new Error("Failed to store error");
  }
}

// Delete error by ID
async function deleteError(id) {
  try {
    const [result] = await db.execute("DELETE FROM errors WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      throw new Error("Error not found");
    }
    console.log("✅ Error deleted from DB:", id);
    return true;
  } catch (error) {
    console.error("Model Error (delete):", error);
    throw new Error("Failed to delete error");
  }
}

module.exports = {
  getAllErrors,
  getErrorById,
  createError,
  deleteError,
};

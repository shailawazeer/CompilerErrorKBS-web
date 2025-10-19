const errorModel = require("../models/errorModel");
const { generateSolution } = require("../services/geminiService");

// Search error (Gemini + store)
async function searchError(req, res) {
  try {
    // accept either `error_message` (rich schema) or legacy `query`
    const error_message = (
      req.body.error_message ||
      req.body.query ||
      ""
    ).trim();
    if (
      !error_message ||
      typeof error_message !== "string" ||
      error_message.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Error message (or query) is required.",
      });
    }

    const solution = await generateSolution(error_message);
    const storedError = await errorModel.createError(error_message, solution);
    res.json({ success: true, solution, storedId: storedError.id });
  } catch (error) {
    console.error("Controller Error (search):", error);
    res.status(500).json({ success: false, message: error.message });
  }
}

// Get all errors
async function getAllErrors(req, res) {
  try {
    const errors = await errorModel.getAllErrors();
    res.json({
      success: true,
      data: errors,
      count: errors.length,
    });
  } catch (error) {
    console.error("Controller Error (getAll):", error);
    res.status(500).json({ success: false, message: error.message });
  }
}

// Add error manually
async function addError(req, res) {
  try {
    // accept either `error_message` or `query`
    const error_message = (
      req.body.error_message ||
      req.body.query ||
      ""
    ).trim();
    const solution = (req.body.solution || "").trim();

    if (!error_message || !solution) {
      return res.status(400).json({
        success: false,
        message: "Error message and solution required",
      });
    }

    const storedError = await errorModel.createError(error_message, solution);

    res.status(201).json({
      success: true,
      data: storedError,
    });
  } catch (error) {
    console.error("Controller Error (add):", error);
    res.status(500).json({ success: false, message: error.message });
  }
}

// Delete error
async function deleteError(req, res) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid ID" });
    }

    await errorModel.deleteError(id);

    res.json({ success: true, message: "Error deleted" });
  } catch (error) {
    console.error("Controller Error (delete):", error);
    res.status(500).json({ success: false, message: error.message });
  }
}
// Get error by ID
async function getErrorById(req, res) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid ID" });
    }

    const error = await errorModel.getErrorById(id);

    if (!error) {
      return res
        .status(404)
        .json({ success: false, message: "Error not found" });
    }

    res.json({ success: true, data: error });
  } catch (error) {
    console.error("Controller Error (getById):", error);
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = {
  searchError,
  getAllErrors,
  getErrorById,
  addError,
  deleteError,
};

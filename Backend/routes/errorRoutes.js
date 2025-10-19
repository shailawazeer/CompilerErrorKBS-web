const express = require("express");
const {
  searchError,
  getAllErrors,
  getErrorById,
  addError,
  deleteError,
} = require("../controllers/errorController");

const router = express.Router();

// Search with Gemini (POST /api/errors/search)
router.post("/search", searchError);

// Get all errors (GET /api/errors)
router.get("/", getAllErrors);

// Get single error by ID (GET /api/errors/:id)
router.get("/:id", getErrorById);

// Add error (POST /api/errors)
router.post("/", addError);

// Delete error (DELETE /api/errors/:id)
router.delete("/:id", deleteError);

module.exports = router;
// Get single error by ID (GET /api/errors/:id)
router.get("/:id", getErrorById); // Add this line

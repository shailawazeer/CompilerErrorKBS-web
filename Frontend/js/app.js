import { sendQuery, getHistory, getQuery, removeQuery } from "./api.js";
import {
  displaySolution,
  showFeedback,
  renderHistory,
  displayRetrievedSolution,
} from "./ui.js";

// Get elements
const $queryForm = document.getElementById("error-query-form");
const $errorInput = document.getElementById("error-input");
const $loadHistoryBtn = document.getElementById("load-history-btn");

/**
 * Handles the submission of a new error query.
 */
async function handleQuerySubmit(e) {
  e.preventDefault();
  const query = $errorInput.value.trim();

  if (!query) {
    showFeedback("Please enter an error query.", "error");
    return;
  }

  displaySolution("⏳ Searching for a solution... Please wait.");
  showFeedback("Querying Gemini API...", "info");

  try {
    const result = await sendQuery(query);
    const solution = result.solution || "No solution found.";
    displaySolution(solution);
    showFeedback("Solution found and saved!", "success");
    $errorInput.value = "";
  } catch (error) {
    console.error("Submission failed:", error);
    displaySolution("❌ Error: Could not retrieve solution. Please try again.");
    showFeedback("An error occurred during search.", "error");
  }
}

/**
 * Loads and renders the query history from the database.
 */
async function loadHistory() {
  showFeedback("Loading history...", "info");
  try {
    const queries = await getHistory();
    renderHistory(queries, handleViewQuery, handleRemoveQuery);
    showFeedback(`History loaded! (${queries.length} entries)`, "success");
  } catch (error) {
    console.error("Failed to load history:", error);
    showFeedback("Could not load history. Check database connection.", "error");
  }
}

/**
 * Handles the 'View' button click on a history item.
 */
async function handleViewQuery(id) {
  showFeedback("Retrieving solution...", "info");
  try {
    const query = await getQuery(id);
    displayRetrievedSolution(query);
    showFeedback("Solution retrieved!", "success");
  } catch (error) {
    console.error("Failed to view query:", error);
    showFeedback("Could not retrieve the solution.", "error");
  }
}

/**
 * Handles the 'Remove' button click on a history item.
 */
async function handleRemoveQuery(id) {
  if (!confirm("Are you sure you want to remove this query?")) {
    return;
  }

  showFeedback("Removing query...", "info");
  try {
    await removeQuery(id);
    showFeedback("Query removed successfully!", "success");
    loadHistory(); // Reload history
  } catch (error) {
    console.error("Failed to remove query:", error);
    showFeedback("Could not remove the query.", "error");
  }
}

// Event Listeners
$queryForm.addEventListener("submit", handleQuerySubmit);
$loadHistoryBtn.addEventListener("click", loadHistory);

// Get DOM elements
const $solutionOutput = document.getElementById("solution-output");
const $feedbackMessage = document.getElementById("feedback-message");
const $historyList = document.getElementById("history-list");
const $solutionBox = document.querySelector(".result-box");

/**
 * Updates the main solution display box with markdown formatting.
 * @param {string} solutionText The text to display.
 */
function displaySolution(solutionText) {
  // Simple markdown-to-HTML converter
  let formatted = solutionText
    // Headers
    .replace(/^## (.*$)/gim, "<h3>$1</h3>")
    .replace(/^### (.*$)/gim, "<h4>$1</h4>")

    // Bold
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")

    // Code blocks with language
    .replace(/```(\w+)?\n([\s\S]*?)```/g, "<pre><code>$2</code></pre>")

    // Inline code
    .replace(/`([^`]+)`/g, "<code>$1</code>")

    // Paragraphs - convert double line breaks to paragraphs
    .replace(/\n\n/g, "</p><p>")

    // Single line breaks
    .replace(/\n/g, "<br>");

  // Wrap in paragraph tags if not already
  if (!formatted.includes("<p>")) {
    formatted = "<p>" + formatted + "</p>";
  }

  $solutionOutput.innerHTML = formatted;
  $solutionBox.classList.remove("hidden");

  // Scroll to solution
  $solutionBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

/**
 * Displays a temporary feedback message (e.g., success, error, loading).
 * @param {string} message The message to display.
 * @param {string} type 'success', 'error', or 'info'.
 */
function showFeedback(message, type = "info") {
  $feedbackMessage.textContent = message;
  $feedbackMessage.className = type; // Use 'success' or 'error' class
  $feedbackMessage.classList.remove("hidden");

  // Clear message after 4 seconds
  setTimeout(() => {
    $feedbackMessage.classList.add("hidden");
  }, 4000);
}

/**
 * Renders the history list items.
 * @param {Array<object>} queries Array of query objects from the database.
 * @param {function} viewHandler Callback for the 'View' button.
 * @param {function} removeHandler Callback for the 'Remove' button.
 */
function renderHistory(queries, viewHandler, removeHandler) {
  $historyList.innerHTML = ""; // Clear existing list

  if (queries.length === 0) {
    $historyList.innerHTML = `
      <li style="text-align: center; color: var(--text-secondary); padding: 20px;">
        No queries saved in the Knowledge Base yet. Search for an error first!
      </li>
    `;
    return;
  }

  queries.forEach((query) => {
    const listItem = document.createElement("li");

    // Truncate long queries
    const displayText =
      query.query.length > 80
        ? query.query.substring(0, 80) + "..."
        : query.query;

    listItem.innerHTML = `
      <span title="${query.query}">${displayText}</span>
      <div class="actions">
        <button class="view-query" data-id="${query.id}">View</button>
        <button class="remove-query" data-id="${query.id}">Remove</button>
      </div>
    `;

    // Attach event listeners
    listItem
      .querySelector(".view-query")
      .addEventListener("click", () => viewHandler(query.id));
    listItem
      .querySelector(".remove-query")
      .addEventListener("click", () => removeHandler(query.id));

    $historyList.appendChild(listItem);
  });
}

/**
 * Displays the solution for a selected history item.
 * @param {object} query The query object containing query and solution.
 */
function displayRetrievedSolution(query) {
  displaySolution(query.solution);
  showFeedback(
    `Viewing solution for: ${query.query.substring(0, 50)}...`,
    "info"
  );
}

/**
 * Hides the history solution display.
 */
function hideRetrievedSolution() {
  $solutionBox.classList.add("hidden");
}

// Export functions
export {
  displaySolution,
  showFeedback,
  renderHistory,
  displayRetrievedSolution,
  hideRetrievedSolution,
};

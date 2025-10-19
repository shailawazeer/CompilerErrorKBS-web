const API_BASE = "http://localhost:3000/api/errors";

/**
 * Send a new query to search for solution
 */
export async function sendQuery(query) {
  const response = await fetch(`${API_BASE}/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ error_message: query }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}

/**
 * Get all queries from history
 */
export async function getHistory() {
  const response = await fetch(API_BASE);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.message || "Failed to fetch history");
  }

  return result.data || [];
}

/**
 * Get a single query by ID
 */
export async function getQuery(id) {
  const response = await fetch(`${API_BASE}/${id}`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.message || "Failed to fetch query");
  }

  return result.data;
}

/**
 * Remove a query by ID
 */
export async function removeQuery(id) {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}

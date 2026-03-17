const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';

async function parseResponse(response) {
  if (response.ok) {
    return response.status === 204 ? null : response.json();
  }

  let payload = {};
  try {
    payload = await response.json();
  } catch {
    payload = {};
  }

  const error = new Error(payload.message || 'Request failed');
  error.status = response.status;
  error.validationErrors = payload.validationErrors ?? {};
  throw error;
}

export async function fetchTasks() {
  const response = await fetch(`${API_BASE_URL}/api/tasks`);
  return parseResponse(response);
}

export async function createTask(task) {
  const response = await fetch(`${API_BASE_URL}/api/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(task)
  });

  return parseResponse(response);
}

export async function completeTask(taskId) {
  const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}/complete`, {
    method: 'PATCH'
  });

  return parseResponse(response);
}


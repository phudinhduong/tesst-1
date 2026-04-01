const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

async function getJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json();
}

export async function fetchStacks() {
  return getJson(`${API_BASE_URL}/stacks`);
}

export async function fetchSteps(stackId) {
  const query = stackId ? `?stackId=${encodeURIComponent(stackId)}` : '';
  return getJson(`${API_BASE_URL}/steps${query}`);
}

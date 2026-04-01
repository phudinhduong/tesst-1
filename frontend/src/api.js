const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

async function getJson(url) {
  const response = await fetch(url).catch(() => {
    throw new Error('Cannot reach API server. Check backend URL and CORS settings.');
  });

  if (!response.ok) {
    const suffix = response.statusText ? ` ${response.statusText}` : '';
    if (response.status === 404) {
      throw new Error('Requested guide data was not found (404).');
    }
    throw new Error(`API request failed with status ${response.status}${suffix}.`);
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

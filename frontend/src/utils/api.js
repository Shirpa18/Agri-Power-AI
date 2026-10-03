const API_BASE_URL = "http://127.0.0.1:8000";

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    let errorMessage = "Backend request failed.";

    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorMessage;
    } catch {
      // Keep default error message.
    }

    throw new Error(errorMessage);
  }

  return response.json();
}

export async function getFarm() {
  return request("/api/farm");
}

export async function getFarmDecision() {
  return request("/api/farm/decision");
}

export async function getWaterRequirement() {
  return request("/api/farm/water");
}

export async function getEnergyPlan() {
  return request("/api/farm/energy");
}

export async function getFarmIntelligence() {
  return request("/api/farm/intelligence");
}

export async function updateFarm(data) {
  return request("/api/farm/update", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function automaticPumpControl() {
  return request("/api/farm/automatic-control", {
    method: "POST",
  });
}

export async function sendSensorData(data) {
  return request("/api/sensors", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function simulateFarmState(data) {
  return request("/api/simulation", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getSensorHistory(limit = 50) {
  return request(`/api/sensors/history?limit=${limit}`);
}

export async function getDecisionHistory(limit = 50) {
  return request(`/api/decisions/history?limit=${limit}`);
}

export async function getHealth() {
  return request("/api/health");
}
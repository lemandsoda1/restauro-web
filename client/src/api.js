const BASE = "";

async function request(path, options = {}) {
  const token = localStorage.getItem("restauro_token");
  const headers = { ...options.headers };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Don't set Content-Type for FormData (browser sets boundary automatically)
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${BASE}${path}`, { ...options, headers });

  const isAuthEndpoint = path.startsWith("/api/auth/");

  // Only treat a 401 as an expired session when we actually sent a token and
  // it wasn't a login/register attempt — otherwise let the endpoint's own
  // error (e.g. "E-Mail oder Passwort ist ungültig.") surface to the form.
  if (res.status === 401 && token && !isAuthEndpoint) {
    localStorage.removeItem("restauro_token");
    localStorage.removeItem("restauro_user");
    window.location.href = "/login";
    throw new Error("Sitzung abgelaufen.");
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Anfrage fehlgeschlagen.");
  return data;
}

const api = {
  get: (path) => request(path),
  post: (path, body) =>
    request(path, { method: "POST", body: JSON.stringify(body) }),
  patch: (path, body) =>
    request(path, { method: "PATCH", body: JSON.stringify(body) }),
  upload: (path, formData) =>
    request(path, { method: "POST", body: formData }),
};

export default api;

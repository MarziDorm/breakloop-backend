const BASE_URL = "http://localhost:3000";

async function request(method, path, body) {
  const opts = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${BASE_URL}${path}`, opts);
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

// Habit API
export const habitApi = {
  list: () => request("GET", "/habit/list"),
  get: (id) => request("GET", `/habit/get?id=${id}`),
  create: (body) => request("POST", "/habit/create", body),
  update: (body) => request("POST", "/habit/update", body),
  delete: (id) => request("POST", "/habit/delete", { id }),
};

// UrgeEvent API
export const urgeEventApi = {
  list: (habitId) => request("GET", `/urgeEvent/list${habitId ? `?habitId=${habitId}` : ""}`),
  create: (body) => request("POST", "/urgeEvent/create", body),
  update: (body) => request("POST", "/urgeEvent/update", body),
  delete: (id) => request("POST", "/urgeEvent/delete", { id }),
};

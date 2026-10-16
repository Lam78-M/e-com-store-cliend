const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "/api").replace(
  /\/$/,
  "",
);

export const CATEGORIES = [
  { value: "drinks", label: "Drinks" },
  { value: "biscuits", label: "Biscuits" },
  { value: "fast-food", label: "Fast Food" },
  { value: "chocolate", label: "Chocolate" },
  { value: "snacks", label: "Snacks" },
  { value: "desserts", label: "Desserts" },
  { value: "canteen-items", label: "Canteen Items" },
  { value: "stationery", label: "Stationery" },
];

export class AdminApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "AdminApiError";
    this.status = status;
  }
}

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        ...(options.body instanceof FormData
          ? {}
          : { "Content-Type": "application/json" }),
        ...options.headers,
      },
      cache: "no-store",
    });
  } catch {
    throw new AdminApiError(
      `Could not reach the API. Check the backend connection and ${
        process.env.NEXT_PUBLIC_API_BASE_URL
          ? "NEXT_PUBLIC_API_BASE_URL"
          : "the local /api route"
      }.`,
    );
  }

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new AdminApiError(
      payload?.message || payload?.error || `Request failed (${response.status}).`,
      response.status,
    );
  }
  return payload;
}

function unwrapList(payload, key) {
  const list = Array.isArray(payload)
    ? payload
    : payload?.[key] ?? payload?.data?.[key] ?? payload?.data;
  if (!Array.isArray(list)) {
    throw new AdminApiError(`The API response did not contain a ${key} list.`);
  }
  return list;
}

function unwrapRecord(payload, key) {
  const record = payload?.[key] ?? payload?.data?.[key] ?? payload?.data ?? payload;
  if (!record || typeof record !== "object" || Array.isArray(record)) {
    throw new AdminApiError("The API returned an invalid record.");
  }
  return record;
}

export async function getProducts({ category, signal } = {}) {
  const query = category ? `?category=${encodeURIComponent(category)}` : "";
  return unwrapList(
    await request(`/products${query}`, { signal }),
    "products",
  );
}

export async function getProduct(id, { signal } = {}) {
  return unwrapRecord(
    await request(`/products/${encodeURIComponent(id)}`, { signal }),
    "product",
  );
}

export async function createProduct(product) {
  return unwrapRecord(
    await request("/products", {
      method: "POST",
      body: JSON.stringify(product),
    }),
    "product",
  );
}

export async function updateProduct(id, product) {
  return unwrapRecord(
    await request(`/products/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify(product),
    }),
    "product",
  );
}

export async function deleteProduct(id) {
  return request(`/products/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export async function getOrders({ status, signal } = {}) {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  return unwrapList(await request(`/orders${query}`, { signal }), "orders");
}

export async function updateOrder(id, changes) {
  return unwrapRecord(
    await request(`/orders/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify(changes),
    }),
    "order",
  );
}

export async function getCanteenSettings({ signal } = {}) {
  return unwrapRecord(await request("/canteen/settings", { signal }), "settings");
}

export async function updateCanteenSettings(settings) {
  return unwrapRecord(
    await request("/canteen/settings", {
      method: "PATCH",
      body: JSON.stringify(settings),
    }),
    "settings",
  );
}

export async function uploadProductImage(file) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  if (!cloudName || !uploadPreset) {
    throw new AdminApiError(
      "Image upload is not configured. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET to enable it.",
    );
  }

  const formData = new FormData();
  formData.set("file", file);
  formData.set("upload_preset", uploadPreset);
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/image/upload`,
    { method: "POST", body: formData },
  );
  const payload = await response.json().catch(() => null);
  if (!response.ok || typeof payload?.secure_url !== "string") {
    throw new AdminApiError(
      payload?.error?.message || "The product image could not be uploaded.",
      response.status,
    );
  }
  return payload.secure_url;
}

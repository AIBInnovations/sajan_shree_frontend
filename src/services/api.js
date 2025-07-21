// services/api.js
const API_BASE_URL =
  `${import.meta.env.VITE_API_URL}/api` || "http://localhost:3001/api";

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem("token");
    const config = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    };

    const response = await fetch(url, config);
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    return response.json();
  }

  // Orders
  getOrders() {
    return this.request("/orders");
  }

  getOrder(id) {
    return this.request(`/orders/${id}`);
  }

  createOrder(data) {
    return this.request("/orders", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  updateOrder(id, data) {
    return this.request(`/orders/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  // Products
  getProducts() {
    return this.request("/products");
  }

  getProduct(id) {
    return this.request(`/products/${id}`);
  }

  createProduct(data) {
    return this.request("/products", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  updateProduct(id, data) {
    return this.request(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  deleteProduct(id) {
    return this.request(`/products/${id}`, {
      method: "DELETE",
    });
  }

  // User Authentication
  login(data) {
    return this.request("/users/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  register(data) {
    return this.request("/users/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Add more API methods as needed...
}

export default new ApiService();

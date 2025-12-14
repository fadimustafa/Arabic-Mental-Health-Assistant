import axios from "axios";

// ✅ Create axios instance
const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Attach token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Helper to handle API errors
const handleRequest = async (promise) => {
  try {
    const { data } = await promise;
    return data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

/* ---------------- AUTH ---------------- */

// Register
export const registerUser = async ({ username, email, password }) => {
  return api.post('/auth/register', { username, email, password });
};

// Login
export const loginUser = async ({ username, password }) => {
  return api.post('/auth/login', { username, password });
};


/* ---------------- CHAT ---------------- */

// Send Chat
export const sendChat = (messages) =>
  handleRequest(api.post("/api/chat", messages));

// Save + Summarize conversation
export const saveConversation = (payload) =>
  handleRequest(api.post("/save-conversation", payload));

// Fetch messages of specific chat
export const fetchChatMessages = (chatId) =>
  handleRequest(api.get(`/chats/${chatId}/messages`));

// Fetch all chats
export const fetchChats = () => handleRequest(api.get("/chats"));

// Delete chat
export const deleteChat = (id) =>
  handleRequest(api.delete(`/chats/${id}`));

/* ---------------- EXPORT ---------------- */
export default api;

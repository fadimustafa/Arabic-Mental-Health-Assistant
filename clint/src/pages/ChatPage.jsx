import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  sendChat,
  saveConversation,
  fetchChats,
  deleteChat,
  fetchChatMessages,
} from "../api";
import { motion } from "framer-motion";
import "@fontsource/tajawal/400.css";
import "@fontsource/tajawal/700.css";
import EmotionStatus from "../components/EmotionStatus";
import Sidebar from "../components/Sidebar";
import PopupHestory from "../components/PopupHestory";
import { BarChart2, LogOut, Save, Send } from "lucide-react";


export default function ChatPage() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [showPopup, setShowPopup] = useState(false); // 👈 تحكم في البوب أب
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);
  const navigate = useNavigate();

  // 🔹 Scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  // 🔹 Load chats on mount
  useEffect(() => {
    loadChats(true);
  }, []);

  // =====================================================
  // 📌 Load Chats
  const loadChats = async (loadLast = false) => {
    try {
      const data = await fetchChats();
      setChats(data || []);
      console.log(chats);
      
      if (loadLast && data?.length > 0) {
        const lastChat = data[data.length - 1];
        await selectChat(lastChat);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/auth/login", { replace: true });
      } else {
        console.error("❌ Error loading chats", err);
        setChats([]);
      }
    }
  };

  // =====================================================
  // 📌 Select Chat
  const selectChat = async (chat) => {
    if (!chat) return;
    setSelectedChat(chat);

    try {
      const msgs = await fetchChatMessages(chat.id);
      setHistory(
        msgs.map((m) => ({
          sender: m.sender === "user" ? "you" : "bot",
          text: m.text,
          emotion: m.emotion,
        }))
      );
    } catch (err) {
      console.error("❌ Error fetching chat messages:", err);
      setHistory([]);
    }
  };

  // =====================================================
  // 📌 Send Message
  const send = async () => {
    const text = String(input).trim();
    if (!text || loading) return;

    setHistory((h) => [...h, { sender: "you", text }]);
    setInput("");
    setLoading(true);

    try {
      const payload = {
        chat_id: selectedChat?.id || null,
        message: text,
      };
      const data = await sendChat(payload);

      setHistory((h) => [
        ...h,
        { sender: "bot", text: data.response, emotion: data.emotion },
      ]);

      if (!selectedChat && data.chat_id) {
        await loadChats();
        setSelectedChat({ id: data.chat_id, title: "جديد", summary: "" });
      }
    } catch (err) {
      console.error("❌ Send error:", err);
      const msg =
        Array.isArray(err?.response?.data?.detail)
          ? err.response.data.detail.map((d) => d.msg).join(" | ")
          : err?.response?.data?.detail || "❌ خطأ في الإرسال";

      setHistory((h) => [...h, { sender: "bot", text: msg }]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // 📌 Save Chat
  const saveChat = async () => {
    if (!selectedChat) return alert("❌ لا توجد محادثة محددة للحفظ");

    try {
      await saveConversation({ chat_id: selectedChat.id });
      alert("✅ تم حفظ المحادثة بنجاح");
      loadChats();
    } catch (err) {
      console.error("❌ Save error:", err);
      alert("❌ تعذر حفظ المحادثة");
    }
  };

  // =====================================================
  // 📌 New Chat
  const newChat = async () => {
    try {
      if (selectedChat) {
        await saveConversation({ chat_id: selectedChat.id });
      }
      setHistory([]);
      setSelectedChat(null);
    } catch (err) {
      console.error("❌ Error saving before new chat:", err);
    }
  };

  // =====================================================
  // 📌 Delete Chat
  const handleDelete = async (id) => {
    if (!confirm("هل أنت متأكد من حذف هذه المحادثة؟")) return;
    try {
      await deleteChat(id);
      setChats((prev) => prev.filter((chat) => chat.id !== id));
      if (selectedChat?.id === id) {
        setSelectedChat(null);
        setHistory([]);
      }
    } catch (err) {
      console.error("❌ Delete error:", err);
      alert("❌ تعذر حذف المحادثة");
    }
  };

  // =====================================================
// 📌 Logout
const handleLogout = () => {
  // إذا كنت تستخدم localStorage أو cookies للمصادقة
  localStorage.removeItem("token"); 
  // إعادة التوجيه لصفحة تسجيل الدخول
  navigate("/", { replace: true });
};

  // =====================================================
  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white font-[Tajawal]">
      {/* Sidebar (ثابت) */}
      <Sidebar
        onNewChat={newChat}
        chats={chats}
        onSelectChat={selectChat}
      />
  
      {/* Main Chat */}
      <div className="flex-1 flex flex-col">
            {/* Header (ثابت) */}
          <div className="flex justify-between items-center px-4 py-2 border-b border-gray-800 bg-gray-900/70 backdrop-blur-md">
              {/* Logo / Title */}
              <h2 className="text-lg font-semibold text-white tracking-wide">نَفَسّ</h2>

                {/* Action Buttons */}
              <div className="flex items-center gap-2">
              {selectedChat && (
                <button
              onClick={() => setShowPopup(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-500 transition shadow-sm"
              >
              <BarChart2 size={16} />
              <span className="hidden sm:inline">الملخص</span>
               </button>
              )}

          <button
            onClick={saveChat}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-green-600 text-white hover:bg-green-500 transition shadow-sm"
          >
            <Save size={16} />
            <span className="hidden sm:inline">حفظ</span>
          </button>

          {/* 🔹 زر تسجيل الخروج (أيقونة فقط لتوفير المساحة) */}
          <button
            onClick={handleLogout}
            className="p-2 rounded-full text-gray-300 hover:bg-red-500 hover:text-white transition"
            title="تسجيل الخروج"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
        {/* Chat History (يتحرك مع السكرول) */}
        <div className="flex-1 overflow-y-auto p-6">
          {history.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`mb-3 flex ${
                m.sender === "you" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] p-4 rounded-2xl shadow-xl ${
                  m.sender === "you"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-gray-700 text-gray-100 backdrop-blur-md rounded-bl-none"
                }`}
              >
                <p className="whitespace-pre-wrap">{m.text}</p>
                {m.emotion && <EmotionStatus emotion={m.emotion} />}
              </div>
            </motion.div>
          ))}
          <div ref={chatEndRef} />
        </div>
        {/* Input (ثابت تحت) */}
      
       <div className="p-1">
          <div className="flex items-center gap-2 bg-gray-800/90 backdrop-blur-md rounded-xl px-4 py-2 shadow-lg max-w-3xl mx-auto">
            {/* Input */}
            <input
              className="flex-1 text-right bg-transparent border-none focus:ring-0 focus:outline-none text-white placeholder-gray-400 text-sm"
              placeholder="اكتب رسالتك..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
            />

            {/* Send button */}
            <button
              onClick={send}
              disabled={loading}
              className={`flex items-center justify-center w-9 h-9 rounded-md transition ${
                loading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-500 text-white"
              }`}
            >
              {loading ? (
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                  />
                </svg>
              ) : (
                <Send size={16} />
              )}
            </button>
          </div>
        </div>
      </div>
      {/* Popup */}
      {showPopup && selectedChat && (
        <PopupHestory
          chat={selectedChat}
          onClose={() => setShowPopup(false)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
  
}

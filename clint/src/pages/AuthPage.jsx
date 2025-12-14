import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, loginUser } from "../api.js";

export default function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login"); // 'login' | 'register'
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onRegister = async () => {
    try {
      setLoading(true);
      await registerUser({ username, email, password });
      alert("✅ تم التسجيل بنجاح! الآن قم بتسجيل الدخول.");
      setMode("login");
    } catch (err) {
      alert(err?.response?.data?.detail || "❌ فشل التسجيل");
    } finally {
      setLoading(false);
    }
  };

  const onLogin = async () => {
    try {
      setLoading(true);
      const res = await loginUser({ username, password });
      localStorage.setItem("token", res.data.access_token);
      navigate("/chat", { replace: true });
    } catch (err) {
      alert(err?.response?.data?.detail || "❌ فشل تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4 font-[Tajawal]">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-3xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          {mode === "login" ? "تسجيل الدخول" : "إنشاء حساب"}
        </h2>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">اسم المستخدم</label>
            <input
              className="w-full mt-2 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-600 focus:outline-none transition"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="أدخل اسم المستخدم"
            />
          </div>

          {mode === "register" && (
            <div>
              <label className="block text-sm font-medium text-gray-700">البريد الإلكتروني (اختياري)</label>
              <input
                className="w-full mt-2 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-600 focus:outline-none transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">كلمة المرور</label>
            <input
              type="password"
              className="w-full mt-2 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-600 focus:outline-none transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4">
          {mode === "register" ? (
            <>
              <button
                onClick={onRegister}
                disabled={loading}
                className="w-full py-3 bg-green-600 text-white font-bold rounded-2xl shadow-lg hover:bg-green-500 disabled:opacity-50 transition"
              >
                {loading ? "⏳ جاري التسجيل..." : "تسجيل"}
              </button>
              <button
                onClick={() => setMode("login")}
                className="w-full py-3 bg-gray-200 text-gray-800 font-semibold rounded-2xl hover:bg-gray-300 transition"
              >
                لدي حساب
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onLogin}
                disabled={loading}
                className="w-full py-3 bg-green-600 text-white font-bold rounded-2xl shadow-lg hover:bg-green-500 disabled:opacity-50 transition"
              >
                {loading ? "⏳ جاري الدخول..." : "دخول"}
              </button>
              <button
                onClick={() => setMode("register")}
                className="w-full py-3 bg-gray-200 text-gray-800 font-semibold rounded-2xl hover:bg-gray-300 transition"
              >
                مستخدم جديد
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import "@fontsource/tajawal/400.css";
import "@fontsource/tajawal/700.css";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col font-[Tajawal]">
      {/* Navbar */}
      <header className="flex justify-between items-center p-6 max-w-7xl mx-auto w-full">
        <h1 className="text-3xl font-extrabold tracking-wide">    نَفَسّ</h1>
        <nav className="space-x-6 hidden md:flex">
          <a href="#features" className="hover:text-green-400 transition">المميزات</a>
          <a href="#how" className="hover:text-green-400 transition">كيف يعمل</a>
          <a href="#contact" className="hover:text-green-400 transition">اتصل بنا</a>
        </nav>
        <button 
          onClick={handleClick} 
          className="bg-green-600 text-white font-bold px-5 py-2 rounded-2xl shadow-lg hover:bg-green-500 transition"
        >
          تسجيل الدخول
        </button>
      </header>

      {/* Hero Section */}
      <motion.section
        className="flex flex-col items-center justify-center text-center flex-1 px-6 mt-12 mb-5"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-5xl md:text-7xl font-extrabold leading-snug mb-6">
          محادثة ذكية <br /> 
          <span className="text-green-400">باللغة العربية</span>
        </h2>
        <p className="max-w-2xl text-lg md:text-2xl text-gray-300 mb-10">
        نَفَسّ، مساحتك الآمنة المدعومة بالذكاء الاصطناعي للتعبير، فهم مشاعرك، ومساندتك في أي وقت وأي مكان.
        </p>
        <a
          onClick={handleClick}
          className="bg-green-600 text-white font-bold px-8 py-4 rounded-3xl flex items-center gap-3 shadow-lg hover:bg-green-500 transition cursor-pointer"
        >
          ابدأ المحادثة الآن <ArrowRight className="w-6 h-6" />
        </a>
      </motion.section>

      {/* Features */}
      <section id="features" className="bg-gray-100 text-gray-900 py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-4xl font-bold mb-16">✨ مميزات نَفَسّ</h3>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="p-8 rounded-3xl shadow-lg bg-white border border-gray-200 hover:scale-105 transition transform">
              <h4 className="font-bold text-2xl mb-3">🤖 ذكاء اصطناعي متقدم</h4>
              <p>محادثات طبيعية وذكية بدعم أحدث تقنيات الذكاء الاصطناعي.</p>
            </div>
            <div className="p-8 rounded-3xl shadow-lg bg-white border border-gray-200 hover:scale-105 transition transform">
              <h4 className="font-bold text-2xl mb-3">🎭 التعرف على المشاعر</h4>
              <p>يتعرف المساعد على حالتك العاطفية ويقدم ردوداً مناسبة.</p>
            </div>
            <div className="p-8 rounded-3xl shadow-lg bg-white border border-gray-200 hover:scale-105 transition transform">
              <h4 className="font-bold text-2xl mb-3">🔒 الخصوصية والأمان</h4>
              <p>جميع محادثاتك مشفرة وتحفظ خصوصيتك بشكل كامل.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="py-20 px-6 bg-gradient-to-r from-gray-800 to-gray-700 text-center text-white">
        <h3 className="text-4xl font-bold mb-16"> كيف يعمل؟</h3>
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-10">
          <div className="bg-white text-gray-900 p-8 rounded-3xl shadow-lg hover:scale-105 transition transform">
            <h4 className="font-bold mb-3 text-xl">٣. دعم فوري</h4>
            <p>احصل على نصائح ودعم عاطفي فوراً.</p>
          </div>
          <div className="bg-white text-gray-900 p-8 rounded-3xl shadow-lg hover:scale-105 transition transform">
            <h4 className="font-bold mb-3 text-xl">٢. استجابة ذكية</h4>
            <p>يتفاعل المساعد معك بسرعة وذكاء.</p>
          </div>
          <div className="bg-white text-gray-900 p-8 rounded-3xl shadow-lg hover:scale-105 transition transform">
            <h4 className="font-bold mb-3 text-xl">١. اكتب رسالة</h4>
            <p>ابدأ بكتابة ما يدور في بالك.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-950 text-gray-400 py-8 text-center">
        <p>© {new Date().getFullYear()} نَفَسّ - جميع الحقوق محفوظة</p>
      </footer>
    </div>
  );
}

import { X, Trash2 } from "lucide-react";

export default function PopupHestory({ chat, onClose, onDelete }) {
  if (!chat) return null;

  const summary = chat.summary || {}; // 👈 التعامل مع الملخص بأمان

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div
        className="bg-white/10 backdrop-blur-md text-white rounded-2xl shadow-2xl 
                   p-8 w-[600px] max-w-3xl relative border border-white/20"
        dir="rtl"
      >
        {/* Close button */}
        <button
          className="absolute top-4 left-4 text-gray-200 hover:text-yellow-400 transition"
          onClick={onClose}
        >
          <X size={28} />
        </button>

        {/* العنوان */}
        <h2 className="text-2xl font-bold mb-6 text-yellow-400 text-right">
          {summary.title || "بدون عنوان"}
        </h2>

        {/* الملخص */}
        <p className="mb-4 text-lg leading-relaxed text-right whitespace-pre-wrap">
          <strong className="text-yellow-300"> الملخص:</strong>{" "}
          {summary.summary || "لا يوجد ملخص"}
        </p>

        {/* المشاعر */}
        <p className="mb-4 text-lg text-right">
          <strong className="text-yellow-300">المشاعر:</strong>{" "}
          {summary.dominant_emotion || "غير محدد"}
        </p>

        {/* التاريخ */}
        <p className="text-sm text-gray-300 text-right mb-6">
          <strong className="text-yellow-300">التاريخ:</strong>{" "}
          {summary.created_at
            ? new Date(summary.created_at).toLocaleString("ar-EG")
            : "غير متوفر"}
        </p>

        {/* Delete button */}
        <button
          onClick={() => onDelete(chat.id)}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-xl shadow-lg transition flex items-center gap-2"
        >
          <Trash2 size={20} /> حذف المحادثة
        </button>
      </div>
    </div>
  );
}

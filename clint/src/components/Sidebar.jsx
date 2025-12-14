import { useState } from "react";
import { Plus, Search, BookOpen, MessageCircleCodeIcon } from "lucide-react";

export default function Sidebar({ onNewChat, chats = [], onSelectChat }) {
  const [search, setSearch] = useState("");

  const filteredChats = Array.isArray(chats)
  ? chats.filter((c) =>
      c.summary?.title?.toLowerCase().includes(search.toLowerCase())
    )
  : [];


  return (
    <div className="top-0 bottom-0 w-64 bg-white/10 backdrop-blur-md p-6 flex flex-col border-r border-white/20 relative">
      {/* Header */}
      <h2 className="text-lg flex gap-1 font-bold mb-6"><MessageCircleCodeIcon/> محادثات</h2>

      {/* New Chat Button */}
      <button
        onClick={onNewChat}
        className="flex items-center gap-2 bg-white/20 text-gray-200 px-3 py-2 rounded-2xl font-bold shadow hover:bg-yellow-300 transition mb-4"
      >
        <Plus size={18} />
        محادثة جديدة
      </button>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="ابحث في المحادثات..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/20 text-sm placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      </div>

      {/* Library */}
      <div className="flex-1 overflow-y-auto space-y-2">
        <h3 className="flex items-center gap-2 text-sm font-semibold opacity-80 mb-2">
          <BookOpen size={16} /> المكتبة
        </h3>
        {filteredChats.length === 0 ? (
          <p className="text-sm opacity-60">لا توجد محادثات محفوظة</p>
        ) : (
          filteredChats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => onSelectChat(chat)}
              className="w-full text-right px-3 py-2 rounded-xl bg-white/5 hover:bg-white/20 transition text-sm"
            >
              {chat.summary?.title || "بدون عنوان"}
            </button>
          ))
        )}
      </div>
    </div>
  );
}

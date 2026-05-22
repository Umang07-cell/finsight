import { motion } from 'framer-motion'
import {
  Plus,
  Search,
  Settings,
  User,
  MessageSquare,
  Trash2,
} from 'lucide-react'
import UploadPanel from './UploadPanel'

export default function Sidebar({
  mode,
  setMode,
  onClear,
  recentChats = [],
  activeChat = null,
  setActiveChat,
  onNewChat,
}) {
  const modes = [
    { id: 'fast', label: '⚡ Fast', desc: 'Llama 3 8B' },
    { id: 'standard', label: '🧠 Standard', desc: 'Llama 3 70B' },
    { id: 'deep', label: '🔬 Deep', desc: 'Wide retrieval' },
  ]

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-72 bg-card border-r border-border flex flex-col h-full"
    >
      {/* ===== LOGO ===== */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-sm shadow-lg">
            F
          </div>

          <div>
            <h2 className="text-white font-semibold text-sm">
              FinSight
            </h2>

            <p className="text-slate-500 text-xs">
              AI Financial Intelligence
            </p>
          </div>
        </div>
      </div>

      {/* ===== TOP ACTIONS ===== */}
      <div className="p-3 border-b border-border space-y-2">

        {/* NEW CHAT */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNewChat}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-all"
        >
          <Plus size={18} />
          <span className="text-sm font-medium">
            New Chat
          </span>
        </motion.button>

        {/* SEARCH */}
        <button
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-dark hover:text-white transition-all"
        >
          <Search size={18} />

          <span className="text-sm">
            Search Chats
          </span>
        </button>
      </div>

      {/* ===== COMPANY INSIGHT + UPLOAD ===== */}
      {/* ===== COMPANY INSIGHT ===== */}
<div className="p-4 border-b border-border">
  <h3 className="text-white font-semibold text-sm mb-1">
    🏢 Company Insight
  </h3>

  <p className="text-slate-500 text-xs mb-4">
    Full analysis without uploading PDF
  </p>

  <div className="space-y-3">
    <input
      type="text"
      placeholder="Company (e.g. Apple)"
      className="w-full bg-dark border border-border rounded-xl px-4 py-3 text-sm text-white outline-none"
    />

    <input
      type="text"
      placeholder="Year (e.g. 2023)"
      className="w-full bg-dark border border-border rounded-xl px-4 py-3 text-sm text-white outline-none"
    />

    <button
      className="w-full bg-primary text-white rounded-xl py-3 text-sm font-medium hover:opacity-90 transition"
    >
      Analyze Company →
    </button>
  </div>
</div>

{/* ===== CHATGPT MENU ===== */}
<div className="p-3 border-b border-border space-y-2">

  <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 border border-primary/20 text-primary">
    ✏️ New Chat
  </button>

  <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-dark hover:text-white">
    🔍 Search Chats
  </button>

</div>

      {/* ===== MODE SELECTOR ===== */}
      <div className="p-4 border-b border-border">
        <h3 className="text-white font-semibold text-sm mb-3">
          Query Mode
        </h3>

        <div className="space-y-2">
          {modes.map((m) => (
            <motion.button
              key={m.id}
              whileHover={{ x: 2 }}
              onClick={() => setMode(m.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all ${
                mode === m.id
                  ? 'bg-primary/10 border border-primary/30 text-primary'
                  : 'text-slate-400 hover:bg-dark hover:text-white'
              }`}
            >
              <span>{m.label}</span>

              <span className="text-xs opacity-60">
                {m.desc}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* ===== RECENT CHATS ===== */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-semibold text-sm">
            Recent Chats
          </h3>

          <button className="text-slate-500 hover:text-white transition-colors">
            <MessageSquare size={16} />
          </button>
        </div>

        <div className="space-y-1">

          {recentChats.length > 0 ? (
            recentChats.map((chat) => (
              <motion.button
                key={chat.id}
                whileHover={{ x: 2 }}
                onClick={() => setActiveChat(chat.id)}
                className={`w-full group flex items-center justify-between px-3 py-3 rounded-xl text-left transition-all ${
                  activeChat === chat.id
                    ? 'bg-white/10 text-white'
                    : 'text-slate-400 hover:bg-dark hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <MessageSquare
                    size={16}
                    className="flex-shrink-0"
                  />

                  <span className="truncate text-sm">
                    {chat.title}
                  </span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                  }}
                  className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </motion.button>
            ))
          ) : (
            <div className="text-slate-500 text-sm px-3 py-2">
              No recent chats
            </div>
          )}

        </div>
      </div>

      {/* ===== BOTTOM SECTION ===== */}
      <div className="border-t border-border p-3 space-y-2">

        {/* SETTINGS */}
        <button
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-dark hover:text-white transition-all"
        >
          <Settings size={18} />

          <span className="text-sm">
            Settings
          </span>
        </button>

        {/* USER PROFILE */}
        <button
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-dark transition-all"
        >
          <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm">
            U
          </div>

          <div className="flex flex-col text-left">
            <span className="text-white text-sm font-medium">
              Umang Pawar
            </span>

            <span className="text-slate-500 text-xs">
              FinSight User
            </span>
          </div>

          <User
            size={16}
            className="ml-auto text-slate-500"
          />
        </button>

        {/* CLEAR CHAT */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={onClear}
          className="w-full border border-border text-slate-400 hover:text-white hover:border-slate-500 py-3 rounded-xl text-sm transition-all"
        >
          Clear Chat
        </motion.button>

      </div>
    </motion.aside>
  )
}
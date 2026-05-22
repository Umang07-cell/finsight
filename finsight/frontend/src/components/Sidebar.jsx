import { motion } from 'framer-motion'
import { Trash2, MessageSquare } from 'lucide-react'

export default function Sidebar({
  onClear,
  recentChats = [],
  activeChat = null,
  setActiveChat,
  onNewChat,
  darkMode = false,
  company,
  setCompany,
  year,
  setYear,
  onCompanyInsight,
  onUploadPDF,
  uploading,
  uploadedFiles = [],
}) {
  const bg = darkMode ? '#1e293b' : '#ffffff'
  const textColor = darkMode ? '#f1f5f9' : '#111827'
  const subText = darkMode ? '#94a3b8' : '#6b7280'
  const border = darkMode ? '#334155' : '#e5e7eb'
  const inputBg = darkMode ? '#0f172a' : '#f9fafb'

  return (
    <div
      style={{ backgroundColor: bg, borderRightColor: border, height: '100%', display: 'flex', flexDirection: 'column' }}
      className="border-r w-72 overflow-hidden"
    >
      {/* Header */}
      <div style={{ borderBottomColor: border }} className="flex items-center justify-between p-4 border-b flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gray-900 flex items-center justify-center">
            <span className="text-white font-bold text-xs">F</span>
          </div>
          <span style={{ color: textColor }} className="font-semibold">FinSight</span>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">

        {/* New Chat */}
        <div style={{ borderBottomColor: border }} className="p-3 border-b">
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={onNewChat}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-medium"
          >
            <span>✏️</span>
            <span>New Chat</span>
          </motion.button>
        </div>

        {/* Company Insight */}
        <div style={{ borderBottomColor: border }} className="p-4 border-b">
          <h3 style={{ color: textColor }} className="font-semibold text-sm mb-1">🏢 Company Insight</h3>
          <p style={{ color: subText }} className="text-xs mb-3">Full analysis without uploading PDF</p>
          <input
            type="text"
            placeholder="Company (e.g. Apple)"
            value={company}
            onChange={e => setCompany(e.target.value)}
            style={{ backgroundColor: inputBg, borderColor: border, color: textColor }}
            className="w-full border rounded-xl px-3 py-2 text-sm mb-2 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Year (e.g. 2023)"
            value={year}
            onChange={e => setYear(e.target.value)}
            style={{ backgroundColor: inputBg, borderColor: border, color: textColor }}
            className="w-full border rounded-xl px-3 py-2 text-sm mb-3 focus:outline-none"
          />
          <button
            onClick={onCompanyInsight}
            disabled={!company || !year}
            className="w-full bg-gray-900 text-white py-2 rounded-xl text-sm font-medium disabled:opacity-40"
          >
            Analyze Company →
          </button>
        </div>

        {/* Upload PDF */}
        <div style={{ borderBottomColor: border }} className="p-4 border-b">
          <h3 style={{ color: textColor }} className="font-semibold text-sm mb-1">📄 Upload 10-K Filing</h3>
          <p style={{ color: subText }} className="text-xs mb-3">Enter company details above first</p>
          <button
            onClick={onUploadPDF}
            disabled={uploading || !company || !year}
            style={{ borderColor: border, color: subText }}
            className="w-full border-2 border-dashed rounded-xl py-3 text-sm disabled:opacity-40"
          >
            {uploading ? 'Processing...' : '+ Click to upload PDF'}
          </button>
          {uploadedFiles.map((f, i) => (
            <div key={i} style={{ backgroundColor: inputBg }} className="mt-2 rounded-xl px-3 py-2">
              <p style={{ color: textColor }} className="text-xs font-medium">{f.company} {f.year}</p>
              <p style={{ color: subText }} className="text-xs">{f.chunks} chunks indexed</p>
            </div>
          ))}
        </div>

        {/* Recent Chats */}
        <div className="p-4">
          <h3 style={{ color: textColor }} className="font-semibold text-sm mb-3">Recent Chats</h3>
          <div className="space-y-1">
            {recentChats.length > 0 ? recentChats.map((chat) => (
              <motion.button
                key={chat.id}
                whileHover={{ x: 2 }}
                onClick={() => setActiveChat(chat.id)}
                style={{ color: activeChat === chat.id ? textColor : subText }}
                className="w-full group flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all hover:opacity-80"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <MessageSquare size={14} className="flex-shrink-0" />
                  <span className="truncate text-xs">{chat.title}</span>
                </div>
                <button
                  onClick={e => { e.stopPropagation(); }}
                  className="opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 size={13} style={{ color: subText }} />
                </button>
              </motion.button>
            )) : (
              <p style={{ color: subText }} className="text-xs px-3 py-2">No recent chats</p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom - Clear chat */}
      <div style={{ borderTopColor: border }} className="border-t p-3 flex-shrink-0">
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={onClear}
          style={{ borderColor: border, color: subText }}
          className="w-full border py-2 rounded-xl text-sm transition-all"
        >
          Clear Chat
        </motion.button>
      </div>
    </div>
  )
}
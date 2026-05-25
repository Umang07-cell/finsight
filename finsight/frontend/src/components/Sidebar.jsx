import { useState } from 'react'
import { motion } from 'framer-motion'
import { Trash2, MessageSquare, Settings, User } from 'lucide-react'

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
}) {
  const bg = darkMode ? '#1e293b' : '#ffffff'
  const textColor = darkMode ? '#f1f5f9' : '#111827'
  const subText = darkMode ? '#94a3b8' : '#6b7280'
  const border = darkMode ? '#334155' : '#e5e7eb'
  const inputBg = darkMode ? '#0f172a' : '#f9fafb'

  const [showSettings, setShowSettings] = useState(false)
  const [showProfile, setShowProfile] = useState(false)

  const [notifications, setNotifications] = useState(true)
  const [compactMode, setCompactMode] = useState(false)

  return (
    <>
      <div
        style={{
          backgroundColor: bg,
          borderRightColor: border
        }}
        className="border-r w-72 h-full flex flex-col overflow-hidden"
      >

        {/* Header */}
        <div
          style={{ borderBottomColor: border }}
          className="flex items-center gap-2 p-4 border-b flex-shrink-0"
        >
          <div className="w-7 h-7 rounded-lg bg-gray-900 flex items-center justify-center">
            <span className="text-white font-bold text-xs">
              F
            </span>
          </div>

          <span
            style={{ color: textColor }}
            className="font-semibold"
          >
            FinSight
          </span>
        </div>

        {/* New Chat button */}
        <div
          style={{ borderBottomColor: border }}
          className="p-3 border-b flex-shrink-0"
        >
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

        {/* Scrollable middle */}
        <div className="flex-1 overflow-y-auto">

          {/* Company Insight */}
          <div
            style={{ borderBottomColor: border }}
            className="p-4 border-b"
          >
            <h3
              style={{ color: textColor }}
              className="font-semibold text-sm mb-1"
            >
              🏢 Company Insight
            </h3>

            <p
              style={{ color: subText }}
              className="text-xs mb-3"
            >
              Full analysis without uploading PDF
            </p>

            <input
              type="text"
              placeholder="Company (e.g. Apple)"
              value={company}
              onChange={e => setCompany(e.target.value)}
              style={{
                backgroundColor: inputBg,
                borderColor: border,
                color: textColor
              }}
              className="w-full border rounded-xl px-3 py-2 text-sm mb-2 focus:outline-none"
            />

            <input
              type="text"
              placeholder="Year (e.g. 2023)"
              value={year}
              onChange={e => setYear(e.target.value)}
              style={{
                backgroundColor: inputBg,
                borderColor: border,
                color: textColor
              }}
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

          {/* Recent Chats */}
          <div className="p-4">

            <h3
              style={{ color: textColor }}
              className="font-semibold text-sm mb-3"
            >
              Recent Chats
            </h3>

            <div className="space-y-1">

              {recentChats.length > 0 ? (
                recentChats.map((chat) => (
                  <motion.button
                    key={chat.id}
                    whileHover={{ x: 2 }}
                    onClick={() => setActiveChat(chat.id)}
                    style={{
                      color:
                        activeChat === chat.id
                          ? textColor
                          : subText
                    }}
                    className="w-full group flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all hover:opacity-80"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">

                      <MessageSquare
                        size={14}
                        className="flex-shrink-0"
                      />

                      <span className="truncate text-xs">
                        {chat.title}
                      </span>

                    </div>

                    <button
                      onClick={e => {
                        e.stopPropagation()
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2
                        size={13}
                        style={{ color: subText }}
                      />
                    </button>

                  </motion.button>
                ))
              ) : (
                <p
                  style={{ color: subText }}
                  className="text-xs px-3 py-2"
                >
                  No recent chats yet
                </p>
              )}

            </div>
          </div>
        </div>

        {/* Bottom - Settings & Profile */}
        <div
          style={{ borderTopColor: border }}
          className="border-t p-3 space-y-1 flex-shrink-0"
        >

          {/* SETTINGS */}
          <button
            onClick={() => setShowSettings(true)}
            style={{ color: subText }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm hover:opacity-80 transition-all"
          >
            <Settings size={16} />
            <span>Settings</span>
          </button>

          {/* PROFILE */}
          <button
            onClick={() => setShowProfile(true)}
            style={{ color: subText }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm hover:opacity-80 transition-all"
          >
            <User size={16} />
            <span>Profile</span>
          </button>

        </div>
      </div>

      {/* ===== SETTINGS MODAL ===== */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">

          <div
            style={{
              backgroundColor: bg,
              borderColor: border
            }}
            className="w-full max-w-sm rounded-2xl border p-5"
          >

            <h2
              style={{ color: textColor }}
              className="text-lg font-semibold mb-4"
            >
              ⚙️ Settings
            </h2>

            <div className="space-y-3">

              <button
                onClick={() =>
                  setNotifications(!notifications)
                }
                style={{
                  backgroundColor: inputBg,
                  color: textColor
                }}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl"
              >
                <span>Notifications</span>

                <span>
                  {notifications ? 'ON' : 'OFF'}
                </span>
              </button>

              <button
                onClick={() =>
                  setCompactMode(!compactMode)
                }
                style={{
                  backgroundColor: inputBg,
                  color: textColor
                }}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl"
              >
                <span>Compact Mode</span>

                <span>
                  {compactMode ? 'ON' : 'OFF'}
                </span>
              </button>

            </div>

            <button
              onClick={() => setShowSettings(false)}
              className="w-full mt-5 bg-gray-900 text-white py-2.5 rounded-xl"
            >
              Close
            </button>

          </div>
        </div>
      )}

      {/* ===== PROFILE MODAL ===== */}
      {showProfile && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">

          <div
            style={{
              backgroundColor: bg,
              borderColor: border
            }}
            className="w-full max-w-sm rounded-2xl border p-5 text-center"
          >

            <div className="w-20 h-20 rounded-full bg-gray-900 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              U
            </div>

            <h2
              style={{ color: textColor }}
              className="text-xl font-semibold"
            >
              Umang Pawar
            </h2>

            <p
              style={{ color: subText }}
              className="text-sm mt-1"
            >
              FinSight Creator
            </p>

            <div className="mt-5 space-y-2">

              <div
                style={{
                  backgroundColor: inputBg,
                  color: textColor
                }}
                className="rounded-xl p-3 text-sm"
              >
                🚀 AI Engineer
              </div>

              <div
                style={{
                  backgroundColor: inputBg,
                  color: textColor
                }}
                className="rounded-xl p-3 text-sm"
              >
                📊 Financial AI Enthusiast
              </div>

            </div>

            <button
              onClick={() => setShowProfile(false)}
              className="w-full mt-5 bg-gray-900 text-white py-2.5 rounded-xl"
            >
              Close
            </button>

          </div>
        </div>
      )}
    </>
  )
}
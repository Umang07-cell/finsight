import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MessageBubble from '../components/MessageBubble'
import useChat from '../hooks/useChat'
import axios from 'axios'

const API = 'https://finsight-production-b9e2.up.railway.app'

const themes = {
  fast: {
    light: {
      bg: '#f0fdf4',
      orb: '#bbf7d0',
      button: '#10b981',
      badge: '#d1fae5',
      badgeText: '#065f46'
    },
    dark: {
      bg: '#0a1a0f',
      orb: '#14532d',
      button: '#10b981',
      badge: '#14532d',
      badgeText: '#6ee7b7'
    },
    label: '⚡ Fast',
    desc: 'Llama 3 8B — instant answers'
  },

  standard: {
    light: {
      bg: '#f8fafc',
      orb: '#bfdbfe',
      button: '#3b82f6',
      badge: '#dbeafe',
      badgeText: '#1e40af'
    },
    dark: {
      bg: '#0f172a',
      orb: '#1e3a5f',
      button: '#3b82f6',
      badge: '#1e3a5f',
      badgeText: '#93c5fd'
    },
    label: '🧠 Standard',
    desc: 'Llama 3 70B — detailed analysis'
  },

  deep: {
    light: {
      bg: '#faf5ff',
      orb: '#ddd6fe',
      button: '#7c3aed',
      badge: '#ede9fe',
      badgeText: '#5b21b6'
    },
    dark: {
      bg: '#0d0a1a',
      orb: '#2e1065',
      button: '#7c3aed',
      badge: '#2e1065',
      badgeText: '#c4b5fd'
    },
    label: '🔬 Deep',
    desc: 'Full report with citations'
  }
}

export default function Chat() {
  const [mode, setMode] = useState('standard')
  const [darkMode, setDarkMode] = useState(false)
  const [input, setInput] = useState('')

  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [previewOpen, setPreviewOpen] = useState(false)

  const [uploading, setUploading] = useState(false)

  const {
    messages,
    loading,
    sendMessage,
    clearMessages,
    setMessages
  } = useChat()

  const inputRef = useRef()
  const fileRef = useRef()
  const imageRef = useRef()

  const t = themes[mode][darkMode ? 'dark' : 'light']

  const textColor = darkMode ? '#f1f5f9' : '#111827'
  const subTextColor = darkMode ? '#94a3b8' : '#6b7280'
  const cardBg = darkMode ? '#1e293b' : '#ffffff'
  const borderColor = darkMode ? '#334155' : '#e5e7eb'
  const inputBg = darkMode ? '#1e293b' : '#ffffff'
  const topBarBg = darkMode
    ? 'rgba(15,23,42,0.95)'
    : 'rgba(255,255,255,0.95)'

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const handleSend = (text) => {
    const q = text || input.trim()

    if (!q || loading) return

    sendMessage(q, mode)
    setInput('')
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleFileUpload = async (file) => {
    if (!file) return

    const allowed =
      file.type === 'application/pdf' ||
      file.type.startsWith('image/')

    if (!allowed) {
      alert('Only PDF and images are allowed')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('File size should be under 10MB')
      return
    }

    setUploading(true)

    const isPDF = file.type === 'application/pdf'

    const endpoint = isPDF
      ? '/analyze-pdf'
      : '/analyze-image'

    const formData = new FormData()

    formData.append('file', file)

    sendMessage(
      `[Uploaded: ${file.name}] Analyze this ${
        isPDF ? 'document' : 'image'
      }.`,
      mode
    )

    try {
      const res = await axios.post(
        `${API}/api/ingest${endpoint}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: res.data.analysis,
          sources: [],
          mode,
          model:
            mode === 'fast'
              ? 'llama-3.1-8b-instant'
              : 'llama-3.3-70b-versatile',
          report: null
        }
      ])
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            e.response?.data?.detail ||
            e.message ||
            'Upload failed.',
          sources: [],
          mode,
          model: '',
          report: null
        }
      ])
    } finally {
      setUploading(false)
    }
  }

  return (
    <motion.div
      animate={{ backgroundColor: t.bg }}
      transition={{ duration: 0.6 }}
      className="h-screen flex flex-col relative overflow-hidden"
      style={{
        fontFamily: "'DM Sans', sans-serif",
        backgroundColor: t.bg
      }}
    >
      {/* BACKGROUND */}
      <motion.div
        key={mode + darkMode}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 0.5, scale: 1 }}
        transition={{ duration: 0.8 }}
        style={{ backgroundColor: t.orb }}
        className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl pointer-events-none z-0"
      />

      {/* TOP BAR */}
      <div
        style={{
          backgroundColor: topBarBg,
          borderBottomColor: borderColor
        }}
        className="border-b z-10 flex items-center justify-between px-6 py-3"
      >
        <div className="flex items-center gap-2">
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

        <div className="flex items-center gap-2">
          <button
            onClick={() => setDarkMode(!darkMode)}
            style={{
              borderColor,
              color: subTextColor
            }}
            className="text-xs border px-3 py-1.5 rounded-lg"
          >
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>

          <button
            onClick={clearMessages}
            style={{
              borderColor,
              color: subTextColor
            }}
            className="text-xs border px-3 py-1.5 rounded-lg"
          >
            Clear chat
          </button>
        </div>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto z-10">
        <div className="max-w-3xl mx-auto px-4 py-6">
          {messages.map((msg, i) => (
            <MessageBubble
              key={i}
              message={msg}
              darkMode={darkMode}
            />
          ))}
        </div>
      </div>

      {/* PREVIEW MODAL */}
      {previewOpen && selectedFile && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">

          <div className="bg-white rounded-2xl p-4 w-full max-w-2xl shadow-2xl">

            <h2 className="text-xl font-semibold mb-4 text-black">
              Preview File
            </h2>

            {selectedFile.type.startsWith('image/') ? (
              <img
                src={previewUrl}
                alt="preview"
                className="w-full max-h-[500px] object-contain rounded-xl"
              />
            ) : (
              <iframe
                src={previewUrl}
                title="PDF Preview"
                className="w-full h-[500px] rounded-xl border"
              />
            )}

            <div className="flex justify-end gap-3 mt-4">

              <button
                onClick={() => {
                  setPreviewOpen(false)
                  setSelectedFile(null)
                  setPreviewUrl('')
                }}
                className="px-4 py-2 border rounded-xl text-black"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  handleFileUpload(selectedFile)

                  setPreviewOpen(false)
                  setSelectedFile(null)
                  setPreviewUrl('')
                }}
                className="px-4 py-2 bg-black text-white rounded-xl"
              >
                Send
              </button>

            </div>
          </div>
        </div>
      )}

      {/* INPUT BAR */}
      <div
        style={{
          backgroundColor: topBarBg,
          borderTopColor: borderColor
        }}
        className="border-t z-10 p-3 sm:p-4"
      >
        <div className="max-w-3xl mx-auto">

          <div
            style={{
              backgroundColor: inputBg,
              borderColor
            }}
            className="flex items-end gap-2 border rounded-2xl px-3 py-2 shadow-sm"
          >
            {/* PDF BUTTON */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => fileRef.current.click()}
              disabled={uploading}
              style={{
                color: uploading
                  ? t.button
                  : subTextColor
              }}
              className="p-1 flex-shrink-0"
            >
              📄
            </motion.button>

            <input
              ref={fileRef}
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0]

                if (!file) return

                setSelectedFile(file)
                setPreviewOpen(true)

                setPreviewUrl(
                  URL.createObjectURL(file)
                )

                e.target.value = ''
              }}
            />

            {/* IMAGE BUTTON */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => imageRef.current.click()}
              disabled={uploading}
              style={{
                color: subTextColor
              }}
              className="p-1 flex-shrink-0"
            >
              🖼️
            </motion.button>

            <input
              ref={imageRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0]

                if (!file) return

                setSelectedFile(file)
                setPreviewOpen(true)

                setPreviewUrl(
                  URL.createObjectURL(file)
                )

                e.target.value = ''
              }}
            />

            {/* TEXTAREA */}
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) =>
                setInput(e.target.value)
              }
              onKeyDown={handleKey}
              onInput={(e) => {
                e.target.style.height = 'auto'
                e.target.style.height = `${e.target.scrollHeight}px`
              }}
              placeholder="Ask anything..."
              rows={1}
              style={{
                color: textColor,
                caretColor: textColor
              }}
              className="flex-1 bg-transparent text-sm placeholder-gray-400 focus:outline-none resize-none py-1"
            />

            {/* SEND BUTTON */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              style={{
                backgroundColor: t.button
              }}
              className="text-white p-2 rounded-xl disabled:opacity-40 flex-shrink-0"
            >
              ➤
            </motion.button>
          </div>

          <p
            style={{ color: subTextColor }}
            className="text-center text-xs mt-2"
          >
            Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>
    </motion.div>
  )
}
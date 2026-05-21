import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MessageBubble from '../components/MessageBubble'
import useChat from '../hooks/useChat'
import axios from 'axios'

const themes = {
  fast: {
    light: { bg: '#f0fdf4', orb: '#bbf7d0', button: '#10b981', badge: '#d1fae5', badgeText: '#065f46' },
    dark: { bg: '#0a1a0f', orb: '#14532d', button: '#10b981', badge: '#14532d', badgeText: '#6ee7b7' },
    label: '⚡ Fast',
    desc: 'Llama 3 8B — instant answers'
  },
  standard: {
    light: { bg: '#f8fafc', orb: '#bfdbfe', button: '#3b82f6', badge: '#dbeafe', badgeText: '#1e40af' },
    dark: { bg: '#0f172a', orb: '#1e3a5f', button: '#3b82f6', badge: '#1e3a5f', badgeText: '#93c5fd' },
    label: '🧠 Standard',
    desc: 'Llama 3 70B — detailed analysis'
  },
  deep: {
    light: { bg: '#faf5ff', orb: '#ddd6fe', button: '#7c3aed', badge: '#ede9fe', badgeText: '#5b21b6' },
    dark: { bg: '#0d0a1a', orb: '#2e1065', button: '#7c3aed', badge: '#2e1065', badgeText: '#c4b5fd' },
    label: '🔬 Deep Research',
    desc: 'Full report with citations'
  }
}

const quickPrompts = [
  "What are today's top market movers?",
  "How should a beginner start investing?",
  "Explain good debt vs bad debt",
  "How can I save more money?",
]

export default function Chat() {
  const [mode, setMode] = useState('standard')
  const [darkMode, setDarkMode] = useState(false)
  const [input, setInput] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [company, setCompany] = useState('')
  const [year, setYear] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const { messages, loading, sendMessage, clearMessages } = useChat()
  const inputRef = useRef()
  const fileRef = useRef()
  const imageRef = useRef()

  const t = themes[mode][darkMode ? 'dark' : 'light']
  const textColor = darkMode ? '#f1f5f9' : '#111827'
  const subTextColor = darkMode ? '#94a3b8' : '#6b7280'
  const cardBg = darkMode ? '#1e293b' : '#ffffff'
  const borderColor = darkMode ? '#334155' : '#e5e7eb'
  const inputBg = darkMode ? '#1e293b' : '#ffffff'
  const topBarBg = darkMode ? 'rgba(15,23,42,0.9)' : 'rgba(255,255,255,0.9)'

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
    if (!file || !company || !year) {
      setDrawerOpen(true)
      return
    }
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('company_name', company)
    formData.append('year', year)
    try {
      const res = await axios.post('https://finsight-production-b9e2.up.railway.app/api/ingest/', formData)
      setUploadedFiles(prev => [...prev, { company, year, chunks: res.data.chunks_created }])
      sendMessage(`I've uploaded ${company}'s ${year} 10-K filing. Give me a brief overview.`, mode)
    } catch {
      alert('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleCompanyInsight = () => {
    if (!company || !year) return
    sendMessage(`Give me a comprehensive financial analysis and company overview for ${company} for the year ${year}. Include stock performance, key financial metrics, market position, and investment outlook.`, 'deep')
    setDrawerOpen(false)
  }

  useEffect(() => { inputRef.current?.focus() }, [])

  return (
    <motion.div
      animate={{ backgroundColor: t.bg }}
      transition={{ duration: 0.6 }}
      style={{ backgroundColor: t.bg }}
      className="h-screen flex flex-col relative overflow-hidden font-['DM_Sans',sans-serif]"
    >
      {/* Animated orb */}
      <motion.div
        key={mode + darkMode}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 0.6, scale: 1 }}
        transition={{ duration: 0.8 }}
        style={{ backgroundColor: t.orb }}
        className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none z-0"
      />
      <motion.div
        key={mode + 'orb2' + darkMode}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1 }}
        style={{ backgroundColor: t.orb }}
        className="absolute bottom-20 left-0 w-64 h-64 rounded-full blur-3xl pointer-events-none z-0"
      />

      {/* Top bar */}
<div
  style={{ backgroundColor: topBarBg, borderColor }}
  className="backdrop-blur-sm border-b z-10 px-3 sm:px-6 py-3 sm:py-4"
>

  {/* Desktop Navbar */}
  <div className="hidden sm:flex items-center justify-between gap-4">

    {/* Left */}
    <div className="flex items-center gap-3 flex-shrink-0">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setDrawerOpen(!drawerOpen)}
        className="w-9 h-9 flex flex-col gap-1.5 items-center justify-center rounded-xl transition-colors"
        style={{ color: textColor }}
      >
        <span style={{ backgroundColor: textColor }} className="w-5 h-0.5 rounded block"></span>
        <span style={{ backgroundColor: textColor }} className="w-5 h-0.5 rounded block"></span>
        <span style={{ backgroundColor: textColor }} className="w-3 h-0.5 rounded block"></span>
      </motion.button>

      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-gray-900 flex items-center justify-center">
          <span className="text-white font-bold text-xs">F</span>
        </div>

        <span
          style={{ color: textColor }}
          className="font-semibold text-base whitespace-nowrap"
        >
          FinSight
        </span>
      </div>
    </div>

    {/* Mode switcher */}
    <div
      style={{
        backgroundColor: darkMode ? '#1e293b' : '#f1f5f9',
        borderColor
      }}
      className="flex items-center rounded-xl p-1 gap-1"
    >
      {Object.entries(themes).map(([key]) => (
        <motion.button
          key={key}
          onClick={() => setMode(key)}
          whileTap={{ scale: 0.95 }}
          style={{
            backgroundColor: mode === key ? cardBg : 'transparent',
            color: mode === key ? textColor : subTextColor,
          }}
          className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 shadow-sm whitespace-nowrap flex items-center justify-center"
        >
          {key === 'fast'
            ? '⚡ Fast'
            : key === 'standard'
            ? '🧠 Standard'
            : '🔬 Deep'}
        </motion.button>
      ))}
    </div>

    {/* Right */}
    <div className="flex items-center gap-2 flex-shrink-0">

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setDarkMode(!darkMode)}
        style={{ borderColor, color: subTextColor }}
        className="text-xs border px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
      >
        {darkMode ? '☀️ Light' : '🌙 Dark'}
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={clearMessages}
        style={{ borderColor, color: subTextColor }}
        className="text-xs border px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
      >
        Clear chat
      </motion.button>
    </div>
  </div>

  {/* Mobile Navbar */}
  <div className="flex sm:hidden flex-col gap-3">

    {/* Row 1 */}
    <div className="flex items-center justify-between">

      {/* Left */}
      <div className="flex items-center gap-2">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setDrawerOpen(!drawerOpen)}
          className="w-8 h-8 flex flex-col gap-1.5 items-center justify-center rounded-xl"
          style={{ color: textColor }}
        >
          <span style={{ backgroundColor: textColor }} className="w-5 h-0.5 rounded block"></span>
          <span style={{ backgroundColor: textColor }} className="w-5 h-0.5 rounded block"></span>
          <span style={{ backgroundColor: textColor }} className="w-3 h-0.5 rounded block"></span>
        </motion.button>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gray-900 flex items-center justify-center">
            <span className="text-white font-bold text-xs">F</span>
          </div>

          <span
            style={{ color: textColor }}
            className="font-semibold text-lg whitespace-nowrap"
          >
            FinSight
          </span>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1">

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setDarkMode(!darkMode)}
          style={{ borderColor, color: subTextColor }}
          className="text-[10px] border px-2 py-1 rounded-lg whitespace-nowrap"
        >
          {darkMode ? '☀️' : '🌙'}
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={clearMessages}
          style={{ borderColor, color: subTextColor }}
          className="text-[10px] border px-2 py-1 rounded-lg whitespace-nowrap"
        >
          Clear
        </motion.button>
      </div>
    </div>

    {/* Row 2 - Centered Mode Switcher */}
    <div className="flex justify-center w-full">

      <div
        style={{
          backgroundColor: darkMode ? '#1e293b' : '#f1f5f9',
          borderColor
        }}
        className="flex items-center rounded-xl p-1 gap-1"
      >
        {Object.entries(themes).map(([key]) => (
          <motion.button
            key={key}
            onClick={() => setMode(key)}
            whileTap={{ scale: 0.95 }}
            style={{
              backgroundColor: mode === key ? cardBg : 'transparent',
              color: mode === key ? textColor : subTextColor,
            }}
            className="px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap flex items-center justify-center"
          >
            {key === 'fast'
              ? '⚡'
              : key === 'standard'
              ? '🧠'
              : '🔬'}
          </motion.button>
        ))}
      </div>
    </div>
  </div>
</div>

      {/* Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 bg-black/30 z-20 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{ backgroundColor: cardBg, borderColor }}
              className="fixed left-0 top-0 h-full w-80 shadow-2xl z-30 flex flex-col border-r"
            >
              <div style={{ borderColor }} className="flex items-center justify-between p-5 border-b">
                <span style={{ color: textColor }} className="font-semibold">Menu</span>
                <button onClick={() => setDrawerOpen(false)} style={{ color: subTextColor }} className="text-xl hover:opacity-70">×</button>
              </div>

              {/* Company Insight */}
              <div style={{ borderColor }} className="p-5 border-b">
                <h3 style={{ color: textColor }} className="font-semibold text-sm mb-1">🏢 Company Insight</h3>
                <p style={{ color: subTextColor }} className="text-xs mb-3">Get full analysis without uploading a PDF</p>
                <input
                  type="text"
                  placeholder="Company name (e.g. Apple)"
                  value={company}
                  onChange={e => setCompany(e.target.value)}
                  style={{ backgroundColor: darkMode ? '#0f172a' : '#f9fafb', borderColor, color: textColor }}
                  className="w-full border rounded-xl px-3 py-2 text-sm mb-2 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Year (e.g. 2023)"
                  value={year}
                  onChange={e => setYear(e.target.value)}
                  style={{ backgroundColor: darkMode ? '#0f172a' : '#f9fafb', borderColor, color: textColor }}
                  className="w-full border rounded-xl px-3 py-2 text-sm mb-3 focus:outline-none"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCompanyInsight}
                  disabled={!company || !year}
                  className="w-full bg-gray-900 text-white py-2.5 rounded-xl text-sm font-medium disabled:opacity-40"
                >
                  Analyze Company →
                </motion.button>
              </div>

              {/* Upload */}
              <div style={{ borderColor }} className="p-5 border-b">
                <h3 style={{ color: textColor }} className="font-semibold text-sm mb-1">📄 Upload 10-K Filing</h3>
                <p style={{ color: subTextColor }} className="text-xs mb-3">Enter company details above first</p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => fileRef.current.click()}
                  disabled={uploading || !company || !year}
                  style={{ borderColor, color: subTextColor }}
                  className="w-full border-2 border-dashed rounded-xl py-3 text-sm disabled:opacity-40 transition-colors"
                >
                  {uploading ? 'Processing...' : '+ Drop or click to upload PDF'}
                </motion.button>
                <input ref={fileRef} type="file" accept=".pdf" className="hidden"
                  onChange={e => handleFileUpload(e.target.files[0])} />
                {uploadedFiles.map((f, i) => (
                  <div key={i} style={{ backgroundColor: darkMode ? '#0f172a' : '#f9fafb' }} className="mt-2 rounded-xl px-3 py-2">
                    <p style={{ color: textColor }} className="text-xs font-medium">{f.company} {f.year}</p>
                    <p style={{ color: subTextColor }} className="text-xs">{f.chunks} chunks indexed</p>
                  </div>
                ))}
              </div>

              {/* Recent chats */}
              <div className="p-5 flex-1 overflow-y-auto">
                <h3 style={{ color: textColor }} className="font-semibold text-sm mb-3">Recent Chats</h3>
                {messages.filter(m => m.role === 'user').slice(-5).reverse().map((m, i) => (
                  <div key={i} style={{ borderColor }} className="flex items-center justify-between py-2 border-b">
                    <p style={{ color: subTextColor }} className="text-xs truncate flex-1">{m.content}</p>
                  </div>
                ))}
                {messages.filter(m => m.role === 'user').length === 0 && (
                  <p style={{ color: subTextColor }} className="text-xs">No recent chats</p>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto z-10">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 style={{ color: textColor }} className="text-3xl font-bold mb-2">Welcome! 👋</h2>
              <p style={{ color: subTextColor }} className="mb-8 text-lg">How can I help you today?</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl w-full">
                {quickPrompts.map((q, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * i }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSend(q)}
                    style={{ backgroundColor: cardBg, borderColor, color: textColor }}
                    className="border rounded-2xl px-4 py-3 text-sm text-left hover:shadow-sm transition-all"
                  >
                    {q}
                  </motion.button>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                style={{ backgroundColor: t.badge, color: t.badgeText }}
                className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium"
              >
                {themes[mode].label} · {themes[mode].desc}
              </motion.div>
            </motion.div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto px-4 py-6">
            {messages.map((msg, i) => (
              <MessageBubble key={i} message={msg} darkMode={darkMode} />
            ))}
            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start mb-4">
                <div style={{ backgroundColor: cardBg, borderColor }} className="border rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                  <div className="flex gap-1">
                    {[0, 1, 2].map(i => (
                      <motion.div
                        key={i}
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.12 }}
                        style={{ backgroundColor: t.button }}
                        className="w-2 h-2 rounded-full"
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Input bar */}
      <div style={{ backgroundColor: topBarBg, borderColor }} className="p-4 backdrop-blur-sm border-t z-10">
        <div className="max-w-3xl mx-auto">
          <div style={{ backgroundColor: inputBg, borderColor }} className="flex items-end gap-2 border rounded-2xl px-3 py-2 shadow-sm">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => { if (!company || !year) { setDrawerOpen(true) } else { fileRef.current.click() } }}
              style={{ color: subTextColor }}
              className="p-1 transition-colors flex-shrink-0"
              title="Upload PDF"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => imageRef.current.click()}
              style={{ color: subTextColor }}
              className="p-1 transition-colors flex-shrink-0"
              title="Upload Image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </motion.button>
            <input ref={imageRef} type="file" accept="image/*" className="hidden" />

            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask anything about finance, markets, investments..."
              rows={1}
              style={{ color: textColor, caretColor: textColor }}
              className="flex-1 bg-transparent text-sm placeholder-gray-400 focus:outline-none resize-none py-1"
            />

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              style={{ backgroundColor: t.button }}
              className="text-white p-2 rounded-xl disabled:opacity-40 transition-colors flex-shrink-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
              </svg>
            </motion.button>
          </div>
          <p style={{ color: subTextColor }} className="text-center text-xs mt-2">Enter to send · Shift+Enter for new line</p>
        </div>
      </div>
    </motion.div>
  )
}
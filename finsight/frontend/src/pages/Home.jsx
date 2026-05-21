import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
 
const suggestions = [
  { icon: "📈", title: "Market Trends", desc: "What's happening in markets today?" },
  { icon: "🏦", title: "Investment Guide", desc: "How should I start investing?" },
  { icon: "💰", title: "Tax Planning", desc: "How can I reduce my tax burden?" },
  { icon: "📊", title: "Stock Analysis", desc: "Analyze Apple's financial health" },
  { icon: "🛡️", title: "Insurance", desc: "What insurance do I need?" },
  { icon: "💳", title: "Debt Management", desc: "Good debt vs bad debt explained" },
]
 
const stats = [
  { value: "10K+", label: "Filings Analyzed" },
  { value: "3", label: "AI Models" },
  { value: "100%", label: "Free to Use" },
  { value: "Real-time", label: "Market Data" },
]
 
export default function Home() {
  return (
    <div className="min-h-screen bg-white font-['DM_Sans',sans-serif]">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center">
            <span className="text-white font-bold text-sm">F</span>
          </div>
          <span className="font-semibold text-gray-900 text-lg tracking-tight">FinSight</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-gray-500 text-sm hidden md:block">AI Financial Intelligence</span>
          <Link to="/chat">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium"
            >
              Open App →
            </motion.button>
          </Link>
        </div>
      </nav>
 
      {/* Hero */}
      <section className="max-w-5xl mx-auto px-8 pt-20 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-1.5 text-sm text-gray-600 mb-8">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Live market data · SEC filings · AI analysis
          </div>
 
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6 tracking-tight">
            Your Personal<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-600 to-gray-900">
              Financial Analyst
            </span>
          </h1>
 
          <p className="text-gray-500 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Ask anything about stocks, investments, taxes, insurance, or upload SEC filings for deep AI-powered analysis with cited sources.
          </p>
 
          <Link to="/chat">
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}
              whileTap={{ scale: 0.98 }}
              className="bg-gray-900 text-white px-8 py-4 rounded-2xl text-base font-semibold inline-flex items-center gap-2"
            >
              Start for free
              <span>→</span>
            </motion.button>
          </Link>
        </motion.div>
 
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-16 border-t border-gray-100"
        >
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl font-bold text-gray-900">{s.value}</div>
              <div className="text-sm text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </section>
 
      {/* Suggestions */}
      <section className="max-w-5xl mx-auto px-8 pb-20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">What can I help you with?</h2>
          <Link to="/chat" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Try all →</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {suggestions.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              whileHover={{ y: -3, boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}
            >
              <Link to="/chat">
                <div className="bg-white border border-gray-100 rounded-2xl p-5 cursor-pointer hover:border-gray-200 transition-all">
                  <div className="text-2xl mb-3">{s.icon}</div>
                  <div className="font-semibold text-gray-900 text-sm mb-1">{s.title}</div>
                  <div className="text-gray-500 text-sm">{s.desc}</div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
 
      {/* Footer */}
      <footer className="border-t border-gray-100 px-8 py-6 flex items-center justify-between">
        <span className="text-gray-400 text-sm">FinSight — AI Financial Intelligence</span>
        <span className="text-gray-400 text-sm">Powered by Llama 3 · Alpha Vantage</span>
      </footer>
    </div>
  )
}
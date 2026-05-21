import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-dark/80 backdrop-blur-md border-b border-border"
    >
      <Link to="/" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-sm">F</div>
        <span className="text-white font-semibold text-lg">FinSight</span>
      </Link>
      <div className="flex items-center gap-4">
        <Link to="/chat" className="text-slate-400 hover:text-white transition-colors text-sm">Chat</Link>
        <Link to="/chat">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-sky-400 transition-colors"
          >
            Get Started
          </motion.button>
        </Link>
      </div>
    </motion.nav>
  )
}
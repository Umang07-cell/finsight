import { motion } from 'framer-motion'
import UploadPanel from './UploadPanel'

export default function Sidebar({ mode, setMode, onClear }) {
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
      {/* Logo */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-sm">F</div>
          <span className="text-white font-semibold">FinSight</span>
        </div>
      </div>

      {/* Upload */}
      <UploadPanel />

      {/* Mode selector */}
      <div className="p-4 border-b border-border">
        <h3 className="text-white font-semibold text-sm mb-3">Query Mode</h3>
        <div className="space-y-2">
          {modes.map(m => (
            <motion.button
              key={m.id}
              whileHover={{ x: 2 }}
              onClick={() => setMode(m.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                mode === m.id
                  ? 'bg-primary/10 border border-primary/30 text-primary'
                  : 'text-slate-400 hover:bg-dark hover:text-white'
              }`}
            >
              <span>{m.label}</span>
              <span className="text-xs opacity-60">{m.desc}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Clear */}
      <div className="p-4 mt-auto">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onClear}
          className="w-full border border-border text-slate-400 hover:text-white hover:border-slate-500 py-2 rounded-lg text-sm transition-colors"
        >
          Clear Chat
        </motion.button>
      </div>
    </motion.aside>
  )
}
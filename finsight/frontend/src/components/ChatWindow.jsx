import { useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MessageBubble from './MessageBubble'

export default function ChatWindow({ messages, loading }) {
  const bottomRef = useRef()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      <AnimatePresence>
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full flex flex-col items-center justify-center text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-3xl mb-4">
              📊
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">Ready to analyze</h3>
            <p className="text-slate-500 text-sm max-w-sm">
              Upload a 10-K filing on the left, then ask anything about it.
            </p>
            <div className="mt-6 grid grid-cols-1 gap-2 w-full max-w-sm">
              {[
                "What was the total revenue in 2023?",
                "How did R&D spending change year over year?",
                "What are the main risk factors?",
              ].map((q, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-card border border-border rounded-lg px-4 py-2 text-sm text-slate-400"
                >
                  "{q}"
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {messages.map((msg, i) => (
        <MessageBubble key={i} message={msg} />
      ))}

      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-start mb-4"
        >
          <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3">
            <div className="flex gap-1">
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                  className="w-2 h-2 bg-primary rounded-full"
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}

      <div ref={bottomRef} />
    </div>
  )
}
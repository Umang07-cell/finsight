import { useState } from 'react'
import axios from 'axios'

export default function useChat() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const sessionId = useState(() => crypto.randomUUID())[0]

  const sendMessage = async (question, mode = 'standard') => {
    const userMsg = { role: 'user', content: question }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)

    try {
      const res = await axios.post('https://finsight-production-b9e2.up.railway.app/api/query/', {
        question,
        session_id: sessionId,
        mode
      })

      const botMsg = {
        role: 'assistant',
        content: res.data.answer,
        sources: res.data.sources,
        mode: res.data.mode,
        model: res.data.model_used,
        report: res.data.report
      }
      setMessages(prev => [...prev, botMsg])
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Something went wrong. Please try again.',
        sources: [],
        mode,
        model: '',
        report: null
      }])
    } finally {
      setLoading(false)
    }
  }

  const clearMessages = () => setMessages([])

  return { messages, loading, sendMessage, clearMessages, sessionId }
}
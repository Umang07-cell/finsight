import { useState, useEffect } from 'react'
import axios from 'axios'

export default function useChat() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [savedChats, setSavedChats] = useState([])

  // ===== PERSISTENT SESSION ID =====
  const [sessionId, setSessionId] = useState(() => {
    return (
      localStorage.getItem(
        'finsight_current_session'
      ) || crypto.randomUUID()
    )
  })

  // ===== LOAD SAVED CHATS =====
  useEffect(() => {

    const stored = localStorage.getItem(
      'finsight_saved_chats'
    )

    if (stored) {
      try {
        setSavedChats(JSON.parse(stored))
      } catch (e) {
        console.log('Failed to load chats')
      }
    }

  }, [])

  // ===== SAVE CURRENT SESSION =====
  useEffect(() => {

    localStorage.setItem(
      'finsight_current_session',
      sessionId
    )

  }, [sessionId])

  // ===== AUTO SAVE CURRENT CHAT =====
  useEffect(() => {

    if (messages.length === 0) return

    const firstUserMsg = messages.find(
      m => m.role === 'user'
    )

    if (!firstUserMsg) return

    const currentChat = {
      id: sessionId,
      title: firstUserMsg.content.slice(0, 50),
      messages
    }

    setSavedChats(prev => {

      const existingIndex = prev.findIndex(
        c => c.id === sessionId
      )

      let updated

      if (existingIndex !== -1) {

        updated = [...prev]

        updated[existingIndex] = currentChat

      } else {

        updated = [
          currentChat,
          ...prev
        ]
      }

      // keep only latest 10 chats
      updated = updated.slice(0, 10)

      // persist
      localStorage.setItem(
        'finsight_saved_chats',
        JSON.stringify(updated)
      )

      return updated
    })

  }, [messages, sessionId])

  // ===== SEND MESSAGE =====
  const sendMessage = async (
    question,
    mode = 'standard'
  ) => {

    const userMsg = {
      role: 'user',
      content: question
    }

    setMessages(prev => [
      ...prev,
      userMsg
    ])

    setLoading(true)

    try {

      const res = await axios.post(
        'https://finsight-production-b9e2.up.railway.app/api/query/',
        {
          question,
          session_id: sessionId,
          mode
        }
      )

      const botMsg = {
        role: 'assistant',
        content: res.data.answer,
        sources: res.data.sources,
        mode: res.data.mode,
        model: res.data.model_used,
        report: res.data.report
      }

      setMessages(prev => [
        ...prev,
        botMsg
      ])

    } catch (err) {

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content:
            'Something went wrong. Please try again.',
          sources: [],
          mode,
          model: '',
          report: null
        }
      ])

    } finally {

      setLoading(false)

    }
  }

  // ===== START NEW CHAT =====
  const startNewChat = () => {

    const newId = crypto.randomUUID()

    localStorage.setItem(
      'finsight_current_session',
      newId
    )

    setSessionId(newId)

    setMessages([])
  }

  // ===== LOAD OLD CHAT =====
  const loadChat = (chatId) => {

    const chat = savedChats.find(
      c => c.id === chatId
    )

    if (chat) {

      setSessionId(chat.id)

      setMessages(chat.messages)
    }
  }
  const deleteChat = (chatId) => {

  const updated = savedChats.filter(
    c => c.id !== chatId
  )

  setSavedChats(updated)

  localStorage.setItem(
    'finsight_saved_chats',
    JSON.stringify(updated)
  )

  // if current open chat deleted
  if (sessionId === chatId) {
    setMessages([])
  }
}

  // ===== CLEAR CURRENT CHAT =====
  const clearMessages = () => {
    setMessages([])
  }

  return {
    deleteChat,
    messages,
    setMessages,
    loading,
    sendMessage,
    clearMessages,
    startNewChat,
    loadChat,
    savedChats,
    sessionId
  }
}
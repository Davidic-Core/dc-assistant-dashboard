'use client'

import { useState } from 'react'
import { Send, Loader, Edit2, RotateCcw, Copy, Trash2, Check, X, Square } from 'lucide-react'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export default function AIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I&apos;m your AI GitHub Assistant. I can help you with repository insights, commit analysis, and coding questions. What would you like to know?',
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleSend = () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I&apos;ve analyzed your request about "${input.slice(0, 30)}...". Based on your repositories, I found some interesting insights. Would you like me to elaborate on any specific aspect?`,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      }
      setMessages((prev) => [...prev, aiMessage])
      setIsLoading(false)
    }, 800)
  }

  const handleEditPrompt = (messageId: string, content: string) => {
    setEditingId(messageId)
    setEditText(content)
  }

  const handleSaveEdit = (messageId: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, content: editText } : msg
      )
    )
    setEditingId(null)
    setEditText('')
  }

  const handleRegenerate = (messageId: string) => {
    const messageIndex = messages.findIndex((m) => m.id === messageId)
    if (messageIndex !== -1) {
      const userMessage = messages[messageIndex - 1]
      if (userMessage && userMessage.role === 'user') {
        setMessages((prev) => prev.slice(0, messageIndex))
        setIsLoading(true)

        setTimeout(() => {
          const aiMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: `I&apos;ve regenerated my response about "${userMessage.content.slice(0, 30)}...". Here&apos;s a new perspective based on your request.`,
            timestamp: new Date().toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
          }
          setMessages((prev) => [...prev, aiMessage])
          setIsLoading(false)
        }, 800)
      }
    }
  }

  const handleCopyResponse = (content: string, messageId: string) => {
    navigator.clipboard.writeText(content)
    setCopiedId(messageId)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleDeleteMessage = (messageId: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== messageId))
  }

  return (
    <div className="flex flex-col h-full bg-card border border-card-border rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-card-border bg-gradient-to-r from-card to-card-border">
        <h3 className="font-semibold text-foreground">AI Assistant</h3>
        <p className="text-xs text-text-secondary mt-1">
          Ask about your repositories and GitHub activity
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 group ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-accent">AI</span>
              </div>
            )}
            <div className="flex flex-col gap-1">
              <div
                className={`max-w-xs px-4 py-2.5 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-accent text-background'
                    : 'bg-card-border text-foreground border border-card-border'
                }`}
              >
                {editingId === message.id ? (
                  <div className="flex gap-2">
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="flex-1 bg-background text-foreground rounded px-2 py-1 text-sm border border-accent/50 focus:outline-none"
                      rows={2}
                    />
                  </div>
                ) : (
                  <>
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {message.timestamp}
                    </p>
                  </>
                )}
              </div>
              {editingId === message.id ? (
                <div className="flex gap-2 px-4">
                  <button
                    onClick={() => handleSaveEdit(message.id)}
                    className="text-xs px-3 py-1 bg-accent text-background rounded hover:bg-accent-hover transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="text-xs px-3 py-1 bg-card-border text-foreground rounded hover:bg-card-border/80 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : message.role === 'assistant' ? (
                <div className="flex gap-2 px-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleRegenerate(message.id)}
                    className="text-xs p-1.5 rounded bg-card-border/50 hover:bg-card-border text-text-secondary hover:text-accent transition-colors"
                    title="Regenerate response"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleCopyResponse(message.content, message.id)}
                    className="text-xs p-1.5 rounded bg-card-border/50 hover:bg-card-border text-text-secondary hover:text-accent transition-colors"
                    title="Copy response"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleDeleteMessage(message.id)}
                    className="text-xs p-1.5 rounded bg-card-border/50 hover:bg-red-500/20 text-text-secondary hover:text-red-400 transition-colors"
                    title="Delete message"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                  {copiedId === message.id && (
                    <span className="text-xs text-accent self-center">Copied!</span>
                  )}
                </div>
              ) : (
                <div className="flex gap-2 px-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEditPrompt(message.id, message.content)}
                    className="text-xs p-1.5 rounded bg-card-border/50 hover:bg-card-border text-text-secondary hover:text-accent transition-colors"
                    title="Edit message"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleDeleteMessage(message.id)}
                    className="text-xs p-1.5 rounded bg-card-border/50 hover:bg-red-500/20 text-text-secondary hover:text-red-400 transition-colors"
                    title="Delete message"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-accent">AI</span>
            </div>
            <div className="bg-card-border rounded-lg px-4 py-3">
              <Loader className="w-4 h-4 animate-spin text-accent" />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-card-border bg-gradient-to-t from-card to-card-border">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
            placeholder="Ask me anything..."
            className="flex-1 bg-background border border-card-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-text-tertiary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() && !isLoading}
            className="p-2.5 bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors text-background flex-shrink-0"
            title={isLoading ? 'Stop response' : 'Send message'}
          >
            {isLoading ? (
              <Square className="w-4 h-4" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

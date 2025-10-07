'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Navbar from '../../components/Navbar'
import {
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  UserIcon
} from '@heroicons/react/24/outline'

interface Conversation {
  id: string
  otherParticipant: {
    id: string
    username: string
    firstName: string
    lastName: string
    avatar?: string
  }
  lastMessage?: {
    content: string
    createdAt: string
    senderId: string
  }
  unreadCount: number
}

interface Message {
  id: string
  content: string
  senderId: string
  createdAt: string
  isRead: boolean
}

export default function MessagesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sendingMessage, setSendingMessage] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/login?redirect=/messages')
      return
    }

    fetchConversations()

    // Se c'è un parametro conversation nell'URL, selezionalo automaticamente
    const conversationId = searchParams.get('conversation')
    if (conversationId) {
      setSelectedConversation(conversationId)
    }
  }, [session, status, router, searchParams])

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation)
    }
  }, [selectedConversation])

  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/messages/conversations')
      if (response.ok) {
        const data = await response.json()
        setConversations(data)
      }
    } catch (error) {
      console.error('Error fetching conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/messages/conversations/${conversationId}`)
      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages || [])
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return

    setSendingMessage(true)
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId: selectedConversation,
          content: newMessage,
        }),
      })

      if (response.ok) {
        setNewMessage('')
        fetchMessages(selectedConversation)
        fetchConversations() // Aggiorna anche la lista conversazioni
      }
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setSendingMessage(false)
    }
  }

  if (loading) {
    return (
      <div className="h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-wine-600"></div>
        </div>
      </div>
    )
  }

  const selectedConv = conversations.find(c => c.id === selectedConversation)

  return (
    <div className="h-screen bg-white flex flex-col">
      <Navbar />

      <div className="flex-1 flex overflow-hidden">
        {/* Conversazioni */}
        <div className={`border-r border-gray-200 overflow-y-auto transition-all duration-300 flex-shrink-0 ${
          sidebarCollapsed ? 'w-20' : 'w-80'
        }`}>
          {/* Toggle button */}
          <div className="p-3 border-b border-gray-200 flex items-center justify-between bg-gray-50">
            {!sidebarCollapsed && <span className="text-sm font-semibold text-gray-700">Conversazioni</span>}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
              title={sidebarCollapsed ? 'Espandi' : 'Comprimi'}
            >
              <svg
                className={`h-5 w-5 text-gray-600 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          </div>

          {conversations.length === 0 ? (
            <div className="text-center py-12">
              {!sidebarCollapsed && (
                <>
                  <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-sm">Nessuna conversazione</p>
                </>
              )}
            </div>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedConversation(conv.id)}
                className={`w-full p-3 border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                  selectedConversation === conv.id ? 'bg-wine-50' : ''
                }`}
                title={sidebarCollapsed ? (conv.otherParticipant?.firstName && conv.otherParticipant?.lastName
                  ? `${conv.otherParticipant.firstName} ${conv.otherParticipant.lastName}`
                  : conv.otherParticipant?.username) : ''}
              >
                {sidebarCollapsed ? (
                  <div className="flex justify-center relative">
                    {conv.otherParticipant?.avatar ? (
                      <img
                        src={conv.otherParticipant.avatar}
                        alt={conv.otherParticipant.username}
                        className="h-10 w-10 rounded-full"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <UserIcon className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                    {conv.unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 inline-flex items-center justify-center h-5 w-5 text-xs font-bold text-white bg-red-600 rounded-full">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {conv.otherParticipant?.avatar ? (
                        <img
                          src={conv.otherParticipant.avatar}
                          alt={conv.otherParticipant.username}
                          className="h-10 w-10 rounded-full"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <UserIcon className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {conv.otherParticipant?.firstName && conv.otherParticipant?.lastName
                          ? `${conv.otherParticipant.firstName} ${conv.otherParticipant.lastName}`
                          : conv.otherParticipant?.username}
                      </p>
                      {conv.lastMessage && (
                        <p className="text-xs text-gray-500 truncate">
                          {conv.lastMessage.content}
                        </p>
                      )}
                    </div>
                    {conv.unreadCount > 0 && (
                      <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                )}
              </button>
            ))
          )}
        </div>

        {/* Messaggi */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Header conversazione */}
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        {selectedConv?.otherParticipant?.avatar ? (
                          <img
                            src={selectedConv.otherParticipant.avatar}
                            alt={selectedConv.otherParticipant.username}
                            className="h-10 w-10 rounded-full"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <UserIcon className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {selectedConv?.otherParticipant?.firstName && selectedConv?.otherParticipant?.lastName
                            ? `${selectedConv.otherParticipant.firstName} ${selectedConv.otherParticipant.lastName}`
                            : selectedConv?.otherParticipant?.username}
                        </p>
                      </div>
                    </div>
                  </div>

              {/* Messaggi */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                    {messages.length === 0 ? (
                      <div className="text-center py-12">
                        <p className="text-gray-500">Nessun messaggio. Inizia la conversazione!</p>
                      </div>
                    ) : (
                      messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.senderId === session?.user?.id ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              message.senderId === session?.user?.id
                                ? 'bg-wine-600 text-white'
                                : 'bg-gray-200 text-gray-900'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p className={`text-xs mt-1 ${
                              message.senderId === session?.user?.id ? 'text-wine-200' : 'text-gray-500'
                            }`}>
                              {new Date(message.createdAt).toLocaleTimeString('it-IT', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

              {/* Input messaggio */}
              <div className="p-4 border-t border-gray-200 bg-white">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Scrivi un messaggio..."
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-wine-500"
                        disabled={sendingMessage}
                      />
                      <button
                        onClick={sendMessage}
                        disabled={sendingMessage || !newMessage.trim()}
                        className="bg-wine-600 text-white px-4 py-2 rounded-lg hover:bg-wine-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <PaperAirplaneIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <ChatBubbleLeftRightIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Seleziona una conversazione per iniziare</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

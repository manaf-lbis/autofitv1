import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, CheckCheck, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { initSocket } from "@/lib/socket"

interface User {
  id: string
  name: string
  issue: string
  lastMessage: string
  timestamp: string
  unreadCount: number
  isOnline: boolean
}

interface Message {
  id: string
  userId: string
  content: string
  timestamp: string
  isFromUser: boolean
  status: "sent" | "delivered" | "read"
}

const users: User[] = [
  {
    id: "1",
    name: "John Smith",
    issue: "Battery Jump Start",
    lastMessage: "Thank you for the quick service!",
    timestamp: "2m",
    unreadCount: 0,
    isOnline: true,
  },
  {
    id: "2",
    name: "Sarah Johnson",
    issue: "Tire Change Required",
    lastMessage: "How long will it take to reach?",
    timestamp: "5m",
    unreadCount: 2,
    isOnline: true,
  },
  {
    id: "3",
    name: "Mike Wilson",
    issue: "Pre-trip Inspection",
    lastMessage: "Can we schedule for tomorrow?",
    timestamp: "15m",
    unreadCount: 1,
    isOnline: false,
  },
  {
    id: "4",
    name: "Emily Davis",
    issue: "Engine Overheating",
    lastMessage: "I'm stuck on highway 101",
    timestamp: "1h",
    unreadCount: 3,
    isOnline: true,
  },
  {
    id: "5",
    name: "Robert Brown",
    issue: "Live Assistance",
    lastMessage: "The brake pedal feels soft",
    timestamp: "2h",
    unreadCount: 0,
    isOnline: false,
  },
]

const messages: { [key: string]: Message[] } = {
  "1": [
    {
      id: "1",
      userId: "1",
      content: "Hi, I need help with my car battery",
      timestamp: "10:30",
      isFromUser: true,
      status: "read",
    },
    {
      id: "2",
      userId: "1",
      content: "Hello! I can help you with that. What seems to be the problem?",
      timestamp: "10:31",
      isFromUser: false,
      status: "read",
    },
    {
      id: "3",
      userId: "1",
      content: "My car won't start. I think the battery is dead.",
      timestamp: "10:32",
      isFromUser: true,
      status: "read",
    },
    {
      id: "4",
      userId: "1",
      content: "I'll send a technician to your location. Can you share your exact address?",
      timestamp: "10:33",
      isFromUser: false,
      status: "read",
    },
    {
      id: "5",
      userId: "1",
      content: "123 Main Street, Downtown",
      timestamp: "10:34",
      isFromUser: true,
      status: "read",
    },
    {
      id: "6",
      userId: "1",
      content: "Perfect! Our technician will be there in 15 minutes.",
      timestamp: "10:35",
      isFromUser: false,
      status: "read",
    },
    {
      id: "7",
      userId: "1",
      content: "Thank you for the quick service!",
      timestamp: "11:45",
      isFromUser: true,
      status: "read",
    },
  ],
  "2": [
    {
      id: "1",
      userId: "2",
      content: "I have a flat tire on Highway 95",
      timestamp: "14:15",
      isFromUser: true,
      status: "read",
    },
    {
      id: "2",
      userId: "2",
      content: "I'm sending help right away. Please stay in a safe location.",
      timestamp: "14:16",
      isFromUser: false,
      status: "read",
    },
    {
      id: "3",
      userId: "2",
      content: "How long will it take to reach?",
      timestamp: "14:20",
      isFromUser: true,
      status: "delivered",
    },
  ],
}

export default function ChatManagementPage() {
  const [activeUserId, setActiveUserId] = useState<string>("1")
  const [newMessage, setNewMessage] = useState("")
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const activeUser = users.find((user) => user.id === activeUserId)
  const activeMessages = messages[activeUserId] || []

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [activeMessages])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return
    console.log("Sending message:", newMessage)
    setNewMessage("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  useEffect(()=>{
   const socket = initSocket()
   socket.on('you cna su',(data)=>{
    console.log(data);
   })
  },[])

  return (
    <div className="min-h-[calc(100vh-120px)] bg-white flex">
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar - User List */}
      <div
        className={`fixed lg:relative inset-y-0 left-0 z-50 w-80 bg-gray-50 border-r border-gray-200 flex flex-col transform transition-transform duration-200 ease-out lg:translate-x-0 ${
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold text-gray-900">Messages</h1>
            <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setIsMobileSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* User List */}
        <div className="flex-1 overflow-y-auto">
          {users.map((user) => (
            <div
              key={user.id}
              onClick={() => {
                setActiveUserId(user.id)
                setIsMobileSidebarOpen(false)
              }}
              className={`p-4 cursor-pointer transition-colors ${
                activeUserId === user.id ? "bg-white border-r-2 border-r-blue-500" : "hover:bg-white/50"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-gray-900 truncate">{user.name}</h3>
                    {user.isOnline && <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />}
                  </div>
                  <p className="text-sm text-gray-600 truncate">{user.issue}</p>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className="text-xs text-gray-500">{user.timestamp}</span>
                  {user.unreadCount > 0 && (
                    <div className="w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                      {user.unreadCount}
                    </div>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-500 truncate">{user.lastMessage}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeUser ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setIsMobileSidebarOpen(true)}>
                  <Menu className="h-5 w-5" />
                </Button>
                <div className="flex items-center gap-2">
                  <h2 className="font-medium text-gray-900">{activeUser.name}</h2>
                  {activeUser.isOnline && <div className="w-2 h-2 bg-green-500 rounded-full" />}
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-1 ml-0 lg:ml-0">{activeUser.issue}</p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              <div className="space-y-4">
                {activeMessages.map((message) => (
                  <div key={message.id} className={`flex ${message.isFromUser ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                        message.isFromUser ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-900"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <div
                        className={`flex items-center justify-end gap-1 mt-1 ${
                          message.isFromUser ? "text-blue-100" : "text-gray-500"
                        }`}
                      >
                        <span className="text-xs">{message.timestamp}</span>
                        {message.isFromUser && (
                          <CheckCheck
                            className={`h-3 w-3 ${message.status === "read" ? "text-blue-200" : "text-blue-300"}`}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
              <p className="text-gray-600">Choose a customer to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}




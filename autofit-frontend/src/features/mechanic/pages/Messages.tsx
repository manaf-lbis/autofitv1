import { useState, useRef, useEffect } from "react"
import { Send, CheckCheck, Menu, X, Clock, MessageSquare, Circle } from "lucide-react"
import { Button } from "@/components/ui/button"
import MessagesShimmer from "../components/shimmer/MessagesShimmer"
import { useGetMechanicChatsQuery } from "../api/mechanicChatApi"
import { formatTimeToNow } from "@/lib/dateFormater"


const CURRENT_MECHANIC_ID = "683d79ecd070035eb47505a4"

export default function MessagesPage() {

  const [activeServiceId, setActiveServiceId] = useState<string>("")
  const [newMessage, setNewMessage] = useState("")
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const {data ,isLoading:chatLoading} = useGetMechanicChatsQuery()

  useEffect(() => {
    fetchChats()
  }, [])


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [activeServiceId])

  const fetchChats = async () => {
   
  }


  const sendMessage = async (serviceId: string, message: string) => {
    if (!message.trim()) return


    try {

     
      setNewMessage("")
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setIsSending(false)
    }
  }


  const getUnreadCount = (messages) => {
    return messages.filter((msg) => !msg.seen && msg.senderRole === "user").length
  }

  const getLastMessage = (messages) => {
    if (messages.length === 0) return "No messages"
    const lastMsg = messages[messages.length - 1]
    // Truncate long messages in sidebar
    return lastMsg.message.length > 50 ? lastMsg.message.substring(0, 50) + "..." : lastMsg.message
  }

  const getServiceTypeLabel = (serviceType: string) => {
    switch (serviceType) {
      case "roadsideAssistance":
        return "Roadside Assistance"
      case "pretrip":
        return "Pre-trip Inspection"
      case "live":
        return "Live Support"
      default:
        return "Service"
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const activeChat = chats.find((chat) => chat._id === activeServiceId)
  const activeMessages = activeChat?.messages || []

  if (chatLoading) {
    return <MessagesShimmer />
  }

  return (
    <div className="h-[calc(100vh-120px)] bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 bg-black/20 z-40 lg:hidden" onClick={() => setIsMobileSidebarOpen(false)} />
      )}

      {/* Left Sidebar - Chat List */}
      <div
        className={`fixed lg:relative inset-y-0 left-0 z-50 w-80 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-200 ease-out lg:translate-x-0 ${
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Messages</h1>
              <p className="text-sm text-gray-500 mt-1">{chats.length} conversations</p>
            </div>
            <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setIsMobileSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {chats.length === 0 ? (
            <div className="p-6 text-center">
              <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-sm text-gray-500">No conversations yet</p>
            </div>
          ) : (
            <div className="p-4">
              {chats.map((chat) => {
                const unreadCount = getUnreadCount(chat.messages)
                const lastMessage = getLastMessage(chat.messages)
                const lastMessageTime =
                  chat.messages.length > 0 ? formatTimeToNow(chat.messages[chat.messages.length - 1].createdAt) : ""
                const serviceType = chat.messages[0]?.serviceType || ""

                return (
                  <div
                    key={chat._id}
                    onClick={() => {
                      setActiveServiceId(chat._id)
                      setIsMobileSidebarOpen(false)
                    }}
                    className={`p-4 mb-2 cursor-pointer transition-all duration-150 rounded-lg border ${
                      activeServiceId === chat._id
                        ? "bg-blue-50 border-blue-200"
                        : "bg-white border-gray-100 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative flex-shrink-0">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">{getInitials(chat.name)}</span>
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium text-gray-900 truncate">{chat.name}</h3>
                          <span className="text-xs text-gray-500 flex-shrink-0">{lastMessageTime}</span>
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-500">{getServiceTypeLabel(serviceType)}</span>
                          {unreadCount > 0 && (
                            <div className="w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-medium">
                              {unreadCount}
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{lastMessage}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {activeChat ? (
          <>
            {/* Chat Header - Simplified */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setIsMobileSidebarOpen(true)}>
                  <Menu className="h-5 w-5" />
                </Button>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">{getInitials(activeChat.name)}</span>
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">{activeChat.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <Circle className="w-2 h-2 fill-green-500 text-green-500" />
                      <span className="text-sm text-gray-500">Online</span>
                      <span className="text-sm text-gray-400">•</span>
                      <span className="text-sm text-gray-500">
                        {getServiceTypeLabel(activeMessages[0]?.serviceType)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages - Fixed for long text */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {activeMessages.map((message) => {
                  const isFromMechanic = message.senderRole === "mechanic"

                  return (
                    <div key={message._id} className={`flex ${isFromMechanic ? "justify-end" : "justify-start"}`}>
                      <div className={`flex gap-3 max-w-[85%] ${isFromMechanic ? "flex-row-reverse" : "flex-row"}`}>
                        {!isFromMechanic && (
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="text-xs font-medium text-gray-600">
                              {getInitials(message.senderInfo.name)}
                            </span>
                          </div>
                        )}
                        <div
                          className={`px-4 py-3 rounded-lg break-words ${
                            isFromMechanic
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-900 border border-gray-200"
                          }`}
                        >
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.message}</p>
                          <div
                            className={`flex items-center justify-between mt-2 text-xs ${
                              isFromMechanic ? "text-blue-100" : "text-gray-500"
                            }`}
                          >
                            <span>{formatTimeToNow(message.createdAt)}</span>
                            {isFromMechanic && (
                              <CheckCheck
                                className={`h-3 w-3 ml-2 ${message.seen ? "text-blue-200" : "text-blue-300"}`}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input - Fixed alignment */}
            <div className="p-6 border-t border-gray-100 bg-white">
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        sendMessage(activeServiceId, newMessage)
                      }
                    }}
                    placeholder="Type a message..."
                    disabled={isSending}
                    rows={1}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 transition-colors resize-none min-h-[48px] max-h-32"
                    style={{
                      height: "auto",
                      minHeight: "48px",
                    }}
                    onInput={(e) => {
                      const target = e.target as HTMLTextAreaElement
                      target.style.height = "auto"
                      target.style.height = Math.min(target.scrollHeight, 128) + "px"
                    }}
                  />
                </div>
                <Button
                  onClick={() => sendMessage(activeServiceId, newMessage)}
                  disabled={!newMessage.trim() || isSending}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 h-12 disabled:opacity-50 flex-shrink-0"
                >
                  {isSending ? <Clock className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
              <p className="text-gray-500 max-w-sm">
                Choose a customer conversation from the sidebar to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}





// import { useState, useRef, useEffect } from "react"
// import { Send, CheckCheck, Menu, X, Clock, MessageSquare, Circle } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import MessagesShimmer from "../components/shimmer/MessagesShimmer"
// import { useGetMechanicChatsQuery } from "../api/mechanicChatApi"

// interface SenderInfo {
//   _id: string
//   name: string
// }

// interface Message {
//   _id: string
//   serviceId: string
//   serviceType: string
//   senderId: string
//   senderRole: "user" | "mechanic"
//   receiverId: string
//   receiverRole: "user" | "mechanic"
//   message: string
//   seen: boolean
//   createdAt: string
//   updatedAt: string
//   senderInfo: SenderInfo
// }

// interface ChatData {
//   _id: string
//   name: string
//   messages: Message[]
// }

// interface ApiResponse {
//   status: string
//   message: string
//   data: ChatData[]
// }

// // Mock data with long messages to test UI
// const mockApiResponse: ApiResponse = {
//   status: "success",
//   message: "Mechanic chats fetched successfully",
//   data: [
//     {
//       _id: "685189a3b220e56e30e227b3",
//       name: "Abdul Manaf S",
//       messages: [
//         {
//           _id: "6857caadbf458575f04779a3",
//           serviceId: "685189a3b220e56e30e227b3",
//           serviceType: "roadsideAssistance",
//           senderId: "67f77dedfed0bf6ab1dd5664",
//           senderRole: "user",
//           receiverId: "683d79ecd070035eb47505a4",
//           receiverRole: "mechanic",
//           message:
//             "Hi, I need urgent help with my car battery. It's completely dead and I'm stuck on Highway 101 near the Shell gas station. I was driving to an important business meeting when my car suddenly stopped working. The engine won't start at all, and I've tried jump-starting it myself but nothing seems to work. I'm getting quite worried because I'm in an unfamiliar area and it's getting dark. Could you please send someone as soon as possible? I'm willing to pay extra for emergency service. My car is a 2019 Honda Civic, silver color, license plate ABC-1234. I'll be waiting by the car with my hazard lights on.",
//           seen: false,
//           createdAt: "2025-06-22T09:19:41.786Z",
//           updatedAt: "2025-06-22T09:19:41.786Z",
//           senderInfo: {
//             _id: "67f77dedfed0bf6ab1dd5664",
//             name: "Abdul Manaf S",
//           },
//         },
//       ],
//     },
//     {
//       _id: "685243ccf0b115be143c772a",
//       name: "Sarah Johnson",
//       messages: [
//         {
//           _id: "6857ca93bf458575f0477991",
//           serviceId: "685243ccf0b115be143c772a",
//           serviceType: "roadsideAssistance",
//           senderId: "67f77dedfed0bf6ab1dd5665",
//           senderRole: "user",
//           receiverId: "683d79ecd070035eb47505a4",
//           receiverRole: "mechanic",
//           message:
//             "My tire is flat and I need immediate assistance. I'm currently at the Shell gas station on Main Street.",
//           seen: false,
//           createdAt: "2025-06-22T09:19:15.961Z",
//           updatedAt: "2025-06-22T09:19:15.961Z",
//           senderInfo: {
//             _id: "67f77dedfed0bf6ab1dd5665",
//             name: "Sarah Johnson",
//           },
//         },
//       ],
//     },
//     {
//       _id: "6851b269dd7d4176242ecf4b",
//       name: "Michael Chen",
//       messages: [
//         {
//           _id: "685767752af03b4b203d0f11",
//           serviceId: "6851b269dd7d4176242ecf4b",
//           serviceType: "pretrip",
//           senderId: "67f77dedfed0bf6ab1dd5666",
//           senderRole: "user",
//           receiverId: "683d79ecd070035eb47505a4",
//           receiverRole: "mechanic",
//           message:
//             "I need a comprehensive pre-trip inspection for my vehicle before a long journey to California. The trip is scheduled for next week and I want to make sure everything is in perfect condition. Could you check the brakes, engine oil, transmission fluid, tire pressure, battery condition, and all lights? I've heard that long highway drives can be tough on vehicles, so I want to be extra cautious. Please let me know your availability and pricing for a complete inspection.",
//           seen: false,
//           createdAt: "2025-06-22T02:16:21.507Z",
//           updatedAt: "2025-06-22T02:16:21.507Z",
//           senderInfo: {
//             _id: "67f77dedfed0bf6ab1dd5666",
//             name: "Michael Chen",
//           },
//         },
//         {
//           _id: "685768532af03b4b203d0f2f",
//           serviceId: "6851b269dd7d4176242ecf4b",
//           serviceType: "pretrip",
//           senderId: "67f77dedfed0bf6ab1dd5666",
//           senderRole: "user",
//           receiverId: "683d79ecd070035eb47505a4",
//           receiverRole: "mechanic",
//           message: "When would be the earliest available slot for the inspection?",
//           seen: false,
//           createdAt: "2025-06-22T02:20:03.617Z",
//           updatedAt: "2025-06-22T02:20:03.617Z",
//           senderInfo: {
//             _id: "67f77dedfed0bf6ab1dd5666",
//             name: "Michael Chen",
//           },
//         },
//         {
//           _id: "6857ca87bf458575f0477983",
//           serviceId: "6851b269dd7d4176242ecf4b",
//           serviceType: "pretrip",
//           senderId: "683d79ecd070035eb47505a4",
//           senderRole: "mechanic",
//           receiverId: "67f77dedfed0bf6ab1dd5666",
//           receiverRole: "user",
//           message:
//             "I can schedule the comprehensive inspection for tomorrow morning at 9:00 AM. The complete check will take approximately 45-60 minutes and will include all the items you mentioned: brake system inspection, engine oil and fluid levels, transmission fluid check, tire pressure and tread depth, battery voltage and connection test, and full lighting system verification. The total cost will be $85 for the complete pre-trip inspection. I'll also provide you with a detailed report of all findings. Does this time work for you?",
//           seen: true,
//           createdAt: "2025-06-22T09:19:03.963Z",
//           updatedAt: "2025-06-22T09:19:03.963Z",
//           senderInfo: {
//             _id: "683d79ecd070035eb47505a4",
//             name: "Alex Rodriguez",
//           },
//         },
//       ],
//     },
//   ],
// }

// const CURRENT_MECHANIC_ID = "683d79ecd070035eb47505a4"

// export default function MessagesPage() {
//   const [chats, setChats] = useState<ChatData[]>([])
//   const [activeServiceId, setActiveServiceId] = useState<string>("")
//   const [newMessage, setNewMessage] = useState("")
//   const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
//   const [isLoading, setIsLoading] = useState(true)
//   const [isSending, setIsSending] = useState(false)
//   const messagesEndRef = useRef<HTMLDivElement>(null)
//   const {data,isLoading:chatLoading} = useGetMechanicChatsQuery()

//   useEffect(() => {
//     fetchChats()
//   }, [])



//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
//   }, [chats, activeServiceId])

//   const fetchChats = async () => {
//     try {
//       setIsLoading(true)
//       setTimeout(() => {
//         setChats(mockApiResponse.data)
//         if (mockApiResponse.data.length > 0) {
//           setActiveServiceId(mockApiResponse.data[0]._id)
//         }
//         setIsLoading(false)
//       }, 1200)
//     } catch (error) {
//       console.error("Error fetching chats:", error)
//       setIsLoading(false)
//     }
//   }


//   const sendMessage = async (serviceId: string, message: string) => {
//     if (!message.trim()) return

//     setIsSending(true)
//     try {
//       const newMsg: Message = {
//         _id: Date.now().toString(),
//         serviceId,
//         serviceType: "roadsideAssistance",
//         senderId: CURRENT_MECHANIC_ID,
//         senderRole: "mechanic",
//         receiverId: getReceiverIdForService(serviceId),
//         receiverRole: "user",
//         message: message.trim(),
//         seen: false,
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//         senderInfo: {
//           _id: CURRENT_MECHANIC_ID,
//           name: "Alex Rodriguez",
//         },
//       }

//       setChats((prevChats) =>
//         prevChats.map((chat) => (chat._id === serviceId ? { ...chat, messages: [...chat.messages, newMsg] } : chat)),
//       )

//       setNewMessage("")
//     } catch (error) {
//       console.error("Error sending message:", error)
//     } finally {
//       setIsSending(false)
//     }
//   }

//   const getReceiverIdForService = (serviceId: string): string => {
//     const chat = chats.find((c) => c._id === serviceId)
//     return chat?.messages[0]?.senderId || ""
//   }

//   const formatTime = (dateString: string) => {
//     const date = new Date(dateString)
//     const now = new Date()
//     const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

//     if (diffInHours < 1) {
//       const diffInMinutes = Math.floor(diffInHours * 60)
//       return diffInMinutes < 1 ? "now" : `${diffInMinutes}m ago`
//     } else if (diffInHours < 24) {
//       return `${Math.floor(diffInHours)}h ago`
//     } else {
//       return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
//     }
//   }

//   const getUnreadCount = (messages: Message[]) => {
//     return messages.filter((msg) => !msg.seen && msg.senderRole === "user").length
//   }

//   const getLastMessage = (messages: Message[]) => {
//     if (messages.length === 0) return "No messages"
//     const lastMsg = messages[messages.length - 1]
//     // Truncate long messages in sidebar
//     return lastMsg.message.length > 50 ? lastMsg.message.substring(0, 50) + "..." : lastMsg.message
//   }

//   const getServiceTypeLabel = (serviceType: string) => {
//     switch (serviceType) {
//       case "roadsideAssistance":
//         return "Roadside Assistance"
//       case "pretrip":
//         return "Pre-trip Inspection"
//       case "live":
//         return "Live Support"
//       default:
//         return "Service"
//     }
//   }

//   const getInitials = (name: string) => {
//     return name
//       .split(" ")
//       .map((n) => n[0])
//       .join("")
//       .toUpperCase()
//       .slice(0, 2)
//   }

//   const activeChat = chats.find((chat) => chat._id === activeServiceId)
//   const activeMessages = activeChat?.messages || []

//   if (chatLoading) {
//     return <MessagesShimmer />
//   }

//   return (
//     <div className="h-[calc(100vh-120px)] bg-gray-50 flex">
//       {/* Mobile Sidebar Overlay */}
//       {isMobileSidebarOpen && (
//         <div className="fixed inset-0 bg-black/20 z-40 lg:hidden" onClick={() => setIsMobileSidebarOpen(false)} />
//       )}

//       {/* Left Sidebar - Chat List */}
//       <div
//         className={`fixed lg:relative inset-y-0 left-0 z-50 w-80 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-200 ease-out lg:translate-x-0 ${
//           isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
//         }`}
//       >
//         {/* Header */}
//         <div className="p-6 border-b border-gray-100">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-lg font-semibold text-gray-900">Messages</h1>
//               <p className="text-sm text-gray-500 mt-1">{chats.length} conversations</p>
//             </div>
//             <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setIsMobileSidebarOpen(false)}>
//               <X className="h-5 w-5" />
//             </Button>
//           </div>
//         </div>

//         {/* Chat List */}
//         <div className="flex-1 overflow-y-auto">
//           {chats.length === 0 ? (
//             <div className="p-6 text-center">
//               <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
//               <p className="text-sm text-gray-500">No conversations yet</p>
//             </div>
//           ) : (
//             <div className="p-4">
//               {chats.map((chat) => {
//                 const unreadCount = getUnreadCount(chat.messages)
//                 const lastMessage = getLastMessage(chat.messages)
//                 const lastMessageTime =
//                   chat.messages.length > 0 ? formatTime(chat.messages[chat.messages.length - 1].createdAt) : ""
//                 const serviceType = chat.messages[0]?.serviceType || ""

//                 return (
//                   <div
//                     key={chat._id}
//                     onClick={() => {
//                       setActiveServiceId(chat._id)
//                       setIsMobileSidebarOpen(false)
//                     }}
//                     className={`p-4 mb-2 cursor-pointer transition-all duration-150 rounded-lg border ${
//                       activeServiceId === chat._id
//                         ? "bg-blue-50 border-blue-200"
//                         : "bg-white border-gray-100 hover:bg-gray-50"
//                     }`}
//                   >
//                     <div className="flex items-start gap-3">
//                       <div className="relative flex-shrink-0">
//                         <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
//                           <span className="text-sm font-medium text-gray-600">{getInitials(chat.name)}</span>
//                         </div>
//                         <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
//                       </div>
//                       <div className="flex-1 min-w-0">
//                         <div className="flex items-center justify-between mb-1">
//                           <h3 className="font-medium text-gray-900 truncate">{chat.name}</h3>
//                           <span className="text-xs text-gray-500 flex-shrink-0">{lastMessageTime}</span>
//                         </div>
//                         <div className="flex items-center justify-between mb-2">
//                           <span className="text-xs text-gray-500">{getServiceTypeLabel(serviceType)}</span>
//                           {unreadCount > 0 && (
//                             <div className="w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-medium">
//                               {unreadCount}
//                             </div>
//                           )}
//                         </div>
//                         <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{lastMessage}</p>
//                       </div>
//                     </div>
//                   </div>
//                 )
//               })}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Chat Area */}
//       <div className="flex-1 flex flex-col bg-white">
//         {activeChat ? (
//           <>
//             {/* Chat Header - Simplified */}
//             <div className="p-6 border-b border-gray-100">
//               <div className="flex items-center gap-4">
//                 <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setIsMobileSidebarOpen(true)}>
//                   <Menu className="h-5 w-5" />
//                 </Button>
//                 <div className="flex items-center gap-3">
//                   <div className="relative">
//                     <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
//                       <span className="text-sm font-medium text-gray-600">{getInitials(activeChat.name)}</span>
//                     </div>
//                     <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
//                   </div>
//                   <div>
//                     <h2 className="font-semibold text-gray-900">{activeChat.name}</h2>
//                     <div className="flex items-center gap-2 mt-1">
//                       <Circle className="w-2 h-2 fill-green-500 text-green-500" />
//                       <span className="text-sm text-gray-500">Online</span>
//                       <span className="text-sm text-gray-400">•</span>
//                       <span className="text-sm text-gray-500">
//                         {getServiceTypeLabel(activeMessages[0]?.serviceType)}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Messages - Fixed for long text */}
//             <div className="flex-1 overflow-y-auto p-6">
//               <div className="space-y-6">
//                 {activeMessages.map((message) => {
//                   const isFromMechanic = message.senderRole === "mechanic"

//                   return (
//                     <div key={message._id} className={`flex ${isFromMechanic ? "justify-end" : "justify-start"}`}>
//                       <div className={`flex gap-3 max-w-[85%] ${isFromMechanic ? "flex-row-reverse" : "flex-row"}`}>
//                         {!isFromMechanic && (
//                           <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
//                             <span className="text-xs font-medium text-gray-600">
//                               {getInitials(message.senderInfo.name)}
//                             </span>
//                           </div>
//                         )}
//                         <div
//                           className={`px-4 py-3 rounded-lg break-words ${
//                             isFromMechanic
//                               ? "bg-blue-600 text-white"
//                               : "bg-gray-100 text-gray-900 border border-gray-200"
//                           }`}
//                         >
//                           <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.message}</p>
//                           <div
//                             className={`flex items-center justify-between mt-2 text-xs ${
//                               isFromMechanic ? "text-blue-100" : "text-gray-500"
//                             }`}
//                           >
//                             <span>{formatTime(message.createdAt)}</span>
//                             {isFromMechanic && (
//                               <CheckCheck
//                                 className={`h-3 w-3 ml-2 ${message.seen ? "text-blue-200" : "text-blue-300"}`}
//                               />
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   )
//                 })}
//               </div>
//               <div ref={messagesEndRef} />
//             </div>

//             {/* Message Input - Fixed alignment */}
//             <div className="p-6 border-t border-gray-100 bg-white">
//               <div className="flex items-end gap-3">
//                 <div className="flex-1">
//                   <textarea
//                     value={newMessage}
//                     onChange={(e) => setNewMessage(e.target.value)}
//                     onKeyPress={(e) => {
//                       if (e.key === "Enter" && !e.shiftKey) {
//                         e.preventDefault()
//                         sendMessage(activeServiceId, newMessage)
//                       }
//                     }}
//                     placeholder="Type a message..."
//                     disabled={isSending}
//                     rows={1}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 transition-colors resize-none min-h-[48px] max-h-32"
//                     style={{
//                       height: "auto",
//                       minHeight: "48px",
//                     }}
//                     onInput={(e) => {
//                       const target = e.target as HTMLTextAreaElement
//                       target.style.height = "auto"
//                       target.style.height = Math.min(target.scrollHeight, 128) + "px"
//                     }}
//                   />
//                 </div>
//                 <Button
//                   onClick={() => sendMessage(activeServiceId, newMessage)}
//                   disabled={!newMessage.trim() || isSending}
//                   className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 h-12 disabled:opacity-50 flex-shrink-0"
//                 >
//                   {isSending ? <Clock className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
//                 </Button>
//               </div>
//             </div>
//           </>
//         ) : (
//           <div className="flex-1 flex items-center justify-center">
//             <div className="text-center">
//               <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
//               <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
//               <p className="text-gray-500 max-w-sm">
//                 Choose a customer conversation from the sidebar to start messaging
//               </p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// import type React from "react"

// import { useState, useRef, useEffect } from "react"
// import { MessageCircle, X, Send, Minimize2, Maximize2 } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { initSocket } from "@/lib/socket"
// import { useGetUserChatsQuery } from "../api/userChatApi"

// interface Message {
//   id: string
//   content: string
//   timestamp: string
//   isFromUser: boolean
// }

// const initialMessages: Message[] = [
//   {
//     id: "1",
//     content: "Hello! I'm here to help you with your vehicle needs. How can I assist you today?",
//     timestamp: "10:30",
//     isFromUser: false,
//   },
// ]

// const ChatBubble:React.FC<{serviceId:string}> = ({serviceId}) => {

//   const [isOpen, setIsOpen] = useState(false)
//   const [isMinimized, setIsMinimized] = useState(false)
//   const [messages, setMessages] = useState<Message[]>(initialMessages)
//   const [newMessage, setNewMessage] = useState("")
//   const [hasNewMessage, setHasNewMessage] = useState(false)
//   const messagesEndRef = useRef<HTMLDivElement>(null)

//   const {data} = useGetUserChatsQuery(serviceId)

//   const mechanicName = "Alex Johnson"

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
//   }, [messages])

//   useEffect(() => {
//     if (!isOpen || isMinimized) {
//       const timer = setTimeout(() => {
//         setHasNewMessage(true)
//       }, 5000)
//       return () => clearTimeout(timer)
//     }
//   }, [isOpen, isMinimized])

//   const handleSendMessage = () => {
//     if (!newMessage.trim()) return

//     const userMessage: Message = {
//       id: Date.now().toString(),
//       content: newMessage,
//       timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
//       isFromUser: true,
//     }

//     setMessages((prev) => [...prev, userMessage])
//     setNewMessage("")

//     setTimeout(() => {
//       const mechanicResponse: Message = {
//         id: (Date.now() + 1).toString(),
//         content: "Thanks for your message! I'll help you with that right away.",
//         timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
//         isFromUser: false,
//       }
//       setMessages((prev) => [...prev, mechanicResponse])
//     }, 1000)
//   }

//   useEffect(()=>{
//     const socket = initSocket();
//     socket.on('you can suggest',(data)=>{

//     })
//   },[])

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault()
//       handleSendMessage()
//     }
//   }

//   const openChat = () => {
//     setIsOpen(true)
//     setIsMinimized(false)
//     setHasNewMessage(false)
//   }

//   const closeChat = () => {
//     setIsOpen(false)
//     setIsMinimized(false)
//   }

//   const toggleMinimize = () => {
//     setIsMinimized(!isMinimized)
//     if (isMinimized) {
//       setHasNewMessage(false)
//     }
//   }

//   const restoreChat = () => {
//     setIsMinimized(false)
//     setHasNewMessage(false)
//   }

//   return (
//     <>

//       {!isOpen && (
//         <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
//           <button
//             onClick={openChat}
//             className="relative bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 sm:p-4 shadow-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
//           >
//             <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
//             {hasNewMessage && (
//               <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse">
//                 <div className="absolute inset-0 w-3 h-3 bg-red-500 rounded-full animate-ping" />
//               </div>
//             )}
//           </button>
//         </div>
//       )}

//       {/* Chat Modal */}
//       {isOpen && (
//         <div className="fixed inset-4 sm:bottom-6 sm:right-6 sm:inset-auto z-50">
//           <div
//             className={`bg-white rounded-lg shadow-2xl border border-gray-200 transition-all duration-300 ${
//               isMinimized ? "w-full sm:w-96 h-14" : "w-full h-full sm:w-96 sm:h-[500px] max-h-[90vh]"
//             }`}
//           >
//             {/* Chat Header */}
//             <div
//               className={`flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 bg-blue-600 text-white ${
//                 isMinimized ? "rounded-lg cursor-pointer hover:bg-blue-700" : "rounded-t-lg"
//               } transition-colors duration-200`}
//               onClick={isMinimized ? restoreChat : undefined}
//             >
//               <div className="flex items-center gap-2">
//                 <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
//                 <h3 className="font-medium text-sm sm:text-base">{mechanicName}</h3>
//                 <span className="text-xs text-blue-100 hidden sm:inline">Online</span>
//                 {isMinimized && hasNewMessage && <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse ml-2" />}
//               </div>
//               <div className="flex items-center gap-1">
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={(e) => {
//                     e.stopPropagation()
//                     toggleMinimize()
//                   }}
//                   className="text-white hover:bg-blue-700 p-1 h-auto w-auto"
//                 >
//                   {isMinimized ? (
//                     <Maximize2 className="h-3 w-3 sm:h-4 sm:w-4" />
//                   ) : (
//                     <Minimize2 className="h-3 w-3 sm:h-4 sm:w-4" />
//                   )}
//                 </Button>
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={(e) => {
//                     e.stopPropagation()
//                     closeChat()
//                   }}
//                   className="text-white hover:bg-blue-700 p-1 h-auto w-auto"
//                 >
//                   <X className="h-3 w-3 sm:h-4 sm:w-4" />
//                 </Button>
//               </div>
//             </div>

//             {!isMinimized && (
//               <>
//                 {/* Messages */}
//                 <div className="flex-1 overflow-y-auto p-3 sm:p-4 bg-gray-50" style={{ height: "calc(100% - 120px)" }}>
//                   <div className="space-y-3 sm:space-y-4">
//                     {messages.map((message) => (
//                       <div key={message.id} className={`flex ${message.isFromUser ? "justify-end" : "justify-start"}`}>
//                         <div
//                           className={`max-w-[85%] sm:max-w-xs px-3 py-2 rounded-lg text-sm ${
//                             message.isFromUser
//                               ? "bg-blue-600 text-white rounded-br-sm"
//                               : "bg-white border border-gray-200 text-gray-900 rounded-bl-sm"
//                           }`}
//                         >
//                           <p className="leading-relaxed">{message.content}</p>
//                           <div className={`text-xs mt-1 ${message.isFromUser ? "text-blue-100" : "text-gray-500"}`}>
//                             {message.timestamp}
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                   <div ref={messagesEndRef} />
//                 </div>

//                 {/* Message Input */}
//                 <div className="p-3 sm:p-4 border-t border-gray-200 bg-white rounded-b-lg">
//                   <div className="flex gap-2">
//                     <input
//                       type="text"
//                       value={newMessage}
//                       onChange={(e) => setNewMessage(e.target.value)}
//                       onKeyPress={handleKeyPress}
//                       placeholder="Type your message..."
//                       className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
//                     />
//                     <Button
//                       onClick={handleSendMessage}
//                       disabled={!newMessage.trim()}
//                       size="sm"
//                       className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed min-w-[44px]"
//                     >
//                       <Send className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       )}
//     </>
//   )
// }


// export default ChatBubble




import type React from "react";
import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Minimize2, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { initSocket, getSocket } from "@/lib/socket";
import { useGetUserChatsQuery } from "../api/userChatApi";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";


interface Message {
  id: string;
  content: string;
  timestamp: string;
  isFromUser: boolean;
}

const ChatBubble: React.FC<{ serviceId: string }> = ({ serviceId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: initialChats, isLoading, error } = useGetUserChatsQuery(serviceId);
  const  user  = useSelector((state:RootState)=>state.auth.user)
  const mechanicName = "Alex Johnson";

  // Initialize WebSocket
  useEffect(() => {
    const socket = initSocket();
    socket.on("newMessage", (message: Message) => {
      if (!message.isFromUser) {
        setMessages((prev) => [...prev, message]);
        setHasNewMessage(true);
      }
    });

    return () => {
      socket.off("newMessage");
    };
  }, [serviceId]);

  // Load initial chats
  useEffect(() => {
    if (initialChats && !isLoading && !error) {
      const formattedMessages = initialChats.map((chat) => ({
        id: chat._id.toString(),
        content: chat.message,
        timestamp: new Date(chat.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isFromUser: chat.senderRole === "user",
      }));
      setMessages(formattedMessages);
    }
  }, [initialChats, isLoading, error]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!isOpen || isMinimized) {
      const timer = setTimeout(() => {
        setHasNewMessage(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isMinimized]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isFromUser: true,
    };

    setMessages((prev) => [...prev, userMessage]);
    setNewMessage("");

    const socket = getSocket();
    if (socket && user) {
      const receiverId = "mechanic123"; // Replace with assigned mechanic ID
      socket.emit("sendMessage", {
        serviceId,
        senderId: 'user', //!!!!!!!!!!!!!!!
        senderRole: "user",
        receiverId,
        receiverRole: "mechanic",
        message: newMessage,
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const openChat = () => {
    setIsOpen(true);
    setIsMinimized(false);
    setHasNewMessage(false);
  };

  const closeChat = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
    if (isMinimized) {
      setHasNewMessage(false);
    }
  };

  const restoreChat = () => {
    setIsMinimized(false);
    setHasNewMessage(false);
  };

  if (isLoading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error.message as any}</div>;

  return (
    <>
      {!isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
          <button
            onClick={openChat}
            className="relative bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 sm:p-4 shadow-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
            {hasNewMessage && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse">
                <div className="absolute inset-0 w-3 h-3 bg-red-500 rounded-full animate-ping" />
              </div>
            )}
          </button>
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-4 sm:bottom-6 sm:right-6 sm:inset-auto z-60">
          <div
            className={`bg-white rounded-lg shadow-2xl border border-gray-200 transition-all duration-300 ${
              isMinimized ? "w-full sm:w-96 h-14" : "w-full h-full sm:w-96 sm:h-[500px] max-h-[90vh]"
            }`}
          >
            <div
              className={`flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 bg-blue-600 text-white ${
                isMinimized ? "rounded-lg cursor-pointer hover:bg-blue-700" : "rounded-t-lg"
              }`}
              onClick={isMinimized ? restoreChat : undefined}
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <h3 className="font-medium text-sm sm:text-base">{mechanicName}</h3>
                <span className="text-xs text-blue-100 hidden sm:inline">Online</span>
                {isMinimized && hasNewMessage && <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse ml-2" />}
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMinimize();
                  }}
                  className="text-white hover:bg-blue-700 p-1 h-auto w-auto"
                >
                  {isMinimized ? <Maximize2 className="h-3 w-3 sm:h-4 sm:w-4" /> : <Minimize2 className="h-3 w-3 sm:h-4 sm:w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    closeChat();
                  }}
                  className="text-white hover:bg-blue-700 p-1 h-auto w-auto"
                >
                  <X className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>

            {!isMinimized && (
              <>
                <div className="flex-1 overflow-y-auto p-3 sm:p-4 bg-gray-50" style={{ height: "calc(100% - 120px)" }}>
                  <div className="space-y-3 sm:space-y-4">
                    {messages.map((message) => (
                      <div key={message.id} className={`flex ${message.isFromUser ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[85%] sm:max-w-xs px-3 py-2 rounded-lg text-sm ${
                            message.isFromUser ? "bg-blue-600 text-white rounded-br-sm" : "bg-white border border-gray-200 text-gray-900 rounded-bl-sm"
                          }`}
                        >
                          <p className="leading-relaxed">{message.content}</p>
                          <div className={`text-xs mt-1 ${message.isFromUser ? "text-blue-100" : "text-gray-500"}`}>
                            {message.timestamp}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div ref={messagesEndRef} />
                </div>

                <div className="p-3 sm:p-4 border-t border-gray-200 bg-white rounded-b-lg">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed min-w-[44px]"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBubble;


// import type React from "react";
// import { useState, useRef, useEffect } from "react";
// import { MessageCircle, X, Send, Minimize2, Maximize2 } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { initSocket } from "@/lib/socket";
// import { useDispatch, useSelector } from "react-redux";
// import { RootState } from "@/store/store";
// import { formatTimeToNow } from "@/lib/dateFormater";
// import { useGetUserChatsQuery } from "../api/userChatApi";
// import { setMessages, addMessage } from "../slices/chatSlice";
// import { Socket } from "socket.io-client";

// interface Props {
//   serviceId: string;
//   mechanicId: string;
//   mechanicName:string;
// }

// const ChatBubble: React.FC<Props> = ({ serviceId, mechanicId, mechanicName }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isMinimized, setIsMinimized] = useState(false);
//   const [newMessage, setNewMessage] = useState("");
//   const [hasNewMessage, setHasNewMessage] = useState(false);
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const dispatch = useDispatch();
//   const messages = useSelector((state: RootState) => state.chatSlice);
//   const { data: chatData } = useGetUserChatsQuery({
//     serviceId,
//     serviceType: "roadsideAssistance",
//   });

//   const socketRef = useRef<Socket | null>(null);


//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   useEffect(() => {
//     if (!isOpen || isMinimized) {
//       const timer = setTimeout(() => {
//         setHasNewMessage(true);
//       }, 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [isOpen, isMinimized]);

//   useEffect(() => {
//     const socket = initSocket();
//     socketRef.current = socket;

//     const room = `roadside_${serviceId}`;
//     socket.emit("joinRoom", { room });

//     socket.on("roadsideMessage", (data) => {
//       dispatch(addMessage(data));
//     });

//     return () => {
//       socket.off("roadsideMessage");
//       socket.emit("leaveRoom", { room });
//     };
//   }, []);

//   useEffect(() => {
//     const data = chatData?.data.map((ele) => ({
//       _id: ele._id,
//       serviceId: ele.serviceId,
//       message: ele.message,
//       senderId: ele.senderId._id,
//       senderName: ele.senderId.name,
//       senderRole: ele.senderRole,
//       seen: ele.seen,
//       createdAt: ele.createdAt,
//     }));

//     if (data) {
//       dispatch(setMessages(data));
//     }
//   }, [chatData]);

//   const handleSendMessage = () => {
//     if (!newMessage.trim()) return;

//     socketRef.current?.emit("roadsideChat", {
//       serviceId,
//       message: newMessage,
//     });

//     setNewMessage('')

//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   const openChat = () => {
//     setIsOpen(true);
//     setIsMinimized(false);
//     setHasNewMessage(false);
//   };

//   const closeChat = () => {
//     setIsOpen(false);
//     setIsMinimized(false);
//   };

//   const toggleMinimize = () => {
//     setIsMinimized(!isMinimized);
//     if (isMinimized) {
//       setHasNewMessage(false);
//     }
//   };

//   const restoreChat = () => {
//     setIsMinimized(false);
//     setHasNewMessage(false);
//   };

//   return (
//     <>
//       {/* Chat Bubble */}
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
//               isMinimized
//                 ? "w-full sm:w-96 h-14"
//                 : "w-full h-full sm:w-96 sm:h-[500px] max-h-[90vh]"
//             }`}
//           >
//             {/* Chat Header */}
//             <div
//               className={`flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 bg-blue-600 text-white ${
//                 isMinimized
//                   ? "rounded-lg cursor-pointer hover:bg-blue-700"
//                   : "rounded-t-lg"
//               } transition-colors duration-200`}
//               onClick={isMinimized ? restoreChat : undefined}
//             >
//               <div className="flex items-center gap-2">
//                 <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
//                 <h3 className="font-medium text-sm sm:text-base">
//                   {mechanicName}
//                 </h3>
//                 <span className="text-xs text-blue-100 hidden sm:inline">
//                   Online
//                 </span>
//                 {isMinimized && hasNewMessage && (
//                   <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse ml-2" />
//                 )}
//               </div>
//               <div className="flex items-center gap-1">
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     toggleMinimize();
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
//                     e.stopPropagation();
//                     closeChat();
//                   }}
//                   className="text-white hover:bg-blue-700 p-1 h-auto w-auto"
//                 >
//                   <X className="h-3 w-3 sm:h-4 sm:w-4" />
//                 </Button>
//               </div>
//             </div>

//             {/* Chat Content - Only show when not minimized */}
//             {!isMinimized && (
//               <>
//                 {/* Messages */}
//                 <div
//                   className="flex-1 overflow-y-auto p-3 sm:p-4 bg-gray-50"
//                   style={{ height: "calc(100% - 120px)" }}
//                 >
//                   <div className="space-y-3 sm:space-y-4">
//                     {messages.map((message) => (
//                       <div
//                         key={message._id}
//                         className={`flex ${
//                           message.senderId !== mechanicId
//                             ? "justify-end"
//                             : "justify-start"
//                         }`}
//                       >
//                         <div
//                           className={`max-w-[85%] sm:max-w-xs px-3 py-2 rounded-lg text-sm ${
//                             message.senderId !== mechanicId
//                               ? "bg-blue-600 text-white rounded-br-sm"
//                               : "bg-white border border-gray-200 text-gray-900 rounded-bl-sm"
//                           }`}
//                         >
//                           <p className="leading-relaxed">{message.message}</p>
//                           <div
//                             className={`text-xs mt-1 ${
//                               message.senderId !== mechanicId
//                                 ? "text-blue-100"
//                                 : "text-gray-500"
//                             }`}
//                           >
//                             {formatTimeToNow(message.createdAt)}
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
//   );
// };

// export default ChatBubble;




import type React from "react";
import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Minimize2, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { initSocket } from "@/lib/socket";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { formatTimeToNow } from "@/lib/dateFormater";
import { useGetUserChatsQuery } from "../api/userChatApi";
import { setMessages, addMessage } from "../slices/chatSlice";
import { Socket } from "socket.io-client";

interface Props {
  serviceId: string;
  mechanicId: string;
  mechanicName: string;
}

const ChatBubble: React.FC<Props> = ({ serviceId, mechanicId, mechanicName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const messages = useSelector((state: RootState) => state.chatSlice);
  const { data: chatData } = useGetUserChatsQuery({
    serviceId,
    serviceType: "roadsideAssistance",
  });

  const socketRef = useRef<Socket | null>(null);

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

  useEffect(() => {
    const socket = initSocket();
    socketRef.current = socket;

    const room = `roadside_${serviceId}`;
    socket.emit("joinRoom", { room });

    socket.on("roadsideMessage", (data) => {
      dispatch(addMessage(data));
    });

    return () => {
      socket.off("roadsideMessage");
      socket.emit("leaveRoom", { room });
    };
  }, []);

  useEffect(() => {
    const data = chatData?.data.map((ele) => ({
      _id: ele._id,
      serviceId: ele.serviceId,
      message: ele.message,
      senderId: ele.senderId._id,
      senderName: ele.senderId.name,
      senderRole: ele.senderRole,
      seen: ele.seen,
      createdAt: ele.createdAt,
    }));

    if (data) {
      dispatch(setMessages(data));
    }
  }, [chatData]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    socketRef.current?.emit("roadsideChat", {
      serviceId,
      message: newMessage,
    });

    setNewMessage("");
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

  return (
    <>
      {/* Chat Bubble */}
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

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed inset-4 sm:bottom-6 sm:right-6 sm:inset-auto z-50">
          <div
            className={`bg-white rounded-lg shadow-2xl border border-gray-200 transition-all duration-300 ${
              isMinimized ? "w-full sm:w-96 h-14" : "w-full h-full sm:w-96 sm:h-[500px] max-h-[calc(90vh-60px)]" // Adjusted max-height to account for footer
            }`}
          >
            {/* Chat Header */}
            <div
              className={`flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 bg-blue-600 text-white ${
                isMinimized ? "rounded-lg cursor-pointer hover:bg-blue-700" : "rounded-t-lg"
              } transition-colors duration-200`}
              onClick={isMinimized ? restoreChat : undefined}
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <h3 className="font-medium text-sm sm:text-base">{mechanicName}</h3>
                <span className="text-xs text-blue-100 hidden sm:inline">Online</span>
                {isMinimized && hasNewMessage && (
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse ml-2" />
                )}
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
                  {isMinimized ? (
                    <Maximize2 className="h-3 w-3 sm:h-4 sm:w-4" />
                  ) : (
                    <Minimize2 className="h-3 w-3 sm:h-4 sm:w-4" />
                  )}
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

            {/* Chat Content - Only show when not minimized */}
            {!isMinimized && (
              <>
                {/* Messages */}
                <div
                  className="p-3 sm:p-4 bg-gray-50 overflow-y-auto" // Reintroduced overflow-y-auto
                  style={{ height: "calc(100% - 120px)" }} // Height adjusted for header and input
                >
                  <div className="space-y-3 sm:space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message._id}
                        className={`flex ${
                          message.senderId !== mechanicId ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[85%] sm:max-w-xs px-3 py-2 rounded-lg text-sm ${
                            message.senderId !== mechanicId
                              ? "bg-blue-600 text-white rounded-br-sm"
                              : "bg-white border border-gray-200 text-gray-900 rounded-bl-sm"
                          }`}
                          style={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}
                        >
                          <p className="leading-relaxed">{message.message}</p>
                          <div
                            className={`text-xs mt-1 ${
                              message.senderId !== mechanicId
                                ? "text-blue-100"
                                : "text-gray-500"
                            }`}
                          >
                            {formatTimeToNow(message.createdAt)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
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
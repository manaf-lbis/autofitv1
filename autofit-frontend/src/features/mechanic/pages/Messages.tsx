import { useState, useRef, useEffect } from "react";
import { Send, Check, CheckCheck, Clock, MessageSquare, Circle, ArrowLeft, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import MessagesShimmer from "../components/shimmer/MessagesShimmer";
import { useGetMechanicChatsQuery } from "../../../services/mechanicServices/mechanicChatApi";
import { formatTimeToNow } from "@/lib/dateFormater";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setMessages } from "../slices/mechanicChatSlice";
import { Socket } from "socket.io-client";
import { initSocket } from "@/lib/socket";

export default function MessagesPage() {
  const [activeServiceId, setActiveServiceId] = useState<string>("");
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { data, isLoading: chatLoading } = useGetMechanicChatsQuery(undefined, { refetchOnMountOrArgChange: true, refetchOnReconnect: true, refetchOnFocus: true });
  const chats = useSelector((state: RootState) => state.mechanicChatSlice);
  const socketRef = useRef<Socket | null>(null);
  const activeChat = chats.find((chat) => chat._id === activeServiceId);
  const activeMessages = activeChat?.messages || [];
  const dispatch = useDispatch();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeServiceId, activeMessages]);

  useEffect(() => {
    socketRef.current = initSocket();
  }, []);

  useEffect(() => {
    if (data?.data && chats.length === 0) {
      dispatch(setMessages(data.data));
    }
  }, [data]);

  const sendMessage = async (serviceId: string, message: string) => {
    if (!message.trim()) return;

    setIsSending(true);
    try {
      socketRef.current?.emit("roadsideChat", {
        serviceId,
        message: newMessage,
      });

      setNewMessage("");
      
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const getUnreadCount = (messages: any[]) => {
    return messages.filter((msg: any) => !msg.seen && msg.senderRole === "user").length;
  };

  const getLastMessage = (messages: any[]) => {
    if (messages.length === 0) return "No messages";
    const lastMsg = messages[messages.length - 1];
    return lastMsg.message.length > 50 ? lastMsg.message.substring(0, 50) + "..." : lastMsg.message;
  };

  const getServiceTypeLabel = (serviceType: string) => {
    switch (serviceType) {
      case "roadsideAssistance":
        return "Roadside Assistance";
      case "pretrip":
        return "Pre-trip Inspection";
      case "live":
        return "Live Support";
      default:
        return "Service";
    }
  };

  const setActiveChat = (serviceId: string) => {
    setActiveServiceId(serviceId);

    socketRef.current?.emit("markAsSeen", {
      serviceId,
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const sortedChats = [...chats].sort((a, b) => {
    const lastA = a.messages[a.messages.length - 1];
    const lastB = b.messages[b.messages.length - 1];
    if (!lastA && !lastB) return 0;
    if (!lastA) return 1;
    if (!lastB) return -1;
    return new Date(lastB.createdAt).getTime() - new Date(lastA.createdAt).getTime();
  });

  if (chatLoading) {
    return <MessagesShimmer />;
  }

  return (
    <>
      <style>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: transparent transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          background: transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: transparent;
          border-radius: 3px;
          transition: background-color 0.2s ease;
        }
        
        .custom-scrollbar:hover {
          scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
        }
        
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background-color: rgba(0, 0, 0, 0.2);
        }
        
        .custom-scrollbar:hover::-webkit-scrollbar-thumb:hover {
          background-color: rgba(0, 0, 0, 0.3);
        }
      `}</style>
      
      <div className="h-[calc(100vh-120px)] bg-gray-50 flex">
        {/* Chat List - Full screen on mobile when no chat is active */}
        <div
          className={`${
            activeServiceId ? "hidden lg:flex" : "flex"
          } ${
            activeServiceId ? "w-80" : "w-full lg:w-80"
          } bg-white border-r border-gray-200 flex-col`}
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Messages</h1>
                <p className="text-sm text-gray-500 mt-1">{sortedChats.length} conversations</p>
              </div>
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {sortedChats.length === 0 ? (
              <div className="p-6 text-center">
                <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-sm text-gray-500">No conversations yet</p>
              </div>
            ) : (
              <div className="p-4">
                {sortedChats.map((chat) => {
                  const unreadCount = getUnreadCount(chat.messages);
                  const lastMessage = getLastMessage(chat.messages);
                  const lastMessageTime =
                    chat.messages.length > 0 ? formatTimeToNow(chat.messages[chat.messages.length - 1].createdAt) : "";
                  const serviceType = chat.messages[0]?.serviceType || "";

                  return (
                    <div
                      key={chat._id}
                      onClick={() => setActiveChat(chat._id)}
                      className={`p-4 mb-2 cursor-pointer transition-all duration-150 rounded-lg border ${activeServiceId === chat._id
                          ? "bg-blue-50 border-blue-200"
                          : "bg-white border-gray-100 hover:bg-gray-50"
                        }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative flex-shrink-0">
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-600">{getInitials(chat.name)}</span>
                          </div>
                          <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 border-2 border-white rounded-full ${
                            chat.isCompleted ? "bg-gray-400" : "bg-green-500"
                          }`}></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-medium text-gray-900 truncate">{chat.name}</h3>
                            <span className="text-xs text-gray-500 flex-shrink-0">{lastMessageTime}</span>
                          </div>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">{getServiceTypeLabel(serviceType)}</span>
                              {chat.isCompleted && (
                                <span className="text-xs text-red-500 font-medium">Completed</span>
                              )}
                            </div>
                            {unreadCount > 0 && !chat.isCompleted && (
                              <div className="w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-medium">
                                {unreadCount}
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{lastMessage}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Chat Area - Full screen on mobile when chat is active */}
        <div className={`${activeServiceId ? "flex" : "hidden lg:flex"} flex-1 flex-col bg-white`}>
          {activeChat ? (
            <>
              {/* Chat Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-4">
                  {/* Back button for mobile */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="lg:hidden"
                    onClick={() => setActiveServiceId("")}
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">{getInitials(activeChat.name)}</span>
                      </div>
                      <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 border-2 border-white rounded-full ${
                        activeChat.isCompleted ? "bg-gray-400" : "bg-green-500"
                      }`}></div>
                    </div>
                    <div>
                      <h2 className="font-semibold text-gray-900">{activeChat.name}</h2>
                      <div className="flex items-center gap-2 mt-1">
                        <Circle className={`w-2 h-2 fill-current ${activeChat.isCompleted ? "text-gray-400" : "text-green-500"}`} />
                        <span className="text-sm text-gray-500">
                          {activeChat.isCompleted ? "Service Completed" : "Online"}
                        </span>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm text-gray-500">
                          {getServiceTypeLabel(activeMessages[0]?.serviceType)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                <div className="space-y-6">
                  {activeMessages.map((message) => {
                    const isFromMechanic = message.senderRole === "mechanic";

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
                            className={`px-4 py-3 rounded-lg break-words ${isFromMechanic
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 text-gray-900 border border-gray-200"
                              }`}
                          >
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.message}</p>
                            <div
                              className={`flex items-center justify-between mt-2 text-xs ${isFromMechanic ? "text-blue-100" : "text-gray-500"
                                }`}
                            >
                              <span>{formatTimeToNow(message.createdAt)}</span>
                              {isFromMechanic && (
                                <span className="ml-2">
                                  {message.seen ? (
                                    <CheckCheck className="h-3 w-3 text-blue-200" />
                                  ) : (
                                    <Check className="h-3 w-3 text-blue-300" />
                                  )}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input or Completion Notice */}
              {activeChat.isCompleted ? (
                <div className="p-6 border-t border-gray-100 bg-gray-50">
                  <div className="flex items-center justify-center gap-3 text-gray-600">
                    <XCircle className="h-5 w-5 text-gray-400" />
                    <span className="text-sm font-medium">This chat is no longer active - Service has been completed</span>
                  </div>
                </div>
              ) : (
                <div className="p-6 border-t border-gray-100 bg-white">
                  <div className="flex items-end gap-3">
                    <div className="flex-1">
                      <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage(activeServiceId, newMessage);
                          }
                        }}
                        placeholder="Type a message..."
                        disabled={isSending}
                        rows={1}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 transition-colors resize-none"
                        style={{
                          height: "48px",
                          minHeight: "48px",
                          maxHeight: "128px",
                          lineHeight: "1.5"
                        }}
                        onInput={(e) => {
                          const target = e.target as HTMLTextAreaElement;
                          target.style.height = "48px";
                          if (target.scrollHeight > 48) {
                            target.style.height = Math.min(target.scrollHeight, 128) + "px";
                          }
                        }}
                      />
                    </div>
                    <Button
                      onClick={() => sendMessage(activeServiceId, newMessage)}
                      disabled={!newMessage.trim() || isSending}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 disabled:opacity-50 flex-shrink-0 self-end"
                      style={{
                        height: "48px",
                        minHeight: "48px"
                      }}
                    >
                      {isSending ? <Clock className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              )}
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
    </>
  );
}
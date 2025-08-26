// import { useState, useEffect, useRef } from "react"
// import {
//   Video,
//   VideoOff,
//   Mic,
//   MicOff,
//   Phone,
//   Settings,
//   Copy,
//   Shield,
//   ArrowLeft,
//   Grid3x3,
//   Users,
//   AlertCircle,
//   Loader2,
// } from "lucide-react"
// import { cn } from "@/lib/utils"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import toast from "react-hot-toast"

// interface VideoCallModalProps {
//   isOpen: boolean
//   onClose: () => void
//   mechanicName: string
//   bookingTime: string
//   sessionId: string
//   userId: string
//   role: "user" | "mechanic"
// }

// interface Participant {
//   id: string
//   name: string
//   isHost: boolean
//   isMuted: boolean
//   isVideoOn: boolean
//   isYou: boolean
//   stream?: MediaStream
// }

// export function VideoCallModal({
//   isOpen,
//   onClose,
//   mechanicName,
//   bookingTime,
//   sessionId,
//   userId,
//   role,
// }: VideoCallModalProps) {
//   const [isMuted, setIsMuted] = useState(true)
//   const [isVideoOn, setIsVideoOn] = useState(false)
//   const [callDuration, setCallDuration] = useState(0)
//   const [layoutMode, setLayoutMode] = useState<"spotlight" | "grid">("spotlight")
//   const [error, setError] = useState<string | null>(null)
//   const [isConnected, setIsConnected] = useState(false)
//   const [isVideoLoading, setIsVideoLoading] = useState(false)
//   const [micPermissionDenied, setMicPermissionDenied] = useState(false)
//   const [videoPermissionDenied, setVideoPermissionDenied] = useState(false)
//   const [participants, setParticipants] = useState<Participant[]>([
//     {
//       id: userId,
//       name: role === "user" ? "You" : mechanicName,
//       isHost: role === "mechanic",
//       isMuted: true,
//       isVideoOn: false,
//       isYou: true,
//       stream: undefined,
//     },
//   ])

//   const localVideoRef = useRef<HTMLVideoElement>(null)
//   const remoteVideoRef = useRef<HTMLVideoElement>(null)
//   const streamRef = useRef<MediaStream | null>(null)
//   const isOpenRef = useRef(isOpen)

//   useEffect(() => {
//     isOpenRef.current = isOpen
//   }, [isOpen])

//   // Stream cleanup
//   useEffect(() => {
//     return () => {
//       if (streamRef.current) {
//         streamRef.current.getTracks().forEach((track) => track.stop())
//         streamRef.current = null
//       }
//     }
//   }, [])

//   // Update local video stream
//   useEffect(() => {
//     if (localVideoRef.current && streamRef.current && isVideoOn && !isVideoLoading) {
//       localVideoRef.current.srcObject = streamRef.current
//       localVideoRef.current.play().catch((err) => console.error("Play error:", err))
//     } else if (localVideoRef.current) {
//       localVideoRef.current.srcObject = null
//     }
//   }, [isVideoOn, isVideoLoading, streamRef.current])

//   // Toggle microphone
//   const handleToggleMic = async () => {
//     if (!streamRef.current) {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
//         if (!isOpenRef.current) {
//           stream.getTracks().forEach((track) => track.stop())
//           return
//         }
//         streamRef.current = stream
//         stream.getAudioTracks().forEach((track) => (track.enabled = true))
//         setIsMuted(false)
//         setIsConnected(true)
//         setError(null)
//         setMicPermissionDenied(false)
//         setParticipants((prev) =>
//           prev.map((p) => (p.isYou ? { ...p, isMuted: false, stream } : p))
//         )
//         if (localVideoRef.current) localVideoRef.current.srcObject = stream
//       } catch {
//         if (isOpenRef.current) {
//           toast.error("Microphone access denied")
//           setError("Microphone access denied")
//           setMicPermissionDenied(true)
//         }
//       }
//     } else {
//       streamRef.current.getAudioTracks().forEach((track) => (track.enabled = !isMuted))
//       setIsMuted(!isMuted)
//       setMicPermissionDenied(false)
//       setParticipants((prev) =>
//         prev.map((p) => (p.isYou ? { ...p, isMuted: !isMuted } : p))
//       )
//     }
//   }

//   // Toggle video
//   const handleToggleVideo = async () => {
//     if (!isVideoOn) {
//       setIsVideoLoading(true)
//       try {
//         const videoStream = await navigator.mediaDevices.getUserMedia({
//           video: true,
//           audio: isMuted ? false : true,
//         })
//         if (!isOpenRef.current) {
//           videoStream.getTracks().forEach((track) => track.stop())
//           return
//         }
//         if (streamRef.current) streamRef.current.getTracks().forEach((track) => track.stop())
//         streamRef.current = videoStream
//         videoStream.getVideoTracks().forEach((track) => (track.enabled = true))
//         if (!isMuted) videoStream.getAudioTracks().forEach((track) => (track.enabled = true))
//         setIsVideoOn(true)
//         setIsConnected(true)
//         setError(null)
//         setVideoPermissionDenied(false)
//         setParticipants((prev) =>
//           prev.map((p) => (p.isYou ? { ...p, isVideoOn: true, stream: videoStream } : p))
//         )
//       } catch {
//         if (isOpenRef.current) {
//           toast.error("Camera access denied")
//           setError("Camera access denied")
//           setVideoPermissionDenied(true)
//         }
//       } finally {
//         setIsVideoLoading(false)
//       }
//     } else {
//       if (streamRef.current) {
//         streamRef.current.getVideoTracks().forEach((track) => track.stop())
//         const audioTracks = streamRef.current.getAudioTracks()
//         streamRef.current = audioTracks.length > 0 ? new MediaStream(audioTracks) : null
//         setIsVideoOn(false)
//         setVideoPermissionDenied(false)
//       }
//     }
//   }

//   // Call duration timer
//   useEffect(() => {
//     if (isOpen) {
//       const bookingStartTime = new Date(bookingTime).getTime()
//       const timer = setInterval(() => {
//         setCallDuration(Math.max(0, Math.floor((Date.now() - bookingStartTime) / 1000)))
//       }, 1000)
//       return () => clearInterval(timer)
//     }
//   }, [isOpen, bookingTime])

//   // Prevent body scrolling
//   useEffect(() => {
//     if (isOpen) {
//       const originalStyles = {
//         overflow: document.body.style.overflow,
//         position: document.body.style.position,
//         width: document.body.style.width,
//         height: document.body.style.height,
//       }
//       document.body.style.overflow = "hidden"
//       document.body.style.position = "fixed"
//       document.body.style.width = "100%"
//       document.body.style.height = "100%"
//       return () => {
//         Object.assign(document.body.style, originalStyles)
//       }
//     }
//   }, [isOpen])

//   const formatDuration = (seconds: number) =>
//     `${Math.floor(seconds / 60).toString().padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`

//   const handleEndCall = () => {
//     if (streamRef.current) {
//       streamRef.current.getTracks().forEach((track) => track.stop())
//       streamRef.current = null
//     }
//     setIsMuted(true)
//     setIsVideoOn(false)
//     setCallDuration(0)
//     setLayoutMode("spotlight")
//     setError(null)
//     setIsConnected(false)
//     setIsVideoLoading(false)
//     setMicPermissionDenied(false)
//     setVideoPermissionDenied(false)
//     setParticipants([
//       {
//         id: userId,
//         name: role === "user" ? "You" : mechanicName,
//         isHost: role === "mechanic",
//         isMuted: true,
//         isVideoOn: false,
//         isYou: true,
//         stream: undefined,
//       },
//     ])
//     onClose()
//   }

//   const getSelfParticipant = () => participants.find((p) => p.isYou)
//   const getRemoteParticipant = () => participants.find((p) => !p.isYou)

//   const renderParticipantVideo = (participant: Participant, isMainVideo = false) => {
//     const gradientClass = participant.isYou
//       ? "bg-gradient-to-br from-blue-600 to-purple-700"
//       : participant.isHost
//       ? "bg-gradient-to-br from-green-600 to-emerald-700"
//       : "bg-gradient-to-br from-orange-600 to-red-700"

//     const getAvatarSize = () =>
//       isMainVideo
//         ? "w-20 sm:w-24 md:w-32 lg:w-40 h-20 sm:h-24 md:h-32 lg:h-40"
//         : "w-12 sm:w-16 md:w-20 h-12 sm:h-16 md:h-20"

//     const getTextSize = () => (isMainVideo ? "text-2xl sm:text-3xl md:text-4xl" : "text-base sm:text-lg md:text-xl")

//     return (
//       <div className="relative w-full h-full flex items-center justify-center bg-black">
//         {participant.isYou && participant.stream && participant.isVideoOn && !isVideoLoading ? (
//           <video
//             ref={localVideoRef}
//             autoPlay
//             muted
//             playsInline
//             className="w-full h-full object-contain rounded-xl transform scale-x-[-1]"
//           />
//         ) : !participant.isYou && participant.stream && participant.isVideoOn ? (
//           <video
//             ref={remoteVideoRef}
//             autoPlay
//             playsInline
//             className="w-full h-full object-contain rounded-xl"
//           />
//         ) : participant.isYou && isVideoLoading ? (
//           <div className="w-full h-full bg-gray-900 flex items-center justify-center border border-gray-700 rounded-xl">
//             <div className="text-center text-white p-4">
//               <Loader2 className="w-8 sm:w-10 mx-auto mb-2 text-blue-400 animate-spin" />
//               <p className="text-sm sm:text-base">Loading camera...</p>
//             </div>
//           </div>
//         ) : participant.isYou && error ? (
//           <div className="w-full h-full bg-gray-900 flex items-center justify-center border border-gray-700 rounded-xl">
//             <div className="text-center text-white p-4">
//               <AlertCircle className="w-8 sm:w-10 mx-auto mb-2 text-red-400" />
//               <p className="text-sm sm:text-base">Camera error: {error}</p>
//             </div>
//           </div>
//         ) : participant.isYou && !participant.isVideoOn ? (
//           <div className="w-full h-full bg-gray-900 flex items-center justify-center border border-gray-700 rounded-xl">
//             <div className="text-center">
//               <div className={`${getAvatarSize()} bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3`}>
//                 <span className={`text-gray-400 ${getTextSize()} font-semibold`}>
//                   {participant.name.charAt(0).toUpperCase()}
//                 </span>
//               </div>
//               <VideoOff className={`${isMainVideo ? "w-8 sm:w-10" : "w-5 sm:w-6"} text-gray-500 mx-auto mb-2`} />
//               <span className="text-gray-400 text-sm sm:text-base">Camera off</span>
//             </div>
//           </div>
//         ) : (
//           <div className={`w-full h-full ${gradientClass} flex items-center justify-center rounded-xl relative`}>
//             <div className={`${getAvatarSize()} bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-white/20`}>
//               <span className={`text-white ${getTextSize()} font-semibold drop-shadow-lg`}>
//                 {participant.name.charAt(0).toUpperCase()}
//               </span>
//             </div>
//           </div>
//         )}

//         <div className="absolute bottom-3 left-3 flex items-center gap-2">
//           <Badge
//             variant="secondary"
//             className="bg-black/90 text-white text-xs font-medium backdrop-blur-md px-2 py-1"
//           >
//             <span className="truncate max-w-20 sm:max-w-32">{participant.name}</span>
//             {participant.isMuted ? (
//               <MicOff className="w-4 h-4 ml-1 text-red-400" />
//             ) : (
//               <Mic className="w-4 h-4 ml-1 text-green-400" />
//             )}
//           </Badge>
//           {participant.isHost && (
//             <Badge className="bg-blue-600/90 text-white text-xs font-medium backdrop-blur-md">Host</Badge>
//           )}
//           {participant.isYou && (
//             <Badge className="bg-blue-600/90 text-white text-xs font-medium backdrop-blur-md">You</Badge>
//           )}
//         </div>
//       </div>
//     )
//   }

//   if (!isOpen) return null

//   const selfParticipant = getSelfParticipant()
//   const remoteParticipant = getRemoteParticipant()
//   const totalParticipants = participants.length

//   return (
//     <div className="fixed inset-0 z-[10000] bg-gray-950 flex flex-col touch-none" style={{ height: "100vh" }}>
//       {/* Header */}
//       <div className="flex-shrink-0 bg-black/60 backdrop-blur-md border-b border-gray-800/50 z-10">
//         <div className="flex items-center justify-between p-4 min-h-[64px]">
//           <div className="flex items-center gap-4">
//             <Button
//               variant="ghost"
//               size="sm"
//               className="text-white hover:bg-white/20 font-medium p-2"
//               onClick={handleEndCall}
//             >
//               <ArrowLeft className="w-5 h-5" />
//               <span className="ml-2">Back</span>
//             </Button>
//             <div className="flex items-center gap-3">
//               <div className="flex items-center gap-2">
//                 <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
//                 <span className="text-white text-sm font-semibold">{formatDuration(callDuration)}</span>
//               </div>
//               <Badge
//                 variant="secondary"
//                 className="bg-green-600/90 text-white text-xs font-medium px-2 py-1"
//               >
//                 <Shield className="w-4 h-4 mr-1" />
//                 {isConnected ? "Connected" : "Connecting"}
//               </Badge>
//               <div className="flex items-center gap-1 text-gray-300">
//                 <Users className="w-4 h-4" />
//                 <span className="text-sm font-medium">{totalParticipants}</span>
//               </div>
//             </div>
//           </div>
//           <div className="flex items-center gap-2">
//             <Button
//               variant="ghost"
//               size="sm"
//               className="text-white hover:bg-white/20 p-2"
//               onClick={() => setLayoutMode(layoutMode === "spotlight" ? "grid" : "spotlight")}
//             >
//               <Grid3x3 className="w-5 h-5" />
//             </Button>
//             <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 p-2">
//               <Copy className="w-5 h-5" />
//             </Button>
//             <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 p-2">
//               <Settings className="w-5 h-5" />
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* Video Content */}
//       <div className="flex-1 relative p-4 min-h-0 overflow-auto" style={{ paddingBottom: "96px" }}>
//         {layoutMode === "grid" || totalParticipants === 1 ? (
//           <div
//             className={`h-full grid gap-4 transition-all duration-300 min-h-0 ${
//               totalParticipants === 1 ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
//             }`}
//           >
//             {participants.map((participant) => (
//               <div
//                 key={participant.id}
//                 className="video-tile overflow-hidden bg-black border border-gray-600 shadow-2xl rounded-xl min-h-[300px]"
//               >
//                 {renderParticipantVideo(participant, true)}
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="h-full relative transition-all duration-300 min-h-0">
//             {selfParticipant && (
//               <div className="video-tile h-full overflow-hidden bg-black border border-gray-600 shadow-2xl rounded-xl min-h-[300px]">
//                 {renderParticipantVideo(selfParticipant, true)}
//               </div>
//             )}
//             {remoteParticipant && (
//               <div className="absolute bottom-4 right-4 w-32 sm:w-40 md:w-48 lg:w-64 h-24 sm:h-32 md:h-40 lg:h-48 z-10">
//                 <div className="video-tile h-full overflow-hidden bg-black border-2 border-blue-500/50 shadow-2xl rounded-xl">
//                   {renderParticipantVideo(remoteParticipant, false)}
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Controls */}
//       <div className="fixed bottom-0 left-0 right-0 bg-black/70 backdrop-blur-md border-t border-gray-800/50 z-10">
//         <div className="flex items-center justify-center p-6 min-h-[96px]">
//           <div className="flex items-center gap-4">
//             <Button
//               size="lg"
//               className={cn(
//                 "w-14 h-14 rounded-full font-semibold shadow-lg relative",
//                 isMuted
//                   ? "bg-red-600 hover:bg-red-700 text-white border-2 border-red-400"
//                   : "bg-gray-700 hover:bg-gray-600 text-white border-2 border-gray-500"
//               )}
//               onClick={handleToggleMic}
//             >
//               {micPermissionDenied ? (
//                 <AlertCircle className="w-6 h-6 text-red-400" />
//               ) : isMuted ? (
//                 <MicOff className="w-6 h-6" />
//               ) : (
//                 <Mic className="w-6 h-6" />
//               )}
//             </Button>
//             <Button
//               size="lg"
//               className={cn(
//                 "w-14 h-14 rounded-full font-semibold shadow-lg relative",
//                 !isVideoOn
//                   ? "bg-red-600 hover:bg-red-700 text-white border-2 border-red-400"
//                   : "bg-gray-700 hover:bg-gray-600 text-white border-2 border-gray-500"
//               )}
//               onClick={handleToggleVideo}
//             >
//               {videoPermissionDenied ? (
//                 <AlertCircle className="w-6 h-6 text-red-400" />
//               ) : isVideoOn ? (
//                 <Video className="w-6 h-6" />
//               ) : (
//                 <VideoOff className="w-6 h-6" />
//               )}
//             </Button>
//             <Button
//               size="lg"
//               className="w-14 h-14 rounded-full bg-gray-700 hover:bg-gray-600 text-white border-2 border-gray-500 shadow-lg"
//             >
//               <Settings className="w-6 h-6" />
//             </Button>
//             <Button
//               size="lg"
//               className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 text-white border-2 border-red-400 shadow-lg"
//               onClick={handleEndCall}
//             >
//               <Phone className="w-6 h-6" />
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }







import { useState, useEffect, useRef } from "react"
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Phone,
  Settings,
  Copy,
  Shield,
  ArrowLeft,
  Grid3x3,
  Users,
  AlertCircle,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import toast from "react-hot-toast"

interface VideoCallModalProps {
  isOpen: boolean
  onClose: () => void
  mechanicName: string
  bookingTime: string
  sessionId: string
  userId: string
  role: "user" | "mechanic"
}

interface Participant {
  id: string
  name: string
  isHost: boolean
  isMuted: boolean
  isVideoOn: boolean
  isYou: boolean
  stream?: MediaStream
}

export function VideoCallModal({
  isOpen,
  onClose,
  mechanicName,
  bookingTime,
  sessionId,
  userId,
  role,
}: VideoCallModalProps) {
  const [isMuted, setIsMuted] = useState(true)
  const [isVideoOn, setIsVideoOn] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const [layoutMode, setLayoutMode] = useState<"spotlight" | "grid">("spotlight")
  const [error, setError] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isVideoLoading, setIsVideoLoading] = useState(false)
  const [micPermissionDenied, setMicPermissionDenied] = useState(false)
  const [videoPermissionDenied, setVideoPermissionDenied] = useState(false)
  const [participants, setParticipants] = useState<Participant[]>([
    {
      id: userId,
      name: role === "user" ? "You" : mechanicName,
      isHost: role === "mechanic",
      isMuted: true,
      isVideoOn: false,
      isYou: true,
      stream: undefined,
    },
  ])

  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const isOpenRef = useRef(isOpen)

  useEffect(() => {
    isOpenRef.current = isOpen
  }, [isOpen])

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
        streamRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (localVideoRef.current && streamRef.current && isVideoOn && !isVideoLoading) {
      localVideoRef.current.srcObject = streamRef.current
      localVideoRef.current.play().catch((err) => console.error("Play error:", err))
    } else if (localVideoRef.current) {
      localVideoRef.current.srcObject = null
    }
  }, [isVideoOn, isVideoLoading, streamRef.current])

  const handleToggleMic = async () => {
    if (!streamRef.current) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        if (!isOpenRef.current) {
          stream.getTracks().forEach((track) => track.stop())
          return
        }
        streamRef.current = stream
        stream.getAudioTracks().forEach((track) => (track.enabled = true))
        setIsMuted(false)
        setIsConnected(true)
        setError(null)
        setMicPermissionDenied(false)
        setParticipants((prev) =>
          prev.map((p) => (p.isYou ? { ...p, isMuted: false, stream } : p))
        )
        if (localVideoRef.current) localVideoRef.current.srcObject = stream
      } catch {
        if (isOpenRef.current) {
          toast.error("Microphone access denied")
          setError("Microphone access denied")
          setMicPermissionDenied(true)
        }
      }
    } else {
      streamRef.current.getAudioTracks().forEach((track) => (track.enabled = !isMuted))
      setIsMuted(!isMuted)
      setMicPermissionDenied(false)
      setParticipants((prev) =>
        prev.map((p) => (p.isYou ? { ...p, isMuted: !isMuted } : p))
      )
    }
  }

  const handleToggleVideo = async () => {
    if (!isVideoOn) {
      setIsVideoLoading(true)
      try {
        const videoStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: isMuted ? false : true,
        })
        if (!isOpenRef.current) {
          videoStream.getTracks().forEach((track) => track.stop())
          return
        }
        if (streamRef.current) streamRef.current.getTracks().forEach((track) => track.stop())
        streamRef.current = videoStream
        videoStream.getVideoTracks().forEach((track) => (track.enabled = true))
        if (!isMuted) videoStream.getAudioTracks().forEach((track) => (track.enabled = true))
        setIsVideoOn(true)
        setIsConnected(true)
        setError(null)
        setVideoPermissionDenied(false)
        setParticipants((prev) =>
          prev.map((p) => (p.isYou ? { ...p, isVideoOn: true, stream: videoStream } : p))
        )
      } catch {
        if (isOpenRef.current) {
          toast.error("Camera access denied")
          setError("Camera access denied")
          setVideoPermissionDenied(true)
        }
      } finally {
        setIsVideoLoading(false)
      }
    } else {
      if (streamRef.current) {
        streamRef.current.getVideoTracks().forEach((track) => track.stop())
        const audioTracks = streamRef.current.getAudioTracks()
        streamRef.current = audioTracks.length > 0 ? new MediaStream(audioTracks) : null
        setIsVideoOn(false)
        setVideoPermissionDenied(false)
      }
    }
  }

  useEffect(() => {
    if (isOpen) {
      const bookingStartTime = new Date(bookingTime).getTime()
      const timer = setInterval(() => {
        setCallDuration(Math.max(0, Math.floor((Date.now() - bookingStartTime) / 1000)))
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [isOpen, bookingTime])

  useEffect(() => {
    if (isOpen) {
      const originalStyles = {
        overflow: document.body.style.overflow,
        position: document.body.style.position,
        width: document.body.style.width,
        height: document.body.style.height,
      }
      document.body.style.overflow = "hidden"
      document.body.style.position = "fixed"
      document.body.style.width = "100%"
      document.body.style.height = "100%"
      return () => {
        Object.assign(document.body.style, originalStyles)
      }
    }
  }, [isOpen])

  const formatDuration = (seconds: number) =>
    `${Math.floor(seconds / 60).toString().padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`

  const handleEndCall = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    setIsMuted(true)
    setIsVideoOn(false)
    setCallDuration(0)
    setLayoutMode("spotlight")
    setError(null)
    setIsConnected(false)
    setIsVideoLoading(false)
    setMicPermissionDenied(false)
    setVideoPermissionDenied(false)
    setParticipants([
      {
        id: userId,
        name: role === "user" ? "You" : mechanicName,
        isHost: role === "mechanic",
        isMuted: true,
        isVideoOn: false,
        isYou: true,
        stream: undefined,
      },
    ])
    onClose()
  }

  const getSelfParticipant = () => participants.find((p) => p.isYou)
  const getRemoteParticipant = () => participants.find((p) => !p.isYou)

  const renderParticipantVideo = (participant: Participant, isMainVideo = false) => {
    const gradientClass = participant.isYou
      ? "bg-gradient-to-br from-blue-600 to-purple-700"
      : participant.isHost
      ? "bg-gradient-to-br from-green-600 to-emerald-700"
      : "bg-gradient-to-br from-orange-600 to-red-700"

    const getAvatarSize = () =>
      isMainVideo
        ? "w-20 sm:w-24 md:w-32 lg:w-40 h-20 sm:h-24 md:h-32 lg:h-40"
        : "w-12 sm:w-16 md:w-20 h-12 sm:h-16 md:h-20"

    const getTextSize = () => (isMainVideo ? "text-2xl sm:text-3xl md:text-4xl" : "text-base sm:text-lg md:text-xl")

    return (
      <div className="relative w-full h-full flex items-center justify-center bg-black">
        {participant.isYou && participant.stream && participant.isVideoOn && !isVideoLoading ? (
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-contain rounded-xl transform scale-x-[-1]"
          />
        ) : !participant.isYou && participant.stream && participant.isVideoOn ? (
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-contain rounded-xl"
          />
        ) : participant.isYou && isVideoLoading ? (
          <div className="w-full h-full bg-gray-900 flex items-center justify-center border border-gray-700 rounded-xl">
            <div className="text-center text-white p-4">
              <Loader2 className="w-8 sm:w-10 mx-auto mb-2 text-blue-400 animate-spin" />
              <p className="text-sm sm:text-base">Loading camera...</p>
            </div>
          </div>
        ) : participant.isYou && error ? (
          <div className="w-full h-full bg-gray-900 flex items-center justify-center border border-gray-700 rounded-xl">
            <div className="text-center text-white p-4">
              <AlertCircle className="w-8 sm:w-10 mx-auto mb-2 text-red-400" />
              <p className="text-sm sm:text-base">Camera error: {error}</p>
            </div>
          </div>
        ) : participant.isYou && !participant.isVideoOn ? (
          <div className="w-full h-full bg-gray-900 flex items-center justify-center border border-gray-700 rounded-xl">
            <div className="text-center">
              <div className={`${getAvatarSize()} bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3`}>
                <span className={`text-gray-400 ${getTextSize()} font-semibold`}>
                  {participant.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <VideoOff className={`${isMainVideo ? "w-8 sm:w-10" : "w-5 sm:w-6"} text-gray-500 mx-auto mb-2`} />
              <span className="text-gray-400 text-sm sm:text-base">Camera off</span>
            </div>
          </div>
        ) : (
          <div className={`w-full h-full ${gradientClass} flex items-center justify-center rounded-xl relative`}>
            <div className={`${getAvatarSize()} bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-white/20`}>
              <span className={`text-white ${getTextSize()} font-semibold drop-shadow-lg`}>
                {participant.name.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        )}

        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <Badge
            variant="secondary"
            className="bg-black/90 text-white text-xs font-medium backdrop-blur-md px-2 py-1"
          >
            <span className="truncate max-w-20 sm:max-w-32">{participant.name}</span>
            {participant.isMuted ? (
              <MicOff className="w-4 h-4 ml-1 text-red-400" />
            ) : (
              <Mic className="w-4 h-4 ml-1 text-green-400" />
            )}
          </Badge>
          {participant.isHost && (
            <Badge className="bg-blue-600/90 text-white text-xs font-medium backdrop-blur-md">Host</Badge>
          )}
          {participant.isYou && (
            <Badge className="bg-blue-600/90 text-white text-xs font-medium backdrop-blur-md">You</Badge>
          )}
        </div>
      </div>
    )
  }

  if (!isOpen) return null

  const selfParticipant = getSelfParticipant()
  const remoteParticipant = getRemoteParticipant()
  const totalParticipants = participants.length

  return (
    <div className="fixed inset-0 z-[10000] bg-gray-950 flex flex-col touch-none" style={{ height: "100vh" }}>
      {/* Header */}
      <div className="flex-shrink-0 bg-black/60 backdrop-blur-md border-b border-gray-800/50 z-10">
        <div className="flex items-center justify-between p-4 min-h-[64px]">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 font-medium p-2"
              onClick={handleEndCall}
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="ml-2">Back</span>
            </Button>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-white text-sm font-semibold">{formatDuration(callDuration)}</span>
              </div>
              <Badge
                variant="secondary"
                className="bg-green-600/90 text-white text-xs font-medium px-2 py-1"
              >
                <Shield className="w-4 h-4 mr-1" />
                {isConnected ? "Connected" : "Connecting"}
              </Badge>
              <div className="flex items-center gap-1 text-gray-300">
                <Users className="w-4 h-4" />
                <span className="text-sm font-medium">{totalParticipants}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 p-2"
              onClick={() => setLayoutMode(layoutMode === "spotlight" ? "grid" : "spotlight")}
            >
              <Grid3x3 className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 p-2">
              <Copy className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 p-2">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Video Content */}
      <div className="flex-1 relative p-4 min-h-0 overflow-auto" style={{ paddingBottom: "96px" }}>
        {layoutMode === "grid" || totalParticipants === 1 ? (
          <div
            className={`h-full grid gap-4 transition-all duration-300 min-h-0 ${
              totalParticipants === 1 ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
            }`}
          >
            {participants.map((participant) => (
              <div
                key={participant.id}
                className="video-tile overflow-hidden bg-black border border-gray-600 shadow-2xl rounded-xl min-h-[300px]"
              >
                {renderParticipantVideo(participant, true)}
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full relative transition-all duration-300 min-h-0">
            {selfParticipant && (
              <div className="video-tile h-full overflow-hidden bg-black border border-gray-600 shadow-2xl rounded-xl min-h-[300px]">
                {renderParticipantVideo(selfParticipant, true)}
              </div>
            )}
            {remoteParticipant && (
              <div className="absolute bottom-4 right-4 w-32 sm:w-40 md:w-48 lg:w-64 h-24 sm:h-32 md:h-40 lg:h-48 z-10">
                <div className="video-tile h-full overflow-hidden bg-black border-2 border-blue-500/50 shadow-2xl rounded-xl">
                  {renderParticipantVideo(remoteParticipant, false)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/70 backdrop-blur-md border-t border-gray-800/50 z-10">
        <div className="flex items-center justify-center p-6 min-h-[96px]">
          <div className="flex items-center gap-4">
            <Button
              size="lg"
              className={cn(
                "w-14 h-14 rounded-full font-semibold shadow-lg relative",
                isMuted
                  ? "bg-red-600 hover:bg-red-700 text-white border-2 border-red-400"
                  : "bg-gray-700 hover:bg-gray-600 text-white border-2 border-gray-500"
              )}
              onClick={handleToggleMic}
            >
              {micPermissionDenied ? (
                <AlertCircle className="w-6 h-6 text-red-400" />
              ) : isMuted ? (
                <MicOff className="w-6 h-6" />
              ) : (
                <Mic className="w-6 h-6" />
              )}
            </Button>
            <Button
              size="lg"
              className={cn(
                "w-14 h-14 rounded-full font-semibold shadow-lg relative",
                !isVideoOn
                  ? "bg-red-600 hover:bg-red-700 text-white border-2 border-red-400"
                  : "bg-gray-700 hover:bg-gray-600 text-white border-2 border-gray-500"
              )}
              onClick={handleToggleVideo}
            >
              {videoPermissionDenied ? (
                <AlertCircle className="w-6 h-6 text-red-400" />
              ) : isVideoOn ? (
                <Video className="w-6 h-6" />
              ) : (
                <VideoOff className="w-6 h-6" />
              )}
            </Button>
            <Button
              size="lg"
              className="w-14 h-14 rounded-full bg-gray-700 hover:bg-gray-600 text-white border-2 border-gray-500 shadow-lg"
            >
              <Settings className="w-6 h-6" />
            </Button>
            <Button
              size="lg"
              className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 text-white border-2 border-red-400 shadow-lg"
              onClick={handleEndCall}
            >
              <Phone className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}






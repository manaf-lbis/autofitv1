// import { useState, useEffect, useRef, useCallback } from "react";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import {
//   Video,
//   VideoOff,
//   Mic,
//   MicOff,
//   Phone,
//   Settings,
//   MoreVertical,
//   Copy,
//   Shield,
//   ArrowLeft,
//   Grid3x3,
//   Users,
//   AlertCircle,
// } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { useUserMedia } from "@/hooks/useUserMedia";
// import { initSocket } from "@/lib/socket";
// import toast from "react-hot-toast";

// interface VideoCallModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   mechanicName: string;
//   bookingTime: string;
//   sessionId: string;
// }

// interface Participant {
//   id: string;
//   name: string;
//   isHost: boolean;
//   isMuted: boolean;
//   isVideoOn: boolean;
//   isYou: boolean;
// }

// export function VideoCallModal({ isOpen, onClose, mechanicName, bookingTime ,sessionId}: VideoCallModalProps) {

//   const [isMuted, setIsMuted] = useState(false);
//   const [isVideoOn, setIsVideoOn] = useState(true);
//   const [callDuration, setCallDuration] = useState(0);
//   const [layoutMode, setLayoutMode] = useState<"spotlight" | "grid">("spotlight");
//   const { stream, error } = useUserMedia({ video: isVideoOn, audio: true });
//   const localVideoRef = useRef<HTMLVideoElement>(null);
//   const socket = initSocket()

//   const [participants, setParticipants] = useState<Participant[]>([
//     {
//       id: "you",
//       name: "You",
//       isHost: false,
//       isMuted: isMuted,
//       isVideoOn: isVideoOn,
//       isYou: true,
//     },
//     {
//       id: "mechanic",
//       name: mechanicName,
//       isHost: true,
//       isMuted: false,
//       isVideoOn: true,
//       isYou: false,
//     },
//     {
//       id: "jose",
//       name: "Jose",
//       isHost: false,
//       isMuted: true,
//       isVideoOn: false,
//       isYou: false,
//     },
//   ]);

//   useEffect(()=>{
//     socket.emit('liveAssistance',{sessionId})

//     socket.on('liveError',({message})=>{
//       console.log(message);
      
//       toast.error(message)
//     });

//     socket.on('initiateOffer',()=>{
//       console.log('initiateOffer');
//     })

//      return () => {
//       socket.off('initiateOffer');
//       socket.emit('liveAssistanceDisconnect')
//     }

//   },[])

//   useEffect(() => {
//     setParticipants((prev) =>
//       prev.map((p) => (p.isYou ? { ...p, isMuted, isVideoOn } : p))
//     );
//   }, [isMuted, isVideoOn]);

//   useEffect(() => {
//     if (stream && localVideoRef.current) {
//       localVideoRef.current.srcObject = stream;
//       console.log("Stream assigned:", stream.active, stream.getVideoTracks());
//     }

//     if (stream) {
//       stream.getAudioTracks().forEach((track) => {
//         track.enabled = !isMuted;
//         console.log("Audio track enabled:", track.enabled);
//       });
//     }

//     return () => {
//       if (stream) {
//         stream.getTracks().forEach((track) => track.stop());
//         console.log("Stream tracks stopped");
//       }
//     };
//   }, [stream, isMuted, isVideoOn, isOpen]);

//   useEffect(() => {
//     if (isOpen) {
//       const bookingStartTime = new Date(bookingTime).getTime();
//       const timer = setInterval(() => {
//         const now = Date.now();
//         const elapsed = Math.floor((now - bookingStartTime) / 1000);
//         setCallDuration(Math.max(0, elapsed));
//       }, 1000);
//       return () => clearInterval(timer);
//     }
//   }, [isOpen, bookingTime]);

//   const formatDuration = (seconds: number) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
//   };

//   const handleEndCall = () => {
//     onClose();
//     setCallDuration(0);
//     setIsMuted(false);
//     setIsVideoOn(true);
//     setLayoutMode("spotlight");
//   };

//   const getOtherParticipants = useCallback(() => {
//     return participants.filter((p) => !p.isYou);
//   }, [participants]);

//   const getSelfParticipant = useCallback(() => {
//     return participants.find((p) => p.isYou);
//   }, [participants]);

//   const renderParticipantVideo = useCallback(
//     (participant: Participant, isInGrid = false, gridSize = 1) => {
//       let gradientClass = "bg-gradient-to-br from-gray-700 to-gray-900";
//       if (participant.isYou) {
//         gradientClass = "bg-gradient-to-br from-blue-600 to-purple-700";
//       } else if (participant.isHost) {
//         gradientClass = "bg-gradient-to-br from-green-600 to-emerald-700";
//       } else {
//         gradientClass = "bg-gradient-to-br from-orange-600 to-red-700";
//       }

//       const getAvatarSize = () => {
//         if (isInGrid) {
//           if (gridSize === 1) return "w-20 sm:w-28 md:w-36 lg:w-44 h-20 sm:h-28 md:h-36 lg:h-44";
//           if (gridSize === 2) return "w-16 sm:w-20 md:w-24 lg:w-32 h-16 sm:h-20 md:h-24 lg:h-32";
//           if (gridSize <= 4) return "w-12 sm:w-16 md:w-20 lg:w-24 h-12 sm:h-16 md:h-20 lg:h-24";
//           return "w-10 sm:w-12 md:w-16 lg:w-20 h-10 sm:h-12 md:h-16 lg:h-20";
//         }
//         return "w-12 sm:w-16 md:w-20 h-12 sm:h-16 md:h-20";
//       };

//       const getTextSize = () => {
//         if (isInGrid) {
//           if (gridSize === 1) return "text-2xl sm:text-3xl md:text-4xl lg:text-5xl";
//           if (gridSize === 2) return "text-xl sm:text-2xl md:text-3xl lg:text-4xl";
//           if (gridSize <= 4) return "text-lg sm:text-xl md:text-2xl lg:text-3xl";
//           return "text-base sm:text-lg md:text-xl lg:text-2xl";
//         }
//         return "text-sm sm:text-base md:text-lg";
//       };

//       return (
//         <div className="relative w-full h-full group">
//           {participant.isYou && stream && participant.isVideoOn ? (
//             <video
//               ref={localVideoRef}
//               autoPlay
//               muted
//               playsInline
//               className="w-full h-full object-cover rounded-xl transform scale-x-[-1]"
//             />
//           ) : participant.isYou && error ? (
//             <div className="w-full h-full bg-gray-900 flex items-center justify-center relative border border-gray-700">
//               <div className="text-center text-white">
//                 <AlertCircle className="w-8 h-8 mx-auto mb-2 text-red-400" />
//                 <p className="text-sm">Camera error: {error}</p>
//               </div>
//             </div>
//           ) : participant.isYou && !participant.isVideoOn ? (
//             <div className="w-full h-full bg-gray-900 flex items-center justify-center relative border border-gray-700">
//               <div className="text-center">
//                 <div className={`${getAvatarSize()} bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3`}>
//                   <span className={`text-gray-400 ${getTextSize()} font-semibold`}>
//                     {participant.name.charAt(0).toUpperCase()}
//                   </span>
//                 </div>
//                 <VideoOff className={`${isInGrid && gridSize === 1 ? "w-8 h-8" : "w-5 h-5"} text-gray-500 mx-auto mb-2`} />
//                 <span className="text-gray-400 text-xs sm:text-sm">Camera off</span>
//               </div>
//             </div>
//           ) : participant.isVideoOn ? (
//             <div className={`w-full h-full ${gradientClass} flex items-center justify-center relative overflow-hidden`}>
//               <div className="absolute inset-0 bg-black/5"></div>
//               <div className={`${getAvatarSize()} bg-white/20 rounded-full flex items-center justify-center relative z-10 backdrop-blur-sm border-2 border-white/20`}>
//                 <span className={`text-white ${getTextSize()} font-semibold drop-shadow-lg`}>
//                   {participant.name.charAt(0).toUpperCase()}
//                 </span>
//               </div>
//               <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-black/5"></div>
//             </div>
//           ) : (
//             <div className="w-full h-full bg-gray-900 flex items-center justify-center relative border border-gray-700">
//               <div className="text-center">
//                 <div className={`${getAvatarSize()} bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3`}>
//                   <span className={`text-gray-400 ${getTextSize()} font-semibold`}>
//                     {participant.name.charAt(0).toUpperCase()}
//                   </span>
//                 </div>
//                 <VideoOff className={`${isInGrid && gridSize === 1 ? "w-8 h-8" : "w-5 h-5"} text-gray-500 mx-auto mb-2`} />
//                 <span className="text-gray-400 text-xs sm:text-sm">Camera off</span>
//               </div>
//             </div>
//           )}

//           {!participant.isYou && (
//             <div className="absolute bottom-3 left-3 flex items-center gap-2">
//               <Badge
//                 variant="secondary"
//                 className="bg-black/90 text-white text-xs font-medium border-0 backdrop-blur-md"
//               >
//                 {participant.name}
//                 {participant.isMuted ? (
//                   <MicOff className="w-3 h-3 ml-1 text-red-400" />
//                 ) : (
//                   <Mic className="w-3 h-3 ml-1 text-green-400" />
//                 )}
//               </Badge>
//               {participant.isHost && (
//                 <Badge className="bg-blue-600/90 text-white text-xs font-medium backdrop-blur-md">Host</Badge>
//               )}
//             </div>
//           )}

//           {participant.isYou && (
//             <div className="absolute bottom-3 left-3 flex items-center gap-2">
//               <Badge className="bg-blue-600/90 text-white text-xs font-medium backdrop-blur-md flex items-center">
//                 You
//                 {participant.isMuted ? (
//                   <MicOff className="w-3 h-3 ml-1 text-red-400" />
//                 ) : (
//                   <Mic className="w-3 h-3 ml-1 text-green-400" />
//                 )}
//               </Badge>
//             </div>
//           )}
//         </div>
//       );
//     },
//     [stream, error, isVideoOn, isMuted]
//   );

//   if (!isOpen) return null;

//   const otherParticipants = getOtherParticipants();
//   const selfParticipant = getSelfParticipant();
//   const totalParticipants = participants.length;

//   return (
//     <div className="fixed inset-0 z-50 bg-gray-950 transition-all duration-300">
//       <div className="absolute top-0 left-0 right-0 z-10 bg-black/60 backdrop-blur-md border-b border-gray-800/50">
//         <div className="flex items-center justify-between p-4">
//           <div className="flex items-center gap-4">
//             <Button
//               variant="ghost"
//               size="sm"
//               className="text-white hover:bg-white/20 font-medium"
//               onClick={handleEndCall}
//             >
//               <ArrowLeft className="w-4 h-4 mr-2" />
//               <span className="hidden sm:inline">Back</span>
//             </Button>
//             <div className="flex items-center gap-3">
//               <div className="flex items-center gap-2">
//                 <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-lg"></div>
//                 <span className="text-white text-sm font-semibold">{formatDuration(callDuration)}</span>
//               </div>
//               <Badge variant="secondary" className="bg-green-600/90 text-white font-medium">
//                 <Shield className="w-3 h-3 mr-1" />
//                 Secure
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
//               className="text-white hover:bg-white/20"
//               onClick={() => setLayoutMode(layoutMode === "spotlight" ? "grid" : "spotlight")}
//             >
//               <Grid3x3 className="w-4 h-4" />
//             </Button>
//             <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
//               <Copy className="w-4 h-4" />
//             </Button>
//             <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
//               <Settings className="w-4 h-4" />
//             </Button>
//           </div>
//         </div>
//       </div>

//       <div className="flex h-full pt-20 pb-24">
//         <div className="flex-1 relative p-4">
//           {layoutMode === "grid" ? (
//             <div
//               className={`h-full grid gap-4 transition-all duration-300 ${
//                 totalParticipants === 1
//                   ? "grid-cols-1"
//                   : totalParticipants === 2
//                   ? "grid-cols-1 md:grid-cols-2"
//                   : totalParticipants === 3
//                   ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
//                   : totalParticipants === 4
//                   ? "grid-cols-2"
//                   : totalParticipants <= 6
//                   ? "grid-cols-2 lg:grid-cols-3"
//                   : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
//               }`}
//             >
//               {participants.map((participant) => (
//                 <div
//                   key={participant.id}
//                   className="video-tile overflow-hidden bg-black border border-gray-600 shadow-2xl rounded-xl"
//                 >
//                   {renderParticipantVideo(participant, true, totalParticipants)}
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="h-full relative transition-all duration-300">
//               {otherParticipants.length === 1 ? (
//                 <div className="video-tile h-full overflow-hidden bg-black border border-gray-600 shadow-2xl rounded-xl">
//                   {renderParticipantVideo(otherParticipants[0], true, 1)}
//                 </div>
//               ) : (
//                 <div
//                   className={`h-full grid gap-3 ${
//                     otherParticipants.length === 2
//                       ? "grid-cols-1 lg:grid-cols-2"
//                       : otherParticipants.length === 3
//                       ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
//                       : otherParticipants.length === 4
//                       ? "grid-cols-2"
//                       : "grid-cols-2 lg:grid-cols-3"
//                   }`}
//                 >
//                   {otherParticipants.map((participant) => (
//                     <div
//                       key={participant.id}
//                       className="video-tile overflow-hidden bg-black border border-gray-600 shadow-2xl rounded-xl"
//                     >
//                       {renderParticipantVideo(participant, true, otherParticipants.length)}
//                     </div>
//                   ))}
//                 </div>
//               )}

//               {selfParticipant && (
//                 <div className="absolute bottom-4 right-4 w-40 sm:w-48 md:w-56 lg:w-64 h-28 sm:h-32 md:h-36 lg:h-40 z-10">
//                   <div className="video-tile h-full overflow-hidden bg-black border-2 border-blue-500/50 shadow-2xl rounded-xl ring-1 ring-blue-400/20">
//                     {renderParticipantVideo(selfParticipant, false)}
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-md border-t border-gray-800/50">
//         <div className="flex items-center justify-center p-6">
//           <div className="flex items-center gap-4">
//             <Button
//               size="lg"
//               className={cn(
//                 "w-14 h-14 rounded-full font-semibold transition-all duration-200 shadow-lg",
//                 isMuted
//                   ? "bg-red-600 hover:bg-red-700 text-white border-2 border-red-400"
//                   : "bg-gray-700 hover:bg-gray-600 text-white border-2 border-gray-500"
//               )}
//               onClick={() => setIsMuted(!isMuted)}
//             >
//               {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
//             </Button>

//             <Button
//               size="lg"
//               className={cn(
//                 "w-14 h-14 rounded-full font-semibold transition-all duration-200 shadow-lg",
//                 !isVideoOn
//                   ? "bg-red-600 hover:bg-red-700 text-white border-2 border-red-400"
//                   : "bg-gray-700 hover:bg-gray-600 text-white border-2 border-gray-500"
//               )}
//               onClick={() => setIsVideoOn(!isVideoOn)}
//             >
//               {isVideoOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
//             </Button>

//             <Button
//               size="lg"
//               className="w-14 h-14 rounded-full bg-gray-700 hover:bg-gray-600 text-white border-2 border-gray-500 transition-all duration-200 shadow-lg"
//             >
//               <MoreVertical className="w-6 h-6" />
//             </Button>

//             <Button
//               size="lg"
//               className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 text-white ml-6 font-semibold transition-all duration-200 shadow-lg border-2 border-red-400"
//               onClick={handleEndCall}
//             >
//               <Phone className="w-6 h-6" />
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




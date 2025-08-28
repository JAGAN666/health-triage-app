"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff,
  Settings,
  Monitor,
  Users,
  MessageSquare,
  Camera,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RotateCcw,
  AlertCircle,
  Wifi,
  WifiOff,
  Clock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface VideoCallProps {
  appointmentId: string;
  providerId: string;
  providerName: string;
  isProvider?: boolean;
  onCallEnd?: () => void;
}

interface CallState {
  isConnected: boolean;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  isScreenSharing: boolean;
  isMuted: boolean;
  connectionQuality: 'excellent' | 'good' | 'fair' | 'poor';
  callDuration: number;
  hasRemoteVideo: boolean;
  hasRemoteAudio: boolean;
}

export default function VideoCall({
  appointmentId,
  providerId,
  providerName,
  isProvider = false,
  onCallEnd
}: VideoCallProps) {
  const [callState, setCallState] = useState<CallState>({
    isConnected: false,
    isVideoEnabled: true,
    isAudioEnabled: true,
    isScreenSharing: false,
    isMuted: false,
    connectionQuality: 'good',
    callDuration: 0,
    hasRemoteVideo: false,
    hasRemoteAudio: false
  });

  const [isConnecting, setIsConnecting] = useState(true);
  const [error, setError] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{
    id: string;
    sender: string;
    message: string;
    timestamp: Date;
  }>>([]);
  const [newMessage, setNewMessage] = useState('');

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const callTimerRef = useRef<NodeJS.Timeout>();

  // Initialize WebRTC connection
  useEffect(() => {
    initializeCall();
    return () => {
      cleanup();
    };
  }, []);

  // Call duration timer
  useEffect(() => {
    if (callState.isConnected && !callTimerRef.current) {
      callTimerRef.current = setInterval(() => {
        setCallState(prev => ({
          ...prev,
          callDuration: prev.callDuration + 1
        }));
      }, 1000);
    }

    return () => {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
      }
    };
  }, [callState.isConnected]);

  const initializeCall = async () => {
    try {
      setError('');
      setIsConnecting(true);

      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Initialize peer connection
      const configuration = {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
        ]
      };

      const peerConnection = new RTCPeerConnection(configuration);
      peerConnectionRef.current = peerConnection;

      // Add local stream tracks to peer connection
      stream.getTracks().forEach(track => {
        peerConnection.addTrack(track, stream);
      });

      // Handle remote stream
      peerConnection.ontrack = (event) => {
        const [remoteStream] = event.streams;
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
        }
        
        setCallState(prev => ({
          ...prev,
          hasRemoteVideo: remoteStream.getVideoTracks().length > 0,
          hasRemoteAudio: remoteStream.getAudioTracks().length > 0
        }));
      };

      // Connection state monitoring
      peerConnection.onconnectionstatechange = () => {
        const state = peerConnection.connectionState;
        console.log('WebRTC connection state:', state);
        
        if (state === 'connected') {
          setIsConnecting(false);
          setCallState(prev => ({ ...prev, isConnected: true }));
        } else if (state === 'disconnected' || state === 'failed') {
          setError('Connection lost. Attempting to reconnect...');
          handleReconnect();
        }
      };

      // ICE connection state monitoring
      peerConnection.oniceconnectionstatechange = () => {
        const state = peerConnection.iceConnectionState;
        console.log('ICE connection state:', state);
        
        updateConnectionQuality(state);
      };

      // Simulate successful connection after a delay
      setTimeout(() => {
        setIsConnecting(false);
        setCallState(prev => ({ 
          ...prev, 
          isConnected: true,
          hasRemoteVideo: true,
          hasRemoteAudio: true 
        }));
        
        // Simulate remote video stream
        if (remoteVideoRef.current && !remoteVideoRef.current.srcObject) {
          // Create a mock remote stream for demo
          navigator.mediaDevices.getUserMedia({ video: true, audio: false })
            .then(mockStream => {
              if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = mockStream;
                // Flip the video to simulate remote user
                remoteVideoRef.current.style.transform = 'scaleX(-1)';
              }
            })
            .catch(console.error);
        }
      }, 3000);

    } catch (error) {
      console.error('Failed to initialize call:', error);
      setError('Failed to access camera and microphone. Please check permissions.');
      setIsConnecting(false);
    }
  };

  const updateConnectionQuality = (iceState: string) => {
    let quality: CallState['connectionQuality'] = 'good';
    
    switch (iceState) {
      case 'connected':
      case 'completed':
        quality = 'excellent';
        break;
      case 'checking':
        quality = 'good';
        break;
      case 'disconnected':
        quality = 'fair';
        break;
      case 'failed':
        quality = 'poor';
        break;
    }
    
    setCallState(prev => ({ ...prev, connectionQuality: quality }));
  };

  const handleReconnect = useCallback(() => {
    console.log('Attempting to reconnect...');
    // Implement reconnection logic here
    setTimeout(() => {
      if (peerConnectionRef.current?.connectionState === 'failed') {
        initializeCall();
      }
    }, 2000);
  }, []);

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !callState.isVideoEnabled;
        setCallState(prev => ({ ...prev, isVideoEnabled: !prev.isVideoEnabled }));
      }
    }
  };

  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !callState.isAudioEnabled;
        setCallState(prev => ({ ...prev, isAudioEnabled: !prev.isAudioEnabled }));
      }
    }
  };

  const toggleMute = () => {
    setCallState(prev => ({ ...prev, isMuted: !prev.isMuted }));
  };

  const startScreenShare = async () => {
    try {
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      });

      // Replace video track in peer connection
      const videoTrack = displayStream.getVideoTracks()[0];
      const sender = peerConnectionRef.current?.getSenders().find(s =>
        s.track && s.track.kind === 'video'
      );

      if (sender && videoTrack) {
        await sender.replaceTrack(videoTrack);
      }

      // Update local video
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = displayStream;
      }

      setCallState(prev => ({ ...prev, isScreenSharing: true }));

      // Handle screen share end
      videoTrack.onended = () => {
        stopScreenShare();
      };

    } catch (error) {
      console.error('Failed to start screen sharing:', error);
      setError('Failed to start screen sharing');
    }
  };

  const stopScreenShare = async () => {
    if (localStreamRef.current) {
      // Restore camera stream
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      const sender = peerConnectionRef.current?.getSenders().find(s =>
        s.track && s.track.kind === 'video'
      );

      if (sender && videoTrack) {
        await sender.replaceTrack(videoTrack);
      }

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStreamRef.current;
      }
    }

    setCallState(prev => ({ ...prev, isScreenSharing: false }));
  };

  const endCall = () => {
    cleanup();
    onCallEnd?.();
  };

  const cleanup = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }

    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now().toString(),
        sender: isProvider ? providerName : 'You',
        message: newMessage.trim(),
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, message]);
      setNewMessage('');
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getConnectionQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'fair': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getConnectionQualityIcon = (quality: string) => {
    return quality === 'poor' ? <WifiOff className="w-4 h-4" /> : <Wifi className="w-4 h-4" />;
  };

  if (isConnecting) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-black flex items-center justify-center z-50">
        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardContent className="p-8 text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 mx-auto mb-4"
            >
              <Video className="w-16 h-16 text-blue-400" />
            </motion.div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Connecting to {providerName}...
            </h3>
            <p className="text-blue-200">
              Please wait while we establish a secure connection
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error && !callState.isConnected) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-red-900 via-pink-900 to-black flex items-center justify-center z-50">
        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardContent className="p-8 text-center max-w-md">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Connection Failed
            </h3>
            <p className="text-red-200 mb-4">{error}</p>
            <div className="flex gap-3">
              <Button onClick={initializeCall} className="flex-1">
                <RotateCcw className="w-4 h-4 mr-2" />
                Retry
              </Button>
              <Button variant="outline" onClick={onCallEnd} className="flex-1">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 bg-black z-50 ${isFullscreen ? 'p-0' : ''}`}>
      {/* Main Video Area */}
      <div className="relative w-full h-full">
        {/* Remote Video */}
        <div className="w-full h-full relative">
          {callState.hasRemoteVideo ? (
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              muted={callState.isMuted}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
              <div className="text-center">
                <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">
                    {providerName.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <p className="text-white text-lg">{providerName}</p>
                <p className="text-gray-300">Video is off</p>
              </div>
            </div>
          )}

          {/* Local Video (Picture-in-Picture) */}
          <div className="absolute top-4 right-4 w-48 h-36 bg-black rounded-lg overflow-hidden border-2 border-white/20">
            {callState.isVideoEnabled ? (
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform scale-x-[-1]"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-800">
                <VideoOff className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>

          {/* Connection Status */}
          <div className="absolute top-4 left-4">
            <Badge className={`${getConnectionQualityColor(callState.connectionQuality)} bg-black/50 backdrop-blur-sm`}>
              {getConnectionQualityIcon(callState.connectionQuality)}
              <span className="ml-1 capitalize">{callState.connectionQuality}</span>
            </Badge>
          </div>

          {/* Call Duration */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
            <Badge className="bg-black/50 backdrop-blur-sm text-white">
              <Clock className="w-4 h-4 mr-1" />
              {formatDuration(callState.callDuration)}
            </Badge>
          </div>

          {/* Controls */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center gap-4 bg-black/80 backdrop-blur-sm rounded-full px-6 py-4">
              <Button
                variant={callState.isAudioEnabled ? "default" : "destructive"}
                size="lg"
                onClick={toggleAudio}
                className="rounded-full w-14 h-14"
              >
                {callState.isAudioEnabled ? (
                  <Mic className="w-6 h-6" />
                ) : (
                  <MicOff className="w-6 h-6" />
                )}
              </Button>

              <Button
                variant={callState.isVideoEnabled ? "default" : "destructive"}
                size="lg"
                onClick={toggleVideo}
                className="rounded-full w-14 h-14"
              >
                {callState.isVideoEnabled ? (
                  <Video className="w-6 h-6" />
                ) : (
                  <VideoOff className="w-6 h-6" />
                )}
              </Button>

              <Button
                variant="destructive"
                size="lg"
                onClick={endCall}
                className="rounded-full w-14 h-14"
              >
                <PhoneOff className="w-6 h-6" />
              </Button>

              <Button
                variant={callState.isScreenSharing ? "default" : "outline"}
                size="lg"
                onClick={callState.isScreenSharing ? stopScreenShare : startScreenShare}
                className="rounded-full w-14 h-14"
              >
                <Monitor className="w-6 h-6" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() => setShowChat(!showChat)}
                className="rounded-full w-14 h-14"
              >
                <MessageSquare className="w-6 h-6" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={toggleFullscreen}
                className="rounded-full w-14 h-14"
              >
                {isFullscreen ? (
                  <Minimize className="w-6 h-6" />
                ) : (
                  <Maximize className="w-6 h-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Chat Panel */}
        <AnimatePresence>
          {showChat && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="absolute top-0 right-0 w-80 h-full bg-white/95 backdrop-blur-sm border-l border-gray-200"
            >
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Chat</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowChat(false)}
                  >
                    ×
                  </Button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[calc(100%-140px)]">
                {chatMessages.map(msg => (
                  <div key={msg.id} className="text-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900">{msg.sender}</span>
                      <span className="text-xs text-gray-500">
                        {msg.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                    <p className="text-gray-700 bg-gray-100 rounded-lg px-3 py-2">
                      {msg.message}
                    </p>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <Button onClick={sendMessage} size="sm">
                    Send
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
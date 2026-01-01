import React, { useRef, useEffect, useState } from 'react';
import { ICONS, TRANSLATIONS } from '../constants';
import { Language } from '../types';

interface Props {
  onCapture: (imageSrc: string) => void;
  onClose: () => void;
  language: Language;
}

const CameraCapture: React.FC<Props> = ({ onCapture, onClose, language }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  const t = TRANSLATIONS[language];

  useEffect(() => {
    let currentStream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        currentStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        setStream(currentStream);
        if (videoRef.current) {
          videoRef.current.srcObject = currentStream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError(t.cameraPermission);
      }
    };

    startCamera();

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [t.cameraPermission]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageSrc = canvas.toDataURL('image/jpeg', 0.8);
        onCapture(imageSrc);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
      {error ? (
        <div className="text-white p-6 text-center">
          <ICONS.XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-lg">{error}</p>
          <button 
            onClick={onClose}
            className="mt-6 px-6 py-2 bg-white text-black rounded-full"
          >
            {t.backButton}
          </button>
        </div>
      ) : (
        <>
          <div className="relative w-full h-full max-w-md mx-auto flex flex-col">
             {/* Header */}
            <div className="absolute top-0 left-0 right-0 p-4 z-10 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent">
              <button onClick={onClose} className="text-white p-2 bg-white/20 backdrop-blur-sm rounded-full">
                <ICONS.ChevronLeft className="w-6 h-6" />
              </button>
            </div>

            {/* Video Feed */}
            <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
                <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    className="absolute min-w-full min-h-full object-cover"
                />
                <canvas ref={canvasRef} className="hidden" />
                
                {/* Guide Frame */}
                <div className="absolute inset-8 border-2 border-white/50 rounded-lg pointer-events-none">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-500 rounded-tl-lg"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-500 rounded-tr-lg"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-500 rounded-bl-lg"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-500 rounded-br-lg"></div>
                </div>
            </div>

            {/* Controls */}
            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent flex justify-center items-center pb-12">
               <button 
                onClick={handleCapture}
                className="w-20 h-20 rounded-full bg-white border-4 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-transform active:scale-95 flex items-center justify-center"
                aria-label="Capture"
               >
                 <div className="w-16 h-16 rounded-full bg-emerald-50"></div>
               </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CameraCapture;

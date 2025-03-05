
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface CameraCaptureProps {
  onCapture: (imageDataUrl: string) => void;
  onCancel: () => void;
}

export const CameraCapture = ({ onCapture, onCancel }: CameraCaptureProps) => {
  const { toast } = useToast();
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Start camera when component mounts
  useEffect(() => {
    startCamera();
    return () => {
      // Clean up on unmount
      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Effect to set video stream when videoRef is available
  useEffect(() => {
    if (videoRef.current && videoStream) {
      videoRef.current.srcObject = videoStream;
    }
  }, [videoStream]);

  // Function to start the camera
  const startCamera = async () => {
    try {
      // First stop any existing streams
      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
      }
      
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      setVideoStream(stream);
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast({
        title: "Camera Error",
        description: "Could not access your camera. Please check permissions.",
        variant: "destructive",
      });
      onCancel();
    }
  };

  // Function to take a picture
  const takePicture = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg");
        
        // Stop camera and send image
        if (videoStream) {
          videoStream.getTracks().forEach(track => track.stop());
        }
        
        onCapture(dataUrl);
      }
    }
  };

  return (
    <div className="relative">
      <video 
        ref={videoRef}
        autoPlay 
        playsInline
        className="w-full h-auto rounded-md border border-gray-300"
      />
      <div className="flex justify-center mt-2">
        <Button onClick={takePicture} className="mr-2">
          Take Photo
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

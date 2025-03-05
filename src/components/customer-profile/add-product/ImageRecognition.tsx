
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, Upload, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ProductInfo {
  model?: string | null;
  brand?: string | null;
  category?: string | null;
  imei?: string | null;
  sku?: string | null;
}

interface ImageRecognitionProps {
  onProductInfoDetected: (productInfo: ProductInfo) => void;
}

export const ImageRecognition = ({ onProductInfoDetected }: ImageRecognitionProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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
      setIsCameraActive(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast({
        title: "Camera Error",
        description: "Could not access your camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  // Effect to set video stream when videoRef is available
  useEffect(() => {
    if (videoRef.current && videoStream) {
      videoRef.current.srcObject = videoStream;
    }
  }, [videoStream, isCameraActive]);

  // Function to stop the camera
  const stopCamera = () => {
    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop());
      setVideoStream(null);
    }
    setIsCameraActive(false);
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
        setSelectedImage(dataUrl);
        stopCamera();
      }
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    try {
      // Convert dataURL to base64 string (remove the prefix)
      const base64Image = selectedImage.split(",")[1];

      const { data, error } = await supabase.functions.invoke('analyze-product-image', {
        body: { imageBase64: base64Image },
      });

      if (error) {
        throw error;
      }

      if (data.productInfo) {
        toast({
          title: "Analysis Complete",
          description: "Product information extracted successfully!",
        });
        onProductInfoDetected(data.productInfo);
      } else if (data.error) {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error("Error analyzing image:", error);
      toast({
        title: "Analysis Failed",
        description: "Could not extract product information from the image.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetImage = () => {
    setSelectedImage(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        {isCameraActive ? (
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
              <Button variant="outline" onClick={stopCamera}>
                Cancel
              </Button>
            </div>
          </div>
        ) : selectedImage ? (
          <div className="space-y-2">
            <div className="relative">
              <img 
                src={selectedImage} 
                alt="Selected product" 
                className="w-full h-auto rounded-md border border-gray-300"
              />
              <Button
                variant="outline"
                size="sm"
                className="absolute top-2 right-2"
                onClick={resetImage}
              >
                Reset
              </Button>
            </div>
            <div className="flex justify-center mt-2">
              <Button 
                onClick={analyzeImage} 
                disabled={isAnalyzing}
                className="w-full"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Analyze Image"
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="border border-dashed border-gray-300 rounded-md p-8 text-center">
              <p className="text-gray-500 mb-4">Take or upload a photo of the product</p>
              <div className="flex flex-col sm:flex-row justify-center gap-2">
                <Button variant="outline" onClick={startCamera} className="flex items-center">
                  <Camera className="mr-2 h-4 w-4" />
                  Open Camera
                </Button>
                <label htmlFor="product-image" className="cursor-pointer">
                  <Button variant="outline" className="flex items-center w-full" asChild>
                    <div>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Image
                      <Input
                        id="product-image"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>
                  </Button>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

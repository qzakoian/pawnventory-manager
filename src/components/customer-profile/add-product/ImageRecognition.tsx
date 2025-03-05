
import { useState } from "react";
import { CameraCapture } from "./CameraCapture";
import { ImagePreview } from "./ImagePreview";
import { ImageUpload } from "./ImageUpload";
import { ProductInfo } from "@/types/customer";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ImageRecognitionProps {
  onProductInfoDetected: (productInfo: ProductInfo) => void;
}

export const ImageRecognition = ({ onProductInfoDetected }: ImageRecognitionProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const { toast } = useToast();

  const handleStartCamera = () => {
    setIsCameraActive(true);
  };

  const handleCameraCancel = () => {
    setIsCameraActive(false);
  };

  const handleImageCapture = (imageDataUrl: string) => {
    setSelectedImage(imageDataUrl);
    setIsCameraActive(false);
  };

  const resetImage = () => {
    setSelectedImage(null);
  };

  return (
    <div className="space-y-4">
      <Alert variant="warning" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          AI analysis may be unavailable due to service limits. If analysis fails, please use manual entry.
        </AlertDescription>
      </Alert>
      
      <div className="flex flex-col gap-4">
        {isCameraActive ? (
          <CameraCapture 
            onCapture={handleImageCapture}
            onCancel={handleCameraCancel}
          />
        ) : selectedImage ? (
          <ImagePreview 
            imageSrc={selectedImage}
            onReset={resetImage}
            onProductInfoDetected={onProductInfoDetected}
          />
        ) : (
          <ImageUpload 
            onStartCamera={handleStartCamera}
            onImageSelected={setSelectedImage}
          />
        )}
      </div>
    </div>
  );
};

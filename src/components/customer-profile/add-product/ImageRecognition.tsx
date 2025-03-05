
import { useState } from "react";
import { CameraCapture } from "./CameraCapture";
import { ImagePreview } from "./ImagePreview";
import { ImageUpload } from "./ImageUpload";
import { ProductInfo } from "./utils/productImageUtils";

interface ImageRecognitionProps {
  onProductInfoDetected: (productInfo: ProductInfo) => void;
}

export const ImageRecognition = ({ onProductInfoDetected }: ImageRecognitionProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

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


import { ProductInfo } from "@/types/customer";
import { ImageRecognition } from "./ImageRecognition";

interface AIDetectionTabProps {
  onProductInfoDetected: (productInfo: ProductInfo) => void;
}

export const AIDetectionTab = ({ onProductInfoDetected }: AIDetectionTabProps) => {
  return (
    <div className="space-y-4">
      <ImageRecognition onProductInfoDetected={onProductInfoDetected} />
    </div>
  );
};

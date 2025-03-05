
import { Camera, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ImageUploadProps {
  onStartCamera: () => void;
  onImageSelected: (imageDataUrl: string) => void;
}

export const ImageUpload = ({ onStartCamera, onImageSelected }: ImageUploadProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        onImageSelected(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="border border-dashed border-gray-300 rounded-md p-8 text-center">
      <p className="text-gray-500 mb-4">Take or upload a photo of the product</p>
      <div className="flex flex-col sm:flex-row justify-center gap-2">
        <Button variant="outline" onClick={onStartCamera} className="flex items-center">
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
  );
};

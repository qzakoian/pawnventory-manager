
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download } from "lucide-react";

interface UploadStepProps {
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading: boolean;
  onDownloadTemplate: () => void;
}

export function UploadStep({ onFileUpload, isUploading, onDownloadTemplate }: UploadStepProps) {
  return (
    <>
      <p className="text-sm text-muted-foreground">
        Upload a CSV file containing your customer data. You'll be able to map your columns to our required fields in the next step.
      </p>
      <div className="flex justify-between items-center gap-4">
        <Input
          type="file"
          accept=".csv"
          onChange={onFileUpload}
          disabled={isUploading}
        />
        <Button
          variant="outline"
          size="sm"
          onClick={onDownloadTemplate}
          className="whitespace-nowrap"
        >
          <Download className="mr-2 h-4 w-4" />
          Download Template
        </Button>
      </div>
      <div className="text-sm text-muted-foreground">
        <p>Required fields:</p>
        <ul className="list-disc list-inside">
          <li>Last Name</li>
        </ul>
      </div>
    </>
  );
}

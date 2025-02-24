
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, UserCircle } from "lucide-react";

interface UploadStepProps {
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading: boolean;
  onDownloadTemplate: () => void;
  onDownloadCustomers: () => void;
}

export function UploadStep({
  onFileUpload,
  isUploading,
  onDownloadTemplate,
  onDownloadCustomers
}: UploadStepProps) {
  return (
    <>
      <p className="text-sm text-muted-foreground">
        Upload a CSV file containing your product data. You'll be able to map your columns to our required fields in the next step.
      </p>
      <div className="flex justify-between items-center gap-4">
        <Input
          type="file"
          accept=".csv"
          onChange={onFileUpload}
          disabled={isUploading}
        />
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onDownloadCustomers}
            className="whitespace-nowrap"
          >
            <UserCircle className="mr-2 h-4 w-4" />
            Download Customers List
          </Button>
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
      </div>
      <div className="text-sm text-muted-foreground">
        <p>Required fields:</p>
        <ul className="list-disc list-inside">
          <li>Model</li>
        </ul>
      </div>
    </>
  );
}

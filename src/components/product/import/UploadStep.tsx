
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
      <p className="text-sm text-muted-foreground mt-2">
        If you want to link products with existing customers, first download your customers list to get their IDs:
      </p>
      <Button
        variant="outline"
        size="sm"
        onClick={onDownloadCustomers}
        className="mt-2"
      >
        <UserCircle className="mr-2 h-4 w-4" />
        Download Customers List
      </Button>
      <div className="flex justify-between items-center gap-4 mt-4">
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
      <div className="text-sm text-muted-foreground mt-4">
        <p>Required fields:</p>
        <ul className="list-disc list-inside">
          <li>Model</li>
        </ul>
      </div>
    </>
  );
}


import { LoadingStateProps, ErrorStateProps } from "./types";

export const LoadingState = ({ message = "Loading..." }: LoadingStateProps) => (
  <div className="min-h-screen bg-white p-6">
    <div className="max-w-7xl mx-auto">{message}</div>
  </div>
);

export const ErrorState = ({ message = "Product not found" }: ErrorStateProps) => (
  <div className="min-h-screen bg-white p-6">
    <div className="max-w-7xl mx-auto">{message}</div>
  </div>
);

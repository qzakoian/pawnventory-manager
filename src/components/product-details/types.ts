
import { Customer, Product } from "@/types/customer";

export interface ProductUpdateData {
  customerId: number | null;
}

export interface ProductDetailsHeaderProps {
  onBackClick: () => void;
  productName: string | null;
}

export interface LoadingStateProps {
  message?: string;
}

export interface ErrorStateProps {
  message?: string;
}

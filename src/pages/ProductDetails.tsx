
import { useParams, useNavigate } from "react-router-dom";
import { ProductDetailsHeader } from "@/components/product-details/ProductDetailsHeader";
import { LoadingState, ErrorState } from "@/components/product-details/StateComponents";
import { useProductData } from "@/components/product-details/hooks/useProductData";
import { ProductDetailsCard } from "@/components/product/ProductDetailsCard";
import { CustomerDetailsCard } from "@/components/product/CustomerDetailsCard";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const productId = id ? parseInt(id) : null;
  
  const { 
    product, 
    customers, 
    isLoadingProduct, 
    isLoadingCustomers, 
    updateCustomer 
  } = useProductData(productId);

  if (isLoadingProduct) {
    return <LoadingState />;
  }

  if (!product) {
    return <ErrorState />;
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="px-6 py-8 max-w-7xl mx-auto space-y-8">
        <ProductDetailsHeader 
          onBackClick={() => navigate('/products')} 
          productName={product.model} 
        />

        <div className="space-y-6">
          <CustomerDetailsCard 
            customers={customers || []} 
            selectedCustomer={product.customer} 
            isLoadingCustomers={isLoadingCustomers} 
            onCustomerUpdate={updateCustomer} 
          />
          <ProductDetailsCard product={product} />
        </div>
      </main>
    </div>
  );
};

export default ProductDetails;

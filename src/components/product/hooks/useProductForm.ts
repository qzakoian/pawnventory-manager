
import { useState, useEffect } from "react";
import { Product } from "@/types/customer";

export const useProductForm = (product: Product) => {
  const [model, setModel] = useState(product.model || "");
  const [category, setCategory] = useState(product.product_category || "");
  const [imei, setImei] = useState(product.imei || "");
  const [sku, setSku] = useState(product.sku || "");
  const [scheme, setScheme] = useState(product.scheme || "");
  const [purchaseDate, setPurchaseDate] = useState(
    product.purchase_date ? new Date(product.purchase_date).toISOString().split('T')[0] : ""
  );
  const [purchasePrice, setPurchasePrice] = useState(product.purchase_price_including_VAT || 0);
  const [buybackRate, setBuybackRate] = useState<number>(
    product[`${product.scheme}_rate`] || 0
  );
  const [buybackPrice, setBuybackPrice] = useState<number>(
    product[`${product.scheme}_price`] || 0
  );

  useEffect(() => {
    if (purchasePrice && buybackRate) {
      const interest = (purchasePrice * buybackRate) / 100;
      const calculatedPrice = purchasePrice + interest;
      setBuybackPrice(calculatedPrice);
    }
  }, [purchasePrice, buybackRate]);

  useEffect(() => {
    if (purchasePrice && buybackPrice) {
      const difference = buybackPrice - purchasePrice;
      const calculatedRate = (difference / purchasePrice) * 100;
      setBuybackRate(calculatedRate);
    }
  }, [purchasePrice, buybackPrice]);

  return {
    model,
    setModel,
    category,
    setCategory,
    imei,
    setImei,
    sku,
    setSku,
    scheme,
    setScheme,
    purchaseDate,
    setPurchaseDate,
    purchasePrice,
    setPurchasePrice,
    buybackRate,
    setBuybackRate,
    buybackPrice,
    setBuybackPrice,
  };
};

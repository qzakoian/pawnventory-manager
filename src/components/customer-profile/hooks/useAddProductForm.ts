
import { useState, useEffect } from "react";
import { NewProduct } from "@/types/customer";
import { supabase } from "@/integrations/supabase/client";

export const useAddProductForm = () => {
  const [newProduct, setNewProduct] = useState<NewProduct>({
    model: "",
    brand: "",
    product_category: "",
    scheme: "buy-back",
    purchase_price_including_VAT: 0,
    purchase_date: new Date().toISOString().split('T')[0],
  });

  const [buybackRate, setBuybackRate] = useState<number>(0);
  const [buybackPrice, setBuybackPrice] = useState<number>(0);
  const [imei, setImei] = useState<string>("");
  const [sku, setSku] = useState<string>("");
  const [brands, setBrands] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>("manual");

  useEffect(() => {
    const fetchBrands = async () => {
      const { data } = await supabase
        .from('Brands')
        .select('name')
        .order('name');
      
      if (data) {
        setBrands(data.map(brand => brand.name || "").filter(Boolean));
      }
    };

    fetchBrands();
  }, []);

  const generateRandomIMEI = async () => {
    const { data, error } = await supabase.rpc('generate_random_imei');
    if (!error && data) {
      setImei(data);
    }
  };

  const generateRandomSKU = async () => {
    const { data, error } = await supabase.rpc('generate_random_sku');
    if (!error && data) {
      setSku(data);
    }
  };

  const resetForm = () => {
    setNewProduct({
      model: "",
      brand: "",
      product_category: "",
      scheme: "buy-back",
      purchase_price_including_VAT: 0,
      purchase_date: new Date().toISOString().split('T')[0],
    });
    setBuybackRate(0);
    setBuybackPrice(0);
    setImei("");
    setSku("");
    setActiveTab("manual");
  };

  return {
    newProduct,
    setNewProduct,
    buybackRate,
    setBuybackRate,
    buybackPrice,
    setBuybackPrice,
    imei,
    setImei,
    sku,
    setSku,
    brands,
    activeTab,
    setActiveTab,
    generateRandomIMEI,
    generateRandomSKU,
    resetForm,
  };
};

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      Brands: {
        Row: {
          created_at: string | null
          id: number
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          name: string
        }
        Update: {
          created_at?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      CashInputs: {
        Row: {
          created_at: string
          id: number
          input_amount: number | null
          input_date: string | null
          shop_id: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          input_amount?: number | null
          input_date?: string | null
          shop_id?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          input_amount?: number | null
          input_date?: string | null
          shop_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "CashInputs_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "Shops"
            referencedColumns: ["id"]
          },
        ]
      }
      Customers: {
        Row: {
          address_line1: string | null
          address_line2: string | null
          city: string | null
          company_name: string | null
          county: string | null
          created_at: string
          customer_type: string | null
          email: string | null
          first_name: string | null
          gender: string | null
          id: number
          last_name: string | null
          phone_number: string | null
          postal_code: string | null
          shop_id: number | null
          vat_number: string | null
        }
        Insert: {
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          company_name?: string | null
          county?: string | null
          created_at?: string
          customer_type?: string | null
          email?: string | null
          first_name?: string | null
          gender?: string | null
          id?: number
          last_name?: string | null
          phone_number?: string | null
          postal_code?: string | null
          shop_id?: number | null
          vat_number?: string | null
        }
        Update: {
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          company_name?: string | null
          county?: string | null
          created_at?: string
          customer_type?: string | null
          email?: string | null
          first_name?: string | null
          gender?: string | null
          id?: number
          last_name?: string | null
          phone_number?: string | null
          postal_code?: string | null
          shop_id?: number | null
          vat_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Customers_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "Shops"
            referencedColumns: ["id"]
          },
        ]
      }
      "Product Categories": {
        Row: {
          created_at: string
          id: number
          name: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          name?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      "Product Schemes": {
        Row: {
          created_at: string
          id: number
          name: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          name?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      Products: {
        Row: {
          "12-week-buy-back_price": number | null
          "12-week-buy-back_rate": number | null
          "28-day-buy-back_price": number | null
          "28-day-buy-back_rate": number | null
          brand: string | null
          creation_date: string | null
          customer_id: number | null
          id: number
          imei: string | null
          in_stock: boolean | null
          model: string | null
          photo_url: string | null
          product_category: string | null
          profit: number | null
          purchase_date: string | null
          purchase_price_including_VAT: number | null
          sale_date: string | null
          sale_payment_method: string | null
          sale_price_including_VAT: number | null
          scheme: string | null
          shop_id: number | null
          sku: string | null
        }
        Insert: {
          "12-week-buy-back_price"?: number | null
          "12-week-buy-back_rate"?: number | null
          "28-day-buy-back_price"?: number | null
          "28-day-buy-back_rate"?: number | null
          brand?: string | null
          creation_date?: string | null
          customer_id?: number | null
          id?: number
          imei?: string | null
          in_stock?: boolean | null
          model?: string | null
          photo_url?: string | null
          product_category?: string | null
          profit?: number | null
          purchase_date?: string | null
          purchase_price_including_VAT?: number | null
          sale_date?: string | null
          sale_payment_method?: string | null
          sale_price_including_VAT?: number | null
          scheme?: string | null
          shop_id?: number | null
          sku?: string | null
        }
        Update: {
          "12-week-buy-back_price"?: number | null
          "12-week-buy-back_rate"?: number | null
          "28-day-buy-back_price"?: number | null
          "28-day-buy-back_rate"?: number | null
          brand?: string | null
          creation_date?: string | null
          customer_id?: number | null
          id?: number
          imei?: string | null
          in_stock?: boolean | null
          model?: string | null
          photo_url?: string | null
          product_category?: string | null
          profit?: number | null
          purchase_date?: string | null
          purchase_price_including_VAT?: number | null
          sale_date?: string | null
          sale_payment_method?: string | null
          sale_price_including_VAT?: number | null
          scheme?: string | null
          shop_id?: number | null
          sku?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_brand_fkey"
            columns: ["brand"]
            isOneToOne: false
            referencedRelation: "Brands"
            referencedColumns: ["name"]
          },
          {
            foreignKeyName: "Products_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "Customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Products_product category_fkey"
            columns: ["product_category"]
            isOneToOne: false
            referencedRelation: "Product Categories"
            referencedColumns: ["name"]
          },
          {
            foreignKeyName: "Products_scheme_fkey"
            columns: ["scheme"]
            isOneToOne: false
            referencedRelation: "Product Schemes"
            referencedColumns: ["name"]
          },
          {
            foreignKeyName: "Products_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "Shops"
            referencedColumns: ["id"]
          },
        ]
      }
      Shops: {
        Row: {
          created_at: string
          id: number
          name: string | null
          profile_picture: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          name?: string | null
          profile_picture?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          name?: string | null
          profile_picture?: string | null
        }
        Relationships: []
      }
      "User-Shop links": {
        Row: {
          access_type: Database["public"]["Enums"]["shop_access_type"]
          created_at: string
          id: number
          shop_id: number | null
          user_id: string | null
        }
        Insert: {
          access_type?: Database["public"]["Enums"]["shop_access_type"]
          created_at?: string
          id?: number
          shop_id?: number | null
          user_id?: string | null
        }
        Update: {
          access_type?: Database["public"]["Enums"]["shop_access_type"]
          created_at?: string
          id?: number
          shop_id?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "User-Shop links_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "Shops"
            referencedColumns: ["id"]
          },
        ]
      }
      Users: {
        Row: {
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          plan_id: string | null
          profil_picture: string | null
          shop_id: number | null
          subscription_status: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          plan_id?: string | null
          profil_picture?: string | null
          shop_id?: number | null
          subscription_status?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          plan_id?: string | null
          profil_picture?: string | null
          shop_id?: number | null
          subscription_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Users_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "Shops"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_random_imei: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_random_sku: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      shop_access_type: "owner" | "admin" | "staff"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

/* eslint-disable no-unused-vars */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      admins: {
        Row: {
          avatar: string | null;
          confirmed: boolean | null;
          created_at: string;
          email: string | null;
          firstName: string | null;
          id: string;
          lastName: string | null;
          role: string | null;
        };
        Insert: {
          avatar?: string | null;
          confirmed?: boolean | null;
          created_at?: string;
          email?: string | null;
          firstName?: string | null;
          id: string;
          lastName?: string | null;
          role?: string | null;
        };
        Update: {
          avatar?: string | null;
          confirmed?: boolean | null;
          created_at?: string;
          email?: string | null;
          firstName?: string | null;
          id?: string;
          lastName?: string | null;
          role?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "admin_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      coupons: {
        Row: {
          code: string | null;
          created_at: string;
          createdBy: Json | null;
          description: string | null;
          endDate: string | null;
          id: string;
          limit: number | null;
          minimumPurchaseAmount: number | null;
          numberOfTimesUsed: number | null;
          productCategory: string | null;
          productType: string | null;
          startDate: string | null;
          status: string | null;
          targetAudience: string[] | null;
          type: string | null;
          usageCount: number | null;
          value: number | null;
        };
        Insert: {
          code?: string | null;
          created_at?: string;
          createdBy?: Json | null;
          description?: string | null;
          endDate?: string | null;
          id?: string;
          limit?: number | null;
          minimumPurchaseAmount?: number | null;
          numberOfTimesUsed?: number | null;
          productCategory?: string | null;
          productType?: string | null;
          startDate?: string | null;
          status?: string | null;
          targetAudience?: string[] | null;
          type?: string | null;
          usageCount?: number | null;
          value?: number | null;
        };
        Update: {
          code?: string | null;
          created_at?: string;
          createdBy?: Json | null;
          description?: string | null;
          endDate?: string | null;
          id?: string;
          limit?: number | null;
          minimumPurchaseAmount?: number | null;
          numberOfTimesUsed?: number | null;
          productCategory?: string | null;
          productType?: string | null;
          startDate?: string | null;
          status?: string | null;
          targetAudience?: string[] | null;
          type?: string | null;
          usageCount?: number | null;
          value?: number | null;
        };
        Relationships: [];
      };
      "custom-orders": {
        Row: {
          created_at: string;
          deliveryDetails: Json | null;
          deliveryFee: number | null;
          deliveryType: string | null;
          estimatedFulfillmentDate: string | null;
          id: string;
          itemTypes: string[] | null;
          orderDetails: Json | null;
          orderId: string;
          paymentType: string | null;
          status: string | null;
          totalAmount: number | null;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          deliveryDetails?: Json | null;
          deliveryFee?: number | null;
          deliveryType?: string | null;
          estimatedFulfillmentDate?: string | null;
          id?: string;
          itemTypes?: string[] | null;
          orderDetails?: Json | null;
          orderId: string;
          paymentType?: string | null;
          status?: string | null;
          totalAmount?: number | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          deliveryDetails?: Json | null;
          deliveryFee?: number | null;
          deliveryType?: string | null;
          estimatedFulfillmentDate?: string | null;
          id?: string;
          itemTypes?: string[] | null;
          orderDetails?: Json | null;
          orderId?: string;
          paymentType?: string | null;
          status?: string | null;
          totalAmount?: number | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      feedbacks: {
        Row: {
          created_at: string;
          id: number;
        };
        Insert: {
          created_at?: string;
          id?: number;
        };
        Update: {
          created_at?: string;
          id?: number;
        };
        Relationships: [];
      };
      inbox: {
        Row: {
          content: string | null;
          created_at: string;
          createdBy: Json | null;
          id: string;
          status: string | null;
          userId: string | null;
        };
        Insert: {
          content?: string | null;
          created_at?: string;
          createdBy?: Json | null;
          id?: string;
          status?: string | null;
          userId?: string | null;
        };
        Update: {
          content?: string | null;
          created_at?: string;
          createdBy?: Json | null;
          id?: string;
          status?: string | null;
          userId?: string | null;
        };
        Relationships: [];
      };
      "invoice-requests": {
        Row: {
          created_at: string;
          description: string | null;
          email: string | null;
          id: number;
          name: string | null;
          phone: string | null;
          receptionMedium: string | null;
          receptionValue: string | null;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          email?: string | null;
          id?: number;
          name?: string | null;
          phone?: string | null;
          receptionMedium?: string | null;
          receptionValue?: string | null;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          email?: string | null;
          id?: number;
          name?: string | null;
          phone?: string | null;
          receptionMedium?: string | null;
          receptionValue?: string | null;
        };
        Relationships: [];
      };
      messages: {
        Row: {
          content: string | null;
          created_at: string;
          id: number;
          metadata: Json | null;
          source: string | null;
          status: string | null;
          subject: string | null;
        };
        Insert: {
          content?: string | null;
          created_at?: string;
          id?: number;
          metadata?: Json | null;
          source?: string | null;
          status?: string | null;
          subject?: string | null;
        };
        Update: {
          content?: string | null;
          created_at?: string;
          id?: number;
          metadata?: Json | null;
          source?: string | null;
          status?: string | null;
          subject?: string | null;
        };
        Relationships: [];
      };
      "order-cancellation-requests": {
        Row: {
          created_at: string;
          id: string;
          order_id: string | null;
          reason: string | null;
          status: string | null;
          user_id: string | null;
          userConfirmation: string | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          order_id?: string | null;
          reason?: string | null;
          status?: string | null;
          user_id?: string | null;
          userConfirmation?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          order_id?: string | null;
          reason?: string | null;
          status?: string | null;
          user_id?: string | null;
          userConfirmation?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "public_order-cancellation-requests_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
        ];
      };
      orders: {
        Row: {
          coupon_id: string | null;
          created_at: string;
          deliveryDetails: Json | null;
          deliveryFee: number | null;
          deliveryType: string | null;
          estimatedFulfillmentDate: string | null;
          id: string;
          items: Json[] | null;
          note: string | null;
          orderId: string;
          paymentType: string | null;
          reference: string | null;
          status: string | null;
          totalAmount: number | null;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          coupon_id?: string | null;
          created_at?: string;
          deliveryDetails?: Json | null;
          deliveryFee?: number | null;
          deliveryType?: string | null;
          estimatedFulfillmentDate?: string | null;
          id?: string;
          items?: Json[] | null;
          note?: string | null;
          orderId?: string;
          paymentType?: string | null;
          reference?: string | null;
          status?: string | null;
          totalAmount?: number | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          coupon_id?: string | null;
          created_at?: string;
          deliveryDetails?: Json | null;
          deliveryFee?: number | null;
          deliveryType?: string | null;
          estimatedFulfillmentDate?: string | null;
          id?: string;
          items?: Json[] | null;
          note?: string | null;
          orderId?: string;
          paymentType?: string | null;
          reference?: string | null;
          status?: string | null;
          totalAmount?: number | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "public_orders_coupon_id_fkey";
            columns: ["coupon_id"];
            isOneToOne: false;
            referencedRelation: "coupons";
            referencedColumns: ["id"];
          },
        ];
      };
      quotes: {
        Row: {
          clientName: string | null;
          contact: string | null;
          created_at: string;
          dueDate: string | null;
          email: string | null;
          id: string;
          items: Json[] | null;
          numberOfReactivationRequested: number | null;
          numberOfRevisionsRequested: number | null;
          order_id: string | null;
          quoteNumber: number | null;
          reactivationReasons: string[] | null;
          requestPayment: boolean | null;
          revisionReasons: string[] | null;
          status: string | null;
          title: string | null;
          totalAmount: number | null;
          updated_at: string | null;
        };
        Insert: {
          clientName?: string | null;
          contact?: string | null;
          created_at?: string;
          dueDate?: string | null;
          email?: string | null;
          id?: string;
          items?: Json[] | null;
          numberOfReactivationRequested?: number | null;
          numberOfRevisionsRequested?: number | null;
          order_id?: string | null;
          quoteNumber?: number | null;
          reactivationReasons?: string[] | null;
          requestPayment?: boolean | null;
          revisionReasons?: string[] | null;
          status?: string | null;
          title?: string | null;
          totalAmount?: number | null;
          updated_at?: string | null;
        };
        Update: {
          clientName?: string | null;
          contact?: string | null;
          created_at?: string;
          dueDate?: string | null;
          email?: string | null;
          id?: string;
          items?: Json[] | null;
          numberOfReactivationRequested?: number | null;
          numberOfRevisionsRequested?: number | null;
          order_id?: string | null;
          quoteNumber?: number | null;
          reactivationReasons?: string[] | null;
          requestPayment?: boolean | null;
          revisionReasons?: string[] | null;
          status?: string | null;
          title?: string | null;
          totalAmount?: number | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "quotes_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "custom-orders";
            referencedColumns: ["id"];
          },
        ];
      };
      reviews: {
        Row: {
          created_at: string;
          id: number;
        };
        Insert: {
          created_at?: string;
          id?: number;
        };
        Update: {
          created_at?: string;
          id?: number;
        };
        Relationships: [];
      };
      rolesPermissions: {
        Row: {
          created_at: string;
          id: string;
          permissions: string[] | null;
          role: string | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          permissions?: string[] | null;
          role?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          permissions?: string[] | null;
          role?: string | null;
        };
        Relationships: [];
      };
      "shipping-addresses": {
        Row: {
          address: string | null;
          contactName: string | null;
          country: string | null;
          created_at: string;
          email: string | null;
          id: string;
          phone1: string | null;
          phone2: string | null;
          region: string | null;
          town: string | null;
          user_id: string | null;
        };
        Insert: {
          address?: string | null;
          contactName?: string | null;
          country?: string | null;
          created_at?: string;
          email?: string | null;
          id?: string;
          phone1?: string | null;
          phone2?: string | null;
          region?: string | null;
          town?: string | null;
          user_id?: string | null;
        };
        Update: {
          address?: string | null;
          contactName?: string | null;
          country?: string | null;
          created_at?: string;
          email?: string | null;
          id?: string;
          phone1?: string | null;
          phone2?: string | null;
          region?: string | null;
          town?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "shipping-addresses_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      users: {
        Row: {
          confirmed: boolean | null;
          country: string | null;
          created_at: string;
          dateOfBirth: string | null;
          email: string;
          firstName: string | null;
          gender: string | null;
          id: string;
          lastName: string | null;
          phone: string | null;
          profileImage: string | null;
          provider: string | null;
          region: string | null;
          requestedConfirmLinkNumberOfTimes: number | null;
        };
        Insert: {
          confirmed?: boolean | null;
          country?: string | null;
          created_at?: string;
          dateOfBirth?: string | null;
          email: string;
          firstName?: string | null;
          gender?: string | null;
          id: string;
          lastName?: string | null;
          phone?: string | null;
          profileImage?: string | null;
          provider?: string | null;
          region?: string | null;
          requestedConfirmLinkNumberOfTimes?: number | null;
        };
        Update: {
          confirmed?: boolean | null;
          country?: string | null;
          created_at?: string;
          dateOfBirth?: string | null;
          email?: string;
          firstName?: string | null;
          gender?: string | null;
          id?: string;
          lastName?: string | null;
          phone?: string | null;
          profileImage?: string | null;
          provider?: string | null;
          region?: string | null;
          requestedConfirmLinkNumberOfTimes?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "users_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

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
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

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
    : never;

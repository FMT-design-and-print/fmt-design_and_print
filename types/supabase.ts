export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      admins: {
        Row: {
          avatar: string | null
          confirmed: boolean | null
          created_at: string
          email: string | null
          firstName: string | null
          id: string
          lastName: string | null
          role: string | null
        }
        Insert: {
          avatar?: string | null
          confirmed?: boolean | null
          created_at?: string
          email?: string | null
          firstName?: string | null
          id: string
          lastName?: string | null
          role?: string | null
        }
        Update: {
          avatar?: string | null
          confirmed?: boolean | null
          created_at?: string
          email?: string | null
          firstName?: string | null
          id?: string
          lastName?: string | null
          role?: string | null
        }
        Relationships: []
      }
      coupons: {
        Row: {
          code: string | null
          created_at: string
          createdBy: Json | null
          description: string | null
          endDate: string | null
          id: string
          limit: number | null
          minimumPurchaseAmount: number | null
          numberOfTimesUsed: number | null
          productCategory: string | null
          productType: string | null
          startDate: string | null
          status: string | null
          targetAudience: string[] | null
          type: string | null
          usageCount: number | null
          value: number | null
        }
        Insert: {
          code?: string | null
          created_at?: string
          createdBy?: Json | null
          description?: string | null
          endDate?: string | null
          id?: string
          limit?: number | null
          minimumPurchaseAmount?: number | null
          numberOfTimesUsed?: number | null
          productCategory?: string | null
          productType?: string | null
          startDate?: string | null
          status?: string | null
          targetAudience?: string[] | null
          type?: string | null
          usageCount?: number | null
          value?: number | null
        }
        Update: {
          code?: string | null
          created_at?: string
          createdBy?: Json | null
          description?: string | null
          endDate?: string | null
          id?: string
          limit?: number | null
          minimumPurchaseAmount?: number | null
          numberOfTimesUsed?: number | null
          productCategory?: string | null
          productType?: string | null
          startDate?: string | null
          status?: string | null
          targetAudience?: string[] | null
          type?: string | null
          usageCount?: number | null
          value?: number | null
        }
        Relationships: []
      }
      "custom-orders": {
        Row: {
          contactName: string | null
          created_at: string
          deliveryDetails: Json | null
          deliveryFee: number | null
          deliveryType: string | null
          email: string | null
          estimatedFulfillmentDate: string | null
          id: string
          itemTypes: string[] | null
          orderDetails: Json | null
          orderId: string
          paymentStatus: string | null
          paymentType: string | null
          phone: string | null
          status: string | null
          totalAmount: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          contactName?: string | null
          created_at?: string
          deliveryDetails?: Json | null
          deliveryFee?: number | null
          deliveryType?: string | null
          email?: string | null
          estimatedFulfillmentDate?: string | null
          id?: string
          itemTypes?: string[] | null
          orderDetails?: Json | null
          orderId: string
          paymentStatus?: string | null
          paymentType?: string | null
          phone?: string | null
          status?: string | null
          totalAmount?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          contactName?: string | null
          created_at?: string
          deliveryDetails?: Json | null
          deliveryFee?: number | null
          deliveryType?: string | null
          email?: string | null
          estimatedFulfillmentDate?: string | null
          id?: string
          itemTypes?: string[] | null
          orderDetails?: Json | null
          orderId?: string
          paymentStatus?: string | null
          paymentType?: string | null
          phone?: string | null
          status?: string | null
          totalAmount?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number | null
          approver: string | null
          created_at: string
          createdBy: Json | null
          description: string | null
          id: string
          notes: string | null
          paymentMethods: string[] | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          amount?: number | null
          approver?: string | null
          created_at?: string
          createdBy?: Json | null
          description?: string | null
          id?: string
          notes?: string | null
          paymentMethods?: string[] | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number | null
          approver?: string | null
          created_at?: string
          createdBy?: Json | null
          description?: string | null
          id?: string
          notes?: string | null
          paymentMethods?: string[] | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      feedbacks: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      "invoice-requests": {
        Row: {
          created_at: string
          description: string | null
          email: string | null
          id: number
          name: string | null
          phone: string | null
          receptionMedium: string | null
          receptionValue: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          email?: string | null
          id?: number
          name?: string | null
          phone?: string | null
          receptionMedium?: string | null
          receptionValue?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          email?: string | null
          id?: number
          name?: string | null
          phone?: string | null
          receptionMedium?: string | null
          receptionValue?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string | null
          created_at: string
          group: string | null
          id: number
          metadata: Json | null
          source: string | null
          status: string | null
          subject: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          group?: string | null
          id?: number
          metadata?: Json | null
          source?: string | null
          status?: string | null
          subject?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          group?: string | null
          id?: number
          metadata?: Json | null
          source?: string | null
          status?: string | null
          subject?: string | null
        }
        Relationships: []
      }
      "order-cancellation-requests": {
        Row: {
          created_at: string
          id: string
          order_id: string | null
          reason: string | null
          status: string | null
          user_id: string | null
          userConfirmation: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          order_id?: string | null
          reason?: string | null
          status?: string | null
          user_id?: string | null
          userConfirmation?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string | null
          reason?: string | null
          status?: string | null
          user_id?: string | null
          userConfirmation?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_order-cancellation-requests_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          coupon_id: string | null
          created_at: string
          deliveryDetails: Json | null
          deliveryFee: number | null
          deliveryType: string | null
          estimatedFulfillmentDate: string | null
          id: string
          items: Json[] | null
          note: string | null
          orderId: string
          paymentStatus: string | null
          paymentType: string | null
          reference: string | null
          status: string | null
          totalAmount: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          coupon_id?: string | null
          created_at?: string
          deliveryDetails?: Json | null
          deliveryFee?: number | null
          deliveryType?: string | null
          estimatedFulfillmentDate?: string | null
          id?: string
          items?: Json[] | null
          note?: string | null
          orderId?: string
          paymentStatus?: string | null
          paymentType?: string | null
          reference?: string | null
          status?: string | null
          totalAmount?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          coupon_id?: string | null
          created_at?: string
          deliveryDetails?: Json | null
          deliveryFee?: number | null
          deliveryType?: string | null
          estimatedFulfillmentDate?: string | null
          id?: string
          items?: Json[] | null
          note?: string | null
          orderId?: string
          paymentStatus?: string | null
          paymentType?: string | null
          reference?: string | null
          status?: string | null
          totalAmount?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_orders_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
        ]
      }
      "price-calculator-settings": {
        Row: {
          active: boolean | null
          created_at: string | null
          description: string | null
          displayName: string
          id: string
          options: Json
          order: number | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          displayName: string
          id: string
          options?: Json
          order?: number | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          displayName?: string
          id?: string
          options?: Json
          order?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      quotes: {
        Row: {
          clientName: string | null
          contact: string | null
          created_at: string
          dueDate: string | null
          email: string | null
          id: string
          items: Json[] | null
          numberOfReactivationRequested: number | null
          numberOfRevisionsRequested: number | null
          order_id: string | null
          quoteNumber: number | null
          reactivationReasons: string[] | null
          requestPayment: boolean | null
          revisionReasons: string[] | null
          status: string | null
          title: string | null
          totalAmount: number | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          clientName?: string | null
          contact?: string | null
          created_at?: string
          dueDate?: string | null
          email?: string | null
          id?: string
          items?: Json[] | null
          numberOfReactivationRequested?: number | null
          numberOfRevisionsRequested?: number | null
          order_id?: string | null
          quoteNumber?: number | null
          reactivationReasons?: string[] | null
          requestPayment?: boolean | null
          revisionReasons?: string[] | null
          status?: string | null
          title?: string | null
          totalAmount?: number | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          clientName?: string | null
          contact?: string | null
          created_at?: string
          dueDate?: string | null
          email?: string | null
          id?: string
          items?: Json[] | null
          numberOfReactivationRequested?: number | null
          numberOfRevisionsRequested?: number | null
          order_id?: string | null
          quoteNumber?: number | null
          reactivationReasons?: string[] | null
          requestPayment?: boolean | null
          revisionReasons?: string[] | null
          status?: string | null
          title?: string | null
          totalAmount?: number | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quotes_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "custom-orders"
            referencedColumns: ["id"]
          },
        ]
      }
      receipts: {
        Row: {
          created_at: string
          createdBy: Json | null
          customerAddress: string | null
          customerEmail: string | null
          customerName: string | null
          customerPhone: string | null
          date: string | null
          id: number
          items: Json[] | null
          notes: string | null
          paymentMethod: string | null
          paymentStatus: string | null
          receiptNumber: string | null
          subtotal: number | null
          taxAmount: number | null
          taxRate: number | null
          totalAmount: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          createdBy?: Json | null
          customerAddress?: string | null
          customerEmail?: string | null
          customerName?: string | null
          customerPhone?: string | null
          date?: string | null
          id?: number
          items?: Json[] | null
          notes?: string | null
          paymentMethod?: string | null
          paymentStatus?: string | null
          receiptNumber?: string | null
          subtotal?: number | null
          taxAmount?: number | null
          taxRate?: number | null
          totalAmount?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          createdBy?: Json | null
          customerAddress?: string | null
          customerEmail?: string | null
          customerName?: string | null
          customerPhone?: string | null
          date?: string | null
          id?: number
          items?: Json[] | null
          notes?: string | null
          paymentMethod?: string | null
          paymentStatus?: string | null
          receiptNumber?: string | null
          subtotal?: number | null
          taxAmount?: number | null
          taxRate?: number | null
          totalAmount?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      rolesPermissions: {
        Row: {
          created_at: string
          id: string
          permissions: string[] | null
          role: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          permissions?: string[] | null
          role?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          permissions?: string[] | null
          role?: string | null
        }
        Relationships: []
      }
      sales: {
        Row: {
          created_at: string
          createdBy: Json | null
          description: string | null
          discount: Json | null
          id: string
          notes: string | null
          paymentMethods: string[] | null
          productType: string | null
          quantity: number | null
          totalAmount: number | null
          unitPrice: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          createdBy?: Json | null
          description?: string | null
          discount?: Json | null
          id?: string
          notes?: string | null
          paymentMethods?: string[] | null
          productType?: string | null
          quantity?: number | null
          totalAmount?: number | null
          unitPrice?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          createdBy?: Json | null
          description?: string | null
          discount?: Json | null
          id?: string
          notes?: string | null
          paymentMethods?: string[] | null
          productType?: string | null
          quantity?: number | null
          totalAmount?: number | null
          unitPrice?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      "shipping-addresses": {
        Row: {
          address: string | null
          contactName: string | null
          country: string | null
          created_at: string
          email: string | null
          id: string
          phone1: string | null
          phone2: string | null
          region: Json | null
          town: string | null
          user_id: string | null
        }
        Insert: {
          address?: string | null
          contactName?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          id?: string
          phone1?: string | null
          phone2?: string | null
          region?: Json | null
          town?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string | null
          contactName?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          id?: string
          phone1?: string | null
          phone2?: string | null
          region?: Json | null
          town?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          confirmed: boolean | null
          country: string | null
          created_at: string
          dateOfBirth: string | null
          email: string
          firstName: string | null
          gender: string | null
          id: string
          lastName: string | null
          phone: string | null
          profileImage: string | null
          provider: string | null
          region: Json | null
          requestedConfirmLinkNumberOfTimes: number | null
        }
        Insert: {
          confirmed?: boolean | null
          country?: string | null
          created_at?: string
          dateOfBirth?: string | null
          email: string
          firstName?: string | null
          gender?: string | null
          id: string
          lastName?: string | null
          phone?: string | null
          profileImage?: string | null
          provider?: string | null
          region?: Json | null
          requestedConfirmLinkNumberOfTimes?: number | null
        }
        Update: {
          confirmed?: boolean | null
          country?: string | null
          created_at?: string
          dateOfBirth?: string | null
          email?: string
          firstName?: string | null
          gender?: string | null
          id?: string
          lastName?: string | null
          phone?: string | null
          profileImage?: string | null
          provider?: string | null
          region?: Json | null
          requestedConfirmLinkNumberOfTimes?: number | null
        }
        Relationships: []
      }
      "website-settings": {
        Row: {
          adminSectionUnderConstruction: boolean | null
          adminSectionUnderMaintenance: boolean | null
          created_at: string
          id: number
          userSectionUnderConstruction: boolean | null
          userSectionUnderMaintenance: boolean | null
        }
        Insert: {
          adminSectionUnderConstruction?: boolean | null
          adminSectionUnderMaintenance?: boolean | null
          created_at?: string
          id?: number
          userSectionUnderConstruction?: boolean | null
          userSectionUnderMaintenance?: boolean | null
        }
        Update: {
          adminSectionUnderConstruction?: boolean | null
          adminSectionUnderMaintenance?: boolean | null
          created_at?: string
          id?: number
          userSectionUnderConstruction?: boolean | null
          userSectionUnderMaintenance?: boolean | null
        }
        Relationships: []
      }
      visitors: {
        Row: {
          id: string
          created_at: string
          last_visit: string
          ip_address: string | null
          country: string | null
          city: string | null
          region: string | null
          user_agent: string | null
          visit_count: number
        }
        Insert: {
          id?: string
          created_at?: string
          last_visit?: string
          ip_address?: string | null
          country?: string | null
          city?: string | null
          region?: string | null
          user_agent?: string | null
          visit_count?: number
        }
        Update: {
          id?: string
          created_at?: string
          last_visit?: string
          ip_address?: string | null
          country?: string | null
          city?: string | null
          region?: string | null
          user_agent?: string | null
          visit_count?: number
        }
        Relationships: []
      }
      page_views: {
        Row: {
          id: number
          created_at: string
          visitor_id: string
          url: string
          referrer: string | null
        }
        Insert: {
          id?: number
          created_at?: string
          visitor_id: string
          url: string
          referrer?: string | null
        }
        Update: {
          id?: number
          created_at?: string
          visitor_id?: string
          url?: string
          referrer?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "page_views_visitor_id_fkey"
            columns: ["visitor_id"]
            isOneToOne: false
            referencedRelation: "visitors"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_custom_order_count_by_status: {
        Args: Record<PropertyKey, never>
        Returns: {
          status: string
          count: number
        }[]
      }
      get_order_count_by_status: {
        Args: Record<PropertyKey, never>
        Returns: {
          source_table: string
          status: string
          count: number
        }[]
      }
      get_total_order_count: {
        Args: Record<PropertyKey, never>
        Returns: {
          table_name: string
          order_count: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          user_metadata: Json | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          user_metadata?: Json | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          user_metadata?: Json | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads: {
        Row: {
          bucket_id: string
          created_at: string
          id: string
          in_progress_size: number
          key: string
          owner_id: string | null
          upload_signature: string
          user_metadata: Json | null
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          id: string
          in_progress_size?: number
          key: string
          owner_id?: string | null
          upload_signature: string
          user_metadata?: Json | null
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          id?: string
          in_progress_size?: number
          key?: string
          owner_id?: string | null
          upload_signature?: string
          user_metadata?: Json | null
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads_parts: {
        Row: {
          bucket_id: string
          created_at: string
          etag: string
          id: string
          key: string
          owner_id: string | null
          part_number: number
          size: number
          upload_id: string
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          etag: string
          id?: string
          key: string
          owner_id?: string | null
          part_number: number
          size?: number
          upload_id: string
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          etag?: string
          id?: string
          key?: string
          owner_id?: string | null
          part_number?: number
          size?: number
          upload_id?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_parts_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "s3_multipart_uploads_parts_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: false
            referencedRelation: "s3_multipart_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: string[]
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      list_multipart_uploads_with_delimiter: {
        Args: {
          bucket_id: string
          prefix_param: string
          delimiter_param: string
          max_keys?: number
          next_key_token?: string
          next_upload_token?: string
        }
        Returns: {
          key: string
          id: string
          created_at: string
        }[]
      }
      list_objects_with_delimiter: {
        Args: {
          bucket_id: string
          prefix_param: string
          delimiter_param: string
          max_keys?: number
          start_after?: string
          next_token?: string
        }
        Returns: {
          name: string
          id: string
          metadata: Json
          updated_at: string
        }[]
      }
      operation: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
    }
    Enums: {
      [_ in never]: never
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

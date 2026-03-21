export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      connection_orders: {
        Row: {
          address: string
          area: string | null
          assigned_to: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          package_id: string | null
          phone: string
          preferred_date: string | null
          status: Database["public"]["Enums"]["order_status"]
        }
        Insert: {
          address: string
          area?: string | null
          assigned_to?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          package_id?: string | null
          phone: string
          preferred_date?: string | null
          status?: Database["public"]["Enums"]["order_status"]
        }
        Update: {
          address?: string
          area?: string | null
          assigned_to?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          package_id?: string | null
          phone?: string
          preferred_date?: string | null
          status?: Database["public"]["Enums"]["order_status"]
        }
        Relationships: [
          {
            foreignKeyName: "connection_orders_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
        ]
      }
      coverage_areas: {
        Row: {
          available: boolean
          created_at: string
          district: string | null
          id: string
          name: string
          name_bn: string | null
          zone: string | null
        }
        Insert: {
          available?: boolean
          created_at?: string
          district?: string | null
          id?: string
          name: string
          name_bn?: string | null
          zone?: string | null
        }
        Update: {
          available?: boolean
          created_at?: string
          district?: string | null
          id?: string
          name?: string
          name_bn?: string | null
          zone?: string | null
        }
        Relationships: []
      }
      notices: {
        Row: {
          category: Database["public"]["Enums"]["notice_category"]
          content: string | null
          created_at: string
          id: string
          published: boolean
          title: string
          title_bn: string | null
        }
        Insert: {
          category?: Database["public"]["Enums"]["notice_category"]
          content?: string | null
          created_at?: string
          id?: string
          published?: boolean
          title: string
          title_bn?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["notice_category"]
          content?: string | null
          created_at?: string
          id?: string
          published?: boolean
          title?: string
          title_bn?: string | null
        }
        Relationships: []
      }
      packages: {
        Row: {
          badges: Json | null
          category: Database["public"]["Enums"]["package_category"]
          created_at: string
          featured: boolean
          features: Json | null
          id: string
          name: string
          name_bn: string | null
          price: number
          sort_order: number
          speed: number
          visible: boolean
        }
        Insert: {
          badges?: Json | null
          category?: Database["public"]["Enums"]["package_category"]
          created_at?: string
          featured?: boolean
          features?: Json | null
          id?: string
          name: string
          name_bn?: string | null
          price: number
          sort_order?: number
          speed: number
          visible?: boolean
        }
        Update: {
          badges?: Json | null
          category?: Database["public"]["Enums"]["package_category"]
          created_at?: string
          featured?: boolean
          features?: Json | null
          id?: string
          name?: string
          name_bn?: string | null
          price?: number
          sort_order?: number
          speed?: number
          visible?: boolean
        }
        Relationships: []
      }
      pages: {
        Row: {
          content: string | null
          created_at: string
          id: string
          meta_description: string | null
          meta_title: string | null
          published: boolean
          slug: string
          title: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          published?: boolean
          slug: string
          title: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          published?: boolean
          slug?: string
          title?: string
        }
        Relationships: []
      }
      payment_methods: {
        Row: {
          account_number: string | null
          created_at: string
          id: string
          instructions: string | null
          logo_url: string | null
          name: string
          sort_order: number
          visible: boolean
        }
        Insert: {
          account_number?: string | null
          created_at?: string
          id?: string
          instructions?: string | null
          logo_url?: string | null
          name: string
          sort_order?: number
          visible?: boolean
        }
        Update: {
          account_number?: string | null
          created_at?: string
          id?: string
          instructions?: string | null
          logo_url?: string | null
          name?: string
          sort_order?: number
          visible?: boolean
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          created_at: string
          id: string
          key: string
          value: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          value?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          value?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "super_admin" | "admin" | "staff"
      notice_category: "maintenance" | "offer" | "alert"
      order_status: "pending" | "contacted" | "completed"
      package_category: "home" | "corporate"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["super_admin", "admin", "staff"],
      notice_category: ["maintenance", "offer", "alert"],
      order_status: ["pending", "contacted", "completed"],
      package_category: ["home", "corporate"],
    },
  },
} as const

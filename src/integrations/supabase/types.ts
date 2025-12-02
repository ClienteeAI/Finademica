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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          description: string
          icon: string | null
          id: string
          key: string
          name: string
        }
        Insert: {
          description: string
          icon?: string | null
          id?: string
          key: string
          name: string
        }
        Update: {
          description?: string
          icon?: string | null
          id?: string
          key?: string
          name?: string
        }
        Relationships: []
      }
      activity_log: {
        Row: {
          activity_data: Json | null
          activity_type: string
          client_id: string
          created_at: string | null
          id: string
          points_awarded: number | null
          user_id: string
        }
        Insert: {
          activity_data?: Json | null
          activity_type: string
          client_id: string
          created_at?: string | null
          id?: string
          points_awarded?: number | null
          user_id: string
        }
        Update: {
          activity_data?: Json | null
          activity_type?: string
          client_id?: string
          created_at?: string | null
          id?: string
          points_awarded?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_log_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          active: boolean | null
          company_name: string
          company_tagline: string | null
          created_at: string | null
          custom_domain: string | null
          features: Json | null
          ghl_api_key: string | null
          ghl_location_id: string | null
          ghl_pipeline_id: string | null
          id: string
          logo_url: string | null
          max_users: number | null
          plan_type: string | null
          primary_color: string | null
          secondary_color: string | null
          subdomain: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          company_name: string
          company_tagline?: string | null
          created_at?: string | null
          custom_domain?: string | null
          features?: Json | null
          ghl_api_key?: string | null
          ghl_location_id?: string | null
          ghl_pipeline_id?: string | null
          id?: string
          logo_url?: string | null
          max_users?: number | null
          plan_type?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          subdomain: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          company_name?: string
          company_tagline?: string | null
          created_at?: string | null
          custom_domain?: string | null
          features?: Json | null
          ghl_api_key?: string | null
          ghl_location_id?: string | null
          ghl_pipeline_id?: string | null
          id?: string
          logo_url?: string | null
          max_users?: number | null
          plan_type?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          subdomain?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      ebooks: {
        Row: {
          call_notes: string | null
          created_at: string | null
          generated_content: Json | null
          id: string
          last_read_at: string | null
          pages_read: number | null
          pdf_url: string | null
          title: string | null
          user_id: string
        }
        Insert: {
          call_notes?: string | null
          created_at?: string | null
          generated_content?: Json | null
          id?: string
          last_read_at?: string | null
          pages_read?: number | null
          pdf_url?: string | null
          title?: string | null
          user_id: string
        }
        Update: {
          call_notes?: string | null
          created_at?: string | null
          generated_content?: Json | null
          id?: string
          last_read_at?: string | null
          pages_read?: number | null
          pdf_url?: string | null
          title?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ebooks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      skills: {
        Row: {
          description: string | null
          id: string
          key: string
          name: string
        }
        Insert: {
          description?: string | null
          id?: string
          key: string
          name: string
        }
        Update: {
          description?: string | null
          id?: string
          key?: string
          name?: string
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_id: string
          id: string
          unlocked_at: string | null
          user_id: string
        }
        Insert: {
          achievement_id: string
          id?: string
          unlocked_at?: string | null
          user_id: string
        }
        Update: {
          achievement_id?: string
          id?: string
          unlocked_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_avatar: {
        Row: {
          last_updated: string | null
          stage: number
          user_id: string
        }
        Insert: {
          last_updated?: string | null
          stage?: number
          user_id: string
        }
        Update: {
          last_updated?: string | null
          stage?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_avatar_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_events: {
        Row: {
          created_at: string
          event_type: string
          event_value: string | null
          id: string
          points: number
          user_id: string
        }
        Insert: {
          created_at?: string
          event_type: string
          event_value?: string | null
          id?: string
          points?: number
          user_id: string
        }
        Update: {
          created_at?: string
          event_type?: string
          event_value?: string | null
          id?: string
          points?: number
          user_id?: string
        }
        Relationships: []
      }
      user_gamification: {
        Row: {
          created_at: string | null
          last_activity_date: string | null
          level: number
          streak_days: number
          user_id: string
          xp: number
        }
        Insert: {
          created_at?: string | null
          last_activity_date?: string | null
          level?: number
          streak_days?: number
          user_id: string
          xp?: number
        }
        Update: {
          created_at?: string | null
          last_activity_date?: string | null
          level?: number
          streak_days?: number
          user_id?: string
          xp?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_gamification_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_skills: {
        Row: {
          id: string
          level: number
          skill_id: string
          user_id: string
          xp: number
        }
        Insert: {
          id?: string
          level?: number
          skill_id: string
          user_id: string
          xp?: number
        }
        Update: {
          id?: string
          level?: number
          skill_id?: string
          user_id?: string
          xp?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_skills_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_stats: {
        Row: {
          level: number
          total_points: number
          updated_at: string
          user_id: string
          videos_completed: number
        }
        Insert: {
          level?: number
          total_points?: number
          updated_at?: string
          user_id: string
          videos_completed?: number
        }
        Update: {
          level?: number
          total_points?: number
          updated_at?: string
          user_id?: string
          videos_completed?: number
        }
        Relationships: []
      }
      user_video_selections: {
        Row: {
          ai_reason: string | null
          created_at: string | null
          id: string
          priority_rank: number | null
          user_id: string
          video_id: string
        }
        Insert: {
          ai_reason?: string | null
          created_at?: string | null
          id?: string
          priority_rank?: number | null
          user_id: string
          video_id: string
        }
        Update: {
          ai_reason?: string | null
          created_at?: string | null
          id?: string
          priority_rank?: number | null
          user_id?: string
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_video_selections_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_video_selections_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          client_id: string
          created_at: string | null
          ebook_status: string | null
          ebook_url: string | null
          email: string
          first_name: string | null
          ghl_contact_id: string | null
          id: string
          is_admin: boolean | null
          last_login: string | null
          last_name: string | null
          lead_score: number | null
          login_count: number | null
          password_hash: string | null
          phone: string | null
          quiz_answers: Json | null
          updated_at: string | null
        }
        Insert: {
          client_id: string
          created_at?: string | null
          ebook_status?: string | null
          ebook_url?: string | null
          email: string
          first_name?: string | null
          ghl_contact_id?: string | null
          id?: string
          is_admin?: boolean | null
          last_login?: string | null
          last_name?: string | null
          lead_score?: number | null
          login_count?: number | null
          password_hash?: string | null
          phone?: string | null
          quiz_answers?: Json | null
          updated_at?: string | null
        }
        Update: {
          client_id?: string
          created_at?: string | null
          ebook_status?: string | null
          ebook_url?: string | null
          email?: string
          first_name?: string | null
          ghl_contact_id?: string | null
          id?: string
          is_admin?: boolean | null
          last_login?: string | null
          last_name?: string | null
          lead_score?: number | null
          login_count?: number | null
          password_hash?: string | null
          phone?: string | null
          quiz_answers?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      video_views: {
        Row: {
          client_id: string | null
          completed_at: string
          created_at: string
          id: string
          raw_quiz_answers: Json | null
          status: string
          user_id: string
          video_id: string
        }
        Insert: {
          client_id?: string | null
          completed_at?: string
          created_at?: string
          id?: string
          raw_quiz_answers?: Json | null
          status?: string
          user_id: string
          video_id: string
        }
        Update: {
          client_id?: string | null
          completed_at?: string
          created_at?: string
          id?: string
          raw_quiz_answers?: Json | null
          status?: string
          user_id?: string
          video_id?: string
        }
        Relationships: []
      }
      videos: {
        Row: {
          category: string | null
          client_id: string | null
          created_at: string | null
          description: string | null
          difficulty: string | null
          duration_seconds: number | null
          for_concerns: string[] | null
          for_experience_level: string[] | null
          for_goals: string[] | null
          for_markets: string[] | null
          for_time_available: string[] | null
          id: string
          is_active: boolean | null
          keywords: string[] | null
          order_priority: number | null
          subcategory: string | null
          thumbnail_url: string | null
          title: string
          transcript: string | null
          updated_at: string | null
          video_id: string
          video_url: string
        }
        Insert: {
          category?: string | null
          client_id?: string | null
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          duration_seconds?: number | null
          for_concerns?: string[] | null
          for_experience_level?: string[] | null
          for_goals?: string[] | null
          for_markets?: string[] | null
          for_time_available?: string[] | null
          id?: string
          is_active?: boolean | null
          keywords?: string[] | null
          order_priority?: number | null
          subcategory?: string | null
          thumbnail_url?: string | null
          title: string
          transcript?: string | null
          updated_at?: string | null
          video_id: string
          video_url: string
        }
        Update: {
          category?: string | null
          client_id?: string | null
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          duration_seconds?: number | null
          for_concerns?: string[] | null
          for_experience_level?: string[] | null
          for_goals?: string[] | null
          for_markets?: string[] | null
          for_time_available?: string[] | null
          id?: string
          is_active?: boolean | null
          keywords?: string[] | null
          order_priority?: number | null
          subcategory?: string | null
          thumbnail_url?: string | null
          title?: string
          transcript?: string | null
          updated_at?: string | null
          video_id?: string
          video_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "videos_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_gamification: { Args: { uid: string }; Returns: Json }
      increment_user_stats: {
        Args: { p_points: number; p_user_id: string; p_videos: number }
        Returns: undefined
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
    Enums: {},
  },
} as const

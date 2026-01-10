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
          code: string | null
          description: string
          icon: string | null
          id: string
          key: string
          name: string
          points: number
        }
        Insert: {
          code?: string | null
          description: string
          icon?: string | null
          id?: string
          key: string
          name: string
          points?: number
        }
        Update: {
          code?: string | null
          description?: string
          icon?: string | null
          id?: string
          key?: string
          name?: string
          points?: number
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
            referencedRelation: "user_access_context"
            referencedColumns: ["user_id"]
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
      ai_quiz_questions: {
        Row: {
          correct_answer: string
          created_at: string
          id: string
          level: string
          module: string
          options: Json
          question: string
          quiz_id: string
        }
        Insert: {
          correct_answer: string
          created_at?: string
          id?: string
          level: string
          module: string
          options: Json
          question: string
          quiz_id: string
        }
        Update: {
          correct_answer?: string
          created_at?: string
          id?: string
          level?: string
          module?: string
          options?: Json
          question?: string
          quiz_id?: string
        }
        Relationships: []
      }
      brand_books: {
        Row: {
          brand_key: string
          id: string
          theme_config: Json
          tokens_css: string | null
          updated_at: string
        }
        Insert: {
          brand_key: string
          id?: string
          theme_config?: Json
          tokens_css?: string | null
          updated_at?: string
        }
        Update: {
          brand_key?: string
          id?: string
          theme_config?: Json
          tokens_css?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      client_reserved_nicknames: {
        Row: {
          client_id: string
          created_at: string
          id: string
          nickname: string
        }
        Insert: {
          client_id: string
          created_at?: string
          id?: string
          nickname: string
        }
        Update: {
          client_id?: string
          created_at?: string
          id?: string
          nickname?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_reserved_nicknames_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      client_videos: {
        Row: {
          client_id: string
          created_at: string
          id: string
          is_active: boolean
          order_priority: number | null
          video_id: string
          visibility_override:
            | Database["public"]["Enums"]["visibility_type"]
            | null
        }
        Insert: {
          client_id: string
          created_at?: string
          id?: string
          is_active?: boolean
          order_priority?: number | null
          video_id: string
          visibility_override?:
            | Database["public"]["Enums"]["visibility_type"]
            | null
        }
        Update: {
          client_id?: string
          created_at?: string
          id?: string
          is_active?: boolean
          order_priority?: number | null
          video_id?: string
          visibility_override?:
            | Database["public"]["Enums"]["visibility_type"]
            | null
        }
        Relationships: []
      }
      clients: {
        Row: {
          active: boolean | null
          brand_key: string | null
          company_name: string
          company_tagline: string | null
          created_at: string | null
          custom_domain: string | null
          features: Json | null
          feed_config: Json | null
          ghl_api_key: string | null
          ghl_location_id: string | null
          ghl_pipeline_id: string | null
          id: string
          logo_url: string | null
          max_users: number | null
          onboarding_config: Json | null
          plan_type: string | null
          primary_color: string | null
          quiz_config: Json | null
          require_quiz: boolean | null
          secondary_color: string | null
          signup_config: Json | null
          skip_landing_page: boolean | null
          subdomain: string
          theme_config: Json | null
          theme_override: Json | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          brand_key?: string | null
          company_name: string
          company_tagline?: string | null
          created_at?: string | null
          custom_domain?: string | null
          features?: Json | null
          feed_config?: Json | null
          ghl_api_key?: string | null
          ghl_location_id?: string | null
          ghl_pipeline_id?: string | null
          id?: string
          logo_url?: string | null
          max_users?: number | null
          onboarding_config?: Json | null
          plan_type?: string | null
          primary_color?: string | null
          quiz_config?: Json | null
          require_quiz?: boolean | null
          secondary_color?: string | null
          signup_config?: Json | null
          skip_landing_page?: boolean | null
          subdomain: string
          theme_config?: Json | null
          theme_override?: Json | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          brand_key?: string | null
          company_name?: string
          company_tagline?: string | null
          created_at?: string | null
          custom_domain?: string | null
          features?: Json | null
          feed_config?: Json | null
          ghl_api_key?: string | null
          ghl_location_id?: string | null
          ghl_pipeline_id?: string | null
          id?: string
          logo_url?: string | null
          max_users?: number | null
          onboarding_config?: Json | null
          plan_type?: string | null
          primary_color?: string | null
          quiz_config?: Json | null
          require_quiz?: boolean | null
          secondary_color?: string | null
          signup_config?: Json | null
          skip_landing_page?: boolean | null
          subdomain?: string
          theme_config?: Json | null
          theme_override?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      conversations: {
        Row: {
          client_id: string | null
          created_at: string | null
          id: string
          message: string
          role: string
          user_id: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          id?: string
          message: string
          role: string
          user_id?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          id?: string
          message?: string
          role?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_access_context"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "conversations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_events: {
        Row: {
          email: string | null
          event_name: string
          id: string
          occurred_at: string
          phone: string | null
          props: Json
          user_id: string | null
        }
        Insert: {
          email?: string | null
          event_name: string
          id?: string
          occurred_at?: string
          phone?: string | null
          props?: Json
          user_id?: string | null
        }
        Update: {
          email?: string | null
          event_name?: string
          id?: string
          occurred_at?: string
          phone?: string | null
          props?: Json
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_access_context"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "crm_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      deposits: {
        Row: {
          amount_usd: number
          client_id: string | null
          confirmed_at: string | null
          created_at: string
          id: string
          provider: string | null
          provider_txn_id: string | null
          status: string
          user_id: string
        }
        Insert: {
          amount_usd: number
          client_id?: string | null
          confirmed_at?: string | null
          created_at?: string
          id?: string
          provider?: string | null
          provider_txn_id?: string | null
          status?: string
          user_id: string
        }
        Update: {
          amount_usd?: number
          client_id?: string | null
          confirmed_at?: string | null
          created_at?: string
          id?: string
          provider?: string | null
          provider_txn_id?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "deposits_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_access_context"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "deposits_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
            referencedRelation: "user_access_context"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "ebooks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      feed_comments: {
        Row: {
          client_id: string
          content: string
          created_at: string
          id: string
          post_id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          client_id: string
          content: string
          created_at?: string
          id?: string
          post_id: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          client_id?: string
          content?: string
          created_at?: string
          id?: string
          post_id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feed_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "feed_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feed_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "v_feed_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feed_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_access_context"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "feed_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      feed_events_outbox: {
        Row: {
          actor_user_id: string | null
          client_id: string
          created_at: string
          entity_id: string
          entity_table: string
          event_type: string
          id: string
          payload: Json
          processed_at: string | null
        }
        Insert: {
          actor_user_id?: string | null
          client_id: string
          created_at?: string
          entity_id: string
          entity_table: string
          event_type: string
          id?: string
          payload?: Json
          processed_at?: string | null
        }
        Update: {
          actor_user_id?: string | null
          client_id?: string
          created_at?: string
          entity_id?: string
          entity_table?: string
          event_type?: string
          id?: string
          payload?: Json
          processed_at?: string | null
        }
        Relationships: []
      }
      feed_likes: {
        Row: {
          client_id: string
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          client_id: string
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          client_id?: string
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feed_likes_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feed_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "feed_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feed_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "v_feed_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feed_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_access_context"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "feed_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      feed_moderation_audit: {
        Row: {
          actor_type: string
          actor_user_id: string | null
          client_id: string
          created_at: string
          decision: string
          id: string
          model_name: string | null
          model_score: number | null
          post_id: string
          raw_flags: Json
          reason: string | null
          user_id: string
        }
        Insert: {
          actor_type?: string
          actor_user_id?: string | null
          client_id: string
          created_at?: string
          decision: string
          id?: string
          model_name?: string | null
          model_score?: number | null
          post_id: string
          raw_flags?: Json
          reason?: string | null
          user_id: string
        }
        Update: {
          actor_type?: string
          actor_user_id?: string | null
          client_id?: string
          created_at?: string
          decision?: string
          id?: string
          model_name?: string | null
          model_score?: number | null
          post_id?: string
          raw_flags?: Json
          reason?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feed_moderation_audit_actor_user_id_fkey"
            columns: ["actor_user_id"]
            isOneToOne: false
            referencedRelation: "user_access_context"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "feed_moderation_audit_actor_user_id_fkey"
            columns: ["actor_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feed_moderation_audit_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feed_moderation_audit_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "feed_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feed_moderation_audit_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "v_feed_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feed_moderation_audit_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_access_context"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "feed_moderation_audit_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      feed_post_comments: {
        Row: {
          client_id: string | null
          content: string
          created_at: string
          id: string
          post_id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          client_id?: string | null
          content: string
          created_at?: string
          id?: string
          post_id: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          client_id?: string | null
          content?: string
          created_at?: string
          id?: string
          post_id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feed_post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "feed_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feed_post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "v_feed_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feed_post_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_access_context"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "feed_post_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      feed_post_likes: {
        Row: {
          client_id: string
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          client_id: string
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          client_id?: string
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feed_post_likes_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feed_post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "feed_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feed_post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "v_feed_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feed_post_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_access_context"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "feed_post_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      feed_posts: {
        Row: {
          client_id: string
          content: string
          created_at: string
          id: string
          is_official: boolean
          media_storage_paths: Json
          media_urls: Json
          moderated_at: string | null
          moderated_by: string | null
          moderation_reason: string | null
          post_type: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          client_id: string
          content: string
          created_at?: string
          id?: string
          is_official?: boolean
          media_storage_paths?: Json
          media_urls?: Json
          moderated_at?: string | null
          moderated_by?: string | null
          moderation_reason?: string | null
          post_type?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          client_id?: string
          content?: string
          created_at?: string
          id?: string
          is_official?: boolean
          media_storage_paths?: Json
          media_urls?: Json
          moderated_at?: string | null
          moderated_by?: string | null
          moderation_reason?: string | null
          post_type?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feed_posts_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feed_posts_moderated_by_fkey"
            columns: ["moderated_by"]
            isOneToOne: false
            referencedRelation: "user_access_context"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "feed_posts_moderated_by_fkey"
            columns: ["moderated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feed_posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_access_context"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "feed_posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      feed_reactions: {
        Row: {
          client_id: string
          created_at: string
          id: string
          post_id: string
          reaction: string
          user_id: string
        }
        Insert: {
          client_id: string
          created_at?: string
          id?: string
          post_id: string
          reaction?: string
          user_id: string
        }
        Update: {
          client_id?: string
          created_at?: string
          id?: string
          post_id?: string
          reaction?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feed_reactions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feed_reactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "feed_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feed_reactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "v_feed_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feed_reactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_access_context"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "feed_reactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      instrument_specs_mt5: {
        Row: {
          broker_key: string
          calc_mode: number | null
          contract_size: number
          currency_base: string | null
          currency_margin: string | null
          currency_profit: string | null
          digits: number
          id: string
          inactive_reason: string | null
          is_active: boolean
          symbol: string
          tick_size: number
          tick_value: number | null
          tick_value_profit: number | null
          tick_value_usd: number
          trade_mode: number | null
          updated_at: string
          vol_max: number
          vol_min: number
          vol_step: number
        }
        Insert: {
          broker_key?: string
          calc_mode?: number | null
          contract_size: number
          currency_base?: string | null
          currency_margin?: string | null
          currency_profit?: string | null
          digits: number
          id?: string
          inactive_reason?: string | null
          is_active?: boolean
          symbol: string
          tick_size: number
          tick_value?: number | null
          tick_value_profit?: number | null
          tick_value_usd: number
          trade_mode?: number | null
          updated_at?: string
          vol_max: number
          vol_min: number
          vol_step: number
        }
        Update: {
          broker_key?: string
          calc_mode?: number | null
          contract_size?: number
          currency_base?: string | null
          currency_margin?: string | null
          currency_profit?: string | null
          digits?: number
          id?: string
          inactive_reason?: string | null
          is_active?: boolean
          symbol?: string
          tick_size?: number
          tick_value?: number | null
          tick_value_profit?: number | null
          tick_value_usd?: number
          trade_mode?: number | null
          updated_at?: string
          vol_max?: number
          vol_min?: number
          vol_step?: number
        }
        Relationships: []
      }
      mentor_messages: {
        Row: {
          auth_user_id: string
          content: string
          created_at: string
          id: string
          role: string
        }
        Insert: {
          auth_user_id?: string
          content: string
          created_at?: string
          id?: string
          role: string
        }
        Update: {
          auth_user_id?: string
          content?: string
          created_at?: string
          id?: string
          role?: string
        }
        Relationships: []
      }
      quiz_answers: {
        Row: {
          created_at: string | null
          experience_level: string | null
          id: string
          main_concern: string | null
          markets_interested: string[] | null
          primary_goal: string | null
          time_available: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          experience_level?: string | null
          id?: string
          main_concern?: string | null
          markets_interested?: string[] | null
          primary_goal?: string | null
          time_available?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          experience_level?: string | null
          id?: string
          main_concern?: string | null
          markets_interested?: string[] | null
          primary_goal?: string | null
          time_available?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_answers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "user_access_context"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "quiz_answers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_attempts: {
        Row: {
          assigned_track: string | null
          client_id: string | null
          id: string
          metadata: Json
          passed: boolean | null
          quiz_key: string
          score_percent: number
          started_at: string
          submitted_at: string
          user_id: string
        }
        Insert: {
          assigned_track?: string | null
          client_id?: string | null
          id?: string
          metadata?: Json
          passed?: boolean | null
          quiz_key: string
          score_percent: number
          started_at?: string
          submitted_at?: string
          user_id: string
        }
        Update: {
          assigned_track?: string | null
          client_id?: string | null
          id?: string
          metadata?: Json
          passed?: boolean | null
          quiz_key?: string
          score_percent?: number
          started_at?: string
          submitted_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_attempts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_access_context"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "quiz_attempts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_video_unlocks: {
        Row: {
          created_at: string
          quiz_id: string
          video_id: string
        }
        Insert: {
          created_at?: string
          quiz_id: string
          video_id: string
        }
        Update: {
          created_at?: string
          quiz_id?: string
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_video_unlocks_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_video_unlocks_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "v_user_visible_videos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_video_unlocks_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      quizzes: {
        Row: {
          created_at: string
          id: string
          level: string
          module: string
          pass_score: number
          question_count: number
        }
        Insert: {
          created_at?: string
          id?: string
          level: string
          module: string
          pass_score?: number
          question_count?: number
        }
        Update: {
          created_at?: string
          id?: string
          level?: string
          module?: string
          pass_score?: number
          question_count?: number
        }
        Relationships: []
      }
      signup_sessions: {
        Row: {
          client_id: string
          consumed_at: string | null
          created_at: string
          expires_at: string
          token: string
        }
        Insert: {
          client_id: string
          consumed_at?: string | null
          created_at?: string
          expires_at?: string
          token?: string
        }
        Update: {
          client_id?: string
          consumed_at?: string | null
          created_at?: string
          expires_at?: string
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "signup_sessions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
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
      super_admins: {
        Row: {
          auth_user_id: string
          created_at: string
        }
        Insert: {
          auth_user_id: string
          created_at?: string
        }
        Update: {
          auth_user_id?: string
          created_at?: string
        }
        Relationships: []
      }
      trade_calculations: {
        Row: {
          account_balance: number | null
          account_currency: string
          broker_key: string
          created_at: string
          entry_price: number | null
          id: string
          lots_calculated: number | null
          lots_final: number | null
          lots_requested: number | null
          notes: string | null
          pip_value_position_usd: number | null
          recommended_lots: number | null
          risk_per_1lot_usd: number | null
          risk_total_usd: number | null
          risk_type: string
          risk_value: number | null
          side: string
          stop_loss_price: number | null
          symbol: string
          take_profit_price: number | null
          tick_value_position_usd: number | null
          ticks_to_sl: number | null
          user_id: string
        }
        Insert: {
          account_balance?: number | null
          account_currency?: string
          broker_key?: string
          created_at?: string
          entry_price?: number | null
          id?: string
          lots_calculated?: number | null
          lots_final?: number | null
          lots_requested?: number | null
          notes?: string | null
          pip_value_position_usd?: number | null
          recommended_lots?: number | null
          risk_per_1lot_usd?: number | null
          risk_total_usd?: number | null
          risk_type: string
          risk_value?: number | null
          side: string
          stop_loss_price?: number | null
          symbol: string
          take_profit_price?: number | null
          tick_value_position_usd?: number | null
          ticks_to_sl?: number | null
          user_id: string
        }
        Update: {
          account_balance?: number | null
          account_currency?: string
          broker_key?: string
          created_at?: string
          entry_price?: number | null
          id?: string
          lots_calculated?: number | null
          lots_final?: number | null
          lots_requested?: number | null
          notes?: string | null
          pip_value_position_usd?: number | null
          recommended_lots?: number | null
          risk_per_1lot_usd?: number | null
          risk_total_usd?: number | null
          risk_type?: string
          risk_value?: number | null
          side?: string
          stop_loss_price?: number | null
          symbol?: string
          take_profit_price?: number | null
          tick_value_position_usd?: number | null
          ticks_to_sl?: number | null
          user_id?: string
        }
        Relationships: []
      }
      trade_journal_entries: {
        Row: {
          account_balance: number | null
          account_currency: string
          broker_key: string
          calculation_id: string | null
          close_time: string | null
          created_at: string
          entry_price: number
          id: string
          lots_calculated_raw: number | null
          lots_final: number | null
          lots_requested: number | null
          notes: string | null
          open_time: string | null
          pip_value_position_usd: number | null
          pnl_pct: number | null
          pnl_usd: number | null
          profit_per_1lot_usd: number | null
          profit_total_usd: number | null
          risk_amount_usd: number | null
          risk_per_1lot_usd: number | null
          risk_total_usd: number | null
          risk_type: string | null
          risk_value: number | null
          rr_ratio: number | null
          side: Database["public"]["Enums"]["trade_side"]
          status: Database["public"]["Enums"]["trade_status"]
          stop_loss_price: number
          symbol: string
          tags: string[] | null
          take_profit_price: number | null
          tick_size: number | null
          tick_value_position_usd: number | null
          tick_value_usd_per_1lot: number | null
          ticks_per_pip: number | null
          ticks_to_sl: number | null
          ticks_to_tp: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          account_balance?: number | null
          account_currency?: string
          broker_key: string
          calculation_id?: string | null
          close_time?: string | null
          created_at?: string
          entry_price: number
          id?: string
          lots_calculated_raw?: number | null
          lots_final?: number | null
          lots_requested?: number | null
          notes?: string | null
          open_time?: string | null
          pip_value_position_usd?: number | null
          pnl_pct?: number | null
          pnl_usd?: number | null
          profit_per_1lot_usd?: number | null
          profit_total_usd?: number | null
          risk_amount_usd?: number | null
          risk_per_1lot_usd?: number | null
          risk_total_usd?: number | null
          risk_type?: string | null
          risk_value?: number | null
          rr_ratio?: number | null
          side: Database["public"]["Enums"]["trade_side"]
          status?: Database["public"]["Enums"]["trade_status"]
          stop_loss_price: number
          symbol: string
          tags?: string[] | null
          take_profit_price?: number | null
          tick_size?: number | null
          tick_value_position_usd?: number | null
          tick_value_usd_per_1lot?: number | null
          ticks_per_pip?: number | null
          ticks_to_sl?: number | null
          ticks_to_tp?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          account_balance?: number | null
          account_currency?: string
          broker_key?: string
          calculation_id?: string | null
          close_time?: string | null
          created_at?: string
          entry_price?: number
          id?: string
          lots_calculated_raw?: number | null
          lots_final?: number | null
          lots_requested?: number | null
          notes?: string | null
          open_time?: string | null
          pip_value_position_usd?: number | null
          pnl_pct?: number | null
          pnl_usd?: number | null
          profit_per_1lot_usd?: number | null
          profit_total_usd?: number | null
          risk_amount_usd?: number | null
          risk_per_1lot_usd?: number | null
          risk_total_usd?: number | null
          risk_type?: string | null
          risk_value?: number | null
          rr_ratio?: number | null
          side?: Database["public"]["Enums"]["trade_side"]
          status?: Database["public"]["Enums"]["trade_status"]
          stop_loss_price?: number
          symbol?: string
          tags?: string[] | null
          take_profit_price?: number | null
          tick_size?: number | null
          tick_value_position_usd?: number | null
          tick_value_usd_per_1lot?: number | null
          ticks_per_pip?: number | null
          ticks_to_sl?: number | null
          ticks_to_tp?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trade_journal_entries_calculation_id_fkey"
            columns: ["calculation_id"]
            isOneToOne: false
            referencedRelation: "trade_calculations"
            referencedColumns: ["id"]
          },
        ]
      }
      trade_journal_events: {
        Row: {
          created_at: string
          entry_id: string
          event_type: string
          id: string
          payload: Json
          user_id: string
        }
        Insert: {
          created_at?: string
          entry_id: string
          event_type: string
          id?: string
          payload?: Json
          user_id: string
        }
        Update: {
          created_at?: string
          entry_id?: string
          event_type?: string
          id?: string
          payload?: Json
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trade_journal_events_entry_id_fkey"
            columns: ["entry_id"]
            isOneToOne: false
            referencedRelation: "trade_journal_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      trading_diary: {
        Row: {
          created_at: string | null
          direction: string
          emotion_after: string | null
          emotion_before: string | null
          entry_price: number | null
          exit_price: number | null
          id: string
          lessons_learned: string | null
          pair: string
          position_size: number | null
          profit_loss: number | null
          profit_loss_pct: number | null
          screenshot_url: string | null
          strategy_used: string | null
          trade_date: string
          user_id: string | null
          what_to_improve: string | null
          what_went_well: string | null
        }
        Insert: {
          created_at?: string | null
          direction: string
          emotion_after?: string | null
          emotion_before?: string | null
          entry_price?: number | null
          exit_price?: number | null
          id?: string
          lessons_learned?: string | null
          pair: string
          position_size?: number | null
          profit_loss?: number | null
          profit_loss_pct?: number | null
          screenshot_url?: string | null
          strategy_used?: string | null
          trade_date: string
          user_id?: string | null
          what_to_improve?: string | null
          what_went_well?: string | null
        }
        Update: {
          created_at?: string | null
          direction?: string
          emotion_after?: string | null
          emotion_before?: string | null
          entry_price?: number | null
          exit_price?: number | null
          id?: string
          lessons_learned?: string | null
          pair?: string
          position_size?: number | null
          profit_loss?: number | null
          profit_loss_pct?: number | null
          screenshot_url?: string | null
          strategy_used?: string | null
          trade_date?: string
          user_id?: string | null
          what_to_improve?: string | null
          what_went_well?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trading_diary_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_access_context"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "trading_diary_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      trading_diary_trades: {
        Row: {
          auth_user_id: string
          broker_key: string
          created_at: string
          entry_price: number | null
          id: string
          lots_final: number | null
          notes: string | null
          pip_value_position_usd: number | null
          profit_total_usd: number | null
          risk_total_usd: number | null
          rr_ratio: number | null
          side: string
          status: string | null
          stop_loss_price: number | null
          symbol: string
          take_profit_price: number | null
          tick_value_position_usd: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          auth_user_id: string
          broker_key?: string
          created_at?: string
          entry_price?: number | null
          id?: string
          lots_final?: number | null
          notes?: string | null
          pip_value_position_usd?: number | null
          profit_total_usd?: number | null
          risk_total_usd?: number | null
          rr_ratio?: number | null
          side: string
          status?: string | null
          stop_loss_price?: number | null
          symbol: string
          take_profit_price?: number | null
          tick_value_position_usd?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          auth_user_id?: string
          broker_key?: string
          created_at?: string
          entry_price?: number | null
          id?: string
          lots_final?: number | null
          notes?: string | null
          pip_value_position_usd?: number | null
          profit_total_usd?: number | null
          risk_total_usd?: number | null
          rr_ratio?: number | null
          side?: string
          status?: string | null
          stop_loss_price?: number | null
          symbol?: string
          take_profit_price?: number | null
          tick_value_position_usd?: number | null
          updated_at?: string
          user_id?: string | null
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
            referencedRelation: "user_access_context"
            referencedColumns: ["user_id"]
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
            referencedRelation: "user_access_context"
            referencedColumns: ["user_id"]
          },
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
          action: string | null
          auth_user_id: string | null
          created_at: string
          email: string | null
          event_name: string | null
          event_type: string
          event_value: string | null
          id: string
          meta: Json | null
          occurred_at: string
          phone: string | null
          points: number
          props: Json
          user_id: string
        }
        Insert: {
          action?: string | null
          auth_user_id?: string | null
          created_at?: string
          email?: string | null
          event_name?: string | null
          event_type: string
          event_value?: string | null
          id?: string
          meta?: Json | null
          occurred_at?: string
          phone?: string | null
          points?: number
          props?: Json
          user_id: string
        }
        Update: {
          action?: string | null
          auth_user_id?: string | null
          created_at?: string
          email?: string | null
          event_name?: string | null
          event_type?: string
          event_value?: string | null
          id?: string
          meta?: Json | null
          occurred_at?: string
          phone?: string | null
          points?: number
          props?: Json
          user_id?: string
        }
        Relationships: []
      }
      user_feed_stats: {
        Row: {
          client_id: string
          comments_count: number
          created_at: string
          likes_given_count: number
          likes_received_count: number
          posts_count: number
          updated_at: string
          user_id: string
        }
        Insert: {
          client_id: string
          comments_count?: number
          created_at?: string
          likes_given_count?: number
          likes_received_count?: number
          posts_count?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          client_id?: string
          comments_count?: number
          created_at?: string
          likes_given_count?: number
          likes_received_count?: number
          posts_count?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_feed_stats_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_feed_stats_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "user_access_context"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_feed_stats_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_gamification: {
        Row: {
          created_at: string | null
          experience_points: number
          last_activity_at: string | null
          last_activity_date: string | null
          level: number
          streak_days: number
          total_achievements_unlocked: number
          trades_logged: number
          updated_at: string
          user_id: string
          videos_completed: number
          xp: number
          xp_total: number
        }
        Insert: {
          created_at?: string | null
          experience_points?: number
          last_activity_at?: string | null
          last_activity_date?: string | null
          level?: number
          streak_days?: number
          total_achievements_unlocked?: number
          trades_logged?: number
          updated_at?: string
          user_id: string
          videos_completed?: number
          xp?: number
          xp_total?: number
        }
        Update: {
          created_at?: string | null
          experience_points?: number
          last_activity_at?: string | null
          last_activity_date?: string | null
          level?: number
          streak_days?: number
          total_achievements_unlocked?: number
          trades_logged?: number
          updated_at?: string
          user_id?: string
          videos_completed?: number
          xp?: number
          xp_total?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_gamification_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "user_access_context"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_gamification_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_moderation: {
        Row: {
          client_id: string
          created_at: string
          is_shadowbanned: boolean
          shadowban_reason: string | null
          shadowbanned_at: string | null
          shadowbanned_by: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          client_id: string
          created_at?: string
          is_shadowbanned?: boolean
          shadowban_reason?: string | null
          shadowbanned_at?: string | null
          shadowbanned_by?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          client_id?: string
          created_at?: string
          is_shadowbanned?: boolean
          shadowban_reason?: string | null
          shadowbanned_at?: string | null
          shadowbanned_by?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_moderation_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_moderation_shadowbanned_by_fkey"
            columns: ["shadowbanned_by"]
            isOneToOne: false
            referencedRelation: "user_access_context"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_moderation_shadowbanned_by_fkey"
            columns: ["shadowbanned_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_moderation_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "user_access_context"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_moderation_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_onboarding_answers: {
        Row: {
          answers: Json
          client_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          answers?: Json
          client_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          answers?: Json
          client_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "uoa_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "uoa_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_access_context"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "uoa_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          avatar_storage_path: string | null
          avatar_type: string
          avatar_url: string | null
          bio: string | null
          client_id: string
          created_at: string
          is_public: boolean
          nickname: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_storage_path?: string | null
          avatar_type?: string
          avatar_url?: string | null
          bio?: string | null
          client_id: string
          created_at?: string
          is_public?: boolean
          nickname: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_storage_path?: string | null
          avatar_type?: string
          avatar_url?: string | null
          bio?: string | null
          client_id?: string
          created_at?: string
          is_public?: boolean
          nickname?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "user_access_context"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          client_id: string | null
          level: number
          updated_at: string
          user_id: string
        }
        Insert: {
          client_id?: string | null
          level?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          client_id?: string | null
          level?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "user_access_context"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_progress_user_id_fkey"
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
            referencedRelation: "user_access_context"
            referencedColumns: ["user_id"]
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
      user_tip_seen: {
        Row: {
          client_id: string
          seen_at: string
          tip_key: string
          user_id: string
        }
        Insert: {
          client_id: string
          seen_at?: string
          tip_key: string
          user_id: string
        }
        Update: {
          client_id?: string
          seen_at?: string
          tip_key?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_tip_seen_client_fk"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_tip_seen_user_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_access_context"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_tip_seen_user_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_video_recommendations: {
        Row: {
          created_at: string | null
          id: string
          priority: number | null
          reason: string | null
          tier: string | null
          user_id: string | null
          video_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          priority?: number | null
          reason?: string | null
          tier?: string | null
          user_id?: string | null
          video_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          priority?: number | null
          reason?: string | null
          tier?: string | null
          user_id?: string | null
          video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_video_recommendations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_access_context"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_video_recommendations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
            referencedRelation: "user_access_context"
            referencedColumns: ["user_id"]
          },
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
            referencedRelation: "v_user_visible_videos"
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
      user_video_unlocks: {
        Row: {
          client_id: string
          id: string
          quiz_score: number | null
          unlock_reason: string
          unlocked_at: string
          user_id: string
          video_id: string
        }
        Insert: {
          client_id: string
          id?: string
          quiz_score?: number | null
          unlock_reason: string
          unlocked_at?: string
          user_id: string
          video_id: string
        }
        Update: {
          client_id?: string
          id?: string
          quiz_score?: number | null
          unlock_reason?: string
          unlocked_at?: string
          user_id?: string
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_video_unlocks_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "v_user_visible_videos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_video_unlocks_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      user_xp: {
        Row: {
          auth_user_id: string
          level: number
          updated_at: string
          xp_total: number
        }
        Insert: {
          auth_user_id: string
          level?: number
          updated_at?: string
          xp_total?: number
        }
        Update: {
          auth_user_id?: string
          level?: number
          updated_at?: string
          xp_total?: number
        }
        Relationships: []
      }
      user_xp_events: {
        Row: {
          action_key: string | null
          auth_user_id: string
          created_at: string
          event_type: string
          id: string
          meta: Json
          ref_id: string | null
          user_id: string | null
          xp_amount: number | null
          xp_awarded: number
        }
        Insert: {
          action_key?: string | null
          auth_user_id: string
          created_at?: string
          event_type: string
          id?: string
          meta?: Json
          ref_id?: string | null
          user_id?: string | null
          xp_amount?: number | null
          xp_awarded?: number
        }
        Update: {
          action_key?: string | null
          auth_user_id?: string
          created_at?: string
          event_type?: string
          id?: string
          meta?: Json
          ref_id?: string | null
          user_id?: string | null
          xp_amount?: number | null
          xp_awarded?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_xp_events_user_id_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_access_context"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_xp_events_user_id_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          account_opened_at: string | null
          account_status: string | null
          auth_user_id: string | null
          broker_account_id: string | null
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
          phone_prefix: string | null
          quiz_answers: Json | null
          role: string
          updated_at: string | null
        }
        Insert: {
          account_opened_at?: string | null
          account_status?: string | null
          auth_user_id?: string | null
          broker_account_id?: string | null
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
          phone_prefix?: string | null
          quiz_answers?: Json | null
          role?: string
          updated_at?: string | null
        }
        Update: {
          account_opened_at?: string | null
          account_status?: string | null
          auth_user_id?: string | null
          broker_account_id?: string | null
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
          phone_prefix?: string | null
          quiz_answers?: Json | null
          role?: string
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
      video_access_rules: {
        Row: {
          applies_to_asset: Database["public"]["Enums"]["asset_type"] | null
          applies_to_category:
            | Database["public"]["Enums"]["video_category"]
            | null
          applies_to_module: Database["public"]["Enums"]["video_module"] | null
          client_id: string
          created_at: string
          deposit_min_usd: number | null
          grant_visibility: Database["public"]["Enums"]["visibility_type"]
          id: string
          is_active: boolean
          priority: number
          quiz_min_score: number | null
          user_stage: string
        }
        Insert: {
          applies_to_asset?: Database["public"]["Enums"]["asset_type"] | null
          applies_to_category?:
            | Database["public"]["Enums"]["video_category"]
            | null
          applies_to_module?: Database["public"]["Enums"]["video_module"] | null
          client_id: string
          created_at?: string
          deposit_min_usd?: number | null
          grant_visibility?: Database["public"]["Enums"]["visibility_type"]
          id?: string
          is_active?: boolean
          priority?: number
          quiz_min_score?: number | null
          user_stage: string
        }
        Update: {
          applies_to_asset?: Database["public"]["Enums"]["asset_type"] | null
          applies_to_category?:
            | Database["public"]["Enums"]["video_category"]
            | null
          applies_to_module?: Database["public"]["Enums"]["video_module"] | null
          client_id?: string
          created_at?: string
          deposit_min_usd?: number | null
          grant_visibility?: Database["public"]["Enums"]["visibility_type"]
          id?: string
          is_active?: boolean
          priority?: number
          quiz_min_score?: number | null
          user_stage?: string
        }
        Relationships: []
      }
      video_unlock_rules: {
        Row: {
          client_id: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          min_deposit_usd: number | null
          min_quiz_score: number | null
          priority: number | null
          required_level: number | null
          unlock_type: string
          video_id: string
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          min_deposit_usd?: number | null
          min_quiz_score?: number | null
          priority?: number | null
          required_level?: number | null
          unlock_type: string
          video_id: string
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          min_deposit_usd?: number | null
          min_quiz_score?: number | null
          priority?: number | null
          required_level?: number | null
          unlock_type?: string
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "video_unlock_rules_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "v_user_visible_videos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_unlock_rules_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
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
          is_completed: boolean
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
          is_completed?: boolean
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
          is_completed?: boolean
          raw_quiz_answers?: Json | null
          status?: string
          user_id?: string
          video_id?: string
        }
        Relationships: []
      }
      videos: {
        Row: {
          asset_type: Database["public"]["Enums"]["asset_type"]
          audience: Database["public"]["Enums"]["audience_type"] | null
          blocked_by_ai: boolean
          category: string | null
          client_id: string | null
          created_at: string | null
          description: string | null
          difficulty: string | null
          difficulty_score: number
          duration_seconds: number
          for_concerns: string[] | null
          for_experience_level: string[] | null
          for_goals: string[] | null
          for_markets: string[] | null
          for_time_available: string[] | null
          goal: Database["public"]["Enums"]["video_goal"]
          id: string
          is_active: boolean | null
          keywords: string[] | null
          language: string
          language_subtitles: string | null
          level: number
          mandatory: boolean
          market_relevance:
            | Database["public"]["Enums"]["market_relevance"]
            | null
          module: Database["public"]["Enums"]["video_module"]
          order_priority: number | null
          prerequisites: string[]
          presenter_gender: Database["public"]["Enums"]["presenter_gender"]
          risk_level: Database["public"]["Enums"]["risk_level"]
          slug: string
          subcategory: string | null
          subtopic: string | null
          summary: string | null
          thumbnail_url: string | null
          title: string
          topic: string
          transcript: string | null
          updated_at: string | null
          use_case: Database["public"]["Enums"]["use_case"] | null
          version: Database["public"]["Enums"]["video_version"]
          video_id: string
          video_url: string
          visibility: Database["public"]["Enums"]["visibility_type"]
        }
        Insert: {
          asset_type: Database["public"]["Enums"]["asset_type"]
          audience?: Database["public"]["Enums"]["audience_type"] | null
          blocked_by_ai?: boolean
          category?: string | null
          client_id?: string | null
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          difficulty_score: number
          duration_seconds: number
          for_concerns?: string[] | null
          for_experience_level?: string[] | null
          for_goals?: string[] | null
          for_markets?: string[] | null
          for_time_available?: string[] | null
          goal: Database["public"]["Enums"]["video_goal"]
          id?: string
          is_active?: boolean | null
          keywords?: string[] | null
          language?: string
          language_subtitles?: string | null
          level: number
          mandatory?: boolean
          market_relevance?:
            | Database["public"]["Enums"]["market_relevance"]
            | null
          module: Database["public"]["Enums"]["video_module"]
          order_priority?: number | null
          prerequisites?: string[]
          presenter_gender?: Database["public"]["Enums"]["presenter_gender"]
          risk_level: Database["public"]["Enums"]["risk_level"]
          slug: string
          subcategory?: string | null
          subtopic?: string | null
          summary?: string | null
          thumbnail_url?: string | null
          title: string
          topic: string
          transcript?: string | null
          updated_at?: string | null
          use_case?: Database["public"]["Enums"]["use_case"] | null
          version?: Database["public"]["Enums"]["video_version"]
          video_id: string
          video_url: string
          visibility?: Database["public"]["Enums"]["visibility_type"]
        }
        Update: {
          asset_type?: Database["public"]["Enums"]["asset_type"]
          audience?: Database["public"]["Enums"]["audience_type"] | null
          blocked_by_ai?: boolean
          category?: string | null
          client_id?: string | null
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          difficulty_score?: number
          duration_seconds?: number
          for_concerns?: string[] | null
          for_experience_level?: string[] | null
          for_goals?: string[] | null
          for_markets?: string[] | null
          for_time_available?: string[] | null
          goal?: Database["public"]["Enums"]["video_goal"]
          id?: string
          is_active?: boolean | null
          keywords?: string[] | null
          language?: string
          language_subtitles?: string | null
          level?: number
          mandatory?: boolean
          market_relevance?:
            | Database["public"]["Enums"]["market_relevance"]
            | null
          module?: Database["public"]["Enums"]["video_module"]
          order_priority?: number | null
          prerequisites?: string[]
          presenter_gender?: Database["public"]["Enums"]["presenter_gender"]
          risk_level?: Database["public"]["Enums"]["risk_level"]
          slug?: string
          subcategory?: string | null
          subtopic?: string | null
          summary?: string | null
          thumbnail_url?: string | null
          title?: string
          topic?: string
          transcript?: string | null
          updated_at?: string | null
          use_case?: Database["public"]["Enums"]["use_case"] | null
          version?: Database["public"]["Enums"]["video_version"]
          video_id?: string
          video_url?: string
          visibility?: Database["public"]["Enums"]["visibility_type"]
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
      xp_actions: {
        Row: {
          action_key: string
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          xp_points: number
        }
        Insert: {
          action_key: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          xp_points: number
        }
        Update: {
          action_key?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          xp_points?: number
        }
        Relationships: []
      }
      xp_levels: {
        Row: {
          level: number
          min_xp: number
          perks: string | null
          title: string | null
        }
        Insert: {
          level: number
          min_xp: number
          perks?: string | null
          title?: string | null
        }
        Update: {
          level?: number
          min_xp?: number
          perks?: string | null
          title?: string | null
        }
        Relationships: []
      }
      xp_rules: {
        Row: {
          action_key: string
          cooldown_seconds: number | null
          created_at: string
          id: string
          is_active: boolean
          max_per_day: number | null
          points: number
          updated_at: string
        }
        Insert: {
          action_key: string
          cooldown_seconds?: number | null
          created_at?: string
          id?: string
          is_active?: boolean
          max_per_day?: number | null
          points: number
          updated_at?: string
        }
        Update: {
          action_key?: string
          cooldown_seconds?: number | null
          created_at?: string
          id?: string
          is_active?: boolean
          max_per_day?: number | null
          points?: number
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      user_access_context: {
        Row: {
          best_quiz_score: number | null
          client_id: string | null
          total_deposit_usd: number | null
          user_id: string | null
          user_level: number | null
        }
        Insert: {
          best_quiz_score?: never
          client_id?: string | null
          total_deposit_usd?: never
          user_id?: string | null
          user_level?: never
        }
        Update: {
          best_quiz_score?: never
          client_id?: string | null
          total_deposit_usd?: never
          user_id?: string | null
          user_level?: never
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
      user_gamification_with_level: {
        Row: {
          created_at: string | null
          experience_points: number | null
          last_activity_at: string | null
          last_activity_date: string | null
          level: number | null
          level_perks: string | null
          level_title: string | null
          streak_days: number | null
          total_achievements_unlocked: number | null
          trades_logged: number | null
          updated_at: string | null
          user_id: string | null
          videos_completed: number | null
          xp: number | null
          xp_total: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_gamification_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "user_access_context"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_gamification_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      v_feed_activity: {
        Row: {
          client_id: string | null
          content_preview: string | null
          created_at: string | null
          event_type: string | null
          id: string | null
          post_id: string | null
          user_id: string | null
        }
        Relationships: []
      }
      v_feed_post_comments: {
        Row: {
          avatar_url: string | null
          content: string | null
          created_at: string | null
          first_name: string | null
          id: string | null
          last_name: string | null
          nickname: string | null
          post_id: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feed_post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "feed_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feed_post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "v_feed_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feed_post_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_access_context"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "feed_post_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      v_feed_posts: {
        Row: {
          avatar_url: string | null
          client_id: string | null
          comment_count: number | null
          content: string | null
          created_at: string | null
          email: string | null
          first_name: string | null
          id: string | null
          is_official: boolean | null
          last_name: string | null
          like_count: number | null
          liked_by_me: boolean | null
          media_storage_paths: Json | null
          media_urls: Json | null
          moderated_at: string | null
          moderated_by: string | null
          moderation_reason: string | null
          nickname: string | null
          post_type: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feed_posts_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feed_posts_moderated_by_fkey"
            columns: ["moderated_by"]
            isOneToOne: false
            referencedRelation: "user_access_context"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "feed_posts_moderated_by_fkey"
            columns: ["moderated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feed_posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_access_context"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "feed_posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      v_user_gamification: {
        Row: {
          last_activity_at: string | null
          level: number | null
          streak_days: number | null
          updated_at: string | null
          user_id: string | null
          xp_total: number | null
        }
        Insert: {
          last_activity_at?: string | null
          level?: number | null
          streak_days?: number | null
          updated_at?: string | null
          user_id?: string | null
          xp_total?: never
        }
        Update: {
          last_activity_at?: string | null
          level?: number | null
          streak_days?: number | null
          updated_at?: string | null
          user_id?: string | null
          xp_total?: never
        }
        Relationships: [
          {
            foreignKeyName: "user_gamification_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "user_access_context"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_gamification_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      v_user_gamification_auth: {
        Row: {
          auth_user_id: string | null
          last_activity_at: string | null
          level: number | null
          streak_days: number | null
          updated_at: string | null
          user_id: string | null
          xp_total: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_gamification_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "user_access_context"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_gamification_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      v_user_visible_videos: {
        Row: {
          asset_type: Database["public"]["Enums"]["asset_type"] | null
          audience: Database["public"]["Enums"]["audience_type"] | null
          blocked_by_ai: boolean | null
          category: string | null
          client_id: string | null
          created_at: string | null
          description: string | null
          difficulty: string | null
          difficulty_score: number | null
          duration_seconds: number | null
          for_concerns: string[] | null
          for_experience_level: string[] | null
          for_goals: string[] | null
          for_markets: string[] | null
          for_time_available: string[] | null
          goal: Database["public"]["Enums"]["video_goal"] | null
          id: string | null
          is_active: boolean | null
          is_unlocked: boolean | null
          keywords: string[] | null
          language: string | null
          language_subtitles: string | null
          level: number | null
          mandatory: boolean | null
          market_relevance:
            | Database["public"]["Enums"]["market_relevance"]
            | null
          module: Database["public"]["Enums"]["video_module"] | null
          order_priority: number | null
          prerequisites: string[] | null
          presenter_gender:
            | Database["public"]["Enums"]["presenter_gender"]
            | null
          risk_level: Database["public"]["Enums"]["risk_level"] | null
          slug: string | null
          subcategory: string | null
          subtopic: string | null
          summary: string | null
          thumbnail_url: string | null
          title: string | null
          topic: string | null
          transcript: string | null
          updated_at: string | null
          use_case: Database["public"]["Enums"]["use_case"] | null
          version: Database["public"]["Enums"]["video_version"] | null
          video_id: string | null
          video_url: string | null
          visibility: Database["public"]["Enums"]["visibility_type"] | null
        }
        Insert: {
          asset_type?: Database["public"]["Enums"]["asset_type"] | null
          audience?: Database["public"]["Enums"]["audience_type"] | null
          blocked_by_ai?: boolean | null
          category?: string | null
          client_id?: string | null
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          difficulty_score?: number | null
          duration_seconds?: number | null
          for_concerns?: string[] | null
          for_experience_level?: string[] | null
          for_goals?: string[] | null
          for_markets?: string[] | null
          for_time_available?: string[] | null
          goal?: Database["public"]["Enums"]["video_goal"] | null
          id?: string | null
          is_active?: boolean | null
          is_unlocked?: never
          keywords?: string[] | null
          language?: string | null
          language_subtitles?: string | null
          level?: number | null
          mandatory?: boolean | null
          market_relevance?:
            | Database["public"]["Enums"]["market_relevance"]
            | null
          module?: Database["public"]["Enums"]["video_module"] | null
          order_priority?: number | null
          prerequisites?: string[] | null
          presenter_gender?:
            | Database["public"]["Enums"]["presenter_gender"]
            | null
          risk_level?: Database["public"]["Enums"]["risk_level"] | null
          slug?: string | null
          subcategory?: string | null
          subtopic?: string | null
          summary?: string | null
          thumbnail_url?: string | null
          title?: string | null
          topic?: string | null
          transcript?: string | null
          updated_at?: string | null
          use_case?: Database["public"]["Enums"]["use_case"] | null
          version?: Database["public"]["Enums"]["video_version"] | null
          video_id?: string | null
          video_url?: string | null
          visibility?: Database["public"]["Enums"]["visibility_type"] | null
        }
        Update: {
          asset_type?: Database["public"]["Enums"]["asset_type"] | null
          audience?: Database["public"]["Enums"]["audience_type"] | null
          blocked_by_ai?: boolean | null
          category?: string | null
          client_id?: string | null
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          difficulty_score?: number | null
          duration_seconds?: number | null
          for_concerns?: string[] | null
          for_experience_level?: string[] | null
          for_goals?: string[] | null
          for_markets?: string[] | null
          for_time_available?: string[] | null
          goal?: Database["public"]["Enums"]["video_goal"] | null
          id?: string | null
          is_active?: boolean | null
          is_unlocked?: never
          keywords?: string[] | null
          language?: string | null
          language_subtitles?: string | null
          level?: number | null
          mandatory?: boolean | null
          market_relevance?:
            | Database["public"]["Enums"]["market_relevance"]
            | null
          module?: Database["public"]["Enums"]["video_module"] | null
          order_priority?: number | null
          prerequisites?: string[] | null
          presenter_gender?:
            | Database["public"]["Enums"]["presenter_gender"]
            | null
          risk_level?: Database["public"]["Enums"]["risk_level"] | null
          slug?: string | null
          subcategory?: string | null
          subtopic?: string | null
          summary?: string | null
          thumbnail_url?: string | null
          title?: string | null
          topic?: string | null
          transcript?: string | null
          updated_at?: string | null
          use_case?: Database["public"]["Enums"]["use_case"] | null
          version?: Database["public"]["Enums"]["video_version"] | null
          video_id?: string | null
          video_url?: string | null
          visibility?: Database["public"]["Enums"]["visibility_type"] | null
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
    Functions: {
      add_feed_post_comment: {
        Args: { p_content: string; p_post_id: string }
        Returns: string
      }
      award_xp:
        | {
            Args: {
              p_action_key: string
              p_auth_user_id: string
              p_meta?: Json
            }
            Returns: Json
          }
        | {
            Args: {
              p_action_key: string
              p_auth_user_id: string
              p_user_id: string
            }
            Returns: Json
          }
        | {
            Args: { p_event_type: string; p_meta?: Json; p_ref_id?: string }
            Returns: Json
          }
      calc_level_from_xp: { Args: { p_xp: number }; Returns: number }
      complete_video: {
        Args: { p_points: number; p_user_id: string; p_video_id: string }
        Returns: Json
      }
      create_feed_post: {
        Args: {
          p_content: string
          p_media_storage_paths?: Json
          p_post_type?: string
        }
        Returns: string
      }
      create_signup_session: {
        Args: { p_client_slug: string }
        Returns: string
      }
      current_client_id: { Args: never; Returns: string }
      current_public_user_id: { Args: never; Returns: string }
      delete_feed_post_comment: {
        Args: { p_comment_id: string }
        Returns: boolean
      }
      get_gamification: { Args: { uid: string }; Returns: Json }
      increment_user_stats: {
        Args: { p_points: number; p_user_id: string; p_videos: number }
        Returns: Json
      }
      is_super_admin: { Args: { p_auth_user_id: string }; Returns: boolean }
      log_user_event: {
        Args: {
          p_email?: string
          p_event_name: string
          p_phone?: string
          p_props?: Json
        }
        Returns: string
      }
      set_my_profile: {
        Args: {
          p_avatar_storage_path?: string
          p_avatar_type?: string
          p_avatar_url?: string
          p_bio?: string
          p_is_public?: boolean
          p_nickname: string
        }
        Returns: undefined
      }
      toggle_feed_post_like: {
        Args: { p_post_id: string }
        Returns: {
          like_count: number
          liked: boolean
        }[]
      }
      unlock_next_5_videos: {
        Args: {
          p_asset_type: string
          p_client_id: string
          p_level: number
          p_module: string
          p_quiz_id: string
          p_quiz_score: number
          p_user_id: string
        }
        Returns: number
      }
      unlock_next_videos: {
        Args: {
          p_asset_type: string
          p_client_id: string
          p_level: number
          p_module: string
          p_quiz_score: number
          p_unlock_count?: number
          p_user_id: string
        }
        Returns: number
      }
      unlock_next_videos_by_asset: {
        Args: {
          p_asset_type: string
          p_client_id: string
          p_level: number
          p_quiz_id: string
          p_quiz_score: number
          p_unlock_count?: number
          p_user_id: string
        }
        Returns: number
      }
      unlock_next_videos_by_module: {
        Args: {
          p_client_id: string
          p_level: number
          p_module: string
          p_quiz_id: string
          p_quiz_score: number
          p_unlock_count?: number
          p_user_id: string
        }
        Returns: number
      }
      unlock_videos_after_quiz: {
        Args: {
          p_client_id: string
          p_quiz_id: string
          p_quiz_score: number
          p_user_id: string
        }
        Returns: number
      }
    }
    Enums: {
      asset_type:
        | "forex"
        | "stocks"
        | "crypto"
        | "commodities"
        | "indices"
        | "bonds"
      audience_type: "beginner" | "trader" | "investor" | "professional"
      feed_post_status: "pending" | "approved" | "rejected"
      market_relevance: "forex-only" | "multi-asset"
      presenter_gender: "male" | "female" | "neutral"
      risk_level: "low" | "medium" | "high"
      trade_side: "long" | "short"
      trade_status: "planned" | "open" | "closed"
      use_case: "learning" | "onboarding" | "upsell" | "safety"
      video_category:
        | "basics"
        | "mechanics"
        | "risk"
        | "psychology"
        | "strategy"
      video_goal: "understanding" | "execution" | "awareness"
      video_language: "en" | "cs" | "pt" | "es" | "ar" | "pl"
      video_module:
        | "beginner"
        | "foundation"
        | "intermediate"
        | "advanced"
        | "professional"
      video_version: "original" | "localized"
      visibility_type: "public" | "gated" | "internal"
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
      asset_type: [
        "forex",
        "stocks",
        "crypto",
        "commodities",
        "indices",
        "bonds",
      ],
      audience_type: ["beginner", "trader", "investor", "professional"],
      feed_post_status: ["pending", "approved", "rejected"],
      market_relevance: ["forex-only", "multi-asset"],
      presenter_gender: ["male", "female", "neutral"],
      risk_level: ["low", "medium", "high"],
      trade_side: ["long", "short"],
      trade_status: ["planned", "open", "closed"],
      use_case: ["learning", "onboarding", "upsell", "safety"],
      video_category: ["basics", "mechanics", "risk", "psychology", "strategy"],
      video_goal: ["understanding", "execution", "awareness"],
      video_language: ["en", "cs", "pt", "es", "ar", "pl"],
      video_module: [
        "beginner",
        "foundation",
        "intermediate",
        "advanced",
        "professional",
      ],
      video_version: ["original", "localized"],
      visibility_type: ["public", "gated", "internal"],
    },
  },
} as const

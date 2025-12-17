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
          points: number
        }
        Insert: {
          description: string
          icon?: string | null
          id?: string
          key: string
          name: string
          points?: number
        }
        Update: {
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
      trade_calculations: {
        Row: {
          account_balance: number | null
          account_currency: string
          broker_key: string
          created_at: string
          entry_price: number
          id: string
          lots_calculated: number
          lots_final: number
          lots_requested: number | null
          notes: string | null
          risk_per_1lot_usd: number
          risk_total_usd: number
          risk_type: string
          risk_value: number
          side: string
          stop_loss_price: number
          symbol: string
          take_profit_price: number | null
          ticks_to_sl: number
          user_id: string
        }
        Insert: {
          account_balance?: number | null
          account_currency?: string
          broker_key?: string
          created_at?: string
          entry_price: number
          id?: string
          lots_calculated: number
          lots_final: number
          lots_requested?: number | null
          notes?: string | null
          risk_per_1lot_usd: number
          risk_total_usd: number
          risk_type: string
          risk_value: number
          side: string
          stop_loss_price: number
          symbol: string
          take_profit_price?: number | null
          ticks_to_sl: number
          user_id: string
        }
        Update: {
          account_balance?: number | null
          account_currency?: string
          broker_key?: string
          created_at?: string
          entry_price?: number
          id?: string
          lots_calculated?: number
          lots_final?: number
          lots_requested?: number | null
          notes?: string | null
          risk_per_1lot_usd?: number
          risk_total_usd?: number
          risk_type?: string
          risk_value?: number
          side?: string
          stop_loss_price?: number
          symbol?: string
          take_profit_price?: number | null
          ticks_to_sl?: number
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
          experience_points: number
          last_activity_date: string | null
          level: number
          streak_days: number
          user_id: string
          xp: number
        }
        Insert: {
          created_at?: string | null
          experience_points: number
          last_activity_date?: string | null
          level?: number
          streak_days?: number
          user_id: string
          xp?: number
        }
        Update: {
          created_at?: string | null
          experience_points?: number
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
      complete_video: {
        Args: { p_points: number; p_user_id: string; p_video_id: string }
        Returns: Json
      }
      get_gamification: { Args: { uid: string }; Returns: Json }
      increment_user_stats: {
        Args: { p_points: number; p_user_id: string; p_videos: number }
        Returns: Json
      }
    }
    Enums: {
      trade_side: "long" | "short"
      trade_status: "planned" | "open" | "closed"
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
      trade_side: ["long", "short"],
      trade_status: ["planned", "open", "closed"],
    },
  },
} as const

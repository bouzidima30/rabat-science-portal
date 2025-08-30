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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          category: string | null
          created_at: string
          details: string | null
          id: string
          ip_address: unknown | null
          metadata: Json | null
          severity: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          action: string
          category?: string | null
          created_at?: string
          details?: string | null
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          severity?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          action?: string
          category?: string | null
          created_at?: string
          details?: string | null
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          severity?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      cooperations: {
        Row: {
          annee_debut: number | null
          annee_fin: number | null
          appel_offre: string | null
          coordinateur: string | null
          created_at: string
          description: string | null
          domaine_recherche: string | null
          email_coordinateur: string | null
          id: string
          image_url: string | null
          partenaires: string[] | null
          pays: string[] | null
          review_notes: string | null
          reviewed_at: string | null
          reviewer_id: string | null
          status: string | null
          titre: string
          type_cooperation: string
          updated_at: string
        }
        Insert: {
          annee_debut?: number | null
          annee_fin?: number | null
          appel_offre?: string | null
          coordinateur?: string | null
          created_at?: string
          description?: string | null
          domaine_recherche?: string | null
          email_coordinateur?: string | null
          id?: string
          image_url?: string | null
          partenaires?: string[] | null
          pays?: string[] | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewer_id?: string | null
          status?: string | null
          titre: string
          type_cooperation: string
          updated_at?: string
        }
        Update: {
          annee_debut?: number | null
          annee_fin?: number | null
          appel_offre?: string | null
          coordinateur?: string | null
          created_at?: string
          description?: string | null
          domaine_recherche?: string | null
          email_coordinateur?: string | null
          id?: string
          image_url?: string | null
          partenaires?: string[] | null
          pays?: string[] | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewer_id?: string | null
          status?: string | null
          titre?: string
          type_cooperation?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cooperations_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cooperations_versions: {
        Row: {
          annee_debut: number | null
          annee_fin: number | null
          appel_offre: string | null
          change_summary: string | null
          cooperation_id: string
          coordinateur: string | null
          created_at: string | null
          created_by: string
          description: string | null
          domaine_recherche: string | null
          email_coordinateur: string | null
          id: string
          image_url: string | null
          partenaires: string[] | null
          pays: string[] | null
          status: string
          titre: string
          type_cooperation: string
          version_number: number
        }
        Insert: {
          annee_debut?: number | null
          annee_fin?: number | null
          appel_offre?: string | null
          change_summary?: string | null
          cooperation_id: string
          coordinateur?: string | null
          created_at?: string | null
          created_by: string
          description?: string | null
          domaine_recherche?: string | null
          email_coordinateur?: string | null
          id?: string
          image_url?: string | null
          partenaires?: string[] | null
          pays?: string[] | null
          status: string
          titre: string
          type_cooperation: string
          version_number: number
        }
        Update: {
          annee_debut?: number | null
          annee_fin?: number | null
          appel_offre?: string | null
          change_summary?: string | null
          cooperation_id?: string
          coordinateur?: string | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          domaine_recherche?: string | null
          email_coordinateur?: string | null
          id?: string
          image_url?: string | null
          partenaires?: string[] | null
          pays?: string[] | null
          status?: string
          titre?: string
          type_cooperation?: string
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "cooperations_versions_cooperation_id_fkey"
            columns: ["cooperation_id"]
            isOneToOne: false
            referencedRelation: "cooperations"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string
          date_debut: string
          date_fin: string | null
          description: string | null
          heure_debut: string | null
          heure_fin: string | null
          id: string
          image_url: string | null
          lieu: string | null
          review_notes: string | null
          reviewed_at: string | null
          reviewer_id: string | null
          status: string | null
          titre: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          date_debut: string
          date_fin?: string | null
          description?: string | null
          heure_debut?: string | null
          heure_fin?: string | null
          id?: string
          image_url?: string | null
          lieu?: string | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewer_id?: string | null
          status?: string | null
          titre: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          date_debut?: string
          date_fin?: string | null
          description?: string | null
          heure_debut?: string | null
          heure_fin?: string | null
          id?: string
          image_url?: string | null
          lieu?: string | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewer_id?: string | null
          status?: string | null
          titre?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      events_versions: {
        Row: {
          change_summary: string | null
          created_at: string
          created_by: string
          date_debut: string
          date_fin: string | null
          description: string | null
          event_id: string
          heure_debut: string | null
          heure_fin: string | null
          id: string
          image_url: string | null
          lieu: string | null
          status: string
          titre: string
          version_number: number
        }
        Insert: {
          change_summary?: string | null
          created_at?: string
          created_by: string
          date_debut: string
          date_fin?: string | null
          description?: string | null
          event_id: string
          heure_debut?: string | null
          heure_fin?: string | null
          id?: string
          image_url?: string | null
          lieu?: string | null
          status: string
          titre: string
          version_number: number
        }
        Update: {
          change_summary?: string | null
          created_at?: string
          created_by?: string
          date_debut?: string
          date_fin?: string | null
          description?: string | null
          event_id?: string
          heure_debut?: string | null
          heure_fin?: string | null
          id?: string
          image_url?: string | null
          lieu?: string | null
          status?: string
          titre?: string
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "events_versions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_versions_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      file_manager: {
        Row: {
          created_at: string
          file_size: number | null
          file_url: string | null
          id: string
          mime_type: string | null
          name: string
          parent_id: string | null
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          file_size?: number | null
          file_url?: string | null
          id?: string
          mime_type?: string | null
          name: string
          parent_id?: string | null
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          file_size?: number | null
          file_url?: string | null
          id?: string
          mime_type?: string | null
          name?: string
          parent_id?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "file_manager_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "file_manager"
            referencedColumns: ["id"]
          },
        ]
      }
      file_quarantine: {
        Row: {
          created_by: string | null
          file_id: string | null
          id: string
          quarantine_reason: string
          released_at: string | null
          scanned_at: string | null
        }
        Insert: {
          created_by?: string | null
          file_id?: string | null
          id?: string
          quarantine_reason: string
          released_at?: string | null
          scanned_at?: string | null
        }
        Update: {
          created_by?: string | null
          file_id?: string | null
          id?: string
          quarantine_reason?: string
          released_at?: string | null
          scanned_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "file_quarantine_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "file_quarantine_file_id_fkey"
            columns: ["file_id"]
            isOneToOne: true
            referencedRelation: "files"
            referencedColumns: ["id"]
          },
        ]
      }
      files: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          file_size: number | null
          file_url: string
          id: string
          mime_type: string | null
          name: string
          original_name: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          file_size?: number | null
          file_url: string
          id?: string
          mime_type?: string | null
          name: string
          original_name: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          file_size?: number | null
          file_url?: string
          id?: string
          mime_type?: string | null
          name?: string
          original_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      formations: {
        Row: {
          created_at: string
          departement: string | null
          description: string | null
          document_name: string | null
          document_url: string | null
          id: string
          image_url: string | null
          review_notes: string | null
          reviewed_at: string | null
          reviewer_id: string | null
          status: string | null
          titre: string
          type_formation: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          departement?: string | null
          description?: string | null
          document_name?: string | null
          document_url?: string | null
          id?: string
          image_url?: string | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewer_id?: string | null
          status?: string | null
          titre: string
          type_formation: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          departement?: string | null
          description?: string | null
          document_name?: string | null
          document_url?: string | null
          id?: string
          image_url?: string | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewer_id?: string | null
          status?: string | null
          titre?: string
          type_formation?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "formations_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      formations_versions: {
        Row: {
          change_summary: string | null
          created_at: string | null
          created_by: string
          departement: string | null
          description: string | null
          document_name: string | null
          document_url: string | null
          formation_id: string
          id: string
          image_url: string | null
          status: string
          titre: string
          type_formation: string
          version_number: number
        }
        Insert: {
          change_summary?: string | null
          created_at?: string | null
          created_by: string
          departement?: string | null
          description?: string | null
          document_name?: string | null
          document_url?: string | null
          formation_id: string
          id?: string
          image_url?: string | null
          status: string
          titre: string
          type_formation: string
          version_number: number
        }
        Update: {
          change_summary?: string | null
          created_at?: string | null
          created_by?: string
          departement?: string | null
          description?: string | null
          document_name?: string | null
          document_url?: string | null
          formation_id?: string
          id?: string
          image_url?: string | null
          status?: string
          titre?: string
          type_formation?: string
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "formations_versions_formation_id_fkey"
            columns: ["formation_id"]
            isOneToOne: false
            referencedRelation: "formations"
            referencedColumns: ["id"]
          },
        ]
      }
      news: {
        Row: {
          author_id: string | null
          category: Database["public"]["Enums"]["news_category"]
          content: string
          created_at: string
          document_name: string | null
          document_url: string | null
          excerpt: string | null
          id: string
          image_url: string | null
          published: boolean | null
          review_notes: string | null
          reviewed_at: string | null
          reviewer_id: string | null
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          category: Database["public"]["Enums"]["news_category"]
          content: string
          created_at?: string
          document_name?: string | null
          document_url?: string | null
          excerpt?: string | null
          id?: string
          image_url?: string | null
          published?: boolean | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewer_id?: string | null
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          category?: Database["public"]["Enums"]["news_category"]
          content?: string
          created_at?: string
          document_name?: string | null
          document_url?: string | null
          excerpt?: string | null
          id?: string
          image_url?: string | null
          published?: boolean | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewer_id?: string | null
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "news_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "news_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      news_versions: {
        Row: {
          author_id: string | null
          category: Database["public"]["Enums"]["news_category"]
          change_summary: string | null
          content: string
          created_at: string
          created_by: string
          document_name: string | null
          document_url: string | null
          excerpt: string | null
          id: string
          image_url: string | null
          news_id: string
          status: string
          title: string
          version_number: number
        }
        Insert: {
          author_id?: string | null
          category: Database["public"]["Enums"]["news_category"]
          change_summary?: string | null
          content: string
          created_at?: string
          created_by: string
          document_name?: string | null
          document_url?: string | null
          excerpt?: string | null
          id?: string
          image_url?: string | null
          news_id: string
          status: string
          title: string
          version_number: number
        }
        Update: {
          author_id?: string | null
          category?: Database["public"]["Enums"]["news_category"]
          change_summary?: string | null
          content?: string
          created_at?: string
          created_by?: string
          document_name?: string | null
          document_url?: string | null
          excerpt?: string | null
          id?: string
          image_url?: string | null
          news_id?: string
          status?: string
          title?: string
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "news_versions_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "news_versions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "news_versions_news_id_fkey"
            columns: ["news_id"]
            isOneToOne: false
            referencedRelation: "news"
            referencedColumns: ["id"]
          },
        ]
      }
      pages: {
        Row: {
          contenu: string
          created_at: string
          fichiers: string[] | null
          id: string
          image_url: string | null
          review_notes: string | null
          reviewed_at: string | null
          reviewer_id: string | null
          slug: string
          status: string | null
          titre: string
          updated_at: string
        }
        Insert: {
          contenu: string
          created_at?: string
          fichiers?: string[] | null
          id?: string
          image_url?: string | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewer_id?: string | null
          slug: string
          status?: string | null
          titre: string
          updated_at?: string
        }
        Update: {
          contenu?: string
          created_at?: string
          fichiers?: string[] | null
          id?: string
          image_url?: string | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewer_id?: string | null
          slug?: string
          status?: string | null
          titre?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pages_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pages_versions: {
        Row: {
          change_summary: string | null
          contenu: string
          created_at: string | null
          created_by: string
          fichiers: string[] | null
          id: string
          image_url: string | null
          page_id: string
          slug: string
          status: string
          titre: string
          version_number: number
        }
        Insert: {
          change_summary?: string | null
          contenu: string
          created_at?: string | null
          created_by: string
          fichiers?: string[] | null
          id?: string
          image_url?: string | null
          page_id: string
          slug: string
          status: string
          titre: string
          version_number: number
        }
        Update: {
          change_summary?: string | null
          contenu?: string
          created_at?: string | null
          created_by?: string
          fichiers?: string[] | null
          id?: string
          image_url?: string | null
          page_id?: string
          slug?: string
          status?: string
          titre?: string
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "pages_versions_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          role: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          role?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_view_coordinator_email: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_content_owner: {
        Args: { content_author_id: string }
        Returns: boolean
      }
      log_security_event: {
        Args: {
          p_action: string
          p_category?: string
          p_details?: string
          p_metadata?: Json
          p_severity?: string
          p_user_id: string
        }
        Returns: string
      }
    }
    Enums: {
      news_category:
        | "reunion_travail"
        | "nouvelles_informations"
        | "activites_parauniversitaire"
        | "avis_etudiants"
        | "avis_enseignants"
        | "evenements_scientifique"
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
      news_category: [
        "reunion_travail",
        "nouvelles_informations",
        "activites_parauniversitaire",
        "avis_etudiants",
        "avis_enseignants",
        "evenements_scientifique",
      ],
    },
  },
} as const

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          first_name: string
          last_name: string
          full_name: string
          location: string
          location_place_id?: string | null
          location_lat?: number | null
          location_lng?: number | null
          location_city?: string | null
          location_province?: string | null
          location_country?: string | null
          location_barangay?: string | null
          location_region?: string | null
          avatar_url: string | null
          phone: string | null
          bio: string | null
          position: string | null
          company: string | null
          admin_level: string
          created_at: string
          updated_at: string
          completed_data: boolean
          birthday: string | null
          gender: string | null
        }
        Insert: {
          id: string
          email: string
          first_name: string
          last_name: string
          full_name: string
          location: string
          location_place_id?: string | null
          location_lat?: number | null
          location_lng?: number | null
          location_city?: string | null
          location_province?: string | null
          location_country?: string | null
          location_barangay?: string | null
          location_region?: string | null
          avatar_url?: string | null
          phone?: string | null
          bio?: string | null
          position?: string | null
          company?: string | null
          admin_level?: string
          created_at?: string
          updated_at?: string
          completed_data?: boolean
          birthday?: string | null
          gender?: string | null
        }
        Update: {
          id?: string
          email?: string
          first_name?: string
          last_name?: string
          full_name?: string
          location?: string
          location_place_id?: string | null
          location_lat?: number | null
          location_lng?: number | null
          location_city?: string | null
          location_province?: string | null
          location_country?: string | null
          location_barangay?: string | null
          location_region?: string | null
          avatar_url?: string | null
          phone?: string | null
          bio?: string | null
          position?: string | null
          company?: string | null
          admin_level?: string
          created_at?: string
          updated_at?: string
          completed_data?: boolean
          birthday?: string | null
          gender?: string | null
        }
      }
      resumes_extracted: {
        Row: {
          id: string
          user_id: string
          resume_data: Json
          original_filename: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          resume_data: Json
          original_filename?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          resume_data?: Json
          original_filename?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      resumes_generated: {
        Row: {
          id: string
          user_id: string
          original_resume_id: string | null
          generated_resume_data: Json
          template_used: string | null
          generation_metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          original_resume_id?: string | null
          generated_resume_data: Json
          template_used?: string | null
          generation_metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          original_resume_id?: string | null
          generated_resume_data?: Json
          template_used?: string | null
          generation_metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  
  "graphql_public": {
          Tables: {
            [_ in never]: never
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            "graphql":
{ Args: { "extensions"?: Json,"operationName"?: string,"query"?: string,"variables"?: Json }; Returns: Json
                           }
          }
          Enums: {
            [_ in never]: never
          }
          CompositeTypes: {
            [_ in never]: never
          }
        },"public": {
          Tables: {
            "admin_allowlist": {
                  Row: {
                    "email": string
                  }
                  ComputedFields: never
                  Insert: {
                    "email": string
                  }
                  Update: {
                    "email"?: string
                  }
                  Relationships: [
                    
                  ]
                },"admin_users": {
                  Row: {
                    "user_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "user_id": string
                  }
                  Update: {
                    "user_id"?: string
                  }
                  Relationships: [
                    
                  ]
                },"courses": {
                  Row: {
                    "amount": number,"metadata": NonNullable<Json>,"position": number,"published": boolean,"slug": string
                  }
                  ComputedFields: never
                  Insert: {
                    "amount": number,"metadata": NonNullable<Json>,"position"?: number,"published"?: boolean,"slug": string
                  }
                  Update: {
                    "amount"?: number,"metadata"?: NonNullable<Json>,"position"?: number,"published"?: boolean,"slug"?: string
                  }
                  Relationships: [
                    
                  ]
                },"enrollments": {
                  Row: {
                    "course_slug": string,"created_at": string,"user_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "course_slug": string,"created_at"?: string,"user_id": string
                  }
                  Update: {
                    "course_slug"?: string,"created_at"?: string,"user_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "enrollments_course_slug_fkey"
      columns: ["course_slug"]
isOneToOne: false
      referencedRelation: "courses"
      referencedColumns: ["slug"]
    }
                  ]
                },"lesson_progress": {
                  Row: {
                    "completed": boolean,"course_slug": string,"lesson_id": string,"user_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "completed"?: boolean,"course_slug": string,"lesson_id": string,"user_id": string
                  }
                  Update: {
                    "completed"?: boolean,"course_slug"?: string,"lesson_id"?: string,"user_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "lesson_progress_course_slug_lesson_id_fkey"
      columns: ["course_slug","lesson_id"]
isOneToOne: false
      referencedRelation: "lessons"
      referencedColumns: ["course_slug","id"]
    },{
      foreignKeyName: "lesson_progress_user_id_course_slug_fkey"
      columns: ["user_id","course_slug"]
isOneToOne: false
      referencedRelation: "enrollments"
      referencedColumns: ["user_id","course_slug"]
    }
                  ]
                },"lesson_resources": {
                  Row: {
                    "course_slug": string,"lesson_id": string,"resource_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "course_slug": string,"lesson_id": string,"resource_id": string
                  }
                  Update: {
                    "course_slug"?: string,"lesson_id"?: string,"resource_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "lesson_resources_course_slug_lesson_id_fkey"
      columns: ["course_slug","lesson_id"]
isOneToOne: false
      referencedRelation: "lessons"
      referencedColumns: ["course_slug","id"]
    },{
      foreignKeyName: "lesson_resources_resource_id_fkey"
      columns: ["resource_id"]
isOneToOne: false
      referencedRelation: "resources"
      referencedColumns: ["id"]
    }
                  ]
                },"lessons": {
                  Row: {
                    "course_slug": string,"id": string,"preview": boolean,"video_url": string
                  }
                  ComputedFields: never
                  Insert: {
                    "course_slug": string,"id": string,"preview"?: boolean,"video_url": string
                  }
                  Update: {
                    "course_slug"?: string,"id"?: string,"preview"?: boolean,"video_url"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "lessons_course_slug_fkey"
      columns: ["course_slug"]
isOneToOne: false
      referencedRelation: "courses"
      referencedColumns: ["slug"]
    }
                  ]
                },"profiles": {
                  Row: {
                    "avatar_url": string | null,"id": string,"name": string,"username": string
                  }
                  ComputedFields: never
                  Insert: {
                    "avatar_url"?: string | null,"id": string,"name": string,"username"?: string
                  }
                  Update: {
                    "avatar_url"?: string | null,"id"?: string,"name"?: string,"username"?: string
                  }
                  Relationships: [
                    
                  ]
                },"resources": {
                  Row: {
                    "content": string,"description": string,"id": string,"title": string,"type": string
                  }
                  ComputedFields: never
                  Insert: {
                    "content": string,"description": string,"id": string,"title": string,"type": string
                  }
                  Update: {
                    "content"?: string,"description"?: string,"id"?: string,"title"?: string,"type"?: string
                  }
                  Relationships: [
                    
                  ]
                }
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            "account_access_allowed":
{ Args: Record<PropertyKey, never>; Returns: boolean
                           },
"promote_admin_user":
{ Args: { "target_id": string }; Returns: undefined
                           },
"search_admin_users":
{ Args: { "p_admins_only": boolean,"p_limit": number,"p_new_since"?: string,"p_page": number,"p_search": string,"p_statuses": (string)[] }; Returns: Json
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

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  "graphql_public": {
          Enums: {
            
          }
        },"public": {
          Enums: {
            
          }
        }
} as const

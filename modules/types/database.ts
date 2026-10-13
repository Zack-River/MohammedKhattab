
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
            "account_contacts": {
                  Row: {
                    "email": string,"email_verified_at": string | null,"pending_email": string | null,"phone_e164": string | null,"phone_verified_at": string | null,"updated_at": string,"user_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "email": string,"email_verified_at"?: string | null,"pending_email"?: string | null,"phone_e164"?: string | null,"phone_verified_at"?: string | null,"updated_at"?: string,"user_id": string
                  }
                  Update: {
                    "email"?: string,"email_verified_at"?: string | null,"pending_email"?: string | null,"phone_e164"?: string | null,"phone_verified_at"?: string | null,"updated_at"?: string,"user_id"?: string
                  }
                  Relationships: [

                  ]
                },"account_recovery_grants": {
                  Row: {
                    "expires_at": string,"session_id": string,"user_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "expires_at": string,"session_id": string,"user_id": string
                  }
                  Update: {
                    "expires_at"?: string,"session_id"?: string,"user_id"?: string
                  }
                  Relationships: [

                  ]
                },"account_verification_events": {
                  Row: {
                    "field": string,"id": number,"reviewer_id": string | null,"user_id": string,"value": string,"verified_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "field": string,"id"?: never,"reviewer_id"?: string | null,"user_id": string,"value": string,"verified_at"?: string
                  }
                  Update: {
                    "field"?: string,"id"?: never,"reviewer_id"?: string | null,"user_id"?: string,"value"?: string,"verified_at"?: string
                  }
                  Relationships: [

                  ]
                },"admin_allowlist": {
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
                },"commerce_bundle_courses": {
                  Row: {
                    "bundle_slug": string,"course_slug": string,"position": number
                  }
                  ComputedFields: never
                  Insert: {
                    "bundle_slug": string,"course_slug": string,"position": number
                  }
                  Update: {
                    "bundle_slug"?: string,"course_slug"?: string,"position"?: number
                  }
                  Relationships: [
                    {
      foreignKeyName: "commerce_bundle_courses_bundle_slug_fkey"
      columns: ["bundle_slug"]
isOneToOne: false
      referencedRelation: "commerce_bundles"
      referencedColumns: ["slug"]
    },{
      foreignKeyName: "commerce_bundle_courses_course_slug_fkey"
      columns: ["course_slug"]
isOneToOne: false
      referencedRelation: "courses"
      referencedColumns: ["slug"]
    }
                  ]
                },"commerce_bundles": {
                  Row: {
                    "amount_minor": number,"created_at": string,"description": string,"enabled": boolean,"featured": boolean,"revision": number,"slug": string,"title": string,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "amount_minor": number,"created_at"?: string,"description"?: string,"enabled"?: boolean,"featured"?: boolean,"revision"?: number,"slug": string,"title": string,"updated_at"?: string
                  }
                  Update: {
                    "amount_minor"?: number,"created_at"?: string,"description"?: string,"enabled"?: boolean,"featured"?: boolean,"revision"?: number,"slug"?: string,"title"?: string,"updated_at"?: string
                  }
                  Relationships: [

                  ]
                },"commerce_discounts": {
                  Row: {
                    "bundle_slug": string | null,"course_slug": string | null,"created_at": string,"description": string,"discount_type": string,"discount_value": number,"enabled": boolean,"ends_at": string | null,"id": string,"key": string,"kind": string,"maximum_uses": number | null,"minimum_minor": number,"per_user_limit": number,"revision": number,"stackable": boolean,"starts_at": string | null,"title": string,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "bundle_slug"?: string | null,"course_slug"?: string | null,"created_at"?: string,"description"?: string,"discount_type": string,"discount_value": number,"enabled"?: boolean,"ends_at"?: string | null,"id"?: string,"key": string,"kind": string,"maximum_uses"?: number | null,"minimum_minor"?: number,"per_user_limit"?: number,"revision"?: number,"stackable"?: boolean,"starts_at"?: string | null,"title": string,"updated_at"?: string
                  }
                  Update: {
                    "bundle_slug"?: string | null,"course_slug"?: string | null,"created_at"?: string,"description"?: string,"discount_type"?: string,"discount_value"?: number,"enabled"?: boolean,"ends_at"?: string | null,"id"?: string,"key"?: string,"kind"?: string,"maximum_uses"?: number | null,"minimum_minor"?: number,"per_user_limit"?: number,"revision"?: number,"stackable"?: boolean,"starts_at"?: string | null,"title"?: string,"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "commerce_discounts_bundle_slug_fkey"
      columns: ["bundle_slug"]
isOneToOne: false
      referencedRelation: "commerce_bundles"
      referencedColumns: ["slug"]
    },{
      foreignKeyName: "commerce_discounts_course_slug_fkey"
      columns: ["course_slug"]
isOneToOne: false
      referencedRelation: "courses"
      referencedColumns: ["slug"]
    }
                  ]
                },"courses": {
                  Row: {
                    "amount": number,"created_at": string | null,"metadata": NonNullable<Json>,"position": number,"published": boolean,"revision": number,"slug": string,"updated_at": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "amount": number,"created_at"?: string | null,"metadata": NonNullable<Json>,"position"?: number,"published"?: boolean,"revision"?: number,"slug": string,"updated_at"?: string | null
                  }
                  Update: {
                    "amount"?: number,"created_at"?: string | null,"metadata"?: NonNullable<Json>,"position"?: number,"published"?: boolean,"revision"?: number,"slug"?: string,"updated_at"?: string | null
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
                },"live_session_links": {
                  Row: {
                    "join_url": string,"session_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "join_url": string,"session_id": string
                  }
                  Update: {
                    "join_url"?: string,"session_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "live_session_links_session_id_fkey"
      columns: ["session_id"]
isOneToOne: true
      referencedRelation: "live_sessions"
      referencedColumns: ["id"]
    }
                  ]
                },"live_sessions": {
                  Row: {
                    "chapter_id": string | null,"course_slug": string,"created_at": string,"description": string,"enabled": boolean,"ends_at": string,"id": string,"revision": number,"section_id": string | null,"starts_at": string,"timezone": string,"title": string,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "chapter_id"?: string | null,"course_slug": string,"created_at"?: string,"description"?: string,"enabled"?: boolean,"ends_at": string,"id"?: string,"revision"?: number,"section_id"?: string | null,"starts_at": string,"timezone"?: string,"title": string,"updated_at"?: string
                  }
                  Update: {
                    "chapter_id"?: string | null,"course_slug"?: string,"created_at"?: string,"description"?: string,"enabled"?: boolean,"ends_at"?: string,"id"?: string,"revision"?: number,"section_id"?: string | null,"starts_at"?: string,"timezone"?: string,"title"?: string,"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "live_sessions_course_slug_fkey"
      columns: ["course_slug"]
isOneToOne: false
      referencedRelation: "courses"
      referencedColumns: ["slug"]
    }
                  ]
                },"payment_order_items": {
                  Row: {
                    "course_slug": string,"order_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "course_slug": string,"order_id": string
                  }
                  Update: {
                    "course_slug"?: string,"order_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "payment_order_items_course_slug_fkey"
      columns: ["course_slug"]
isOneToOne: false
      referencedRelation: "courses"
      referencedColumns: ["slug"]
    },{
      foreignKeyName: "payment_order_items_order_id_fkey"
      columns: ["order_id"]
isOneToOne: false
      referencedRelation: "payment_orders"
      referencedColumns: ["id"]
    }
                  ]
                },"payment_orders": {
                  Row: {
                    "amount_minor": number,"bundle_slug": string | null,"checkout_url": string | null,"coupon_id": string | null,"course_slug": string | null,"course_title": string,"created_at": string,"currency": string,"expires_at": string,"id": string,"last_checked_at": string | null,"live": boolean,"paid_at": string | null,"pricing_snapshot": Json | null,"provider_intent_key": string | null,"status": string,"transaction_id": number | null,"user_id": string | null
                  }
                  ComputedFields: never
                  Insert: {
                    "amount_minor": number,"bundle_slug"?: string | null,"checkout_url"?: string | null,"coupon_id"?: string | null,"course_slug"?: string | null,"course_title": string,"created_at"?: string,"currency"?: string,"expires_at"?: string,"id"?: string,"last_checked_at"?: string | null,"live": boolean,"paid_at"?: string | null,"pricing_snapshot"?: Json | null,"provider_intent_key"?: string | null,"status"?: string,"transaction_id"?: number | null,"user_id"?: string | null
                  }
                  Update: {
                    "amount_minor"?: number,"bundle_slug"?: string | null,"checkout_url"?: string | null,"coupon_id"?: string | null,"course_slug"?: string | null,"course_title"?: string,"created_at"?: string,"currency"?: string,"expires_at"?: string,"id"?: string,"last_checked_at"?: string | null,"live"?: boolean,"paid_at"?: string | null,"pricing_snapshot"?: Json | null,"provider_intent_key"?: string | null,"status"?: string,"transaction_id"?: number | null,"user_id"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "payment_orders_bundle_slug_fkey"
      columns: ["bundle_slug"]
isOneToOne: false
      referencedRelation: "commerce_bundles"
      referencedColumns: ["slug"]
    },{
      foreignKeyName: "payment_orders_coupon_id_fkey"
      columns: ["coupon_id"]
isOneToOne: false
      referencedRelation: "commerce_discounts"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "payment_orders_course_slug_fkey"
      columns: ["course_slug"]
isOneToOne: false
      referencedRelation: "courses"
      referencedColumns: ["slug"]
    }
                  ]
                },"profiles": {
                  Row: {
                    "avatar_url": string | null,"first_name": string,"id": string,"last_name": string,"name": string,"username": string
                  }
                  ComputedFields: never
                  Insert: {
                    "avatar_url"?: string | null,"first_name"?: string,"id": string,"last_name"?: string,"name": string,"username"?: string
                  }
                  Update: {
                    "avatar_url"?: string | null,"first_name"?: string,"id"?: string,"last_name"?: string,"name"?: string,"username"?: string
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
                },"workshop_templates": {
                  Row: {
                    "bundle_slug": string | null,"course_slug": string | null,"document": NonNullable<Json>,"id": string,"revision": number,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "bundle_slug"?: string | null,"course_slug"?: string | null,"document": NonNullable<Json>,"id"?: string,"revision"?: number,"updated_at"?: string
                  }
                  Update: {
                    "bundle_slug"?: string | null,"course_slug"?: string | null,"document"?: NonNullable<Json>,"id"?: string,"revision"?: number,"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "workshop_templates_bundle_slug_fkey"
      columns: ["bundle_slug"]
isOneToOne: true
      referencedRelation: "commerce_bundles"
      referencedColumns: ["slug"]
    },{
      foreignKeyName: "workshop_templates_course_slug_fkey"
      columns: ["course_slug"]
isOneToOne: true
      referencedRelation: "courses"
      referencedColumns: ["slug"]
    }
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
"admin_dashboard_snapshot":
{ Args: Record<PropertyKey, never>; Returns: Json
                           },
"begin_commerce_payment":
{ Args: { "p_coupon": string,"p_expected"?: number,"p_kind": string,"p_live": boolean,"p_slug": string,"p_user": string }; Returns: Json
                           },
"begin_course_payment":
{ Args: { "p_live": boolean,"p_slug": string,"p_user": string }; Returns: Json
                           },
"catalog_offer_prices":
{ Args: Record<PropertyKey, never>; Returns: Json
                           },
"claim_payment_check":
{ Args: { "p_order": string }; Returns: boolean
                           },
"commerce_bundle_catalog":
{ Args: Record<PropertyKey, never>; Returns: Json
                           },
"confirm_account_contact":
{ Args: { "p_field": string,"p_user_id": string,"p_value": string }; Returns: undefined
                           },
"consume_request_budget":
{ Args: { "p_bucket": string,"p_limit": number,"p_seconds": number }; Returns: Json
                           },
"contacts_verified":
{ Args: Record<PropertyKey, never>; Returns: boolean
                           },
"delete_admin_course":
{ Args: { "p_slug": string }; Returns: undefined
                           },
"delete_commerce_record":
{ Args: { "p_key": string,"p_kind": string,"p_revision": number }; Returns: undefined
                           },
"delete_live_session":
{ Args: { "p_id": string,"p_revision": number }; Returns: boolean
                           },
"is_public_featured_bundle":
{ Args: { "p_slug": string }; Returns: boolean
                           },
"payment_revenue_snapshot":
{ Args: Record<PropertyKey, never>; Returns: Json
                           },
"promote_admin_user":
{ Args: { "target_id": string }; Returns: undefined
                           },
"quote_commerce":
{ Args: { "p_coupon"?: string,"p_kind": string,"p_slug": string,"p_user"?: string }; Returns: Json
                           },
"save_account_settings":
{ Args: { "p_first_name": string,"p_last_name": string,"p_phone": string,"p_user_id": string,"p_username": string }; Returns: undefined
                           },
"save_admin_curriculum":
{ Args: { "p_deleted_id"?: string,"p_lesson"?: Json,"p_modules": Json,"p_revision": number,"p_slug": string }; Returns: undefined
                           },
"save_commerce_bundle":
{ Args: { "p_input": Json }; Returns: undefined
                           },
"save_commerce_discount":
{ Args: { "p_input": Json,"p_kind": string }; Returns: undefined
                           },
"save_live_session":
{ Args: { "p_input": Json }; Returns: string
                           },
"search_admin_courses":
{ Args: { "p_category"?: string,"p_delivery"?: string,"p_direction"?: string,"p_limit"?: number,"p_page"?: number,"p_search"?: string,"p_sort"?: string,"p_statuses"?: (string)[] }; Returns: Json
                           },
"search_admin_users":
{ Args: { "p_admins_only": boolean,"p_limit": number,"p_new_since"?: string,"p_page": number,"p_search": string,"p_search_mode"?: string,"p_statuses": (string)[] }; Returns: Json
                           },
"settle_course_payment":
{ Args: { "p_amount": number,"p_currency": string,"p_intent": string,"p_order": string,"p_transaction": number }; Returns: undefined
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

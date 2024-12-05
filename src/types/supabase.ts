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
      data_types: {
        Row: {
          data_type: string
          id: string
          satellite_id: string
        }
        Insert: {
          data_type: string
          id?: string
          satellite_id: string
        }
        Update: {
          data_type?: string
          id?: string
          satellite_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "data_types_satellite_id_fkey"
            columns: ["satellite_id"]
            isOneToOne: false
            referencedRelation: "satellites"
            referencedColumns: ["id"]
          },
        ]
      }
      downlink_data: {
        Row: {
          com_sequence_number: string | null
          created_at: string
          data: string | null
          header: string | null
          id: string
          pass_id: string | null
          uplink_id: string | null
        }
        Insert: {
          com_sequence_number?: string | null
          created_at?: string
          data?: string | null
          header?: string | null
          id?: string
          pass_id?: string | null
          uplink_id?: string | null
        }
        Update: {
          com_sequence_number?: string | null
          created_at?: string
          data?: string | null
          header?: string | null
          id?: string
          pass_id?: string | null
          uplink_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "downlink_data_schedule_id_fkey"
            columns: ["pass_id"]
            isOneToOne: false
            referencedRelation: "passes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "downlink_data_uplink_id_fkey"
            columns: ["uplink_id"]
            isOneToOne: false
            referencedRelation: "uplink_pool"
            referencedColumns: ["id"]
          },
        ]
      }
      ground_stations: {
        Row: {
          altitude: number
          call_sign: string | null
          id: string
          latitude: number
          longitude: number
          name: string
        }
        Insert: {
          altitude: number
          call_sign?: string | null
          id?: string
          latitude: number
          longitude: number
          name: string
        }
        Update: {
          altitude?: number
          call_sign?: string | null
          id?: string
          latitude?: number
          longitude?: number
          name?: string
        }
        Relationships: []
      }
      in_memory_address: {
        Row: {
          created_at: string
          end_address: number | null
          id: string
          satellite_id: string | null
          start_address: number | null
        }
        Insert: {
          created_at?: string
          end_address?: number | null
          id?: string
          satellite_id?: string | null
          start_address?: number | null
        }
        Update: {
          created_at?: string
          end_address?: number | null
          id?: string
          satellite_id?: string | null
          start_address?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "in_memory_address_satellite_id_fkey"
            columns: ["satellite_id"]
            isOneToOne: false
            referencedRelation: "satellites"
            referencedColumns: ["id"]
          },
        ]
      }
      operations: {
        Row: {
          commands: string[] | null
          create_user_id: string | null
          created_at: string
          id: number
          pass_id: string | null
          qc1: string | null
          qc2: string | null
          update_at: string | null
        }
        Insert: {
          commands?: string[] | null
          create_user_id?: string | null
          created_at?: string
          id?: number
          pass_id?: string | null
          qc1?: string | null
          qc2?: string | null
          update_at?: string | null
        }
        Update: {
          commands?: string[] | null
          create_user_id?: string | null
          created_at?: string
          id?: number
          pass_id?: string | null
          qc1?: string | null
          qc2?: string | null
          update_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "operation_satellite_schedule_id_fkey"
            columns: ["pass_id"]
            isOneToOne: false
            referencedRelation: "passes"
            referencedColumns: ["id"]
          },
        ]
      }
      parsed_tle: {
        Row: {
          b_star_drag_term: number | null
          classification: string | null
          created_at: string
          eccentricity: number | null
          element_set_number: number | null
          ephemeris_type: number | null
          epoch_day: number | null
          epoch_year: number | null
          id: number
          inclination: number | null
          launch_number: number | null
          launch_piece: string | null
          launch_year: number | null
          mean_anomaly: number | null
          mean_motion: number | null
          mean_motion_first_derivative: number | null
          mean_motion_second_derivative: number | null
          perigee_argument: number | null
          revolution_number: number | null
          right_ascension: number | null
          satellite_id: string | null
        }
        Insert: {
          b_star_drag_term?: number | null
          classification?: string | null
          created_at?: string
          eccentricity?: number | null
          element_set_number?: number | null
          ephemeris_type?: number | null
          epoch_day?: number | null
          epoch_year?: number | null
          id?: number
          inclination?: number | null
          launch_number?: number | null
          launch_piece?: string | null
          launch_year?: number | null
          mean_anomaly?: number | null
          mean_motion?: number | null
          mean_motion_first_derivative?: number | null
          mean_motion_second_derivative?: number | null
          perigee_argument?: number | null
          revolution_number?: number | null
          right_ascension?: number | null
          satellite_id?: string | null
        }
        Update: {
          b_star_drag_term?: number | null
          classification?: string | null
          created_at?: string
          eccentricity?: number | null
          element_set_number?: number | null
          ephemeris_type?: number | null
          epoch_day?: number | null
          epoch_year?: number | null
          id?: number
          inclination?: number | null
          launch_number?: number | null
          launch_piece?: string | null
          launch_year?: number | null
          mean_anomaly?: number | null
          mean_motion?: number | null
          mean_motion_first_derivative?: number | null
          mean_motion_second_derivative?: number | null
          perigee_argument?: number | null
          revolution_number?: number | null
          right_ascension?: number | null
          satellite_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "parsed_tle_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "tle"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parsed_tle_satellite_id_fkey"
            columns: ["satellite_id"]
            isOneToOne: false
            referencedRelation: "satellites"
            referencedColumns: ["id"]
          },
        ]
      }
      passes: {
        Row: {
          aos_azimuth: number | null
          aos_time: string | null
          country: Json | null
          created_at: string
          ground_station_id: string | null
          id: string
          los_azimuth: number | null
          los_time: string | null
          max_azimuth: number | null
          max_elevation: number | null
          satellite_id: string | null
          tle_id: number | null
          update_at: string | null
          updates_count: number | null
        }
        Insert: {
          aos_azimuth?: number | null
          aos_time?: string | null
          country?: Json | null
          created_at?: string
          ground_station_id?: string | null
          id?: string
          los_azimuth?: number | null
          los_time?: string | null
          max_azimuth?: number | null
          max_elevation?: number | null
          satellite_id?: string | null
          tle_id?: number | null
          update_at?: string | null
          updates_count?: number | null
        }
        Update: {
          aos_azimuth?: number | null
          aos_time?: string | null
          country?: Json | null
          created_at?: string
          ground_station_id?: string | null
          id?: string
          los_azimuth?: number | null
          los_time?: string | null
          max_azimuth?: number | null
          max_elevation?: number | null
          satellite_id?: string | null
          tle_id?: number | null
          update_at?: string | null
          updates_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "passes_ground_staton_id_fkey"
            columns: ["ground_station_id"]
            isOneToOne: false
            referencedRelation: "ground_stations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "satellite_schedule_satellite_id_fkey"
            columns: ["satellite_id"]
            isOneToOne: false
            referencedRelation: "satellites"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "satellite_schedule_tle_id_fkey"
            columns: ["tle_id"]
            isOneToOne: false
            referencedRelation: "tle"
            referencedColumns: ["id"]
          },
        ]
      }
      satellite_radio: {
        Row: {
          call_sign: string | null
          downlink_frequency: number
          id: string
          satellite_id: string
          uplink_frequency: number | null
        }
        Insert: {
          call_sign?: string | null
          downlink_frequency: number
          id?: string
          satellite_id: string
          uplink_frequency?: number | null
        }
        Update: {
          call_sign?: string | null
          downlink_frequency?: number
          id?: string
          satellite_id?: string
          uplink_frequency?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "satellite_radio_satellite_id_fkey"
            columns: ["satellite_id"]
            isOneToOne: false
            referencedRelation: "satellites"
            referencedColumns: ["id"]
          },
        ]
      }
      satellites: {
        Row: {
          created_at: string
          id: string
          last_updated: string | null
          name: string
          norad_id: number | null
          status: string | null
          tle_fetch_on: boolean
        }
        Insert: {
          created_at?: string
          id?: string
          last_updated?: string | null
          name: string
          norad_id?: number | null
          status?: string | null
          tle_fetch_on?: boolean
        }
        Update: {
          created_at?: string
          id?: string
          last_updated?: string | null
          name?: string
          norad_id?: number | null
          status?: string | null
          tle_fetch_on?: boolean
        }
        Relationships: []
      }
      system_log: {
        Row: {
          created_at: string
          error_code: number | null
          id: number
        }
        Insert: {
          created_at?: string
          error_code?: number | null
          id?: number
        }
        Update: {
          created_at?: string
          error_code?: number | null
          id?: number
        }
        Relationships: []
      }
      tle: {
        Row: {
          content: string | null
          created_at: string
          id: number
          satellite_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: number
          satellite_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: number
          satellite_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tle_satellite_id_fkey"
            columns: ["satellite_id"]
            isOneToOne: false
            referencedRelation: "satellites"
            referencedColumns: ["id"]
          },
        ]
      }
      uplink_log: {
        Row: {
          id: string
          satellite_id: string | null
          transmit_time: string | null
          uplink_pool_id: string | null
        }
        Insert: {
          id?: string
          satellite_id?: string | null
          transmit_time?: string | null
          uplink_pool_id?: string | null
        }
        Update: {
          id?: string
          satellite_id?: string | null
          transmit_time?: string | null
          uplink_pool_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "uplink_log_satellite_id_fkey"
            columns: ["satellite_id"]
            isOneToOne: false
            referencedRelation: "satellites"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "uplink_log_uplink_pool_id_fkey"
            columns: ["uplink_pool_id"]
            isOneToOne: false
            referencedRelation: "uplink_pool"
            referencedColumns: ["id"]
          },
        ]
      }
      uplink_pool: {
        Row: {
          command: string
          data_type_id: string | null
          description: string | null
          id: string
          satellite_id: string | null
        }
        Insert: {
          command: string
          data_type_id?: string | null
          description?: string | null
          id?: string
          satellite_id?: string | null
        }
        Update: {
          command?: string
          data_type_id?: string | null
          description?: string | null
          id?: string
          satellite_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "uplink_pool_data_type_id_fkey"
            columns: ["data_type_id"]
            isOneToOne: false
            referencedRelation: "data_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "uplink_pool_satellite_id_fkey"
            columns: ["satellite_id"]
            isOneToOne: false
            referencedRelation: "satellites"
            referencedColumns: ["id"]
          },
        ]
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


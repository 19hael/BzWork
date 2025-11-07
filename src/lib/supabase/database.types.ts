export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          company_name: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          company_name?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: Partial<Omit<Database["public"]["Tables"]["profiles"]["Insert"], "id">>;
      };
      workspaces: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          owner_id: string;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          owner_id: string;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: Partial<Omit<Database["public"]["Tables"]["workspaces"]["Insert"], "owner_id">>;
      };
      projects: {
        Row: {
          id: string;
          workspace_id: string;
          name: string;
          description: string | null;
          status: "active" | "archived" | "completed";
          color: string | null;
          start_date: string | null;
          end_date: string | null;
          budget: string | null;
          created_by: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          name: string;
          description?: string | null;
          status?: "active" | "archived" | "completed";
          color?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          budget?: string | null;
          created_by?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: Partial<Omit<Database["public"]["Tables"]["projects"]["Insert"], "workspace_id">>;
      };
      tasks: {
        Row: {
          id: string;
          project_id: string;
          title: string;
          description: string | null;
          status: "todo" | "in_progress" | "review" | "done";
          priority: "low" | "medium" | "high" | "urgent";
          assigned_to: string | null;
          due_date: string | null;
          estimated_hours: string | null;
          actual_hours: string | null;
          tags: string[] | null;
          position: number | null;
          created_by: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          project_id: string;
          title: string;
          description?: string | null;
          status?: "todo" | "in_progress" | "review" | "done";
          priority?: "low" | "medium" | "high" | "urgent";
          assigned_to?: string | null;
          due_date?: string | null;
          estimated_hours?: string | null;
          actual_hours?: string | null;
          tags?: string[] | null;
          position?: number | null;
          created_by?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: Partial<Omit<Database["public"]["Tables"]["tasks"]["Insert"], "project_id">>;
      };
      spreadsheets: {
        Row: {
          id: string;
          workspace_id: string;
          name: string;
          description: string | null;
          data: Json | null;
          columns: Json | null;
          linked_project_id: string | null;
          created_by: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          name: string;
          description?: string | null;
          data?: Json | null;
          columns?: Json | null;
          linked_project_id?: string | null;
          created_by?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: Partial<Omit<Database["public"]["Tables"]["spreadsheets"]["Insert"], "workspace_id">>;
      };
      automations: {
        Row: {
          id: string;
          workspace_id: string;
          name: string;
          description: string | null;
          trigger_type: string;
          trigger_config: Json | null;
          actions: Json | null;
          is_active: boolean | null;
          last_run_at: string | null;
          execution_count: number | null;
          created_by: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          name: string;
          description?: string | null;
          trigger_type: string;
          trigger_config?: Json | null;
          actions?: Json | null;
          is_active?: boolean | null;
          last_run_at?: string | null;
          execution_count?: number | null;
          created_by?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: Partial<Omit<Database["public"]["Tables"]["automations"]["Insert"], "workspace_id" | "trigger_type">>;
      };
      automation_logs: {
        Row: {
          id: string;
          automation_id: string;
          status: "success" | "failed" | "running";
          execution_time_ms: number | null;
          error_message: string | null;
          executed_at: string | null;
        };
        Insert: {
          id?: string;
          automation_id: string;
          status: "success" | "failed" | "running";
          execution_time_ms?: number | null;
          error_message?: string | null;
          executed_at?: string | null;
        };
        Update: Partial<Omit<Database["public"]["Tables"]["automation_logs"]["Insert"], "automation_id" | "status">>;
      };
      ai_interactions: {
        Row: {
          id: string;
          user_id: string;
          interaction_type: string;
          input_data: Json | null;
          output_data: Json | null;
          is_simulated: boolean | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          interaction_type: string;
          input_data?: Json | null;
          output_data?: Json | null;
          is_simulated?: boolean | null;
          created_at?: string | null;
        };
        Update: Partial<Omit<Database["public"]["Tables"]["ai_interactions"]["Insert"], "user_id" | "interaction_type">>;
      };
    };
  };
};

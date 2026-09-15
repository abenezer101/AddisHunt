import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export type Database = {
  public: {
    Tables: {
      startups: {
        Row: {
          id: string;
          name: string;
          tagline: string;
          description: string;
          url: string;
          logo_url: string | null;
          founder_id: string;
          status: 'pending' | 'approved' | 'rejected' | null;
          categories: string[];
          pricing_model: string | null;
          twitter_handle: string | null;
          gallery_urls: string[];
          launch_date: string | null;
          votes_count: number;
          created_at: string | null;
        };
        Insert: Omit<Database['public']['Tables']['startups']['Row'], 'id' | 'created_at' | 'votes_count' | 'status' | 'logo_url' | 'pricing_model' | 'twitter_handle' | 'launch_date'> & {
          id?: string;
          votes_count?: number;
          status?: 'pending' | 'approved' | 'rejected' | null;
          logo_url?: string | null;
          pricing_model?: string | null;
          twitter_handle?: string | null;
          launch_date?: string | null;
        };
        Update: Partial<Database['public']['Tables']['startups']['Insert']>;
        Relationships: [];
      };
      votes: {
        Row: { id: string; startup_id: string; user_id: string; created_at: string | null };
        Insert: { startup_id: string; user_id: string };
        Update: Partial<Database['public']['Tables']['votes']['Insert']>;
        Relationships: [];
      };
      comments: {
        Row: {
          id: string;
          startup_id: string;
          user_id: string;
          author_name: string;
          author_avatar: string | null;
          parent_id: string | null;
          content: string;
          votes_count: number;
          created_at: string | null;
        };
        Insert: Omit<Database['public']['Tables']['comments']['Row'], 'id' | 'created_at' | 'votes_count' | 'parent_id' | 'author_avatar'> & {
          id?: string;
          votes_count?: number;
          parent_id?: string | null;
          author_avatar?: string | null;
        };
        Update: Partial<Database['public']['Tables']['comments']['Insert']>;
        Relationships: [];
      };
      comment_votes: {
        Row: { id: string; comment_id: string; user_id: string; created_at: string | null };
        Insert: { comment_id: string; user_id: string };
        Update: Partial<Database['public']['Tables']['comment_votes']['Insert']>;
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

let anonClient: ReturnType<typeof createClient<Database>> | null = null;

export const createAnonSupabaseClient = () => {
  if (!anonClient) {
    anonClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return anonClient;
};

// Browser client using Clerk token or anon key
export const createClerkSupabaseClient = (clerkToken?: string | null) => {
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    global: clerkToken
      ? {
          headers: {
            Authorization: `Bearer ${clerkToken}`,
          },
        }
      : undefined,
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
};

// Admin client to bypass RLS if service role key is provided
export const createAdminSupabaseClient = () => {
  return createClient<Database>(
    supabaseUrl,
    process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey
  );
};

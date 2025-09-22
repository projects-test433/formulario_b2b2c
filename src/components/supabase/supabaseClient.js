import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://uihydxqlndehylsqryxc.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpaHlkeHFsbmRlaHlsc3FyeXhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1NTU3NTUsImV4cCI6MjA3NDEzMTc1NX0.yzSkvYxDiW6yFh1XK3TDSqG4iw6uJIlhaW_UaYqEh9o'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
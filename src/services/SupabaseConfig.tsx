import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

// Pega tu URL y tu clave anónima (pública) aquí
const SUPABASE_URL = "https://ciqsnxgdonidinkfgpdq.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpcXNueGdkb25pZGlua2ZncGRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyMDMzNTQsImV4cCI6MjA5NDc3OTM1NH0.i70U7LNqcn4mWi8OxyIXIa1Urqv15Jshkm8KjJQnui4";


export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});
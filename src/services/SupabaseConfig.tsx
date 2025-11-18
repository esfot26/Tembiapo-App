import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

// Pega tu URL y tu clave anónima (pública) aquí
const SUPABASE_URL = "https://gdemcgldjpodpzafeoes.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkZW1jZ2xkanBvZHB6YWZlb2VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5MzIxOTIsImV4cCI6MjA3NzUwODE5Mn0.AeiK-2XZ5OTfegbzurnW84GxXx_isb-TL3Xt_5UUEZ4";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});
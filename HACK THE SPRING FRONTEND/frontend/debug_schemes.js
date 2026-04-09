const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const SUPABASE_URL = "https://acbiuzxkxnsbqyekytdi.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjYml1enhreG5zYnF5ZWt5dGRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1NDE2MTIsImV4cCI6MjA4OTExNzYxMn0.xvLr34Ap2nFiyNMeFn0taKI3uFiS6Lw7K243vgaWIQc";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkSchemes() {
    const { data, error } = await supabase.from('schemes').select('*');
    if (error) {
        console.error("Error fetching:", error);
    } else {
        console.log(JSON.stringify(data, null, 2));
    }
}

checkSchemes();

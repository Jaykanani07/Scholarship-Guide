const { createClient } = require('@supabase/supabase-js');

    const supabaseUrl = 'https://acbiuzxkxnsbqyekytdi.supabase.co';
    const supabaseKey = 'sb_publishable_i1HdlKcDVO9M61j5hb1DFA_hyLF2z2F';

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;

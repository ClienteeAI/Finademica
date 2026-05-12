const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const OLD_URL = 'https://tcqrhihgxslpzdqcdwbg.supabase.co';
const OLD_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjcXJoaWhneHNscHpkcWNkd2JnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDM1MTg1NCwiZXhwIjoyMDc5OTI3ODU0fQ.OcDNKhS_vwRZqqShcLftoIfqGKtaCjryohDYn4CyvQE';

const oldSupabase = createClient(OLD_URL, OLD_KEY);

async function generatePerfectSQL() {
    console.log('🏗️ Generating Perfect Mirror SQL...');

    // 1. Get Schema Definitions from REST API (this is the most reliable way to get column types quickly)
    const response = await fetch(`${OLD_URL}/rest/v1/`, {
        headers: { 'apikey': OLD_KEY }
    });
    const schema = await response.json();
    const definitions = schema.definitions;

    let sql = `-- ==========================================\n`;
    sql += `-- PERFECT MIRROR INFRASTRUCTURE (67 TABLES)\n`;
    sql += `-- ==========================================\n\n`;
    sql += `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";\n\n`;

    for (const [tableName, definition] of Object.entries(definitions)) {
        if (!definition.properties) continue;

        sql += `-- Table: ${tableName}\n`;
        sql += `CREATE TABLE IF NOT EXISTS public."${tableName}" (\n`;
        
        const columns = [];
        for (const [colName, props] of Object.entries(definition.properties)) {
            let type = props.format || props.type;
            
            // Map types correctly
            if (type === 'uuid') type = 'UUID';
            else if (type === 'timestamp with time zone') type = 'TIMESTAMPTZ';
            else if (type === 'text') type = 'TEXT';
            else if (type === 'boolean') type = 'BOOLEAN';
            else if (type === 'integer') type = 'INTEGER';
            else if (type === 'numeric') type = 'NUMERIC';
            else if (type === 'jsonb') type = 'JSONB';
            else if (type === 'array') {
                const itemType = props.items && props.items.type === 'string' ? 'TEXT[]' : 'JSONB';
                type = itemType;
            }

            let colDef = `    "${colName}" ${type}`;
            if (colName === 'id' && type === 'UUID') {
                colDef += ` PRIMARY KEY DEFAULT gen_random_uuid()`;
            }
            columns.push(colDef);
        }
        
        sql += columns.join(',\n');
        sql += `\n);\n\n`;
    }

    // Add the re-lock client part
    sql += `-- RE-LOCK CLIENT\n`;
    sql += `INSERT INTO public.clients (id, company_name, subdomain, primary_color, company_tagline)\n`;
    sql += `VALUES ('a6151fd9-1513-4ae0-b960-25454f3a9bf2', 'Finademica', 'finademica', '#6366F1', 'The Architecture of Mastery')\n`;
    sql += `ON CONFLICT (id) DO UPDATE SET company_name = EXCLUDED.company_name;\n`;

    fs.writeFileSync('perfect_mirror_infrastructure.sql', sql);
    console.log('✅ Generated perfect_mirror_infrastructure.sql');
}

generatePerfectSQL();

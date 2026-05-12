import fs from 'fs';

const inputPath = 'src/scripts/seed_master_v2.sql';
const outputPath = 'src/scripts/seed_master_v3.sql';

let content = fs.readFileSync(inputPath, 'utf8');

// Add column creation at the start of the DO block
const columnAdd = `
    -- ENSURE COLUMNS EXIST ON ai_quiz_questions for frontend performance
    ALTER TABLE ai_quiz_questions ADD COLUMN IF NOT EXISTS module TEXT;
    ALTER TABLE ai_quiz_questions ADD COLUMN IF NOT EXISTS level TEXT;
`;

content = content.replace('BEGIN', 'BEGIN' + columnAdd);

// Function to update inserts
function updateInserts(content) {
    const sections = [
        { key: 'FOREX BEGINNER', mod: 'forex', lvl: 'Beginner' },
        { key: 'STOCKS BEGINNER', mod: 'stocks', lvl: 'Beginner' },
        { key: 'CRYPTO BEGINNER', mod: 'crypto', lvl: 'Beginner' },
        { key: 'COMMODITIES BEGINNER', mod: 'commodities', lvl: 'Beginner' },
        { key: 'FOREX INTERMEDIATE', mod: 'forex', lvl: 'Intermediate' },
        { key: 'STOCKS INTERMEDIATE', mod: 'stocks', lvl: 'Intermediate' },
        { key: 'CRYPTO INTERMEDIATE', mod: 'crypto', lvl: 'Intermediate' },
        { key: 'COMMODITIES INTERMEDIATE', mod: 'commodities', lvl: 'Intermediate' },
        { key: 'FOREX ELITE', mod: 'forex', lvl: 'Elite' },
        { key: 'STOCKS ELITE', mod: 'stocks', lvl: 'Elite' },
        { key: 'CRYPTO ELITE', mod: 'crypto', lvl: 'Elite' },
        { key: 'COMMODITIES ELITE', mod: 'commodities', lvl: 'Elite' }
    ];

    let newContent = content;

    for (const section of sections) {
        const regex = new RegExp(`-- ${section.key}\\s+INSERT INTO ai_quiz_questions \\(quiz_id, question, options, correct_option, explanation\\) VALUES`, 'g');
        const replacement = `-- ${section.key}\n    INSERT INTO ai_quiz_questions (quiz_id, module, level, question, options, correct_option, explanation) VALUES`;
        newContent = newContent.replace(regex, replacement);

        // Now replace the values part. We look for the values after the insert statement up to the semicolon.
        // The values are in format (quiz_id, 'question', 'options', index, 'explanation')
        // We want (quiz_id, 'module', 'level', 'question', 'options', index, 'explanation')
        
        // This is tricky with regex. Let's find the start of the values.
        const searchStr = `-- ${section.key}\n    INSERT INTO ai_quiz_questions (quiz_id, module, level, question, options, correct_option, explanation) VALUES`;
        const startIndex = newContent.indexOf(searchStr);
        if (startIndex === -1) continue;
        
        const nextInsertIndex = newContent.indexOf('INSERT INTO', startIndex + searchStr.length);
        const endIndex = nextInsertIndex !== -1 ? nextInsertIndex : newContent.indexOf('END $$', startIndex);
        
        let valuesPart = newContent.substring(startIndex + searchStr.length, endIndex);
        
        // Match each row (quiz_id_var, '...', '...', ..., '...')
        // We'll replace the first comma with , 'module', 'level',
        valuesPart = valuesPart.replace(/\(([^,]+),/g, `($1, '${section.mod}', '${section.lvl}',`);
        
        newContent = newContent.substring(0, startIndex + searchStr.length) + valuesPart + newContent.substring(endIndex);
    }

    return newContent;
}

const updatedContent = updateInserts(content);
fs.writeFileSync(outputPath, updatedContent);
console.log("Updated script written to " + outputPath);

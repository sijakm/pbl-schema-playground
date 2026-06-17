const fs = require('fs');

const fileContent = fs.readFileSync('prompts_pbl.js', 'utf8');

// Use a simple regex to extract the JSON part. The file exports a variable `schema` or something similar?
// Since it's a JS file, we might be better off running a script that requires it if it exports properly.

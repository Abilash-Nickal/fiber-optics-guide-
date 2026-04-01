const fs = require('fs');
const pdf = require('pdf-parse');

const files = [
    'resources/FIBERS_01_25.pdf',
    'resources/FIBERS_02_25.pdf',
    'resources/FIBERS_03_25.pdf',
    'resources/FIBERS_04_25.pdf'
];

async function parseFiles() {
    for (const file of files) {
        if (fs.existsSync(file)) {
            const dataBuffer = fs.readFileSync(file);
            try {
                const data = await pdf(dataBuffer, { max: 3 });
                console.log(`\n\n--- CONTENT OF ${file} ---\n`);
                console.log(data.text.substring(0, 1500));
            } catch (err) {
                console.log(`Error parsing ${file}: ${err.message}`);
            }
        }
    }
}

parseFiles();

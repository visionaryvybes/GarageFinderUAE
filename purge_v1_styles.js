const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

function removeV1Styles(filePath) {
    if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;

    let content = fs.readFileSync(filePath, 'utf8');
    const original = content;

    // SAFE PURGE: ONLY MATCH EXACT TAILWIND CLASSES, LEAVE WHITESPACE ALONE
    // 1. Remove ALL rounded classes (e.g., rounded, rounded-lg, rounded-full, rounded-t-xl, rounded-[20px] etc)
    // We use word boundaries \b and match the exact sequence without consuming surrounding spaces that we don't want to lose if they're the only space.
    // Actually, keeping double spaces inside className is fine, Tailwind handles it. We just don't want to destroy newlines.

    content = content.replace(/\brounded(-[(a-zA-Z0-9\[\]\.)]+)?\b/g, '');

    // 2. Remove gradients completely
    content = content.replace(/\bbg-gradient-to-[a-z]{1,2}\b/g, '');
    content = content.replace(/\bfrom-[a-z]+-?[0-9]*(\/[0-9]+)?\b/g, '');
    content = content.replace(/\bvia-[a-z]+-?[0-9]*(\/[0-9]+)?\b/g, '');
    content = content.replace(/\bto-[a-z]+-?[0-9]*(\/[0-9]+)?\b/g, '');
    content = content.replace(/\bto-transparent\b/g, '');
    content = content.replace(/\bbg-clip-text\b/g, '');
    content = content.replace(/\btext-transparent\b/g, ''); // Fixes invisible text where gradients used to be

    // 3. Remove shadows and glows
    content = content.replace(/\bshadow(-[(a-zA-Z0-9\[\]\.)]+)?\b/g, '');
    content = content.replace(/\bdrop-shadow(-[(a-zA-Z0-9\[\]\.)]+)?\b/g, '');
    content = content.replace(/\bblur(-[(a-zA-Z0-9\[\]\.)]+)?\b/g, '');
    content = content.replace(/\bblur\b/g, '');
    content = content.replace(/\bbackdrop-blur(-[(a-zA-Z0-9\[\]\.)]+)?\b/g, '');
    content = content.replace(/\bbackdrop-blur\b/g, '');
    content = content.replace(/\bglass\b/g, ''); // Custom glass class

    // We DO NOT clean up multiple spaces cleanly to avoid breaking \n layout.
    // Double spaces inside className strings are fine. 

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${filePath}`);
    }
}

const targetDirs = [
    path.join(__dirname, 'app'),
    path.join(__dirname, 'components')
];

targetDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
        walkDir(dir, removeV1Styles);
    }
});

console.log("Safe V1 Style Purge Complete");

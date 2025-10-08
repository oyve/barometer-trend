const fs = require("fs");
const path = require("path");

const cjsDir = path.join(__dirname, "../dist/cjs");

function renameJsToCjs(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);

        // If it's a directory, recursively process it
        if (fs.statSync(fullPath).isDirectory()) {
            renameJsToCjs(fullPath);
        } 
        // If it's a .js file, rename it to .cjs
        else if (file.endsWith(".js")) {
            const newFullPath = fullPath.replace(/\.js$/, ".cjs");
            fs.renameSync(fullPath, newFullPath);

            // Update require statements in the renamed file
            let content = fs.readFileSync(newFullPath, "utf8");
            content = content.replace(/require\(['"](\..*?)['"]\)/g, (match, p1) => {
                if (!p1.endsWith(".cjs")) {
                    return `require('${p1}.cjs')`;
                }
                return match;
            });
            fs.writeFileSync(newFullPath, content, "utf8");
        }
    }
}

// Run the script on the cjs directory
renameJsToCjs(cjsDir);

console.log('Renamed .js files to .cjs in the dist/cjs directory and updated require statements.');
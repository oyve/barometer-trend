const fs = require("fs");
const path = require("path");

const esmDir = path.join(__dirname, "../dist/esm");

function addJsExtensions(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);

        // If it's a directory, recursively process it
        if (fs.statSync(fullPath).isDirectory()) {
            addJsExtensions(fullPath);
        } 
        // If it's a .js file, process its content
        else if (file.endsWith(".js")) {
            let content = fs.readFileSync(fullPath, "utf8");

            // Replace import/export paths without .js extensions
            content = content.replace(/from\s+['"](\..*?[^.])['"]/g, (match, p1) => {
                if (!p1.endsWith(".js")) {
                    return `from '${p1}.js'`;
                }
                return match;
            });

            // Write the updated content back to the file
            fs.writeFileSync(fullPath, content, "utf8");
        }
    }
}

// Run the script on the esm directory
addJsExtensions(esmDir);

console.log('Adde JS extensions to EMS files in the dist/esm directory.');
const fs = require("fs");
const path = require("path");

const esmDir = path.join(__dirname, "../dist/esm");
const sourcePredictionsDir = path.join(__dirname, "../src/predictions");
const esmPredictionsDir = path.join(esmDir, "predictions");
for (const file of fs.readdirSync(sourcePredictionsDir).filter(file => file.endsWith(".json"))) {
    fs.copyFileSync(path.join(sourcePredictionsDir, file), path.join(esmPredictionsDir, file));
}

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

            // TypeScript preserves the CommonJS-style JSON requires used by the
            // sources. Provide a local require function in ESM output so those
            // files can also be loaded through the package import condition.
            if (/\brequire\s*\(/.test(content)) {
                content = `import { createRequire } from "node:module";\nconst require = createRequire(import.meta.url);\n${content}`;
            }

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
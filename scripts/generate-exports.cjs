const fs = require('fs');
const path = require('path');

function generateExports(directory) {
  // Define paths
  const cjsDir = path.resolve(__dirname, `../dist/cjs/${directory}`);
  const esmDir = path.resolve(__dirname, `../dist/esm/${directory}`);

  // Get all JavaScript files in the ESM directory
  const files = fs.readdirSync(esmDir).filter(file => file.endsWith('.js'));

  // Initialize the exports field with the default index file
  const exportsField = {
    '.': {
      require: './dist/cjs/index.cjs',
      import: './dist/esm/index.js',
      types: "./dist/types/index.d.ts"
    },
  };

  // Add entries for other files dynamically
  files.forEach(file => {
    const name = `./${path.basename(file, '.js')}`;
    exportsField[name] = {
      require: `./dist/cjs/${directory}/${file.replace('.js', '.cjs')}`,
      import: `./dist/esm/${directory}/${file}`,
      types: `./dist/types/${directory}/${path.basename(file, '.js')}.d.ts`
    };
  });

  // Read, update, and write the package.json file

  console.log(`Generated exports for directory /${directory}`);
  return exportsField;
}

let exportFormulas = generateExports('formulas');
let scalesFormulas = generateExports('scales');

const exportsField = {...exportFormulas, ...scalesFormulas };

const pkgPath = path.resolve(__dirname, '../package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
pkg.exports = exportsField;

fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
console.log('Finished exports in package.json');

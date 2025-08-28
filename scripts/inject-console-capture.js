const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Script to inject console capture into built HTML files
function injectConsoleCapture() {
  const buildDir = path.join(process.cwd(), 'out'); // Next.js static export
  const htmlFiles = glob.sync('**/*.html', { cwd: buildDir });
  
  const scriptTag = '<script src="/dashboard-console-capture.js"></script>';
  
  htmlFiles.forEach(file => {
    const filePath = path.join(buildDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check if script is already injected
    if (content.includes('dashboard-console-capture.js')) {
      return;
    }
    
    // Inject before closing head tag
    const modifiedContent = content.replace(
      '</head>',
      `  ${scriptTag}\n</head>`
    );
    
    fs.writeFileSync(filePath, modifiedContent);
    console.log(`Injected console capture script into ${file}`);
  });
  
  console.log(`Console capture script injected into ${htmlFiles.length} HTML files`);
}

// Run if called directly
if (require.main === module) {
  injectConsoleCapture();
}

module.exports = injectConsoleCapture;
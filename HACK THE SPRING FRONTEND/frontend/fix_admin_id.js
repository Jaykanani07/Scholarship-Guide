const fs = require('fs');
let html = fs.readFileSync('Admin.html', 'utf8');

html = html.replace(/openEditModal\(\$\{sc\.id\}\)/g, "openEditModal('${sc.id}')");
html = html.replace(/deleteScheme\(\$\{sc\.id\}\)/g, "deleteScheme('${sc.id}')");

fs.writeFileSync('Admin.html', html, 'utf8');
console.log("Updated Admin.html successfully");

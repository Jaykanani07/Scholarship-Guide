const fs = require('fs');
const path = require('path');

const frontendDir = __dirname;
const cssFiles = [
    'Education.css', 'Health.css', 'Housing.css', 'Agriculture.css', 
    'Finance.css', 'Business.css', 'Pansion.css'
];

const premiumCategoryCSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@500;600;700;800&display=swap');

body {
    background-color: #f4f7f6;
    font-family: 'Inter', sans-serif;
    color: #333;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

/* Page Header */
.category-header {
    background: linear-gradient(135deg, #0f1f5c 0%, #1a3a8f 40%, #112c66 100%);
    color: white;
    padding: 70px 20px 50px;
    text-align: center;
    position: relative;
    overflow: hidden;
}
.category-header::before {
    content: ''; position: absolute; width: 300px; height: 300px;
    border-radius: 50%; background: rgba(255,209,3,0.08); top: -80px; left: -80px;
}
.category-header h1 {
    font-family: 'Outfit', sans-serif;
    font-size: 2.8rem;
    font-weight: 800;
    margin: 0;
    letter-spacing: 0.5px;
    position: relative; z-index: 1;
}
.category-header p {
    font-family: 'Inter', sans-serif;
    font-size: 1.15rem;
    opacity: 0.9;
    margin-top: 15px;
    position: relative; z-index: 1;
}

/* Grid Container */
.premium-grid {
    display: grid !important;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)) !important;
    gap: 30px !important;
    padding: 50px 20px 80px;
    max-width: 1200px;
    margin: -30px auto 0 auto !important;
    position: relative; z-index: 5;
}

/* Scheme Cards */
.premium-card {
    background: #fff;
    border-radius: 16px;
    border: 1px solid rgba(17, 44, 102, 0.05);
    box-shadow: 0 10px 30px rgba(17, 44, 102, 0.06);
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    overflow: hidden;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.premium-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(17, 44, 102, 0.12);
    border-color: rgba(255, 209, 3, 0.3);
}

.premium-card .card-body {
    padding: 30px 25px;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
}

.premium-card .card-title {
    color: #112c66;
    font-family: 'Outfit', sans-serif;
    font-weight: 700;
    font-size: 1.35rem;
    margin-bottom: 15px;
    line-height: 1.4;
}

.premium-card .card-text {
    color: #555;
    font-size: 0.95rem;
    line-height: 1.6;
    flex-grow: 1;
    margin-bottom: 25px;
}

.premium-btn {
    background: linear-gradient(135deg, #1a3a8f, #112c66);
    border: none;
    border-radius: 10px;
    color: #fff !important;
    font-weight: 600;
    font-size: 0.95rem;
    padding: 14px 20px;
    text-align: center;
    transition: all 0.3s ease;
    text-decoration: none;
    display: block;
    width: 100%;
    margin-top: auto;
    box-shadow: 0 4px 15px rgba(26,58,143,0.2);
}

.premium-btn:hover {
    background: linear-gradient(135deg, #ffd103, #ffb300);
    color: #112c66 !important;
    box-shadow: 0 8px 25px rgba(255, 209, 3, 0.4);
    transform: translateY(-2px);
}

.footer {
    background-color: #0b1d42;
    color: rgba(255,255,255,0.7);
    padding: 30px 20px;
    text-align: center;
    font-family: 'Inter', sans-serif;
    font-size: 0.9rem;
    margin-top: auto;
}

/* Loading/Error states */
.status-msg {
    grid-column: 1 / -1;
    text-align: center;
    padding: 60px 20px;
    color: #112c66;
    font-family: 'Outfit', sans-serif;
    font-weight: 600;
    font-size: 1.4rem;
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(17,44,102,0.05);
}
`;

cssFiles.forEach(file => {
    fs.writeFileSync(path.join(frontendDir, file), premiumCategoryCSS);
    console.log("Updated", file);
});

// Now update update_categories.js
const updateJsPath = path.join(frontendDir, 'update_categories.js');
let updateJs = fs.readFileSync(updateJsPath, 'utf8');

// Replace navbar string
updateJs = updateJs.replace(
    /const navbar_replacement = .*/,
    "const navbar_replacement = '<nav id=\"pageNavbar\" class=\"navbar navbar-expand-lg navbar-dark premium-navbar shadow-sm\"></nav>';"
);

// We need to inject the category-header directly into the JS output where the container is rewritten.
// In update_categories.js, there's: 
// const new_container = '\n<div class="container mt-5" id="schemesContainer" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px;">\n</div>\n';
updateJs = updateJs.replace(
    /const new_container = '.*?';/,
    "const new_container = '\\n<div class=\"category-header\"><h1>' + cat_name + ' Schemes</h1><p>Explore all available government subsidies and assistance</p></div>\\n<div class=\"container premium-grid\" id=\"schemesContainer\">\\n</div>\\n';"
);

// We update the Javascript template inside update_categories.js to use premium classes
updateJs = updateJs.replace(
    /container\.html\('<div class="w-100 text-center py-5"><h4>Loading schemes...<\/h4><\/div>'\);/g,
    "container.html('<div class=\"status-msg\">Loading schemes...</div>');"
);
updateJs = updateJs.replace(
    /container\.html\('<div class="w-100 text-center py-5"><h4 class="text-muted">No schemes available in this category yet.<\/h4><\/div>'\);/g,
    "container.html('<div class=\"status-msg\">No schemes available in this category yet.</div>');"
);
updateJs = updateJs.replace(
    /container\.html\('<div class="w-100 text-center py-5 text-danger"><h4>Error loading schemes. Please try again.<\/h4><\/div>'\);/g,
    "container.html('<div class=\"status-msg\" style=\"color:#e11d48;\">Error loading schemes. Please try again.</div>');"
);

updateJs = updateJs.replace(
    /<div class="card mb-4 shadow-sm" style="width: 100%; border-radius: 12px; border: none; overflow: hidden;">/g,
    "<div class=\"premium-card\">"
);
updateJs = updateJs.replace(
    /<a href="ScholarshipDetail.html\?id=\\\${sc.id}" class="btn btn-primary custom-btn".*?<\/a>/g,
    "<a href=\"ScholarshipDetail.html?id=\\${sc.id}\" class=\"premium-btn\">View Scholarship</a>"
);
updateJs = updateJs.replace(
    /<h4 class="card-title font-weight-bold" style="color: #112c66;">/g,
    "<h4 class=\"card-title\">"
);

fs.writeFileSync(updateJsPath, updateJs);
console.log("Updated update_categories.js");

// Now rewrite NavBar.html to inject global Premium Navbar Styles
const navPath = path.join(frontendDir, 'NavBar.html');
let navHtml = fs.readFileSync(navPath, 'utf8');

const premiumNavStyle = `
<style>
/* Premium Navbar Styles */
.premium-navbar {
    background: rgba(17, 44, 102, 0.98) !important;
    backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    padding: 14px 24px;
    font-family: 'Inter', sans-serif;
}
.premium-navbar .navbar-brand {
    font-family: 'Outfit', sans-serif;
    font-weight: 800;
    color: #fff !important;
    letter-spacing: 0.5px;
    display: flex;
    align-items: center;
    font-size: 22px;
}
.premium-navbar .nav-link {
    color: rgba(255, 255, 255, 0.85) !important;
    font-weight: 500;
    font-size: 15px;
    padding: 8px 18px !important;
    transition: all 0.3s ease;
    border-radius: 8px;
}
.premium-navbar .nav-link:hover {
    color: #ffd103 !important;
    background: rgba(255,255,255,0.05);
}
.premium-navbar .dropdown-menu {
    background: #0f1f5c;
    border: 1px solid rgba(255,255,255,0.1);
    box-shadow: 0 15px 35px rgba(0,0,0,0.3);
    border-radius: 12px;
    margin-top: 15px;
    padding: 12px 0;
}
.premium-navbar .dropdown-item {
    color: rgba(255,255,255,0.85);
    font-weight: 500;
    padding: 10px 24px;
    transition: all 0.2s;
}
.premium-navbar .dropdown-item:hover {
    background: rgba(255, 209, 3, 0.1);
    color: #ffd103;
}
.premium-navbar .btn-outline-custom {
    border: 2px solid #ffd103;
    color: #ffd103;
    background: transparent;
    border-radius: 30px;
    padding: 8px 24px;
    font-weight: 600;
    transition: all 0.3s ease;
}
.premium-navbar .btn-outline-custom:hover {
    background: #ffd103;
    color: #112c66;
    box-shadow: 0 4px 15px rgba(255, 209, 3, 0.4);
}
.premium-navbar .form-control {
    border-radius: 30px;
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.15);
    color: #fff;
    padding: 10px 20px;
    transition: all 0.3s;
}
.premium-navbar .form-control:focus {
    background: rgba(255,255,255,0.15);
    border-color: #ffd103;
    box-shadow: 0 0 0 0.2rem rgba(255, 209, 3, 0.25);
    color: #fff;
}
.premium-navbar .form-control::placeholder {
    color: rgba(255,255,255,0.5);
}
.nav-item.dropdown:hover .dropdown-menu {
    display: block;
}
</style>
`;

if (!navHtml.includes('premium-navbar')) {
    navHtml = navHtml.replace('<script></script>', '<script></script>\n' + premiumNavStyle);
    fs.writeFileSync(navPath, navHtml);
    console.log("Updated NavBar style element");
}

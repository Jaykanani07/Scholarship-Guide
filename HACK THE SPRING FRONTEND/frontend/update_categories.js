const fs = require('fs');
const path = require('path');

const frontend_dir = __dirname;
const categories = {
    "Education.html": "Education",
    "Health.html": "Health",
    "Housing.html": "Housing",
    "Agriculture.HTML": "Agriculture",
    "Finance.html": "Financial schemes",
    "Business.html": "Business",
    "Pansion.html": "Pension"
};

const navbar_replacement = '<nav id="pageNavbar" class="navbar navbar-expand-lg navbar-light bg-light shadow-sm"></nav>';

const javascript_template = (cat) => `
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.3/dist/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js"></script>
    <script>
      $(document).ready(function () {
        $("#pageNavbar").load("NavBar.html");

        const category = "${cat}";
        const container = $("#schemesContainer");
            container.html('<div class="status-msg">Loading schemes...</div>');

        $.ajax({
          url: "http://localhost:3000/schemes/category/" + encodeURIComponent(category),
          method: "GET",
          success: function(data) {
            container.empty();
            if (data.length === 0) {
              container.html('<div class="status-msg">No schemes available in this category yet.</div>');
              return;
            }
            data.forEach(function(sc) {
              let shortDesc = sc.description || "";
              if (shortDesc.length > 80) {
                  shortDesc = shortDesc.substring(0, 77) + '...';
              }
              const card = \`
                <div class="premium-card">
                  <div class="card-body">
                    <h4 class="card-title">\${sc.scheme_name}</h4>
                    <p class="card-text">\${shortDesc}</p>
                    <a href="ScholarshipDetail.html?id=\${sc.id}" class="premium-btn">View Scholarship</a>
                  </div>
                </div>
              \`;
              container.append(card);
            });
          },
          error: function(err) {
            container.html('<div class="status-msg" style="color:#e11d48;">Error loading schemes. Please try again.</div>');
          }
        });
      });
    </script>
</body>
</html>`;

for (const [filename, cat_name] of Object.entries(categories)) {
    const filepath = path.join(frontend_dir, filename);
    if (!fs.existsSync(filepath)) {
        console.log(`File not found: ${filename}`);
        continue;
    }

    let content = fs.readFileSync(filepath, 'utf-8');

    // Replace navbar
    content = content.replace(/<nav[^>]*>[\s\S]*?<\/nav>/, navbar_replacement);

    // Replace the container of cards
    const parts = content.split('<div class="container">');
    if (parts.length >= 2) {
        const sub_parts = parts[1].split('<footer class="footer">');
        if (sub_parts.length >= 2) {
            const new_container = '\\n<div class="category-header"><h1>' + cat_name + ' Schemes</h1><p>Explore all available government subsidies and assistance</p></div>\\n<div class="container premium-grid" id="schemesContainer">\\n</div>\\n';
            
            let footer_and_rest = sub_parts[1].replace(/<script[\s\S]*?<\/script>/g, '');
            footer_and_rest = footer_and_rest.replace('</body>', '').replace('</html>', '').trim();
            
            content = parts[0] + new_container + '<footer class="footer">\\n' + footer_and_rest + javascript_template(cat_name);
        }
    }

    fs.writeFileSync(filepath, content, 'utf-8');
    console.log(`Updated ${filename}`);
}

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

const javascript_template = (cat) => `
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.3/dist/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js"></script>
    <script>
      $(document).ready(function () {
        $("#pageNavbar").load("NavBar.html");

        const category = "${cat}";
        const container = $("#schemesContainer");
        container.html('<div class="w-100 text-center py-5"><h4>Loading schemes...</h4></div>');

        $.ajax({
          url: "https://scholarship-guide.onrender.com/schemes/category/" + encodeURIComponent(category),
          method: "GET",
          success: function(data) {
            container.empty();
            if (data.length === 0) {
              container.html('<div class="w-100 text-center py-5"><h4 class="text-muted">No schemes available in this category yet.</h4></div>');
              return;
            }
            data.forEach(function(sc) {
              // Limiting description to 80 chars so card height of 300px isn't broken
              let shortDesc = sc.description || "";
              if (shortDesc.length > 80) {
                  shortDesc = shortDesc.substring(0, 77) + '...';
              }
              const card = \`
                <div class="card">
                  <h4>\${sc.scheme_name}</h4>
                  <p>\${shortDesc}</p>
                  <a href="ScholarshipDetail.html?id=\${sc.id}" class="btn custom-btn" style="color:white;text-decoration:none;">Apply Now</a>
                </div>
              \`;
              container.append(card);
            });
          },
          error: function(err) {
            container.html('<div class="w-100 text-center py-5 text-danger"><h4>Error loading schemes. Please try again.</h4></div>');
          }
        });
      });
    </script>
</body>
</html>`;

for (const [filename, cat_name] of Object.entries(categories)) {
    const filepath = path.join(frontend_dir, filename);
    if (!fs.existsSync(filepath)) {
        continue;
    }

    let content = fs.readFileSync(filepath, 'utf-8');
    
    // We already wrapped it in <div class="container" id="schemesContainer"> previously.
    // So just replace the script tag.
    content = content.replace(/<script src="https:\/\/ajax\.googleapis\.com[\s\S]*?<\/html>/g, javascript_template(cat_name));
    
    fs.writeFileSync(filepath, content, 'utf-8');
}
console.log("Updated Category Cards with Correct CSS Structures");


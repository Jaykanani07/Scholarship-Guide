import os
import re

frontend_dir = r"d:\scholarship-guide\scholarship-guide\HACK THE SPRING FRONTEND\frontend"
categories = {
    "Education.html": "Education",
    "Health.html": "Health care",
    "Housing.html": "Housing",
    "Agriculture.HTML": "Agriculture",
    "Finance.html": "Financial schemes",
    "Business.html": "Business",
    "Pansion.html": "Pension"
}

navbar_replacement = '<nav id="pageNavbar" class="navbar navbar-expand-lg navbar-light bg-light shadow-sm"></nav>'

javascript_template = """
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.3/dist/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js"></script>
    <script>
      $(document).ready(function () {
        $("#pageNavbar").load("NavBar.html");

        const category = "{category_name}";
        const container = $("#schemesContainer");
        container.html('<div class="w-100 text-center py-5"><h4>Loading schemes...</h4></div>');

        $.ajax({
          url: "http://localhost:3000/schemes/category/" + encodeURIComponent(category),
          method: "GET",
          success: function(data) {
            container.empty();
            if (data.length === 0) {
              container.html('<div class="w-100 text-center py-5"><h4 class="text-muted">No schemes available in this category yet.</h4></div>');
              return;
            }
            data.forEach(function(sc) {
              const card = `
                <div class="card mb-4 shadow-sm" style="width: 100%; border-radius: 12px; border: none; overflow: hidden;">
                  <div class="card-body p-4">
                    <h4 class="card-title font-weight-bold" style="color: #112c66;">${sc.scheme_name}</h4>
                    <p class="card-text text-muted">${sc.description}</p>
                    <a href="ScholarshipDetail.html?id=${sc.id}" class="btn btn-primary custom-btn" style="background-color: #1a3a8f; border: none;">View Scholarship</a>
                  </div>
                </div>
              `;
              container.append(card);
            });
          },
          error: function(err) {
            container.html('<div class="w-100 text-center py-5 text-danger"><h4>Error loading schemes. Please try again.</h4></div>');
          }
        });
      });
    </script>
"""

for filename, cat_name in categories.items():
    filepath = os.path.join(frontend_dir, filename)
    if not os.path.exists(filepath):
        print(f"File not found: {filename}")
        continue
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace navbar
    # Find <nav ...> ... </nav> block
    nav_pattern = re.compile(r'<nav[^>]*>.*?</nav>', re.DOTALL)
    if nav_pattern.search(content):
        content = nav_pattern.sub(navbar_replacement, content, count=1)
    
    # Replace the container of cards
    # Let's find `<div class="container">` that contains cards and replace it
    # We will replace all cards inside the first <div class="container"> after <nav>
    
    # A bit hacky, but robust enough for this html structure:
    # First split by <div class="container">
    parts = content.split('<div class="container">', 1)
    if len(parts) == 2:
        # Find the footer to know where container ends
        sub_parts = parts[1].split('<footer class="footer">', 1)
        if len(sub_parts) == 2:
            new_container = '\n<div class="container mt-5" id="schemesContainer" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px;">\n</div>\n'
            
            # Remove old scripts
            script_pattern = re.compile(r'<script.*?</script>', re.DOTALL)
            footer_and_rest = script_pattern.sub('', sub_parts[1])
            footer_and_rest = footer_and_rest.replace('</body>', '').replace('</html>', '').strip()
            
            # Reconstruct
            content = parts[0] + new_container + '<footer class="footer">\n' + footer_and_rest + javascript_template.replace('{category_name}', cat_name) + '\n</body>\n</html>'

    # Remove extra jq and bs scripts if they were in the footer block we cleaned up
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print(f"Updated {filename}")

const fs = require('fs');
const files = ["Education.html", "Health.html", "Housing.html", "Agriculture.HTML", "Finance.html", "Business.html", "Pansion.html"];
files.forEach(f => {
  try {
    let c = fs.readFileSync(f, 'utf8');
    c = c.replace(/\\n/g, '\n');
    fs.writeFileSync(f, c);
    console.log("Fixed " + f);
  } catch (e) {
    console.log("Error on " + f);
  }
});

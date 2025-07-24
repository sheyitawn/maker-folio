const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const projectsDir = path.join(__dirname, '../../public/content/');
const outputFile = path.join(__dirname, '../../public/data/projects.json');

const projectsData = {};

fs.readdirSync(projectsDir).forEach(folder => {
  const projectPath = path.join(projectsDir, folder);
  if (!fs.lstatSync(projectPath).isDirectory()) return;

  // --- Handle logs ---
  const logFiles = fs.readdirSync(projectPath)
    .filter(file => file.startsWith('log-') && file.endsWith('.md'));

  const logs = logFiles.map(file => {
    const fullPath = path.join(projectPath, file);
    const raw = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(raw);
    return {
      ...data,
      content: content.trim(),
      filename: file
    };
  }).sort((a, b) => new Date(b.date) - new Date(a.date));

  // --- Handle index.json or index.md ---
  let metadata = {};
  const indexJsonPath = path.join(projectPath, 'index.json');
  const indexMdPath = path.join(projectPath, 'index.md');

  if (fs.existsSync(indexJsonPath)) {
    try {
      metadata = JSON.parse(fs.readFileSync(indexJsonPath, 'utf8'));
    } catch (err) {
      console.warn(`❌ Failed to parse index.json in ${folder}: ${err.message}`);
    }
  } else if (fs.existsSync(indexMdPath)) {
    try {
      const raw = fs.readFileSync(indexMdPath, 'utf8');
      const { data } = matter(raw);
      metadata = data;
    } catch (err) {
      console.warn(`❌ Failed to parse index.md in ${folder}: ${err.message}`);
    }
  }

  projectsData[folder] = {
    ...metadata,
    logs
  };
});

fs.mkdirSync(path.dirname(outputFile), { recursive: true });
fs.writeFileSync(outputFile, JSON.stringify(projectsData, null, 2));
console.log(`Projects written to ${outputFile}! ✍️`);

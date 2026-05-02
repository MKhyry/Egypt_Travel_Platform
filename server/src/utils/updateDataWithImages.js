require('dotenv').config();
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../data');
const imageUrlsPath = path.join(dataDir, 'imageUrls.json');

const loadJSON = (file) => {
  const filePath = path.join(dataDir, file);
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

const saveJSON = (file, data) => {
  const filePath = path.join(dataDir, file);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

const updateDataWithImages = () => {
  const imageUrls = loadJSON('imageUrls.json');

  // Process each category
  const categories = [
    { file: 'places.json', key: 'places' },
    { file: 'hotels.json', key: 'hotels' },
    { file: 'packages.json', key: 'packages' },
  ];

  for (const { file, key } of categories) {
    const records = loadJSON(file);
    const urls = imageUrls[key] || {};
    const urlKeys = Object.keys(urls);

    console.log(`\nProcessing ${file} (${records.length} records)...`);

    let matchedCount = 0;

    for (const record of records) {
      const imageKey = record.imageKey;
      if (!imageKey) {
        console.log(`  [SKIP] "${record.name}" has no imageKey`);
        continue;
      }

      const prefix = imageKey + '-';
      const matchingKeys = urlKeys.filter((k) => k.startsWith(prefix));

      if (matchingKeys.length === 0) {
        console.log(`  [WARN] "${record.name}" (${imageKey}) — no matching images found`);
        continue;
      }

      // Sort by the number at the end: extract number from "key-N" pattern
      matchingKeys.sort((a, b) => {
        const numA = parseInt(a.substring(a.lastIndexOf('-') + 1), 10) || 0;
        const numB = parseInt(b.substring(b.lastIndexOf('-') + 1), 10) || 0;
        return numA - numB;
      });

      record.images = matchingKeys.map((k) => urls[k]);
      matchedCount++;
      console.log(`  "${record.name}" — ${matchingKeys.length} image(s): ${matchingKeys.join(', ')}`);
    }

    saveJSON(file, records);
    console.log(`Saved ${file}: ${matchedCount}/${records.length} records updated with images`);
  }

  console.log('\nDone! All data files updated with Cloudinary image URLs.');
};

updateDataWithImages();

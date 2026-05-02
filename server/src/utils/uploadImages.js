require('dotenv').config();
const fs = require('fs');
const path = require('path');
const cloudinary = require('../config/cloudinary');

const projectRoot = path.resolve(__dirname, '../../..');
const imagesDir = path.join(projectRoot, 'images');
const outputPath = path.join(__dirname, '../data/imageUrls.json');

const uploadImage = async (filePath, folder, publicId) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: `egypt-travel/${folder}`,
      public_id: publicId,
      overwrite: false,
    });
    return result.secure_url;
  } catch (err) {
    if (err.http_code === 420 || (err.message && err.message.includes('already exists'))) {
      // Image already exists, fetch existing URL
      const existing = await cloudinary.api.resource(`egypt-travel/${folder}/${publicId}`);
      return existing.secure_url;
    }
    throw err;
  }
};

const uploadAll = async () => {
  const imageUrls = { places: {}, hotels: {}, packages: {} };
  const categories = ['places', 'hotels', 'packages'];

  for (const category of categories) {
    const categoryDir = path.join(imagesDir, category);
    if (!fs.existsSync(categoryDir)) {
      console.log(`Skipping ${category} — directory not found`);
      continue;
    }

    const files = fs.readdirSync(categoryDir).filter((f) => !f.startsWith('.'));
    console.log(`\nUploading ${files.length} images for ${category}...`);

    for (const file of files) {
      const filePath = path.join(categoryDir, file);
      const ext = path.extname(file);
      const publicId = path.basename(file, ext);
      const folder = category;

      try {
        console.log(`  Uploading ${file}...`);
        const url = await uploadImage(filePath, folder, publicId);
        imageUrls[category][publicId] = url;
        console.log(`  Done: ${publicId}`);
      } catch (err) {
        console.error(`  Error uploading ${file}:`, err.message);
      }
    }

    console.log(`Completed ${category}: ${Object.keys(imageUrls[category]).length} images`);
  }

  fs.writeFileSync(outputPath, JSON.stringify(imageUrls, null, 2));
  console.log(`\nSaved image URLs to ${outputPath}`);
  console.log(`Total: ${Object.keys(imageUrls.places).length} places, ${Object.keys(imageUrls.hotels).length} hotels, ${Object.keys(imageUrls.packages).length} packages`);
};

uploadAll().then(() => process.exit(0)).catch((err) => {
  console.error('Upload failed:', err);
  process.exit(1);
});

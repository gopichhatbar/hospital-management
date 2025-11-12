const fs = require('fs');
const axios = require('axios');

async function generateSitemap() {
    console.log("Starting sitemap generation...");

    try {
        // ✅ Fetch all hospitals
        const { data: hospitals } = await axios.get(
            'https://hospital-management-0b6s.onrender.com/addhospital/hospitals'
        );

        let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n`;
        sitemap += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

        // ✅ Add main pages
        sitemap += `  <url><loc>https://mellifluous-pudding-185a54.netlify.app/</loc><priority>1.0</priority></url>\n`;
        sitemap += `  <url><loc>https://mellifluous-pudding-185a54.netlify.app/userRegister</loc><priority>0.8</priority></url>\n`;
        sitemap += `  <url><loc>https://mellifluous-pudding-185a54.netlify.app/userLogin</loc><priority>0.8</priority></url>\n`;

        // ✅ Add all hospitals dynamically
        hospitals.forEach(hospital => {
            sitemap += `  <url>
  <loc>https://mellifluous-pudding-185a54.netlify.app/hospital/${hospital.hospital_id}</loc>
  <priority>0.8</priority>
  <lastmod>${new Date().toISOString()}</lastmod>
</url>\n`;
        });

        sitemap += `</urlset>`;

        const PUBLIC_PATH = '../public';
        // ✅ Ensure public folder exists
        if (!fs.existsSync(PUBLIC_PATH)) {
            fs.mkdirSync(PUBLIC_PATH, { recursive: true });
        }

        fs.writeFileSync(`${PUBLIC_PATH}/sitemap.xml`, sitemap);
        console.log('✅ Sitemap generated in public/sitemap.xml');
    } catch (error) {
        console.error('❌ Error generating sitemap:', error.message);
    }
}

// Run the script
generateSitemap();

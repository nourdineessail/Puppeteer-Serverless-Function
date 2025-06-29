// pages/api/screenshot.js
import chromium from 'chrome-aws-lambda';
import puppeteer from 'puppeteer-core';

export default async function handler(req, res) {
  try {
    // 1️⃣ Launch headless chromium from chrome-aws-lambda
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });

    const page = await browser.newPage();

    // 2️⃣ Your HTML 📄 (you can also pull this from req.body.html)
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Luxurious Black Velvet Cake</title>
      <style>
        body { font-family: Arial, sans-serif; margin:0; padding:0; display:flex; flex-direction:column; align-items:center; background:#fff; }
        .cake-image { width:736px; height:550px; object-fit:cover; }
        .banner { background:#144566; width:736px; text-align:center; padding:20px 0; color:#fff; font-size:26px; font-weight:bold; margin:0; }
        .container { display:flex; flex-direction:column; align-items:center; width:736px; }
      </style>
    </head>
    <body>
      <div class="container">
        <img src="https://i.pinimg.com/736x/90/7a/fb/907afb1de138f136a13a7ca6de8a0bf4.jpg" class="cake-image">
        <div class="banner">Luxurious Black Velvet Cake Recipe</div>
        <img src="https://i.pinimg.com/736x/90/7a/fb/907afb1de138f136a13a7ca6de8a0bf4.jpg" class="cake-image">
      </div>
    </body>
    </html>
    `;

    // 3️⃣ Set viewport (width x total height = 736px x (2×550px + ~60px banner))
    await page.setViewport({ width: 736, height: 550 * 2 + 60 });

    // 4️⃣ Render & screenshot
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const base64 = await page.screenshot({ encoding: 'base64', omitBackground: false });

    await browser.close();

    // 5️⃣ Return as JSON
    res.status(200).json({ image: base64 });
  } catch (err) {
    console.error(err);
    res.status(500).send('Screenshot failed');
  }
}

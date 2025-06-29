// 1. Import puppeteer (Make.com’s Code app includes this)
const puppeteer = require('puppeteer-core');
const fs = require('fs');

(async () => {
    // 2. Your HTML string
    const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Luxurious Black Velvet Cake</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #fff;
              display: flex;
              flex-direction: column;
              align-items: center;
          }
  
          .cake-image {
              width: 736px;
              height: 550px;
              object-fit: cover;
          }
  
          .banner {
              background-color: #144566;
              width: 736px;
              text-align: center;
              padding: 20px 0;
              color: white;
              font-size: 26px;
              font-weight: bold;
              margin: 0;
          }
  
          .container {
              display: flex;
              flex-direction: column;
              align-items: center;
              width: 736px;
          }
      </style>
  </head>
  <body>
  
      <div class="container">
          <img src="https://i.pinimg.com/736x/90/7a/fb/907afb1de138f136a13a7ca6de8a0bf4.jpg" alt="Black Velvet Cake Top" class="cake-image">
  
          <div class="banner">Luxurious Black Velvet Cake Recipe</div>
  
          <img src="https://i.pinimg.com/736x/90/7a/fb/907afb1de138f136a13a7ca6de8a0bf4.jpg" alt="Black Velvet Cake Bottom" class="cake-image">
      </div>
  
  </body>
  </html>
  `;

    // 3. Launch headless Chromium
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
    });
    const page = await browser.newPage();

    // 4. Set the viewport to match your container width + total height
    await page.setViewport({ width: 736, height: 550 * 2 + /* banner */ 60 });

    // 5. Render the HTML
    await page.setContent(html, { waitUntil: 'networkidle0' });

    // 6. Screenshot and get Base64
    const b64 = await page.screenshot({ encoding: 'base64', omitBackground: false });

    // 7. Log or return the Base64 string
    // In Make.com, `console.log()` becomes the module output
    fs.writeFileSync('file.txt', b64);

    await browser.close();
})();

const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Capture all network requests
  await page.setRequestInterception(true);
  page.on('request', request => {
    request.continue();
  });

  // Listen for network responses
  page.on('response', async response => {
    try {
      const responseBody = await response.text();
      const searchKeyword = 'sieg.alexandre'; // Replace with your search term

      if (responseBody.includes(searchKeyword)) {
        console.log(`Found keyword in response of ${response.url()}`);
      }
    } catch (e) {
      // console.error(`Error reading response body: ${e}`);
    }
  });

  // Navigate to your target page
  await page.goto('https://example.com');

  // Do actions on the page if needed...

  // Close browser after some time
  // setTimeout(async () => {
  //   await browser.close();
  // }, 10000);
})();

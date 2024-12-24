const puppeteer = require('puppeteer');
const { consola } = require('consola');

(async () => {
  const searchedKeyword = await consola.prompt('Enter the searched keyword: ');

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
      const searchKeyword = searchedKeyword; // Replace with your search term

      if (responseBody.includes(searchKeyword)) {
        console.log(`Found keyword in response of ${response.url()}`);
      }
    } catch (e) {
      // console.error(`Error reading response body: ${e}`);
    }
  });

  await page.goto('https://www.linkedin.com');
})();

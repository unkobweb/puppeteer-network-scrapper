import puppeteer from 'puppeteer';
import { consola } from 'consola';
import chalk from 'chalk';

(async () => {
  const searchedKeyword = await consola.prompt('Enter the searched keyword: ');
  const caseSensitive = await consola.prompt('Is the search case sensitive? (yes/no): ', {
    type: 'confirm'
  });

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
      let responseBody = await response.text();
      let searchKeyword = searchedKeyword; // Replace with your search term

      if (!caseSensitive) {
        searchKeyword = searchKeyword.toLowerCase();
        responseBody = responseBody.toLowerCase();
      }

      if (responseBody.includes(searchKeyword)) {
        console.log(`${chalk.greenBright.bold('[KEYWORD FOUND]')} ${response.url()}`);
        //if repsonse is valid JSON search in all property (recursively) for the keyword and log the property path
        try {
          const json = JSON.parse(responseBody);
          const searchInObject = (obj, searchKeyword, path = '') => {
            for (const key in obj) {
              if (typeof obj[key] === 'object') {
                searchInObject(obj[key], searchKeyword, `${path}.${key}`);
              } else if (obj[key].includes && obj[key].includes(searchKeyword)) {
                console.log(`${chalk.yellow.bold('[PATH FOUND]')} ${path}.${key}`);
              }
            }
          };
          searchInObject(json, searchKeyword);
        } catch (e) {
          consola.error(`parsing response body as JSON: ${e}`);
        }
      }
    } catch (e) {
      // console.error(`Error reading response body: ${e}`);
    }
  });

  await page.goto('https://www.linkedin.com');
})();

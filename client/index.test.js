import puppeteer from 'puppeteer';
// import sequelize from '../pj-2-legacy-tabtrackr-ts/server/src/config/database.js';
// import VisitModel from '../pj-2-legacy-tabtrackr-ts/server/src/model/model.js';

const EXTENSION_PATH = '../pj-2-legacy-tabtrackr-ts/client/dist';
const EXTENSION_ID = 'jlkcfdokhgakbcpokmbclbdncaglbbec';

let browser;

beforeEach(async () => {
  browser = await puppeteer.launch({
    headless: true,
    args: [
      `--disable-extensions-except=${EXTENSION_PATH}`,
      `--load-extension=${EXTENSION_PATH}`
    ]
  });
});

afterEach(async () => {
  await browser.close();
  browser = undefined;
});

test('title renders correctly', async () => {
  const page = await browser.newPage();
  await page.goto(`chrome-extension://${EXTENSION_ID}/index.html`);
  const h1Text = await page.$eval('h1', h1 => h1.innerText);
  expect(h1Text.slice(0,14)).toBe('Time Tracked: ');
});

test('clicking period button updates title', async () => {
  const page = await browser.newPage();
  await page.goto(`chrome-extension://${EXTENSION_ID}/index.html`);
  const buttons = await page.$$('button');
  const randomButton = buttons[Math.floor(Math.random()*2)];
  const randomButtonText = await (await randomButton.getProperty('innerText')).jsonValue();
  await randomButton.click();
  const h1Text = await page.$eval('h1', h1 => h1.innerText);
  expect(h1Text).toBe(`Time Tracked: ${randomButtonText}`);
});

/* test('displays list of visits', async () => {
  await sequelize.authenticate();
  const visitList = await VisitModel.findOne({where: {}, raw: true});
  const itemContainers = await page.$$eval('.item-containers');
  console.log(itemContainers);
}); */


// KARSTEN'S COMMENTS ABOUT THE RED UNDERLINES

/* Okay so actually there is no need to use the ES6 module syntax (the import ... from ...) as you're not really importing anything anyway, so your tests are standalone. Thus going back to require I could just run the test file with npx jest.
Now why you had the require not defined is probably due to some VSCode feature that knows your package.json has type: module in it so it expects all .js files to follow the ES6 module syntax.
Also, since you'd like to test with a headless browser, there's some more setup required - maybe this package can help: https://www.npmjs.com/package/jest-puppeteer */
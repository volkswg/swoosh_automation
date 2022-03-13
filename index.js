const fs = require("fs");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth"); // Use v2.4.5 instead of latest
const profilemanager = require("./libs/profile-manager");
const automationRegister = require("./libs/automation-manager");
// main iam247 js file
const jsAutoCompId = fs.readFileSync("./js/jsautoswoosh.js", { encoding: "utf8" });

puppeteer.use(StealthPlugin());

const main = async () => {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setUserAgent(
      "5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36"
    );
    await page.setDefaultNavigationTimeout(0);

    // get profile data
    const profile_data = await profilemanager.getProfile(1, 1);
    console.log(profile_data.length);

    /* mode: 
      1 = register
      2 = check email
    */
    const mode = 1;
    const shop = "iam247";
    const the_form_link =
      "https://docs.google.com/forms/d/e/1FAIpQLScav-7uY6uN6oLaWYP3_hfw_ATo1ZbzZt69VDqkEH6hOJDElA/viewform";

    switch (mode) {
      case 1: // register
        for (let e_profile of profile_data) {
          const result = await automationRegister.iamTwentyFourSeven(
            page,
            e_profile,
            the_form_link,
            jsAutoCompId
          );
        }
        break;
      case 2: // check email
        for (let e_profile of profile_data) {
          const result = await automationRegister.automateCheckEmail(page, e_profile);
        }
        break;
    }

    await page.close();
    await browser.close();
  } catch (e) {
    console.log(e);
  }
  return "done";
};

main().then((value) => {
  console.log(value); // Success!
});

const fs = require("fs");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth"); // Use v2.4.5 instead of latest
const profilemanager = require("./libs/profile-manager");
const gmailManager = require("./libs/gmail-manager");
const utility = require("./libs/utility");
const automationRegister = require("./libs/automation-manager");
puppeteer.use(StealthPlugin());

let jsAutoCompId = fs.readFileSync("./js/jsautoswoosh.js", { encoding: "utf8" });

const automateCheckEmail = async (page, profileData) => {
  await gmailManager.loginGmail(page, profileData.email, profileData.password);
  console.log("logged in");
  await utility.delay(2000);
  await page.goto("https://mail.google.com/mail/u/0/#", { waitUntil: "networkidle2" });
  // await browser.waitForNavigation({ waitUntil: "networkidle0" });
  await utility.delay(5000);
  await page.goto("https://mail.google.com/mail/u/0/#spam", { waitUntil: "networkidle2" });
  await utility.delay(5000);
  await gmailManager.logoutGmail(page);
};

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

    switch (mode) {
      case 1: // register
        const the_form_link =
          "https://docs.google.com/forms/d/e/1FAIpQLSf4jumObZ8ltDqzJYQGOTgz2scPqgLE7Lzb-BPCLIbpQm4NpQ/viewform"; // 9, 11
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
          await automateCheckEmail(page, e_profile);
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

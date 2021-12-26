const fs = require("fs");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth"); // Use v2.4.5 instead of latest
puppeteer.use(StealthPlugin());

let jsauto_content = fs.readFileSync("./js/jsautoswoosh.js", { encoding: "utf8" });

// get profile data
const profile_data_obj = require("./profile_data");
const profile_list_data = profile_data_obj.profile_list;
const base_profile = profile_list_data.base_profile;
const other_profile = profile_list_data.other_profile;
let profile_data = [];
profile_data = profile_data.concat(base_profile);
profile_data = profile_data.concat(other_profile);
console.log(profile_data);

const theSize = "11";

const delay = (time) => {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
};

const loginGmail = async (page, username, password) => {
  await page.goto("https://accounts.google.com/signin/v2", { waitUntil: "networkidle2" });
  await page.type('input[type="email"]', username);
  await page.keyboard.press(String.fromCharCode(13));
  await delay(5000);
  console.log("password input", password);
  await page.type('input[type="password"]', password);
  console.log("password typed");
  await page.keyboard.press(String.fromCharCode(13));
};

const logoutGmail = async (page) => {
  const client = await page.target().createCDPSession();
  await client.send("Network.clearBrowserCookies");
  await client.send("Network.clearBrowserCache");
};

// automate register ===========================================================================
const swooshAutomate = async (page, url, fullname, idcard, email, emailForm, phoneNo) => {
  console.log(url, email);
  await page.goto(url, { waitUntil: "networkidle2" });
  await delay(200);
  await page.goto(url, { waitUntil: "networkidle2" });

  // auto filling form
  // set input id
  await page.addScriptTag({
    content: jsauto_content,
  });
  await page.evaluate(() => (document.getElementById("fullname").value = ""));
  await page.type("#fullname", fullname);
  await page.evaluate(() => (document.getElementById("idcard").value = ""));
  await page.type("#idcard", idcard);
  await page.evaluate(() => (document.getElementById("email").value = ""));
  await page.type("#email", emailForm);
  await page.evaluate(() => (document.getElementById("phoneNo").value = ""));
  await page.type("#phoneNo", phoneNo);
  await page.evaluate(() => (document.getElementById("postcode").value = ""));
  await page.type("#postcode", "10150");

  // await page.click("#taxInNo");
  // await page.click("#valiramAgree");
  if (theSize !== null) {
    await page.click(`#shoeSize${theSize}`);
  }
  await page.evaluate(() => (document.getElementById("address").value = ""));
  await page.type(
    "#address",
    "123/84 หมู่บ้านโกลด์เด้นทาวน์สาธร ซอย 3 ถนนกัลปพฤกษ์ แขวงบางขุนเทียน เขตจอมทอง"
  );
  // await page.evaluate(() => (document.getElementById("province").value = ""));
  // await page.type("#province", "กรุงเทพ");
};

const swooshRegister = async (browser, profileData, link) => {
  console.log(profileData.email, profileData.password);
  await loginGmail(browser, profileData.email, profileData.password);
  await delay(3000);
  await swooshAutomate(
    browser,
    link,
    profileData.fullname,
    profileData.idcard,
    profileData.email,
    profileData.email,
    profileData.phoneNo
  );
  await browser.waitForNavigation({ waitUntil: "networkidle0" });
  await delay(2000);
  await logoutGmail(browser);
};
// automate register ===========================================================================

const automateCheckEmail = async (browser, profileData) => {
  await loginGmail(browser, profileData.email, profileData.password);
  console.log("logged in");
  await delay(2000);
  await browser.goto("https://mail.google.com/mail/u/0/#", { waitUntil: "networkidle2" });
  // await browser.waitForNavigation({ waitUntil: "networkidle0" });
  await delay(5000);
  await browser.goto("https://mail.google.com/mail/u/0/#spam", { waitUntil: "networkidle2" });
  await delay(5000);

  await logoutGmail(browser);
};

const main = async () => {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setUserAgent(
      "5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36"
    );
    await page.setDefaultNavigationTimeout(0);

    /* mode: 
      1 = register
      2 = check email
    */
    const mode = 1;

    switch (mode) {
      case 1: // register
        const the_form_link =
          "https://docs.google.com/forms/d/e/1FAIpQLSf4jumObZ8ltDqzJYQGOTgz2scPqgLE7Lzb-BPCLIbpQm4NpQ/viewform"; // 9, 11
        for (let e_profile of profile_data) {
          await swooshRegister(page, e_profile, the_form_link);
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

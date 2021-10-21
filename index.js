const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth"); // Use v2.4.5 instead of latest
const fs = require("fs");
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

const the_form_link =
  "https://docs.google.com/forms/d/e/1FAIpQLSccyms8cKE4YcZqnU9EWh2fM5evhBwVbnMi7_eaS2ULwSyKaA/viewform";
const theSize = "10";
// const theSize = "6.5";

const delay = (time) => {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
};

const loginGmail = async (page, username, password) => {
  await page.goto("https://accounts.google.com/signin/v2", { waitUntil: "networkidle2" });
  await page.type('input[type="email"]', username);
  await page.keyboard.press(String.fromCharCode(13));
  await delay(2000);
  await page.type('input[type="password"]', password);
  await page.keyboard.press(String.fromCharCode(13));
};

const logoutGmail = async (page) => {
  const client = await page.target().createCDPSession();
  await client.send("Network.clearBrowserCookies");
  await client.send("Network.clearBrowserCache");
};

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

  await page.click("#taxInNo");
  await page.click("#valiramAgree");
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

const main = async () => {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setUserAgent(
      "5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36"
    );
    await page.setDefaultNavigationTimeout(0);

    for (let e_profile of profile_data) {
      await loginGmail(page, e_profile.email, e_profile.password);
      await delay(3000);
      await swooshAutomate(
        page,
        the_form_link,
        e_profile.fullname,
        e_profile.idcard,
        e_profile.email,
        e_profile.email,
        e_profile.phoneNo
      );
      await page.waitForNavigation({ waitUntil: "networkidle0" });
      await delay(2000);
      await logoutGmail(page);
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

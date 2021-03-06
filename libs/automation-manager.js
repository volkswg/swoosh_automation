const utility = require("./utility");
const gmailManager = require("./gmail-manager");

module.exports = {
  automateCheckEmail: async (page, profileData) => {
    await gmailManager.loginGmail(page, profileData.email, profileData.password);
    console.log("logged in");
    await utility.delay(2000);
    await page.goto("https://mail.google.com/mail/u/0/#", { waitUntil: "networkidle2" });
    // await browser.waitForNavigation({ waitUntil: "networkidle0" });
    await utility.delay(5000);
    await page.goto("https://mail.google.com/mail/u/0/#spam", { waitUntil: "networkidle2" });
    await utility.delay(5000);
    await gmailManager.logoutGmail(page);
  },
  iamTwentyFourSeven: async (page, profileData, formURL, jsAutoCompId) => {
    console.log(profileData.email, profileData.password);
    await gmailManager.loginGmail(page, profileData.email, profileData.password);
    await utility.delay(3500);
    await page.goto(formURL, { waitUntil: "networkidle2" });
    await utility.delay(200);
    await page.goto(formURL, { waitUntil: "networkidle2" });

    // auto filling form
    // set input id
    await page.addScriptTag({
      content: jsAutoCompId,
    });

    await page.evaluate(() => (document.getElementById("fullname").value = ""));
    await page.type("#fullname", profileData.fullname);
    await page.evaluate(() => (document.getElementById("idcard").value = ""));
    await page.type("#idcard", profileData.idcard);
    await page.evaluate(() => (document.getElementById("email").value = ""));
    await page.type("#email", profileData.email);
    await page.evaluate(() => (document.getElementById("phoneNo").value = ""));
    await page.type("#phoneNo", profileData.phoneNo);
    await page.evaluate(() => (document.getElementById("postcode").value = ""));
    await page.type("#postcode", "10150");

    await page.click("#taxInNo");
    await page.click("#valiramAgree");
    if (profileData.shoeSize !== null) {
      await page.click(`#shoeSize${profileData.shoeSize}`);
    }
    await page.evaluate(() => (document.getElementById("address").value = ""));
    await page.type(
      "#address",
      "123/84 ?????????????????????????????????????????????????????????????????????????????? ????????? 3 ???????????????????????????????????? ????????????????????????????????????????????? ???????????????????????????"
    );
    // await page.evaluate(() => (document.getElementById("province").value = ""));
    // await page.type("#province", "?????????????????????");
    await page.waitForNavigation({ waitUntil: "networkidle0" });
    await utility.delay(2000);
    await gmailManager.logoutGmail(page);
    return true;
  },
};

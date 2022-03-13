const utility = require("./utility");
const gmailManager = require("./gmail-manager");

module.exports = {
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
      "123/84 หมู่บ้านโกลด์เด้นทาวน์สาธร ซอย 3 ถนนกัลปพฤกษ์ แขวงบางขุนเทียน เขตจอมทอง"
    );
    // await page.evaluate(() => (document.getElementById("province").value = ""));
    // await page.type("#province", "กรุงเทพ");
    await page.waitForNavigation({ waitUntil: "networkidle0" });
    await utility.delay(2000);
    await gmailManager.logoutGmail(page);
    return true;
  },
};

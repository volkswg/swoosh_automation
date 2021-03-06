const utility = require("./utility");

module.exports = {
  loginGmail: async (page, username, password) => {
    await page.goto("https://accounts.google.com/signin/v2", { waitUntil: "networkidle2" });
    await page.type('input[type="email"]', username);
    await page.keyboard.press(String.fromCharCode(13));
    await utility.delay(5000);
    await page.type('input[type="password"]', password);
    await page.keyboard.press(String.fromCharCode(13));
    return true;
  },
  logoutGmail: async (page) => {
    const client = await page.target().createCDPSession();
    await client.send("Network.clearBrowserCookies");
    await client.send("Network.clearBrowserCache");
  },
};

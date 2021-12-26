const csvreader = require("./csv-reader");
const path = require("path");

module.exports = {
  getProfile: async (active, profileType) => {
    const allProfileList = await csvreader.readCSVFile(
      path.join(__dirname, "../", "profile_data_newformat.csv")
    );
    let resProfileList = allProfileList;
    if (active == 1 || active === 0) {
      resProfileList = resProfileList.filter((elem) => elem.active == active);
    }
    if (profileType == 1 || profileType == 2) {
      resProfileList = resProfileList.filter((elem) => elem.profileType == profileType);
    }
    return resProfileList;
  },
};

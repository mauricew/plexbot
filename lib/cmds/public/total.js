const fixedFind = require('../../api.fix').fixedFind;
const sectionUrl = "/library/sections/$s";

module.exports = function(pClient) {
  let tvCount, movieCount;
  return fixedFind(pClient, sectionUrl.replace("$s", "1") + "/all").then(function(res) {
    tvCount = res.length;
    return fixedFind(pClient, sectionUrl.replace("$s", "2") + "/all");
  }).then(function(res1) {
    movieCount = res1.length;
    return `${movieCount} movies, ${tvCount} tv shows`;
  });
};
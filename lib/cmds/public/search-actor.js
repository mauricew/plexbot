const fixedFind = require('../../api.fix').fixedFind;

module.exports = function(pClient, ircClient, curChannel, query) {
  if(query.trim() == ".plactsearch") {
    ircClient.say(curChannel, "Usage: .plactsearch {query} (case insensitive exact name)");
  }
  else {
    return fixedFind(pClient, "/search/actor?query=" + query).then(function(res) {
      let retVal = "";
      if(res.length == 0) {
        retVal = "No results found.";
      }
      else {
        retVal = `${res.length} results found:`;
        res.forEach((a) => retVal += "\n" + a.title);
      }
      return retVal;
    });
  }
}
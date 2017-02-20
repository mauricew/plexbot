const fixedFind = require('../../api.fix').fixedFind;

module.exports = function(pClient, ircClient, curChannel) {
  return fixedFind(pClient, "/library/recentlyAdded").then(function(res) {
    if(res.length == 0) {
      ircClient.say(curChannel, "Nothing new for some odd reason");
    }
    else {
      ircClient.say(curChannel, "Most recent additions:");
      var result = res.slice(0, 5);
      for(var i = 0; i < result.length; i++) {
        var title = result[i].title;
        var year = result[i].year;
        var type = result[i].type;
        if(result[i].type == "season") {
          title = result[i].parentTitle;
          year = "S" + result[i].index + "EX"
        }
        ircClient.say(curChannel, year + "|" + type + "|" + title);
      };
    }
  });
}
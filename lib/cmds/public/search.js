const fixedFind = require('../../api.fix').fixedFind;

module.exports = function(pClient, input) {
  if(input == ".plsearch") {
    return Promise.reject("Usage: .plsearch {query}")
  }
  else {
    let query = input.substring(".plsearch ".length).trim();
    if(query.length < 3) { 
      return Promise.reject("Search must be at least 3 characters.");
    }
    else if(query.toLowerCase() == "the") {
      return Promise.reject("Nice meme.");
    } 
    else {
      return fixedFind(pClient, "/search?local=1&query=" + query, {type: "movie|show"}).then(function(res) {
        let retVal = "Found " + res.length + " results";
        if(res.length > 0) {
          retVal += ":\n";
          for(var i = 0; i < res.length; i++) {
            retVal += res[i].year + "|" + res[i].type + "|" + res[i].title + "\n";
          }
        }
        return retVal;
      });
    }
  }
}
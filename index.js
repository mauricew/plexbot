const Plex = require("plex-api");
const Irc = require("irc");

const config = require("./config.json");
const owner = config.owner;

const commands = require('./lib/cmds/public');
const pmCommands = require('./lib/cmds/private');

const queryLimit = config.queryLimit || 5;
const queryInterval = config.queryInterval || 180;
var resetTimeout;
var limitDate;
var queryCount = 0;
var curChannel = config.irc.channel;

const resetLimit = () => queryCount = 0;

const pClient = new Plex({
  hostname: config.plex.server,
  username: config.plex.username || undefined,
  password: config.plex.password || undefined
});

const ircClient = new Irc.Client(
  config.irc.server, 
  config.irc.nick, {
    channels: [config.irc.channel],
    realName: "PlexBot",
    userName: "plexbot",
    port: config.irc.port || (config.irc.secure ? 6697 : 6667),
    secure: config.irc.secure || false,
    autoRejoin: true,
    floodProtection: true,
    floodProtectionDelay: 800,
  }
);

pClient.query("/").then(function(res) {
  
}, function(err) {
  throw err;
}).then(function() {
  // Owner-only private messages
  const privMsg = (from, msg) => {
    if(from == owner) {
      if(msg.indexOf("join ") == 0) {
        var newChannel = msg.split("join ")[1].trim();
        var result = pmCommands.join(ircClient, curChannel, newChannel);
        if(!result) {
          ircClient.say(owner, "Invalid channel name specified");
        }
        else {
          curChannel = newChannel;
        }
      }
      else if(msg.indexOf("speak ") == 0) {
        ircClient.say(curChannel, msg.split("speak ")[1].trim());
      }
    }
  };
  
  // All channel messages
  const chanMsg = function(from, to, msg) {
    if(true) {
      if(queryCount >= queryLimit) {
        let limitMsg = "Rate limit reached.";
        if(resetTimeout == null) {
          limitDate = new Date();
          setTimeout(resetLimit, queryInterval * 1000);
        }
        let secondsLeft = Math.ceil(((limitDate - new Date()) / 1000) + queryInterval);

        limitMsg += ` Back in ${secondsLeft} seconds.`
        ircClient.say(curChannel, limitMsg);
        return;
      }
      else {
        queryCount++;
        resetTimeout = null;    
      }
    }
    if(msg == ".plabout") {
      commands.about(pClient, owner).then((res) => ircClient.say(curChannel, res));
    }
    else if(msg == ".pltotal") {
      commands.total(pClient).then(function(res) {
        ircClient.say(curChannel, res);
      });
    }
    else if(msg == ".plhelp") {
      ircClient.say(curChannel, commands.help());
    }
    else if(msg == ".plrecent") {
      commands.recent(pClient, ircClient, curChannel).then(function(res) {
        //TODO do this really
        //ircClient.say(curChannel, res);
      });
    }
    else if(msg.indexOf(".plsearch") == 0) {
      commands.search(pClient, msg).then(function(res) {
        ircClient.say(curChannel, res);
      }, function(msg) {
        ircClient.say(curChannel, msg);
      }); 
    }
    else if(msg.indexOf(".plactsearch") == 0) {
      commands.searchActor(pClient, ircClient, curChannel, msg.split(".plactsearch")[1].trim()).then(function(res) {
        ircClient.say(curChannel, res);
      });
    }
    else if(msg == ".plresetlimit" && from == owner) {
      ircClient.say(curChannel, "Rate limit reset");
      queryCount = 0;
      resetTimeout = null;
    }
    else if(msg == ".plgtfo" && from == owner) {
      ircClient.disconnect("requested");
      process.exit(0);
    }
  };

  ircClient.addListener("message", chanMsg);
  ircClient.addListener("pm", privMsg);

});


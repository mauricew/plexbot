module.exports = (ircClient, oldChan, newChan) => {
  if(newChan.indexOf("#") != 0) {
    return false;
  }
  else {
    ircClient.say(oldChan, "Moving to a different channel - " + newChan)
    ircClient.part(oldChan);
    ircClient.join(newChan);
    ircClient.say(newChan, "PlexBot active in " + newChan + ". Type \".plhelp\" for commands.");
    return true;
  }
}
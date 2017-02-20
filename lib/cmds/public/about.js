var info = require('../../../package.json');

const aboutMsg = `PlexBot v${info.version}`;

module.exports = (pClient, owner) => {
  return pClient.query("/").then(function(res) {
    let srvName = res.MediaContainer.friendlyName;
    let plexVersion = res.MediaContainer.version
    return `
${aboutMsg}
This bot belongs to: ${owner}
Server Name: ${srvName}, version ${plexVersion}
`;
  });
}
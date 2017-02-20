plexbot
===========

An IRC bot used to display information from a Plex Media Server.
Currently supports connection to directly accessible servers only.

## Usage
`npm install` to grab dependencies.  
Your configuration file should be named `config.json`.
Base keys are required except for `queryLimit` and `queryInterval` (defaults to 5 commands every 180 seconds).  
Run with `npm start`.

## Commands

### Public, in-channel

#### .plhelp
Displays a list of commands that any user may use.

#### .plabout
Displays the following information:
* Bot information
* Owner user
* Server friendly name and version number

#### .plrecent
Displays the last five items added to the server.

#### .plsearch {query}
Searches the server for movie and show titles.

#### .plactsearch {query}
Searches for actor names that star in the movies and/or shows on the server.

### Owner-only, in-channel
#### .plgtfo
Causes the bot to disconnect and exits the node process.

#### .plresetlimit
Resets the rate limit.

### Owner-only, private message
#### join {#channel}
Tells the bot to move to a different channel, and makes an announcement in the old and new channels.

## Todo
* Properly structure access to services
* More owner-only functionality (e.g. library refresh)
* Logging
* Testing, linting, consistent use of es2015

## License
Copyright &copy; 2017 Maurice Wahba.
This project is made available under the MIT License.
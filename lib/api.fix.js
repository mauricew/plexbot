module.exports = {
  /**
   * Temporary until the find function is fixed in the plex-api module.
   */
  fixedFind: (PlexClient, options, criterias) => {
    if (typeof options === 'string') {
        // Support old method of only supplying a single `url` parameter
        options = { uri: options };
    }
    if (options.uri === undefined) {
        throw new TypeError('Requires uri parameter');
    }

    return PlexClient.query(options).then(function (result) {
      var context = {
        criterias: criterias || {}
      };

      var container = result.MediaContainer;
      var list;
      
      if('Metadata' in container) {
        list = container.Metadata;
      }
      else if('Directory' in container) {
        list = container.Directory;
      }

      if(!list) {
        return [];
      }
      return list.filter((child) => {
        var criterias = context.criterias;

        return Object.keys(criterias).reduce((hasFoundMatch, currentRule) => {
            var regexToMatch = new RegExp(criterias[currentRule]);
            return regexToMatch.test(child[currentRule]);
        }, true);
      }, context);
    });
  }
};
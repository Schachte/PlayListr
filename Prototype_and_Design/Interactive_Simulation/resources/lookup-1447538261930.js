(function(window, undefined) {
  var dictionary = {
    "2950e2e3-2758-424d-a8ba-c096d265c7b7": "my_song_view",
    "bb9772f7-7e3b-4070-ae2f-d56f72d941bd": "detail_reddit_view",
    "90c622e0-0d40-445f-9db2-1ff48c8605a9": "data_view_2_example",
    "d12245cc-1680-458d-89dd-4f0d7fb22724": "home",
    "f2faeeab-4a45-4caf-b81c-b40675f645ec": "about_view",
    "52bb3a4b-50a2-4028-9e85-1295bb32e9a8": "reddit_view",
    "f39803f7-df02-4169-93eb-7547fb8c961a": "Template 1",
    "04b578c7-be7d-47f3-b675-17c0c0181a75": "playlistr"
  };

  var uriRE = /^(\/#)?(screens|templates|masters)\/(.*)(\.html)?/;
  window.lookUpURL = function(fragment) {
    var matches = uriRE.exec(fragment || "") || [],
        folder = matches[2] || "",
        canvas = matches[3] || "",
        name, url;
    if(dictionary.hasOwnProperty(canvas)) { /* search by name */
      url = folder + "/" + canvas;
    }
    return url;
  };

  window.lookUpName = function(fragment) {
    var matches = uriRE.exec(fragment || "") || [],
        folder = matches[2] || "",
        canvas = matches[3] || "",
        name, canvasName;
    if(dictionary.hasOwnProperty(canvas)) { /* search by name */
      canvasName = dictionary[canvas];
    }
    return canvasName;
  };
})(window);
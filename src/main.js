require([
  "dojo/dom-style",

  "esri/arcgis/Portal",

  "app/config",
  "app/portal/OAuthHelper",

  "dojo/domReady!"
], function(

  domStyle,
  esriPortal,
  config, OAuthHelper
) {
  // check if signed in
  OAuthHelper.init(config.oauthOptions);
  if (OAuthHelper.isSignedIn()) {
    // check if user is public account
    // TODO: move to Controller
    new esriPortal.Portal(OAuthHelper.portal).signIn().then(function(portalUser) {
      if (!portalUser.orgId) {
        // show access constraint message
        domStyle.set("appContainer", "display", "none");
        domStyle.set("loginMessageContainer", "display", "");
        OAuthHelper.signOut(true);
      } else {
        // show content
        domStyle.set("loginMessageContainer", "display", "none");
        domStyle.set("appContainer", "display", "");

        // init application
        require([
          "dojo/parser",

          "app/Controller",

          "dojo/domReady!"
        ], function(
          parser,
          Controller
        ) {
          // some widgets require parse to be called manually
          parser.parse();
          // init app
          var modelerApp = new Controller({
            config: config,
            oAuthHelper: OAuthHelper,
            portalUser: portalUser
          });
          modelerApp.init({
            mapNode: "map",
            modelerNode: "modelerPane",
            loadingNode: "loadingPane",
            mapControlsNode: "mapControls",
            featurePaneNode: "featureLayerPane"
          });
        });
      }
    });
  } else {
    // sign in via OAuth
    OAuthHelper.signIn();
  }
});

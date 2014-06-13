var views         = require("./views"),
viewDecor         = require("./plugins/decor"),
defaultViews      = require("./plugins/defaultComponents"),
RegisteredClasses = require("mojo-registered-classes");

var mojoViews = module.exports = function (app) {
  app.views = new RegisteredClasses(app);
  app.use(defaultViews);
  app.use(viewDecor);
};

/**
 * for debugging
 */

var Application = module.exports.Application = require("mojo-application");

module.exports.Base        = views.Base;
module.exports.List        = views.List;
module.exports.States      = views.States;
module.exports.Stack       = views.Stack;

var mainApplication = Application.main;
mainApplication.use(require("mojo-animator"));
mainApplication.use(mojoViews);

module.exports.application = function (options) {
  var app = new Application(options);
  app.use(require("mojo-animator"));
  app.use(mojoViews);
  return app;
}

module.exports.mainApplication = mainApplication;


views.Base.defaultApplication = mainApplication;

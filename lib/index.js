var views    = require("./views"),
viewDecor    = require("./plugins/decor"),
defaultViews = require("./plugins/defaultComponents");

var mojoViews = module.exports = function (app) {

  var classes = {};

  app.views = {
    register: function register (nameOrClasses, clazz) {
      if (arguments.length === 1) {
        for (var name in nameOrClasses) {
          register(name, nameOrClasses[name]);
        }
        return;
      }
      classes[nameOrClasses] = clazz;
    },
    create: function (name, options) {
      var clazz = classes[name];
      if (!clazz) throw new Error("view " + name + " doesn't exist");
      return new clazz(options, app);
    }
  };

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

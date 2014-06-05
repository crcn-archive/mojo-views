var views = require("../views");

module.exports = function (app) {
  app.views.register({
    list   : views.List,
    states : views.States,
    Base   : views.Base
  });
};

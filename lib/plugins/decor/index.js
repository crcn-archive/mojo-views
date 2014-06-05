
var EventsDecorator   = require("./events"),
SectionsDecorator     = require("./sections"),
bindableDecorBindings = require("bindable-decor-bindings"),
frills                = require("frills");

module.exports = function (app) {
  
  var decor = frills();

  decor.
    priority("init", 0).
    priority("load", 1).
    priority("render", 2).
    priority("display", 3).
    use(
      bindableDecorBindings("render"),
      EventsDecorator,
      SectionsDecorator
    );

  app.views.decorate = function (view, options) {
    decor.decorate(view, options);
  };

  app.views.decorator = function (decorator) {
    return decor.use(decorator);
  }
}

var BaseView = require("../base"),
_            = require("underscore"),
Children     = require("./children");


/**
 */

function transformToProperty (from, target, property) {
  return {
    target: target,
    to: property,
    map: function (value) {
      return typeof value === "string" ? from.get(value) : value
    }
  };
}

/**
 */

function ListView () {
  BaseView.apply(this, arguments);
}

/**
 */

module.exports = BaseView.extend(ListView, {

  willRender: function () {
    if (this.children) return;
    this.children = new Children(this.section);
    this.bind("source", transformToProperty(this, this.children, "models")).now();
  }
});

var views = require("../.."),
expect    = require("expect.js"),
BindableObject  = require("bindable-object"),
BindableCollection  = require("bindable-collection");

describe("list/max#", function () {

  var source = new BindableCollection([
    new BindableObject({ name: "a" }),
    new BindableObject({ name: "b" })
  ]);

  return;

  var ItemView = views.Base.extend({
    didCreateSection: function () {
      this.section.append(this.application.nodeFactory.createTextNode(this.model.get("name") + ","));
    }
  });

});
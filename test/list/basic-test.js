var views = require("../.."),
expect    = require("expect.js"),
bindable  = require("bindable");

describe("list/basic#", function () {

  var source = new bindable.Collection([
    new bindable.Object({ name: "a" }),
    new bindable.Object({ name: "b" })
  ]);

  var ItemView = views.Base.extend({
    willRender: function () {
      this.section.append(this.application.nodeFactory.createTextNode("name: " + this.model.get("name") + ","));
    }
  });

  it("can create a new list view", function () {
    new views.List();
  });

  it("render a list of children using modelViewClass", function () {

    var list = new views.List({
      source: source,
      modelViewClass: ItemView
    });

    expect(list.render().toString()).to.be("name: a,name: b,");
  });

  it("render a list of children using modelViewFactory", function () {

    var list = new views.List({
      source: source,
      modelViewFactory: function (options) {
        expect(options.model.get("name")).not.to.be(void 0);
        return new ItemView(options);
      }
    });

    expect(list.render().toString()).to.be("name: a,name: b,");
  });
});
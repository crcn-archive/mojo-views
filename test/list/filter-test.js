var views = require("../.."),
expect    = require("expect.js"),
BindableObject  = require("bindable-object"),
BindableCollection  = require("bindable-collection");

describe("list/filter#", function () {

  var source;

  beforeEach(function() {
    source = new BindableCollection([
      new BindableObject({ _id: 0, completed: false }),
      new BindableObject({ _id: 1, completed: false }),
      new BindableObject({ _id: 2, completed: true }),
      new BindableObject({ _id: 3, completed: false }),
      new BindableObject({ _id: 4, completed: true })
    ]);
  });



  var ItemView = views.Base.extend({
    didCreateSection: function () {
      this.section.append(this.application.nodeFactory.createTextNode(this.model.get("_id") + ","));
    }
  });

  it("can filter a list", function () {
    var list = new views.List({
      source: source,
      filter: function (model) {
        return model.get("_id") > 2;
      },
      modelViewClass: ItemView
    });

    expect(list.render().toString()).to.be("3,4,");
  });


  it("filters new items coming in", function () {

    var list = new views.List({
      source: source,
      filter: function (model) {
        return model.get("_id") > 2;
      },
      modelViewClass: ItemView
    });

    list.render();
    source.push(new BindableObject({ _id: -1 }));
    source.push(new BindableObject({ _id: 5 }));
    expect(list.render().toString()).to.be("3,4,5,");
  });

  it("refilters when the filter changes", function () {

    var list = new views.List({
      source: source,
      filter: function (model) {
        return model.get("_id") > 2;
      },
      modelViewClass: ItemView
    });

    expect(list.render().toString()).to.be("3,4,");

    list.set("filter", function (model) {
      return model.get("_id") < 3;
    });

    expect(list.render().toString()).to.be("0,1,2,");


    list.set("filter", function (model) {
      return model.get("_id") % 2 == 0;
    });

    expect(list.render().toString()).to.be("0,2,4,");
  });


  it("refilters a list when a model property changes", function () {
    var list = new views.List({
      source: source,
      filter: function (model) {
        return !!model.get("name");
      },
      modelViewClass: ItemView
    });

    expect(list.render().toString()).to.be("");


    source.at(0).set("name", "a");

    expect(list.render().toString()).to.be("0,");

  });

  it("refilters a list when a dynamically added model changes", function () {
    var list = new views.List({
      source: source,
      filter: function (model) {
        return !!model.get("name");
      },
      modelViewClass: ItemView
    });

    expect(list.render().toString()).to.be("");

    var model;
    source.push(model = new BindableObject({ _id: 5 }));
    expect(list.render().toString()).to.be("");
    model.set("name", "a");
    expect(list.render().toString()).to.be("5,");
    source.at(0).set("name", "b");
    expect(list.render().toString()).to.be("0,5,");
    model.set("name", void 0);
    expect(list.render().toString()).to.be("0,");
  });


  it("maintains order of views when dynamically filtering", function () {
    var list = new views.List({
      source: source,
      filter: function (model) {
        return model.get("completed");
      },
      modelViewClass: ItemView
    });

    expect(list.render().toString()).to.be("2,4,");
    list.set("filter", void 0);
    expect(list.render().toString()).to.be("0,1,2,3,4,");
    list.set("filter", function (model) { return !model.get("completed") });
    expect(list.render().toString()).to.be("0,1,3,");
    list.set("filter", void 0);
    expect(list.render().toString()).to.be("0,1,2,3,4,");
  });
});
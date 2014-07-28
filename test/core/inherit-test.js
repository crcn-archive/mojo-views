
var expect = require("expect.js"),
mojoViews       = require("../..");


describe("core/inherit#", function () {

  var app = mojoViews.mainApplication;
  app.views.register("basic", mojoViews.Base);

  /**
   */

  it("can inherit a property from a parent", function () {
    var p = app.views.create("basic", { message: "hello!" }),
    c     = app.views.create("basic");

    c.set("parent", p);
    expect(c.message).to.be(undefined);
    expect(c.get("message")).to.be("hello!"); // trigget
    expect(c.message).to.be("hello!");
  });


  /** 
   */

  it("remains bound to the parent property", function () {
    var p = app.views.create("basic", { message: "hello!" }),
    c     = app.views.create("basic");

    c.set("parent", p);
    expect(c.get("message")).to.be("hello!");
    p.set("message", "blah!");
    expect(c.get("message")).to.be("blah!");
  });

  /**
   */

  it("can break inheritance by setting a property", function () {
    var p = app.views.create("basic", { message: "hello!" }),
    c     = app.views.create("basic");

    c.set("parent", p);
    expect(c.get("message")).to.be("hello!");
    c.set("message", "nah!");
    p.set("message", "blah!");
    expect(c.get("message")).to.be("nah!");
  });

  /**
   */

  it("can inherit an object", function () {
    var p = app.views.create("basic", { city: { zip: 99999 } }),
    c     = app.views.create("basic");
    c.set("parent", p);
    expect(c.get("city.zip")).to.be(99999);
  })

  /**
   */

  it("inherits a property by calling set", function () {
    var p = app.views.create("basic", { city: { zip: 99999 } }),
    c     = app.views.create("basic");
    c.set("parent", p);
    c.set("city.name", "San Francisco");
    expect(c.get("city.zip")).to.be(99999);
    expect(c.get("city.name")).to.be("San Francisco");
    expect(p.get("city.name")).to.be("San Francisco");
  });

  /**
   */

  it("doesn't inherit on set() if no dot", function (next) {

    var p = app.views.create("basic", { message: "hello!" }),
    c     = app.views.create("basic");

    c.set("parent", p);

    // _inherit() on set() - this gets triggered
    c.bind("message", function (v) {
      expect(v).to.be("ha!");
      next();
    });

    c.set("message", "ha!");
  })

  /**
   */

  it("doesn't inherit a propertly if defined", function () {
    var p = app.views.create("basic", { message: "hello!" }),
    c     = app.views.create("basic");

    c._define("message");

    c.set("parent", p);

    expect(c.get("message")).to.be(undefined);
  });

  /**
   */

  it("can change inheritance if the parent changes", function () {
    var p = app.views.create("basic", { message: "hello!" }),
    p2    = app.views.create("basic", { message: "yellow!" }),
    c     = app.views.create("basic");

    c.set("parent", p);
    expect(c.get("message")).to.be("hello!");

    c.set("parent", p2);

    // should be automatic
    expect(c.message).to.be("yellow!");
    p.set("message", "ahh!");
    expect(c.message).to.be("yellow!");
    expect(c.get("message")).to.be("yellow!");

    c.set("message", "blahh");
    p2.set("message", "nahh!");
    expect(c.message).to.be("blahh");

  });

  /**
   */

  it("binds inherited functions to the proper context", function () {
    var p = app.views.create("basic", { 
      name: "blah", 
      testFn: function() { 
        expect(this.name).to.be("blah"); 
      }
    }),
    c      = app.views.create("basic", { name: "hah" });

    c.set("parent", p);

    c.get("testFn").call(c);
    c.get("testFn")();
  });


  /**
   */

  it("sub classes inherit defined props", function () {
    var ParentView = mojoViews.Base.extend({
      define: ["abba"]
    }),
    SubView = ParentView.extend({
      define: ["bbaa"]
    });

    var v = new SubView();
    expect(v.define).to.contain("parent");
    expect(v.define).to.contain("abba");
    expect(v.define).to.contain("bbaa");
    expect(v.define).to.contain("sections");
    expect(v._defined).to.have.keys("parent", "abba", "bbaa", "sections");
  });

}); 
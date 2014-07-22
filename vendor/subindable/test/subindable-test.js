var expect = require("expect.js"),
subindable = require("..");

describe("subindable-test#", function () {

  /**
   */


  it("can create a subindable object", function () {
    new subindable.Object();
  });

  /**
   */

  it("can inherit a property from a parent", function () {

    var p = new subindable.Object({ name: "craig" }),
    c     = new subindable.Object();

    c.set("parent", p);
    expect(c.get("name")).to.be("craig");
  });

  /**
   */

  it("is data bound to the parent value", function () {

    var p = new subindable.Object({ name: "craig" }),
    c     = new subindable.Object();

    c.set("parent", p);
    expect(c.get("name")).to.be("craig");
    p.set("name", "jake");
    expect(c.get("name")).to.be("jake");
    p.set("name", "jeff");
    expect(c.get("name")).to.be("jeff");
  });

  /**
   */

  it("breaks inheritance is the child changes", function () {

    var p = new subindable.Object({ name: "craig" }),
    c     = new subindable.Object();

    c.set("parent", p);
    expect(c.get("name")).to.be("craig");
    c.set("name", "jake");
    p.set("name", "jeff");
    expect(c.get("name")).to.be("jake");
  });

  /**
   */

  it("only inherits a _set if the key has a .", function () {

    var p = new subindable.Object({ city: { name: "SF" } }),
    c     = new subindable.Object();

    c.set("parent", p);
    c.set("city.zip", 999);
    expect(c.get("city.name")).to.be("SF");
  });

  /**
   */

  it("only stays bound to changing function", function () {

    var fn1 = function(){}, fn2 = function(){}, fn3 = function(){};
    var p = new subindable.Object({ fn: fn1 }),
    c     = new subindable.Object({}, p);

    expect(c.get("fn").__original).to.be(fn1);
    p.set("fn", fn2);
    expect(c.get("fn").__original).to.be(fn2);
    p.set("fn", fn3);
    expect(c.get("fn").__original).to.be(fn3);
  });

  /**
   */

  it("inherits a property by binding to it", function (next) {
    var p = new subindable.Object({ city: { name: "SF" }}),
    c = new subindable.Object();
    c.set("parent", p);
    c.bind("city", function (city) {
      expect(city.name).to.be("SF");
      next();
    }).now();
  })

  it("inherits a property chani by binding to it", function (next) {
    var p = new subindable.Object({ city: { name: "SF" }}),
    c = new subindable.Object();
    c.set("parent", p);
    c.bind("city.name", function (name) {
      expect(name).to.be("SF");
      next();
    }).now();
  });

  it("inherits a property chani by binding to it", function () {
    var p = new subindable.Object(),
    city,
    c = new subindable.Object({ city: city = { name: "SF" }});
    c.set("parent", p);
    c.set("city.name", "MN");
    expect(c.get("city")).to.be(city);
  });



});
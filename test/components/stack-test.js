var views = require("../.."),
expect    = require("expect.js");

describe("stack#", function () {

  it("can create a new stack view", function () {
    new views.Stack();
  });

  it("can set the state of a stack view", function () {

    var PagesView = views.Stack.extend({
      sections: {
        state1: views.Base.extend(),
        state2: views.Base.extend(),
      }
    });

    var p = new PagesView();
    p.render();
    p.set("state", "state1");
    expect(p.get("currentSection.name")).to.be("state1");
    p.set("state", "state2");
    expect(p.get("currentSection.name")).to.be("state2");
    p.set("state", "state1");
    expect(p.get("currentSection.name")).to.be("state1");
  });

  it("properly renders each state", function () {
    var PagesView = views.Stack.extend({
      sections: {
        state1: views.Base.extend({
          didCreateSection: function () {
            this.section.append(this.application.nodeFactory.createTextNode("state1"))
          }
        }),
        state2: views.Base.extend({
          didCreateSection: function () {
            this.section.append(this.application.nodeFactory.createTextNode("state2"));
          }
        })
      }
    });

    var p = new PagesView();
    p.render();
    p.set("state", "state1");
    expect(p.section.toString()).to.be("state1");
    p.set("state", "state2");
    expect(p.section.toString()).to.be("state2");
    p.set("state", "state1");
    expect(p.section.toString()).to.be("state1");
  });

  it("can bind states to control the current state", function () {

    var PagesView = views.Stack.extend({
      name: "main",
      sections: {
        state1: views.Base.extend({
          didCreateSection: function () {
            this.section.append(this.application.nodeFactory.createTextNode("state1"))
          }
        }),
        state2: views.Base.extend({
          didCreateSection: function () {
            this.section.append(this.application.nodeFactory.createTextNode("state2"));
          }
        })
      }
    });

    var pages = new PagesView();
    pages.render();
    pages.set("states", {
      main: "state1"
    });

    expect(pages.get("currentSection.name")).to.be("state1");

    pages.set("states", {
      main: "state2"
    });


    expect(pages.get("currentSection.name")).to.be("state2");


    pages.set("name", "main2");

    pages.set("states", {
      main: "state1"
    });

    expect(pages.get("currentSection.name")).to.be("state2");

    pages.set("states", {
      main2: "state1"
    });

    expect(pages.get("currentSection.name")).to.be("state1");

  });
});

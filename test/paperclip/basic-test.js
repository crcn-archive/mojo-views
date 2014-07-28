var expect = require("expect.js"),
mojoViews       = require("../.."),
bindable   = require("bindable"),
paperclip  = require("paperclip"),
nofactor   = require("nofactor");

if(false)
describe("paperclip/basic#", function () {

  var app;

  before(function () {
    app = mojoViews.application({ nodeFactory: nofactor.string });
  });

  /**
   */

  it("can assign a paperclip template to a view controller", function () {

    var view = new mojoViews.Container({
      paper: paperclip.compile("Hello World")
    }, app);

    view.render();
    expect(view.section.toString()).to.be("Hello World");
    //expect(view.section.toFragment().childNodes[2].nodeValue).to.be("Hello World");
  });

  /**
   */

  it("can bind to a view controller property", function () {
    var view = new mojoViews.Container({
      name: "Craig",
      paper: paperclip.compile("Hello {{name}}")
    }, app)
    view.render();
    expect(view.section.toString()).to.be("Hello Craig");
    view.set("name", "John");
    expect(view.section.toString()).to.be("Hello John");
  });

  /**
   * tests context, and functions, and inheritence.
   */

  it("can call a function on the view controller, and maintain context", function () {

    var p = new mojoViews.Container({
      name: "parent",
      parentFn: function () {
        return this.name;
      }
    }, app), c = new mojoViews.Container({
      name: "child",
      paper: paperclip.compile("Hello {{childFn()}}, {{parentFn()}}"),
      childFn: function () {
        return this.name;
      }
    }, app);

    p.setChild("child", c);

    c.render();
    expect(c.section.toString()).to.be("Hello child, parent");
  });

  /**
   */


  it("can dynamically change the template", function () {
    var view = new mojoViews.Container({ name: "craig" }, app);
    view.render();
    expect(view.section.toString()).to.be("");
    view.set("paper", paperclip.compile("Hello {{name}}"))
    expect(view.section.toString()).to.be("Hello craig");
    view.set("paper", paperclip.compile("Hello {{name | uppercase() }}"));
    expect(view.section.toString()).to.be("Hello CRAIG");
  });


  /**
   */

  it("busts if the template isn't a function", function (next) {
    var view = new mojoViews.Container({ paper: "invalid" }, app);
    try {
      view.render()
    } catch(e) {
      expect(e.message).to.contain("template must be a ")
      next();
    }
  });

  /**
   */

  it("cleans up the template after the view has been disposed", function () {
    var view = new mojoViews.Container({
      name: "Craig",
      paper: paperclip.compile("Hello {{name}}")
    }, app);

    view.render();
    view.remove();

    // might trigger paperclip template change - shouldn't happen
    view.set("name", "John");
  });


});

var expect = require("expect.js"),
mojoViews       = require("../.."),
paperclip  = require("paperclip");


describe("decorators/children#", function () {

  var app = mojoViews.mainApplication, 
  app2 = mojoViews.mainApplication;
  app.views.register("basic", mojoViews.Base);
  app2.views.register("basic", mojoViews.Base);

  
  it("can define a section with a class", function () {

    var ParentView = mojoViews.Base.extend({
      children: {
        child: mojoViews.Base
      }
    });

    ParentView.prototype.__decorators = undefined;

    var p = new ParentView({}, app), c;
    p.render();
    expect((c = p.get("children.child")).constructor).to.be(mojoViews.Base);
    
  });

  it("can define a section when the type is a class", function () {

    var ParentView = mojoViews.Base.extend({
      children: {
        child: {
          type: mojoViews.Base,
          message: "blah"
        }
      }
    });

    ParentView.prototype.__decorators = undefined;

    var p = new ParentView({}, app);

    p.render();
    p.get("children.child").render();
    expect(p.get("children.child").constructor).to.be(mojoViews.Base);
    expect(p.get("children.child").message).to.be("blah");
  });


  it("can define a section when the type is a registered component", function () {
    var ParentView = mojoViews.Base.extend({
      children: {
        child: {
          type: "basic"
        }
      }
    });

    ParentView.prototype.__decorators = undefined;

    var p = new ParentView({}, app);
    p.render();
    expect(p.get("children.child").constructor).to.be(mojoViews.Base);
  });



  it("throws an error if the type is not found", function (next) {
    
    try {
      var p = new mojoViews.Base({}, app).decorate({
        children: {
          child: "doesn't exist"
        }
      });

      p.render();
    } catch(e) {
      expect(e.message).to.contain("doesn't exist");
      next();
    }
  });


  it("throws an error if the options is an incorrect type", function (next) {
    
    try {
      var p = new mojoViews.Base({}, app).decorate({
        children: {
          child: 654645
        }
      });

      p.render();
    } catch(e) {
      expect(e.message).to.contain("cannot create child");
      next();
    }
  });

  it("allows for a section to be a view object", function () {
    var p = new mojoViews.Base({}, app).decorate({
      children: {
        child: new mojoViews.Base()
      }
    });
    p.render();
    expect(p.get("children.child").constructor).to.be(mojoViews.Base);
  })


  it("throws an error if the options is invalid", function (next) {
    try {
      var p = new mojoViews.Base({}, app).decorate({
        children: {
          child: undefined
        }
      });

      p.render();
    } catch(e) {
      expect(e.message).to.contain("is invalid for view");
      next();
    }
  });


  it("can re-render a section", function () {
    var view = new mojoViews.Base({
      paper: paperclip.compile(
        "{{ html: children.child }}"
      )
    }, app).decorate({
      children: {
        child: {
          type: mojoViews.Base.extend({
            paper: paperclip.compile("hi mojoViews")
          })
        }
      }
    }), child;

    expect(view.render().toString()).to.be("hi mojoViews");
    (child = view.get("children.child")).remove();
    child.render();
  });


  // tests to make sure that children is overwritten entirely when
  // decorated

  it("maintains children when view is instantiated multiple times", function () {
    var SubView = mojoViews.Base.extend({
      paper: paperclip.compile("sub: {{ html: children.child }}"),
      children: {
        child: mojoViews.Base.extend({
          paper: paperclip.compile("Hello subview")
        })
      }
    });


    var v = new SubView({}, app);
    expect(v.render().toString()).to.be("sub: Hello subview");
    v.set("children.child", undefined);
    var v = new SubView({}, app);
    expect(v.render().toString()).to.be("sub: Hello subview");
  });

  it("defaults to base view if type isn't present", function () {
    var SomeView = mojoViews.Base.extend({
      paper: paperclip.compile("a: {{ html: children.child }}"),
      pname: "ab",
      children: {
        child: {
          paper: paperclip.compile("hello {{pname}} {{name}}")
        }
      }
    });

    var sv = new SomeView();
    expect(sv.render().toString()).to.be("a: hello ab child");
  });

}); 
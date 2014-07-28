var expect = require("expect.js"),
mojoViews       = require("../.."),
paperclip  = require("paperclip");


describe("decorators/sections#", function () {

  var app = mojoViews.mainApplication, 
  app2 = mojoViews.mainApplication;
  app.views.register("basic", mojoViews.Container);
  app2.views.register("basic", mojoViews.Container);

  
  it("can define a section with a class", function () {

    var ParentView = mojoViews.Container.extend({
      sections: {
        child: mojoViews.Container
      }
    });

    ParentView.prototype.__decorators = undefined;

    var p = new ParentView({}, app), c;
    p.render();
    expect((c = p.get("sections.child")).constructor).to.be(mojoViews.Container);
    
  });

  it("can define a section when the type is a class", function () {

    var ParentView = mojoViews.Container.extend({
      sections: {
        child: {
          type: mojoViews.Container,
          message: "blah"
        }
      }
    });

    ParentView.prototype.__decorators = undefined;

    var p = new ParentView({}, app);

    p.render();
    p.get("sections.child").render();
    expect(p.get("sections.child").constructor).to.be(mojoViews.Container);
    expect(p.get("sections.child").message).to.be("blah");
  });


  it("can define a section when the type is a registered component", function () {
    var ParentView = mojoViews.Container.extend({
      sections: {
        child: {
          type: "basic"
        }
      }
    });

    ParentView.prototype.__decorators = undefined;

    var p = new ParentView({}, app);
    p.render();
    expect(p.get("sections.child").constructor).to.be(mojoViews.Container);
  });



  it("throws an error if the type is not found", function (next) {
    
    try {
      var p = new mojoViews.Container({}, app).decorate({
        sections: {
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
      var p = new mojoViews.Container({}, app).decorate({
        sections: {
          child: 654645
        }
      });

      p.render();
    } catch(e) {
      expect(e.message).to.contain("cannot create section");
      next();
    }
  });

  it("allows for a section to be a view object", function () {
    var p = new mojoViews.Container({}, app).decorate({
      sections: {
        child: new mojoViews.Container()
      }
    });
    p.render();
    expect(p.get("sections.child").constructor).to.be(mojoViews.Container);
  })


  it("throws an error if the options is invalid", function (next) {
    try {
      var p = new mojoViews.Container({}, app).decorate({
        sections: {
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
    var view = new mojoViews.Container({
      paper: paperclip.compile(
        "{{ html: sections.child }}"
      )
    }, app).decorate({
      sections: {
        child: {
          type: mojoViews.Container.extend({
            paper: paperclip.compile("hi mojoViews")
          })
        }
      }
    }), child;

    expect(view.render().toString()).to.be("hi mojoViews");
    (child = view.get("sections.child")).remove();
    child.render();
  });


  // tests to make sure that sections is overwritten entirely when
  // decorated

  it("maintains sections when view is instantiated multiple times", function () {
    var SubView = mojoViews.Container.extend({
      paper: paperclip.compile("sub: {{ html: sections.child }}"),
      sections: {
        child: mojoViews.Container.extend({
          paper: paperclip.compile("Hello subview")
        })
      }
    });


    var v = new SubView({}, app);
    expect(v.render().toString()).to.be("sub: Hello subview");
    v.set("sections.child", undefined);
    var v = new SubView({}, app);
    expect(v.render().toString()).to.be("sub: Hello subview");

  })


}); 

var expect = require("expect.js"),
mojoViews       = require("../..");


describe("core/basic-view#", function () {

  var app = mojoViews.mainApplication;
  app.views.register("basic", mojoViews.Base);

  // - cannot remove before render
  // - cannot render if rendered
  // - return doc fragment
  // - can re-render after remove

  /**
   */

  it("can create a view apart from the application", function () {
    var view = new mojoViews.Base();
    expect(view.__isView).to.be(true);
    view.render();
    expect(view.application).to.be(mojoViews.mainApplication);
    expect(view.models).to.be(mojoViews.mainApplication.models);
  });

  /**
   */

  it("can pass appliation to the second param", function () {
    var view = new mojoViews.Base({}, app);
    expect(view.application).to.be(app);
    // expect(view.models).to.be(app.models);
  });

  /**
   */

  it("can extend a view", function () {
    var SubView = mojoViews.Base.extend({ name: "blah!" }),
    v = new SubView();
    expect(v.constructor).to.be(SubView);
    expect(v.name).to.be("blah!");
  });


  /**
   */

  it("returns a fragment on render", function () {
    expect(new mojoViews.Base({}, app).render().nodeType).to.be(11);
  })

  /**
   */

   it("has the right info from app", function () {
    var view = app.views.create("basic");
    expect(view.application).to.be(app);
    expect(view._cid).not.to.be(undefined);
   });

   /**
    */

  it("the context of view is itself", function () {
    var view = app.views.create("basic");
    expect(view.context()).to.be(view);
  });

  /**
   */

  it("can create a view with options", function () {
    var view = app.views.create("basic", { name: "blah" });
    expect(view.get("name")).to.be("blah");
  })

  /**
   */

  it("throws an error if the first param isn't an object", function () {
    try {
      app.views.create("basic", "bad arg");
    } catch (e) {
      expect(e.message).to.contain("must be an object");
    }
  })

  /**
   */

  it("has the right path", function () {
    expect(app.views.create("basic").path()).to.be("BaseView");
  });

  /**
   */

  it("can render a view", function () {
    var view = app.views.create("basic");
    view.render();
  })

  /**
   */

  it("can remove a view", function () {
    var view = app.views.create("basic");
    view.render();
    view.remove()
  });

  /**
   */

  it("can listen for a render event", function () {
    var render, rendered;
    var view = app.views.create("basic");
    view.on("render", function () {
      render = true;
    });
    view.render();
    expect(render).to.be(true);
  });

  /**
   */

  it("can listen for a remove event", function () {
    var view = app.views.create("basic"), remove, removed;
    view.render();
    view.on("remove", function () {
      remove = true;
    });
    view.remove();
    expect(remove).to.be(true);
  });

  /**
   */

  it("cannot re-render a view", function () {
    var view = app.views.create("basic"), emitted = 0;
    view.on("render", function () {
      emitted++;
    });
    view.render();
    expect(view.render().nodeType).to.be(11);
    expect(emitted).to.be(1);
  });

  /**
   */


  it("cannot remove a view before it's rendered", function () {
    var view = app.views.create("basic"), emitted;
    view.once("remove", function () {
      emitted = true;
    })
    view.remove();
    expect(emitted).to.be(undefined);
  });


  /**
   */

  it("maintains listeners on remove()", function () {
    var view = app.views.create("basic"), emitted;
    view.on("blah", function () {
      emitted = true;
    });
    view.render();
    view.remove();
    view.emit("blah");
    expect(emitted).to.be(true);
  });

  /**
   * doesn't apply anymore - listeners stick around on dispose()
   */

  /*it("removes listeners on dispose()", function () {
    var view = app.views.create("basic"), emitted;
    view.on("blah", function () {
      emitted = true;
    });
    view.render();
    view.dispose();
    view.emit("blah");
    expect(emitted).to.be(undefined);
  });*/

  /**
   */

  it("can render() a view after it's been dispose()d", function () {
    var view = new mojoViews.Base({}, app);
    view.__decorators = undefined;
    view.render();
    view.dispose();
  });

  /**
   */

  it("will call render", function () {
    var view = new mojoViews.Base({}, app), c = 0, e= 0;
    view.willRender = function () {
      c++;
    }

    view.once("render", function () {
      expect(c).to.be(1);
      e++;
    });

    view.render();
    expect(e).to.be(1);

  });

  /**
   */

  it("did call render", function () {
    var view = new mojoViews.Base({}, app), c = 0, e= 0;
    view.didRender = function () {
      c++;
    }

    view.once("render", function () {
      expect(c).to.be(0);
      e++;
    });

    view.render();
    expect(e).to.be(1);
    expect(c).to.be(1);
  });

  /**
   */

  it("will call remove", function () {
    var view = new mojoViews.Base({}, app), c = 0, e= 0;
    view.render();
    view.willRemove = function () {
      c++;
    }

    view.once("remove", function () {
      expect(c).to.be(1);
      e++;
    });

    view.remove();
    expect(e).to.be(1);
    expect(c).to.be(1);
  });

  /**
   */

  it("did call remove", function () {
    var view = new mojoViews.Base({}, app), c = 0, e= 0;
    view.render();
    view.didRemove = function () {
      c++;
    }

    view.once("remove", function () {
      expect(c).to.be(0);
      e++;
    });

    view.remove();
    expect(e).to.be(1);
    expect(c).to.be(1);
  });
});

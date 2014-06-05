var mojoViews = require("../../"),
expect   = require("expect.js"),
paperclip = require("paperclip");

describe("recycle#", function () {

  var app = mojoViews.mainApplication;

  if(false)
  it("can re-use a view", function () {
    var view = new mojoViews.Base({ application: app });
    view.render();
    expect(view._rendered).to.be(true);
    view.dispose();
    expect(view._rendered).to.be(false);
    view.render();
    expect(view._rendered).to.be(true);
  });

  it("can can re-use a view with a paperclip template", function () {

    var view = new mojoViews.Base({ 
      name: "john",
      paper: paperclip.compile(
        "hello {{name}}"
      )
    }, app);

    expect(view.render().toString()).to.be("hello john");
    view.dispose();
    view.reset({ name: "jeff" });
    expect(view.render().toString()).to.be("hello jeff");
  })
});
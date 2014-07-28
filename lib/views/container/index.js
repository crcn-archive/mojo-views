var BaseView = require("../base");


function ContainerView () {
  BaseView.apply(this, arguments);

}

BaseView.extend(ContainerView, {

  /**
   */

  define: ["children", "sections"],

  /**
   */

  willRender: function () {

    // TODO - fetch all sections
    BaseView.prototype.willRender.call(this);
  },

  /**
   */

  setChild: function (name, child) {
    child.set("parent", this);
    this.set("sections." + name, child)
  }
});

module.exports = ContainerView;
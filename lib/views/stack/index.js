var BaseView = require("../base");

function StackView () {
  BaseView.apply(this, arguments);
}

module.exports = BaseView.extend(StackView, {

  /**
   */

  define: ["state"],

  /**
   */

  bindings: {
    "state": function (stateName) {

      if (!stateName) return;

      var prevChild = this.currentChild, currentChild;

      this.set("currentChild", currentChild = this.get("children." + stateName));
      
      if (!currentChild) {
        throw new Error("state '" + stateName + "' does not exist");
      }

      if (currentChild === prevChild) return;

      if (prevChild) {
        prevChild.remove();
      }


      this.section.replaceChildNodes(currentChild.render());
    },
    "name": function (name) {
      if (this._nameBinding) this._nameBinding.dispose();
      this._nameBinding = this.bind("states." + name, { to: "state" }).now();
    }
  }
});

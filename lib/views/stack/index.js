var BaseView = require("../base");

function StackView () {
  BaseView.apply(this, arguments);
}

module.exports = BaseView.extend(StackView, {

  /**
   */

  bindings: {
    "state": function (stateName) {
      var prevSection = this.currentSection, currentSection;

      this.set("currentSection", currentSection = this.get("sections." + stateName));

      if (prevSection) {
        prevSection.remove();
      }

      this.section.replaceChildNodes(currentSection.render());
    },
    "name": function (name) {
      if (this._nameBinding) this._nameBinding.dispose();
      this._nameBinding = this.bind("states." + name, { to: "state" }).now();
    }
  }
});

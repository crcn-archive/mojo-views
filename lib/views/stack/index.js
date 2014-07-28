var ContainerView = require("../container");

function StackView () {
  ContainerView.apply(this, arguments);
}

module.exports = ContainerView.extend(StackView, {

  /**
   */

  define: ["state"],

  /**
   */

  bindings: {
    "state": function (stateName) {

      if (!stateName) return;

      var prevSection = this.currentSection, currentSection;

      this.set("currentSection", currentSection = this.get("sections." + stateName));
      
      if (!currentSection) {
        throw new Error("state '" + stateName + "' does not exist");
      }

      if (currentSection === prevSection) return;

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

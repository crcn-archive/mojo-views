var bindable = require("bindable"),
_            = require("underscore");

function Children (section) {
  bindable.Collection.apply(this, arguments);
  this.section = section;
  this.bind("models", _.bind(this._onModels, this));
}

module.exports = bindable.Collection.extend(Children, {

  /**
   */

  _onModels: function (newModels, oldModels) {
    this._allocate(newModels.length);
    this.update();
  },

  /**
   */

  update: function () {

  },

  /**
   * allocates views for the models
   */

  _allocate: function (newLen) {
    if (this.length > newLen) {
      this.splice(newLen, this.length - newLen);
    } else {
      
    }
  }
});
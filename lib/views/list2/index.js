var BaseView = require("../base"),
_            = require("underscore"),
bindable     = require("bindable"),
factories    = require("factories");


/**
 */

function getOpListener (self, listener) {

  var currentValue;

  return { 
    to: function (property) {
      var value;

      if (typeof property === "string") {
        value = self.get(property);
      } else {
        value = property;
      }

      listener.call(self, value, currentValue);
      currentValue = value;
    }
  }
}

/**
 */

function ListView () {
  BaseView.apply(this, arguments);
  this._pool = [];
}

/**
 */

module.exports = BaseView.extend(ListView, {

  /**
   */

  willRender: function () {
    if (this.children) return;
    this.children = new bindable.Collection();
    this.children.on("update", _.bind(this._updateSectionItems, this));

    this.bind("modelViewClass", getOpListener(this, this._onModelViewClassChange)).now();
    this.bind("modelViewFactory", getOpListener(this, this._onModelViewClassChange)).now();
    this.bind("source", getOpListener(this, this._onSourceChange)).now();
  },

  /**
   */

  _onSourceChange: function (newSource, oldSource) {
    if (this._sourceListener) this._sourceListener.dispose();
    this._sourceListener = newSource.on("update", this._update);
    this._removeAll();
    this._insertChildren(newSource.source());
  },

  /**
   */

  _onModelViewClassChange: function (modelViewClass) {
    this._modelViewFactory = factories.factory.create(modelViewClass);
  },

  /**
   */

  _update: function (updates) {
    var self = this;
    if (updates.remove) self._removeChildren(updates.remove);
    if (updates.insert) self._insertChildren(updates.insert);
  },

  /**
   */

  _removeAll: function () {
    // TODO - get all views
    this.children.source([]);
  },

  /**
   */

  _removeChildren: function (models) {

  },

  /**
   */

  _insertChildren: function (models) {

    var self = this;
    var newViews = models.map(function (model) {
      return self._modelViewFactory.create({
        model: model
      })
    });

    this.children.push.apply(this.children, newViews);
  },

  /**
   */

  _updateSectionItems: function (update) {

    var self = this;

    this.application.animate({
      update: function () {

        if (update.insert)
        for (var i = 0; i < update.insert.length; i++) {
          self.section.append(update.insert[i].render());
        }

        if (update.remove)
        for (var i = 0; i < update.remove.length; i++) {
          update.remove[i].remove();
        }
      }
    });
  }
});

var BaseView = require("../base"),
bindable     = require("bindable"),
factories    = require("factories"),
_            = require("underscore"),
janitor      = require("janitorjs");

/**
 */

function getOpListener (listener) {

  var self = this;

  var oldValue, currentValue, propertyBinding;

  var update = wrapInAnimation.call(this, function () {
    listener.call(self, currentValue, oldValue);
  });

  return { 
    to: function trigger (property) {
      var value;

      if (propertyBinding) propertyBinding.dispose();

      if (typeof property === "string") {
        value = self.get(property);
        propertyBinding = self.bind(property, function () {
          trigger(property);
        });
      } else {
        value = property;
      }

      oldValue     = currentValue;
      currentValue = value;

      update();
    }
  }
}

/**
 */

function wrapInAnimation (listener) {
  var self = this;
  return function () {
    var args = Array.prototype.slice.call(arguments);
    if (self.visible) {
      self.application.animate({ 
        update: function () {
          listener.apply(self, args);
        }
      });
    } else {
      listener.apply(self, args);
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

BaseView.extend(ListView, {

  /**
   */

  willRender: function () {

    if (this.children) return;

    this._sourceListeners = janitor();
    this._modelListeners  = janitor();
    this.children = new bindable.Collection();
    this.bind("modelViewClass", getOpListener.call(this, this._onModelViewFactoryChange)).now();
    this.bind("modelViewFactory", getOpListener.call(this, this._onModelViewFactoryChange)).now();
    this.bind("filter", getOpListener.call(this, this._onFilterChange)).now();
    this.bind("sort", getOpListener.call(this, this._onSortChange)).now();
    this.bind("source", getOpListener.call(this, this._onSourceChange)).now();
  },
  /**
   */

  _onSourceChange: function (newSource, oldSource) {
    this._removeAllChildren();
    this._sourceListeners.dispose();
    this._modelListeners.dispose();

    this._source = newSource;
    if (newSource) this._sourceListeners.add(newSource.on("update", wrapInAnimation.call(this, this._onSourceUpdate)));

    this._onSourceUpdate({ insert: newSource.source() });
  },

  /**
   */

  _watchModels: function (models) {
    var self = this, updating = false;


    function onModelChange () {
      if (updating) return;
      updating = true;
      self.application.animate({
        update: function () {
          updating = false;
          self._onFilterChange(self._filter, true);
        }
      });
    }



    for (var i = models.length; i--;) {
      this._modelListeners.add(models[i].on("change", onModelChange));
    }
  },

  /**
   */

  _rewatchModels: function () {
    this._modelListeners.dispose();
    this._watchModels(this._source.source());
  },

  /**
   */

  _onModelViewFactoryChange: function (modelViewFactory) {
    this._modelViewFactory = factories.factory.create(modelViewFactory);
    if (!this._source) return;
    this._onSourceChange(this._source);
  },

  /**
   */

  _onFilterChange: function (filter, forceSort) {
    filter = this._filter = filter || ListView.prototype._filter;
    if (!this._source) return;

    var toRemove = [], toInsert = [];

    for (var i = this.children.length; i--;) {
      var child = this.children.at(i);
      if (!filter(child.model)) {
        toRemove.push(child.model);
      }
    }

    for (var i = this._source.length; i--;) {
      var model = this._source.at(i);
      if (filter(model) && !this._getChildByModel(model)) {
        toInsert.unshift(model);
      }
    }

    if (toRemove.length) this._removeChildren(toRemove);
    if (toInsert.length || forceSort) this._addChildren(toInsert || []);
  },

  /**
   */

  _onSortChange: function (sort) {
    sort = this._sort = sort;
    if (!this._source) return;

    var children = this.children.source().sort(sort ? function (av, bv) {
      return sort(av.model, bv.model);
    } : function (av, bv) {
      return av.modelIndex > bv.modelIndex ? 1 : -1;
    });

    // update index
    for (var i = children.length; i--;) {
      children[i].set("index", i);
    }

    var prevChild;

    for (var i = 0, n = children.length; i < n; i++) {
      var child = children[i];

      // only want to render the non visible children
      if (child.visible) {

        var afterNode;

        if (child.previousSibling !== prevChild) {

          if (!prevChild) {
            afterNode = this.section.start;
          } else {
            afterNode = prevChild.section.end;
          }

          var childNodes = child.section.getChildNodes();

          for (var j = 0, n2 = childNodes.length; j < n2; j++) {
            var childNode = childNodes[j];
            if (!process.browser) childNode.parentNode.removeChild(childNode);
            afterNode.parentNode.insertBefore(childNode, afterNode.nextSibling);
            afterNode = childNode;
          }
        }

      } else {
        if (!prevChild) {
          this.section.prepend(child.render());
        } else {
          prevChild.section.end.parentNode.insertBefore(child.render(), prevChild.section.end.nextSibling);
        }
      }


      child.previousSibling = prevChild;
      if (prevChild) prevChild.nextSibling = child;
      prevChild = child;
    }

  },

  /**
   */

  _getChildByModel: function (model) {
    for (var i = this.children.length; i--;) {
      var child = this.children.at(i);
      if (child.model === model) return child;
    }
  },

  /**
   */

  _onSourceUpdate: function (sourceChanges) {
    if (!this._source) return;
    if (sourceChanges.insert) {
      this._watchModels(sourceChanges.insert);
      this._addChildren(sourceChanges.insert.filter(this._filter));
    }
    if (sourceChanges.remove) {
      this._rewatchModels();
      this._removeChildren(sourceChanges.remove);
    }
  },

  /**
   */

  _removeAllChildren: function () {
    this.section.removeAll();

    var oldChildren = this.children.source();

    // TODO - use async each series and runlater
    for (var i = this.children.length; i--;) {
      this.children.at(i).dispose();
    }

    this.children.source([]);
  },

  /**
   */

  _removeChildren: function (models) {
    for (var i = this.children.length; i--;) {
      var child = this.children.at(i);
      if (~models.indexOf(child.model)) {
        this._pool.push(child);
        child.dispose();
        this.children.splice(i, 1);
      }
    }
  },

  /**
   */

  _addChildren: function (models) {

    var newChildren = [], children, self = this, cn = this.children.length;

    for (var i = 0, n = models.length; i < n; i++) {
      var model = models[i];
      var child = this._modelViewFactory.create({ 
        index: cn + i, 
        parent: self,
        model: model,
        modelIndex: this._source.indexOf(model)
      });
      newChildren.push(child);
    }

    this.children.push.apply(this.children, newChildren);
    this._onSortChange(this._sort);
  },

  /**
   */

  _filter: function (model) {
    return true;
  }
});

module.exports = ListView;
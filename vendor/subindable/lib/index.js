var bindable = require("bindable"),
protoclass   = require("protoclass"),
type         = require("type-component"),
_            = require("underscore");


function _combineSuperProps (target, property) {
  var constructor = target.constructor;

  if (!constructor.__combined) {
    constructor.__combined = {};
  }

  if (constructor.__combined[property]) {
    return;
  }

  constructor.__combined[property] = true;

  var p = constructor.prototype,
  defined = [];


  while (p) {
    defined = (p.define || []).concat(defined);
    p = p.constructor.__super__;
  }

  constructor.prototype[property] = target[property] = defined;
}


/**
 * Allows you to inherit properties from a parent bindable.
 * @class SubindableObject
 * @extends BindableObject
 */


function SubindableObject (context, parent) {
  SubindableObject.parent.call(this, context || this);

  if (parent) this.set("parent", parent);

  this._defined = {};

  _combineSuperProps(this, "define");
  this._define.apply(this, this.define);
  var self = this;

  // listen whenever a property 
  this.on("watching", function (propertyChain) {
    var key = propertyChain[0]
    if (self.__context[key] === undefined)
      self.inherit(key);
  });
}

protoclass(bindable.Object, SubindableObject, {

  /**
   */

  define: [

    /**
     * The parent subindable object
     * @property {SubindableObject} parent
     */

    "parent"
  ],

  /*
   */

  get: function (key) {

    var ret = SubindableObject.__super__.get.call(this, key);
    if(ret != undefined) return ret;

    var bindingKey, i;

    if (typeof key !== "string") {
      bindingKey = key[0];
    } else if (~(i = key.indexOf("."))) {
      bindingKey = key.slice(0, i);
    } else {
      bindingKey = key;
    }

    // if the binding key exists, then don't inherit
    if (this.__context[bindingKey] != undefined) {
      return;
    }

    // inherit from the parent
    this.inherit(bindingKey);

    // return the inherited value
    return SubindableObject.__super__.get.call(this, key);
  },

  /*
   */

  set: function (key, value) {  

    var i;

    // if we're setting to a chained property, inherit the first part
    // incase it exists - for example:
    // subView.set("user.name", "blah") 
    // would need to be inherited before being set
    if (typeof key === "string" && ~(i = key.indexOf("."))) {
      var bindingKey = key.slice(0, i);
      if (this.__context[bindingKey] == undefined) this.inherit(bindingKey);
    }

    return SubindableObject.__super__.set.call(this, key, value);
  },

  /**
   */

  _define: function () {
    for(var i = arguments.length; i--;) {
      this._defined[arguments[i]] = true;
    }
  },

  /**
   * DEPRECATED
   */

  _inherit: function (key) {
    console.warn("_inherit on subindable is deprecated");
    this.inherit(key);
  },

  /**
   * Inherits a property from the parent subindable object
   * @param {String} path path to inherit.
   */

  inherit: function (key) {

    if (this._defined[key]) return;
    this._defined[key] = true;

    var parentPropertyBinding,
    parentBinding,
    valueBinding,
    self = this;

    // if the parent ever changes, we'll need to also change the bound value
    parentBinding = this.bind("parent", function(parent) {

      if (parentPropertyBinding) parentPropertyBinding.dispose();
      if (!parent) return;

      // inherit the property from the parent here
      parentPropertyBinding = parent.bind(key, function (v) {

        // if the value is a function, then make sure the context is 
        // bound to the parent
        if (typeof v === "function" && !v.__bound) {
          var org;
          v = _.bind(org = v, parent);
          v.__bound    = true;
          v.__original = org;
        }

        // set the inherited property
        self.set(key, v);
      }).now();
    }).now();


    // now bind to THIS context incase explicitly set
    valueBinding = this.bind(key, function(value) {

      // if the parent value doesn't match this context's value, then
      // break inheritance
      if (self.__context.parent && self.__context.parent.__context[key] === value) {
        return;
      }

      // but be sure that the bound value is not an inherited function
      if (value && value.__bound && value.__original == self.__context.parent.__context[key]) {
        return
      }

      // at this point, the parent value, and this context's value do NOT match
      // so remove all inheritance bindings.
      valueBinding.dispose();

      if (parentPropertyBinding) parentPropertyBinding.dispose()
      if (parentBinding) parentBinding.dispose();
    });
  }

});


module.exports = {
  Object: SubindableObject
}
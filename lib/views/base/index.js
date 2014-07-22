var protoclass     = require("protoclass"),
loaf               = require("loaf"),
SubindableObject   = require("subindable").Object,
janitor            = require("janitorjs"),
runlater           = require("runlater")(1, 100),
_                  = require("underscore"),
decor              = require("../../plugins/decor"),
noselector         = require("noselector");

/**
 * @module mojo
 * @submodule mojo-views
 */

/**
@class BaseView
@extends SubindableObject
*/

/**
 * Called when the view is rendered
 * @event render
 */

/**
 * Called when the view is remove
 * @event remove
 */


function BaseView (data, application) {

  SubindableObject.call(this, this);

  this._onParent     = _.bind(this._onParent, this);

  /**
   * The main application that instantiated this view
   * @property application
   * @type {Application}
   */

  // note that if application is not defined, this.application will
  // default to the default, global application.
  this.application = application;

  // ref back to this context for templates
  this["this"]     = this;

  this.initialize(data);
}

protoclass(SubindableObject, BaseView, {

  /**
   */

  _rendered: false,

  /**
   */

  __isView: true,

  /**
   */

  define: ["sections"],

  /**
   * adds a disposable object to cleanup when the view is destroyed.
   * @method disposable
   * @param {Object} disposable Must have `dispose()` defined.
   */

  disposable: function (disposable) {

    if (!this._janitor) {
      this._janitor = janitor();
    }

    this._janitor.add(disposable);
  },

  /**
   */

  reset: function (data) {

    // copy the data to this object. Note this shaves a TON
    // of time off initializing any view, especially list items if we
    // use this method over @setProperties data
    if (data) {
      for(var key in data) {
        this[key] = data[key];
      }
    }

    // necessary to properly dispose this view so it can be recycled
    if (this.parent) this._onParent(this.parent);
  },

  /**
   * Called when the view is instantiated
   * @method initialize
   * @param {Object} options options passed when creating the view
   */

  initialize: function (data) {


    this.on("change:parent", this._onParent);
    this.reset(data);

    if (this.application) this._initDecor();
  },

  /**
   */

  _initDecor: function () {

    if (!this.application) {
      this.application = BaseView.defaultApplication;
    }

    this._decorated = true;

    if (!this.section) {

      /**
       * The section that manages the `document fragment` owned by this view controller.
       * @property section
       * @type {Section}
       */

      this.section = loaf(this.application.nodeFactory);
      this.didCreateSection();
      this.models  = this.application.models;
    }

    this.application.views.decorate(this, this.constructor.prototype);
  },

  /**
   * Returns the path to the view
   * @method path
   */

  path: function () {
    var path = [], cp = this;

    while (cp) {
      path.unshift(cp.constructor.name);
      cp = cp.parent;
    }

    return path.join(".");
  },

  /**
   * Renders the view
   * @method render
   * @return {Object} document fragment
   */

  render: function () {

    if (this._rendered) return this.section.render();
    this._rendered = true;

    if (this._cleanupJanitor) {
      this._cleanupJanitor.dispose();
      this._cleanupJanitor = undefined;
    }

    if (!this._decorated) {
      this._initDecor();
    }

    this.willRender();

    this.emit("render");

    var fragment = this.section.render();

    this.didRender();

    return fragment;
  },

  /**
   */

  didCreateSection: function () {
    // OVERRIDE ME
  },

  /**
   */

  willRender: function () {
    this._render(this.section.show());
  },

  /**
   */

  didRender: function () {
    //OVERRIDE ME
  },

  /**
   * called in `render()`, before emitting `render` event
   * @method _render
   * @protected
   */

  _render: function (section) {
    // OVERRIDE ME
  },

  /**
   * Removes the view from the parent, or DOM
   * @method remove
   */

  remove: function () {

    if (this.section && (!this.parent || this.parent._rendered)) {
      if (this._rendered) {
        this.willRemove();
        this.emit("remove");
      }
      this.section.remove();
      this.didRemove();
    }

    this._rendered = false;
  },

  /**
   */

  willRemove: function () {
    // OVERRIDE ME
  },

  /**
   */

  didRemove: function () {
    // OVERRIDE ME
  },

  /**
   * jquery selector for elements owned by the view
   * @method $
   * @param {String} selector
   */

  $: function (search) {
    if (!this.section) this.render();

    var el = noselector(this.section.getChildNodes());

    if (arguments.length) {
      return el.find(search).andSelf().filter(search);
    }

    return el;
  },

  /**
   */

  setChild: function (name, child) {
    child.set("parent", this);
    this.set("sections." + name, child)
  },

  /**
   * Sort of a mix-in for the view. This is how `sections`, and `events` are added.
   * @method decorate
   * @param options
   * @returns {Object} this
   */

  decorate: function (options) {
    this.application.views.decorate(this, options);
    return this;
  },

  /*
   */

  dispose: function () {
    this.remove();
    if (this._parentRemoveListener) this._parentRemoveListener.dispose();
    if (this._parentDisposeListener) this._parentDisposeListener.dispose();
    this._parentRemoveListener = undefined;
    this._parentDisposeListener = undefined;

    // need to pull the section out of the parent
    if (this.section) this.section.remove();
    if (this._janitor) this._janitor.dispose();
    this.set("parent", undefined);
    SubindableObject.prototype.dispose.call(this);
  },

  /**
   * Bubbles an event up to the root view
   * @method bubble
   * @param {String} name of the event
   * @param {Object} params... additional params
   */

  bubble: function () {
    this.emit.apply(this, arguments);
    if(this.parent) this.parent.bubble.apply(this.parent, arguments);
  },

  /**
   */

  _onParent: function (parent) {

    if (this._parentRemoveListener) this._parentRemoveListener.dispose();
    if (this._parentDisposeListener) this._parentDisposeListener.dispose();

    if (!this._initParent) {
      this._initParent   = true;
      this._removeLater  = _.bind(this._removeLater, this);
      this._disposeLater = _.bind(this._disposeLater, this);
    }

    this.inherit("application");

    if (!parent) return;

    this._parentRemoveListener  = parent.on("remove", this._removeLater);
    this._parentDisposeListener = parent.on("dispose", this._disposeLater);
  },

  /**
   */

  _removeLater: function () {
    var self = this;
    if (!process.browser) return this.remove();
    this.__cleanupJanitor().add(runlater(function () {
      self.remove();
    }));
  },
  /**
   */

  _disposeLater: function () {
    var self = this;
    if (!process.browser) return this.dispose();
    this.__cleanupJanitor().add(runlater(function () {
      self.dispose();
    }));
  },

  /**
   */

  __cleanupJanitor: function () {
    return this._cleanupJanitor || (this._cleanupJanitor = janitor())
  }
});

module.exports = BaseView;

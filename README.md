### Mojo Views [![Build Status](https://travis-ci.org/classdojo/mojo-views.svg)](https://travis-ci.org/classdojo/mojo-views)

Mojo-views is the view layer for the Mojo.js framework. They are what give your application structure. 

### Installation

```javascript
npm i mojo-views
```

### See also

- [bindable.js](https://github.com/classdojo/bindable.js) - the base class for each view
- [mojo-paperclip](/mojo-js/mojo-paperclip) - template engine

### API

#### views.Base(properties, application)

The base view that controls what the user sees and does

- `properties` - the properties that get set on the view controller
- `application` - (optional) the mojo application

```javascript
var views = require("mojo-views");
var HelloView = views.Base.extend({
    willRender: function () {
      this.section.append(this.nodeFactory.createTextNode("Hello " + this.get("name")));
    }
});

var helloView = new HelloView({ name: "Jeff" });
document.body.appendChild(helloView.render()); // Hello Jeff
```

#### DocumentFragment view.render()

Renders the view, and returns a document fragment

#### base.willRender()

Called right before the view is rendered

#### base.didRender()

Called right after the view is rendered

#### base.section

The section, or virtual document fragment which contains all the elements. See [https://github.com/mojo-js/loaf.js] for further documentation.

#### base.remove()

Removes the view's elements from the DOM.

#### base.willRemove()

Called right before the view is removed

#### base.didRemove()

Called right after the view is removed

#### base.visible

true / false if the view is currently visible to the user

#### base.parent

reference to the parent view

#### views.Stack

Contains a stack of views, where only one is displayed at a time. This class is useful
when displaying different pages.

```javascript
var Pages = views.Stack.extend({
  children: {
    home: require("./home"),
    account: require("./account")
  }
});

var pages = new Pages();
pages.set("state", "home"); // move to the home page
```

#### stack.state

the current state of the stack view

#### stack.states

Allows you to control the state of multiple nested stack.

```javascript

var AccountPages = views.Stack.extend({
  children: {
    billing: require("./billing"),
    profile: require("./profile")
  }
});

var Pages = views.Stack.extend({
  name: "main",
  children: {
    home: require("./home"),
    account: AccountPages
  }
});

var pages = new Pages();

pages.set("states", {
  main: "account",
  account: "profile"
});
```

#### views.List

Contains a list of views


### Default Plugins

Below are a list of plugins for mojo views that extend their functionality

#### children

Children allow you to define child view controller which get added to the view controller

#### bindings

Bindings allow you to compute properties on each view

### Property Scope

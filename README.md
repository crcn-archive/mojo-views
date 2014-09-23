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

```javascript
var views = require("mojo-views");
var HelloView = views.Base.extend({
    willRender: function () {
      this.section.append(this.nodeFactory.createTextNode("Hello World"));
    }
});

var helloView = new HelloView();
document.body.appendChild(helloView.render());
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

#### views.List

Contains a list of views


### Default Plugins

Below are a list of plugins for mojo views that extend their functionality

#### 
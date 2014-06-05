### Mojo Views [![Build Status](https://travis-ci.org/classdojo/mojo-views.svg)](https://travis-ci.org/classdojo/mojo-views)


Mojo.js is a JavaScript framework for building Single Page Applications, or static websites in [Node.js](http://nodejs.org/). It's inspired by [Angular.js](http://angularjs.org/), [Derby.js](http://derbyjs.com/), [Knockout.js](http://knockoutjs.com/), [Meteor.js](http://www.meteor.com/), [Ember.js](http://emberjs.com/), [jQuery](http://jquery.com/), [Backbone.js](http://backbonejs.org/), and many other JavaScript, and non-JavaScript frameworks. The core is small, while third-party modules allow you to customize Mojo depending on your requirements.
Mojo was built initially to phase out old code, and itself - hence the modularity. The philosophy behind Mojo is to allow you to build on top of your old code base, and slowly strangle out your old application until you have a new, highly maintainable application.

### Features

- Supported in all major browsers: `IE 8+`, `Firefox`, `Chrome`, `Safari`, and `Opera`.
- Supported in Node.js. Run the same code on the front-end & backend. See the [mojo site source code](https://github.com/classdojo/mojojs.com) for an example.
- Flexible bi-directional data-bindings.
- Plays nicely with other frameworks such as Backbone.js, Spine.js, and jQuery. Easily build new application code on top of old code.
- No magic. No assumptions. Mojo.js was built around explicitness and modularity.
- 100% JavaScript - [paperclip.js](https://github.com/classdojo/paperclip.js) templates are also translated to JavaScript.
- Small core. Modules make up the rest.
  - Decorators are core - they control everything from computed properties, creating children of a view, and even setting up templates. There are a few built-in decorators (for now - we'll take them out later): `drag & drop`, `paperclip.js` (template), `bindings` (computed properties), `transition`, and `events` (Backbone style). You can also [create your own](#custom-decorators) if you want to extend the core, but there isn't a single decorator that's required for Mojo.js to function properly.
  - The framework itself is broken into multiple repositories - this makes it easier to encapsulate, re-use bits of functionality.

### Core Libraries

- [bindable.js](https://github.com/classdojo/bindable.js) - data-binding layer.
- [paperclip.js](https://github.com/classdojo/paperclip.js) - template engine.
- [loaf.js](https://github.com/classdojo/loaf.js) - controls sections, or virtual document fragments.
- [flatstack](https://github.com/classdojo/flatstack.js) - queue for rendering / removing views.


### Examples:

- [Hello World](http://jsfiddle.net/BZA8K/88/)
- [Hello Input](http://jsfiddle.net/BZA8K/91/)
- [Todo List](http://jsfiddle.net/BZA8K/92/)
- [Dynamic Templates](http://jsfiddle.net/BZA8K/93/)
- [States Component](http://jsfiddle.net/BZA8K/94/)
- [Custom Components](http://jsfiddle.net/BZA8K/95/)
- [dots benchmark](http://jsfiddle.net/BZA8K/96/)
- [property scope](http://jsfiddle.net/BZA8K/106/)

### TODO:

- route docs
- API docs
- starter kit
- testing docs
- style guidlines

### Installation

You can get started with Mojo.js by installing the [starter kit](http://github.com/classdojo/mojo-starter). In terminal run:

```bash
git clone git@github.com:classdojo/mojo-starter.git && cd mojo-starter && npm install;
```

## View Usage

Views extend [bindable](http://github.com/classdojo/bindable.js) objects. The best way to create a view is to first create a sub-class, then instantiate it. For example:

```javascript
var SubView = mojo.View.extend({
  name: "craig"
});
var view = new SubView();
console.log(view.get("name")); //craig
```

#### DocumentFragment view.render()

Renders the view. [For example](http://jsfiddle.net/BZA8K/97/):

```javascript
var view = new mojo.View({
  paper: paperclip.compile("hello!")
});
$("#application").append(view.render());
```

#### view.section

The [loaf section](https://github.com/classdojo/loaf.js). This is where everything is rendered to.

#### view.remove(callback)

Removes the view from the DOM.

#### view.emit(event [, data...])

emits an event

#### view.on(event, listener)

listener for an event. For example:

```javascript
var view = new mojo.View();
view.on("hello", function() {

});
view.emit("hello"); //trigger listener
```

#### view.bubble(event [, data...])

bubbles an event up to the root view.

#### view.parent

reference to the parent view

#### events

- `render` - emitted when `view.render()` is called.
- `remove` - emitted when `view.remove()` is called.
- `dispose` - emitted when the view is removed, and not used anymore.


#### protected methods

Mojo.js has a few methods you can override if you need to something durring render / remove.

```javascript
var view = new mojo.View({
  willRender: function() {
    // called before render
  },
  didRender: function() {
    //called after render
  },
  willRemove: function() {
    //called before remove
  },
  didRemove: function() {
    //called on removed
  }
});
```


## View Decorators

Decorators are extensions to the Mojo.js framework - they help you describe how your view should function, but aren't necessary for Mojo.js to work. Therefore, you can easily mix decorators, or even [create your own](#custom-decorators). This design was picked to allow you, the coder to pick whatever style suites you best. There are however a few built-in decorators that might help you get started.


### Templates

By default, Mojo.js uses [paperclip.js](https://github.com/classdojo/paperclip.js) for the template engine. [Here's a basic example](http://jsfiddle.net/BZA8K/70/):

```javascript
var view = new mojo.View({
  paper: paperclip.compile("hello world!")
});
$("#application").append(view.render());
```

You can also dynamically change the template. Say for instance you want to change the template depending on a model type, [here's what you can do](http://jsfiddle.net/BZA8K/77/):

```javascript

var templates = {
    notice  : paperclip.compile("notice"),
    default : paperclip.compile("notice"),
    warning : paperclip.compile("warning"),
    error   : paperclip.compile("error")
};

var NotificationView = mojo.View.extend({
    "bindings": {
        "model.type": {
            "paper": {
                "map": function(type) {
                    return templates[type] || templates.default;
                 }
             }
         }
     }
});

var alertView = new NotificationView({ model: new bindable.Object({ type: "alert" }) });
var photoView = new NotificationView({ model: new bindable.Object({ type: "photo" }) });
```

You can add your own template - just create a [custom decorator](#custom-decorators).

### Bindings

The bindings decorator is similar to Ember's computed properties feature. [For example](http://jsfiddle.net/BZA8K/98/):

```javascript
var TestView = mojo.View.extend({
  paper: paperclip.compile("hello-world"),
  bindings: {

      //join first & last name
      "firstName, lastName": {
          "fullName": {
              "map": function(firstName, lastName) {
                  return [firstName, lastName].join(" ");
              }
          }
      },

      //uppercase & lowercase fullName
      "fullName": {
          "fullNameUpper": {
              "map": function(fullName) {
                  return String(fullName).toUpperCase();
              }
          },
          "fullNameLower": {
              "map": function(fullName) {
                  return String(fullName).toLowerCase();
              }
          }
      },

      //wait for fullNameUpper to change
      "fullNameUpper": function(fullNameUpper) {
          console.log("CHANGE!");
      }
  }
});

//init view somewhere
```

### Sections


Sections are what make up your application - they allow you to break down your app into smaller, more modular pieces. [Here's a basic example](http://jsfiddle.net/BZA8K/99/):

```javascript
//views/main/header/logo.js
var LogoView = mojo.View.extend({
    paper: paperclip.compile("header-logo")
});

//views/main/header/index.js
var HeaderView = mojo.View.extend({
    paper: paperclip.compile("header"),
    sections: {
        logo: LogoView
    }
});

//views/main/content/index.js
var ContentView = mojo.View.extend({
    paper: paperclip.compile("content")
});

//views/main/index.js
var MainView = mojo.View.extend({
    paper: paperclip.compile("main"),
    sections: {
        header: HeaderView,
        content: ContentView
    }
});

var mainView = new MainView();
$("#application")..append(mainView.render());
```

Mojo comes with a few built-in components: [lists](#list-component), and [states](#states-component).

### List Component

List of views. [Here's an example](http://jsfiddle.net/BZA8K/100/):

```javascript
var TodosView = mojo.View.extend({
  todos: todoCollection,
  sections: {
    items: {
      type: "list",
      source: "todos",
      modelViewClass: TodoView
    }
  }
})
```

Note that each model item in the source collection is assigned as `model` for each list item.

#### list.filter(fn)

Filters the list. For example:

```javascript
var TodosView = mojo.View.extend({
  todos: todoCollection,
  sections: {
    items: {
      type: "list",
      source: "todos",
      modelViewClass: TodoView,

      //filter items that are NOT done.
      filter: function(model) {
        return !model.get("done");
      }
    }
  }
});
```

#### list.sort(fn)

Sorts the list. For example:

```javascript
var TodosView = mojo.View.extend({
  todos: todoCollection,
  sections: {
    items: {
      type: "list",
      source: "todos",
      modelViewClass: TodoView,
      sort: function(a, b) {
        return a.get("priority") > b.get("priority") ? -1 : 1;
      }
    }
  }
});
```

### States Component

The states component allow you to toggle between multiple views. This is useful if you want to introduce something like routes into your application. [Here's an example](http://jsfiddle.net/BZA8K/101/):

```javascript
var MainView = mojo.View.extend({
  sections: {
    pages: {
      type: "states",
      index: 0,
      views: [
        { class: ContactView , name: "contact" },
        { class: HomeView    , name: "home"    }
      ]
    }
  }
})
```

### states.index

the current index of the state. [For example](http://jsfiddle.net/BZA8K/102/):

```javascript
var MainView = mojo.View.extend({
  sections: {
    pages: {
      type: "states",
      index: 0,
      views: [
        { class: ContactView , name: "contact" },
        { class: HomeView    , name: "home"    }
      ]
    }
  }
});

var view = new MainView();
console.log(view.get("sections.pages.index")); //0
```

### Custom Components

Mojo.js allows you to register your own components. [Here's a basic example](http://jsfiddle.net/BZA8K/103/):

```javascript
//views/main/header/logo.js
var HelloView = mojo.View.extend({
    paper: paperclip.compile("hello")
});

mojo.models.set("components.hello", HelloView);

var MainView = mojo.View.extend({
    paper: paperclip.compile("main"),
    sections: {
        hello1: {
            type: "hello",
            message: "craig"
        },
        hello2: {
            type: "hello",
            message: "john"
        }
    }
});

var mainView = new MainView();
$("#application").append(mainView.render());
```

Note that options provided for each section are automatically set to the component being created. The above equivalent might be:

```javascript
var view = new HelloView({
  message: "john"
});
```

### Custom Decorators

There are some cases you might want to add your own decorator. Say for instance you want to add your own custom template engine. [No problem](http://jsfiddle.net/BZA8K/104/):

decorator:

```javascript
var handlebarsDecorator = {

    //returns the handlebar options. This decorator is ignore if the options are
    //undefined
    getOptions: function(view) {
        return view.handlebars;
    },

    //decorates the view with the given options
    decorate: function(view, sourceName) {

        //compile the template
        var template = Handlebars.compile($("script[data-template-name='" + sourceName + "']").html());

        //wait for the view to render, then add the elements
        view.on("render", function() {

            //temporary placeholder for the elements - use innerHTML to compile the template.
            var div       = document.createElement("div");
            div.innerHTML = template(view.context());

            //append JUST the child nodes to the view section
            view.section.append.apply(view.section, div.childNodes);
        });
    }
}

mojo.decorator(handlebarsDecorator);
```

usage:

```javascript
var MainView = mojo.View.extend({
    name       : "craig",
    handlebars : "main"
});
```

## models singleton

Allows for models to be referenced anywhere in the application. [See the variable scope example]().

## Property Scope

Child views inherit properties from the parent view, just like variable scope in JavaScript. Therefore, you should always `define` properties you want to use within your views. [For example](http://jsfiddle.net/BZA8K/105/):

```javascript
var user = new mojo.bindable.Object({
    name: "john"
});

mojo.models.set("user", user);

var HeaderView = mojo.View.extend({
    paper: paperclip.compile("header")
});

var MainView = mojo.View.extend({
    define: ["user"],
    paper: paperclip.compile("main"),
    bindings: {
        "models.user": "user"
    },
    sections: {
        header: HeaderView
    }
});


var view = new MainView();
$("#application").append(view.render());
```

[Checkout what happens](http://jsfiddle.net/BZA8K/106/) when we define `user` in HeaderView. Notice that `user` isn't inherited anymore, and remains `undefined`.

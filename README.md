### Mojo Views [![Build Status](https://travis-ci.org/classdojo/mojo-views.svg)](https://travis-ci.org/classdojo/mojo-views)

Mojo-views is the view layer for the Mojo.js framework. They are what give your application structure. 

### Installation

```javascript
npm i mojo-views
```

### See also

- [bindable.js](https://github.com/classdojo/bindable.js) - base class for each view
- [mojo-paperclip](/mojo-js/mojo-paperclip) - template engine
- [mojo-router](/mojo-js/mojo-pa)

### Features

- Easy interpolation between other libraries such as Backbone, React, Angular, etc. (no lock-in)


## API


### views.Base(properties[, application])

Inherits [bindable.Object](https://github.com/classdojo/bindable.js)

The base view that controls what the user sees and does

- `properties` - the properties that get set on the view controller
- `application` - (optional) the mojo application

```javascript
var views = require("mojo-views");
var HelloView = views.Base.extend({
    didCreateSection: function () {
      this.section.appendChild(this.nodeFactory.createTextNode("Hello " + this.get("name")));
    }
});

var helloView = new HelloView({ name: "Jeff" });
document.body.appendChild(helloView.render()); // Hello Jeff
```

#### DocumentFragment base.render()

Renders the view, and returns a document fragment

#### base.willRender()

Called right before the view is rendered

#### base.didRender()

Called right after the view is rendered

#### base.didCreateSection()

Called once the `section` is created. This is usually where you might add elements to your view controller.

#### base.section

The section, or virtual document fragment which contains all the elements. See [loaf.js](https://github.com/mojo-js/loaf.js) for further documentation.

#### base.application

The [application](https://github.com/mojo-js/mojo-application).

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

### views.Stack(properties[, application])

Inherits [views.Base](#viewsbaseproperties-application)

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

the current state of the stack view. See example above.

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

### views.List(properties[, application])

Inherits [views.Base](#viewsbaseproperties-application)

Contains a list of views.

```javascript
var bindable = require("bindable");

var items = new bindable.Collection([
  new bindable.Object({ text: "hello 1" }),
  new bindable.Object({ text: "hello 2" }),
  new bindable.Object({ text: "hello 3" })
]);

var ItemView = views.Base.extend({
  didCreateSection: function () {
    this.section.append(this.nodeFactory.createTextNode(this.get("model.text")));
  }
});

var ItemsView = new views.List.extend({
  modelViewClass: ItemView
});

var items = new ItemsView({ source: items });
document.body.appendChild(items.render());
```

#### list.source

The source of the list. This should be a [bindable.Collection](https://github.com/classdojo/bindable.js).
Note that this can also be a reference to another property in the list. This is especially useful when inheriting properties from a parent view. See [property scope](#property-scope) for more info.

#### list.modelViewClass

The view class that's created for each `model` in `source`. Note
that the property `model` is set to each listed view, as shown in the example above.

#### list.sort(modelA, modelB)

The sorting function for the list

```javascript
var bindable = require("bindable");

var people = new bindable.Collection([
  new bindable.Object({ name: "John", age: 29 }),
  new bindable.Object({ name: "Jeff", age: 21  }),
  new bindable.Object({ name: "Ben", age: 23  })
]);

var PeopleView = new views.List.extend({
  modelViewClass: PersionView, // not defined in this example
  sort: function (a, b) {
    return a.get("age") > b.get("age") ? -1 : 1;
  }
});

document.body.append(new PeopleView({ source: people }).render());
```

#### list.filter(model)

Filters models from the list

## Built-in Plugins

#### bindings

Bindings allow you to compute properties on each view.

```javascript
var bindable = require("bindable");

var PersonView = views.Base.extend({
  bindings: {
    "model.firstName, model.lastName": function (firstName, lastName) {
      this.textNode.value = "Hello " + firstName + " " + lastName;
    }
  },
  didCreateSection: function () {
    this.textNode = this.application.nodeFactory.createTextNode("");
    this.section.appendChild(this.textNode);
  }
});

var person = new PersonView();
document.body.appendChild(person.render());
```

#### children

Children allow you to define child view controller which get added to the view controller. This allows a greater level of
organization in your codebase. Here's an example of a basic view structure:

```javascript

// this view never actually gets removed - it's always stuck at the top
var HeaderView = views.Base.extend({
  didCreateSection: function () {
    // render elements here
  }
});

// the main home page
var HomeView = views.Stack.extend({
  didCreateSection: function () {
    // render home elements here
  }
});

var ContactView = views.Stack.extend({
  didCreateSection: function () {
    // render elements here
  }
});


// toggles between home, and contact states
var PagesView = views.Stack.extend({
  children: {
    home: HomeView,
    contact: ContactView
  }
});

// the main entry point into the views
var MainView = views.Base.extend({
  didCreateSection: function () {
    this.section.appendChild(this.children.header.render());
    this.section.appendChild(this.children.pages.render());
  },
  children: {
    header: HeaderView,
    pages: PagesView
  }
});

var mainView = new MainView();
document.body.appendChild(mainView.render());
```

## Custom Plugins

TODO 

## Property Scope

Views, just like variable scope, have the ability to inherit properties from their parent view. For example:

```javascript
var TodoView = views.List.extend({
  willRender: function () {
    this.section.append(this.nodeFactory.createTextNode(this.get("model.text")));
  }
});

var TodosListView = views.List.extend({
  modelViewClass: TodoView, 

  // this is inherited from mainView when set in the constructor
  source: "todoItems"
});

var MainView = views.Base.extend({
  children: {
    todosList: TodosListView
  },
  willRender: function () {
    this.section.append(this.nodeFactory.createTextNode("Todos: "));
    this.section.append(this.get("children.todosList").render());
  }
});

var todos = new bindable.Collection([
  new bindable.Object({ text: "clean car" }),
  new bindable.Object({ text: "walk dog" })
]);

/*
will output:


Todos: clean car walk dog
*/

document.body.appendChild(new MainView({ todoItems: todos }).render());
```

### Breaking Scope

You can also be explicit about what properties are inherited from the parent view by setting
`define` in the view. For example:

```javascript

var ChildView = views.Base.extend({
  define: ["message"],
  message: "Hello World!",
  willRender: function () {
    this.section.append(this.nodeFactory.createTextNode(this.get("message")));
  }
})

var ParentView = views.Base.extend({
  children: {
    child: ChildView
  }
  willRender: function () {
    this.section.append(this.get("children.child").render());
  }
});

// outputs: "Hello World!" instead of "Blarg!"
document.body.appendChild(new ParentView({ message: "Blarg!" }).render());
```

## Application API

#### views(application)

registers `mojo-views` to the [mojo-application](https://github.com/mojo-js/mojo-application), which will add a few properties
/ methods onto the application.

```javascript
var Application = require("mojo-application"),
views           = require("mojo-views");

var app = new Application();
app.use(views);
```

```javascript
application.use(require("mojo-views"));
```

#### application.views.register(viewNameOrClasses[, class])

Registers a view class that's accessible anywhere in the application. This is especially useful when registering reusable components
you might want to use in something like [paperclip-component](https://github.com/mojo-js/paperclip-component).

`viewNameOrClasses` - view name to register, or an object of classses to register
`class` - the class to register

```javascript

var app = new Application();

// register views one at a time
app.views.register("main", MainView);

// or register multiple views at a time
app.views.register({
  main: MainView,
  select: SelectView,        // re-usable select component
  loadingBar: LoadingBarView // re-usable loading bar component
  datePicker: DatePickerView // re-usable date picker view
});


var SomeView = views.Base.extend({
  didCreateSection: function () {

    // create the component, and append to this view
    this.section.appendChild(this.application.views.create("datePicker").render());
  }
});


// create some view, but use the application that 
// has all the registered components
var view = new SomeView(void 0, app);


document.body.appendChild(view.render());
```
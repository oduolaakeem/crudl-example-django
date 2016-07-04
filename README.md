# crudl django example
This is a [crudl](http://crudl.io/) example with [Django](https://www.djangoproject.com/) and [DRF](http://www.django-rest-framework.org/) for the REST-API as well as [Graphene](http://graphene-python.org/) for GraphQL.

## Important notes
* crudl is still under development and the syntax might change (esp. with connectors and descriptors).
* The relevant part for your admin interface is within the folder crudl-admin-rest/admin/ (resp. crudl-admin-graphql/admin/).

## Requirements
* Node.js
* python
* virtualenv
* SQLite

## Installation
1. Create and activate a python **virtual environment**.

2. Clone this repository and cd into the new folder:

    ```
    $ git clone https://github.com/crudlio/crudl-example-django.git
    $ cd crudl-example-django
    ```

3. Install the python requirements:

    ```
    $ pip install -r conf/requirements.txt
    ```

4. Setup the database (SQLite) and add contents:

    ```
    $ python manage.py migrate
    $ python manage.py loaddata apps/blog/fixtures/blog.json
    ```

5. Start the django development server:

    ```
    $ python manage.py runserver
    ```

Open your browser and go to ``http://localhost:8000/crudl-rest/`` and login with the user (demo/demo).

### Install crudl-admin (REST)
In order to change the REST admin interface, you need to build a new bundle ...

Go to /crudl-admin-rest/ and install the npm packages, then run watchify:
```
$ npm install
$ npm run watchify
```

### Install crudl-admin (GraphQL)
In order to change the GraphQL admin interface, you need to build a new bundle ...

Go to /crudl-admin-graphql/ and install the npm packages, then run watchify:
```
$ npm install
$ npm run watchify
```

## URLs
```
/rest-api/          # REST API (DRF)
/graphiql-api/      # GraphQL Query Interface
/crudl-rest/        # Crudl Admin (REST)
/crudl-graphql/     # Crudl Admin (GraphQL)
/admin/             # Django Admin (Grappelli)
```
If you want to use /admin/ you need to create a superuser first.

## Notes
While this example is simple, there's still a couple of more advanced features in order to represent a real-world scenario.

### Connectors and Descriptor
In order for CRUDL to work, you need to define _connectors_ (defining the API) and a _descriptor_ (the visual representation). The _descriptor_ consists of _collections_ (XXX) and the _authentification_.

```
{
    id: 'entries',
    url: 'entries/',
    urlQuery,
    pagination,
    transform: {
        readResponseData: data => data.results,
    },
},
{
    id: 'entry',
    url: 'entries/:id/',
}
```

```
var listView = {}
listView.fields = []
listView.filters = []
var changeView = {}
changeView.fields = []
changeView.tabs = []
var addView = {}
```

### Authentication
Both the REST and GraphQL API is only accessible for logged-in users based on TokenAuthentication.
Authentication for GraphQL is done with a decorator wrapping the basic URL.

Please note the besides the Token, we also add an attribute _authInfo_ in order to subsequently have access to the currently logged-in user (e.g. for filtering).

```
id: 'auth_token',
url: '/rest-api/api-token-auth/',
mapping: { read: 'post', },
transform: {
    readResponseData: data => ({
        requestHeaders: { "Authorization": `Token ${data.token}` },
        authInfo: data,
    })
}
```

### Mutually dependent fields
When adding or editing an _Entry_, the _Categories_ depend on the selected _User_.
If you change the field _User_, the options of field _Category_ are populated based on the chosen _User_.

```
name: 'category',
field: 'Autocomplete',
watch: [
    {
        for: 'user',
        setProps: user => ({
            disabled: !user,
            helpText: !user ? "In order to select a category, you have to select a user first" : "Select a category",
        }),
    }
],
```

You can use the same syntax with list filters (see entries.js).

### Foreign Key, Many-to-Many
There are a couple of foreign keys being used (e.g. _Category_ with _Entry_) and one many-to-many field (_Tags_ with _Entry_).

```
name: 'user',
field: 'Select',
actions: {
    asyncProps: (req, connectors) => connectors.users_options.read(req),
},
```

A more complex example is the field _Category_ with _Entries_. It is an autocomplete field with different actions for select and search.

### Relation with different endpoint
The collection _Links_ is an example of related objects which are assigned through an intermediary table with additional fields.
You can either use the main menu in order to handle all Links are an individual _Entry_ in order to edit the _Links_ assigned to this _Entry_ (which are shown using tabs).

```
changeView.tabs = [
    {
        title: 'Links',
        actions: {
            list: (req, connectors) => {
                req.filter("entry", req.id.id)
                req.paginate(false)
                return connectors.links.read(req)
            },
            add: (req, connectors) => connectors.links.create(req),
            save: (req, connectors) => connectors.link.update(req.with('id', req.data.id)),
            delete: (req, connectors) => connectors.link.delete(req.with('id', req.data.id))
        },
        itemTitle: '{url}',
        fields: [...]
    },
]
```

### Autocompletes
We decided to use autocomplete fields for all foreign-key and many-to-many relations.

### Custom fields
With _Users_, we added a custom field _Name_ which is not part of the database or the API.
The methods _normalize_ and _denormalize_ in order to manipulate the data stream.
```
normalize: (data, error) => {
    data.full_name = data.last_name + ', ' + data.first_name
    return data
},
denormalize: (data) => {
    let index = data.full_name.indexOf(',')
    if (index >= 0) {
        data.last_name = data.full_name.slice(0, index)
        data.first_name = data.full_name.slice(index+1)
    } else {
        data.last_name = ''
        data.first_name = ''
    }
    return data
}
```

### Custom components
We have added a custom component _SplitDateTimeField.jsx_ (see admin/fields) in order to show how you're able to implement fields which are not part of the core package.

### Superuser vs staff user
All 3 _Users_ are able to login to crudl (because is_staff is True). But only superusers (patrick, axel) are allowed to edit all objects. The third user (vaclav) is only able to see and edit his own objects. Besides, only superusers are able to change a users password (user vaclav has no permission to edit his own password).

### Initial values
XXX
```
initialValue: () => {
    let d = new Date()
    return d.toJSON().slice(0, 10)
}
```

XXX
```
initialValue: (context) => context.auth.user
```

### Validate fields and form
XXX
```
validate: (value, allValues) => {
    if (value != allValues.password) {
        return 'The passwords do not match.'
    }
}
```

### Multiple sort with ListView
XXX

### Filter from list result
XXX
If there exist an API call that can return such a list (e.g. /rest-api/users/?has_tag=true) then the implementation is straightforward (using asyncProps).

Without such an API, one would have to make an unpaginated call to /rest-api/tags/ and filter the result in the asyncProps action.

### Filter list
With Users, we only show the currently logged-in user (although the API returns a list of all available users).

```
var listView = {
    path: 'users',
    title: 'Users',
    actions: {
        list: function (req, connectors) {
            return connectors.users.read(req.filter('id', req.authInfo.user))
        },
    },
}
```

## Development
This example mainly shows how to use crudl. It is not intended for development on crudl itself.

## TODO
There is still a long list with open issues, but here are the some of the bigger ones:

* Improve: connectors & descriptors
* Improve: Authentication
* Improve: Finish UI
* Add: Permissions
* Add: Documentation
* Add: Tests
* Add: Internationalization (i18n)
* Add: Dashboard/Menus
* Add: Custom and intermediary pages
* Add: Custom bulk actions
* Add: ListView hierarchies
* Add: Show relations with delete
* Add: Reorder via drag & drop with RelationView and ListView
* Add: RTE
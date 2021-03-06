import React from 'react'
import SplitDateTimeField from '../fields/SplitDateTimeField'

import { createResourceConnector } from '../connectors'

const userFields = 'id, originalId, username, firstName, lastName, email, isActive, isStaff, dateJoined'
const users = createResourceConnector('users', userFields)

//-------------------------------------------------------------------
var listView = {
    path: 'users',
    title: 'Users',
    actions: {
        list: users.read,
    },
    normalize: (list) => list.map(item => {
        if (!item.lastName) {
            item.fullName = item.firstName
        } else if (!item.firstName) {
            item.fullName = <span><b>{item.lastName}</b></span>
        } else {
            item.fullName = <span><b>{item.lastName}</b>, {item.firstName}</span>
        }
        return item
    })
}

listView.fields = [
    {
        name: 'originalId',
        label: 'ID',
    },
    {
        name: 'username',
        label: 'Username',
        sortable: false,
        sorted: 'ascending',
        main: true,
    },
    {
        name: 'fullName',
        label: 'Full name',
    },
    {
        name: 'email',
        label: 'Email address',
    },
    {
        name: 'isActive',
        label: 'Active',
        render: 'boolean',
    },
    {
        name: 'isStaff',
        label: 'Staff member',
        render: 'boolean',
    },
]

//-------------------------------------------------------------------
var changeView = {
    path: 'users/:id',
    title: 'User',
    actions: {
        get: function (req) { return users(crudl.path.id).read(req) },
        save: function (req) { return users(crudl.path.id).update(req) },
    },
    denormalize: (data) => {
        /* prevent unknown field ... with query */
        delete(data.dateJoined)
        delete(data.password_confirm)
        delete(data.originalId)
        return data
    }
}

changeView.fieldsets = [
    {
        fields: [
            {
                name: 'id',
                hidden: true,
            },
            {
                name: 'originalId',
                hidden: true,
            },
            {
                name: 'username',
                label: 'Username',
                field: 'String',
            },
        ],
    },
    {
        fields: [
            {
                name: 'firstName',
                label: 'First Name',
                field: 'String',
            },
            {
                name: 'lastName',
                label: 'Last Name',
                field: 'String',
            },
            {
                name: 'email',
                label: 'Email address',
                field: 'String',
                readOnly: () => crudl.auth.user !== crudl.context('originalId'),
            }
        ],
    },
    {
        title: 'Roles',
        expanded: true,
        description: () => {
            if (crudl.auth.user == crudl.context('originalId')) {
                return <span style={{color: '#CC293C'}}>WARNING: If you remove crudl access for the currently logged-in user, you will be logged out and unable to login with this user again.</span>
            }
        },
        fields: [
            {
                name: 'isActive',
                label: 'Active',
                field: 'Checkbox',
                initialValue: true,
                helpText: 'Designates whether this user should be treated as active. Unselect this instead of deleting accounts.'
            },
            {
                name: 'isStaff',
                label: 'Staff member',
                field: 'Checkbox',
                helpText: 'Designates whether the user can log into crudl.'
            },
        ],
    },
    {
        title: 'More...',
        expanded: false,
        description: 'This is an example of a custom field (see admin/fields/SplitDateTimeField.jsx).',
        fields: [
            {
                name: 'dateJoined',
                label: 'Date joined',
                readOnly: true,
                field: SplitDateTimeField,
                getTime: (date) => {
                    let T = date.indexOf('T')
                    return date.slice(T+1, T+6)
                },
                getDate: (date) => {
                    let T = date.indexOf('T')
                    return date.slice(0, T)
                },
            },
        ],
    },
    {
        title: 'Password',
        hidden: () => crudl.auth.user !== crudl.context('originalId'),
        expanded: false,
        description: "Raw passwords are not stored, so there is no way to see this user's password, but you can set a new password.",
        fields: [
            {
                name: 'password',
                label: 'Password',
                field: 'Password',
            },
            {
                name: 'password_confirm',
                label: 'Password (Confirm)',
                field: 'Password',
                validate: (value, allValues) => {
                    if (value != allValues.password) {
                        return 'The passwords do not match.'
                    }
                }
            },
        ],
    },
]

//-------------------------------------------------------------------
var addView = {
    path: 'users/new',
    title: 'New User',
    denormalize: changeView.denormalize,
    actions: {
        add: users.create,
    },
}

addView.fieldsets = [
    {
        fields: [
            {
                name: 'id',
                hidden: true,
            },
            {
                name: 'originalId',
                hidden: true,
            },
            {
                name: 'username',
                label: 'Username',
                field: 'String',
            },
        ],
    },
    {
        fields: [
            {
                name: 'firstName',
                label: 'First Name',
                field: 'String',
            },
            {
                name: 'lastName',
                label: 'Last Name',
                field: 'String',
            },
            {
                name: 'email',
                label: 'Email address',
                field: 'String',
            }
        ],
    },
    {
        title: 'Roles',
        expanded: true,
        fields: [
            {
                name: 'isActive',
                label: 'Active',
                field: 'Checkbox',
                initialValue: true,
                helpText: 'Designates whether this user should be treated as active. Unselect this instead of deleting accounts.'
            },
            {
                name: 'isStaff',
                label: 'Staff member',
                field: 'Checkbox',
                helpText: 'Designates whether the user can log into crudl.'
            },
        ],
    },
    {
        title: 'Password',
        expanded: true,
        fields: [
            {
                name: 'password',
                label: 'Password',
                field: 'Password',
            },
            {
                name: 'password_confirm',
                label: 'Password (Confirm)',
                field: 'Password',
                validate: (value, allValues) => {
                    if (value != allValues.password) {
                        return 'The passwords do not match.'
                    }
                }
            },
        ],
    },
]


module.exports = {
    listView,
    changeView,
    addView,
}

import React from 'react'
import CustomDashboard from './custom/Dashboard'

var users = require('./views/users')
var sections = require('./views/sections')
var categories = require('./views/categories')
var tags = require('./views/tags')
var entries = require('./views/entries')
var { login, logout } = require('./auth')

const OPTIONS = {
    debug: false,
    basePath: '/crudl-graphql/',
    baseURL: '/graphql-api/',
}

var admin = {}
admin.title = 'crudl.io Django GraphQL Example'
admin.options = OPTIONS
admin.views = { users, sections, categories, tags, entries }
admin.auth = { login, logout }
admin.custom = { dashboard: CustomDashboard }
admin.id = 'crudl-example-django'
admin.crudlVersion = "^0.3.0"
admin.messages = {
    'login.button': 'Sign in',
    'logout.button': 'Sign out',
    'logout.affirmation': 'Have a nice day!',
    'pageNotFound': 'Sorry, page not found.',
}

export default admin

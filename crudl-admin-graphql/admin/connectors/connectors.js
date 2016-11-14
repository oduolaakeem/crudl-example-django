import { continuousPagination, listQuery, transformErrors } from '../utils'

module.exports = {

    // USERS
    users: {
        query: {
            read: listQuery({
                name: 'allUsers',
                fields: 'id, originalId, username, firstName, lastName, email, isActive, isStaff, dateJoined'
            }),
            create: `mutation ($input: CreateUserInput!) {
                createUser(input: $input) {
                    errors
                    user {id, originalId, username, firstName, lastName, email, isActive, isStaff, dateJoined}
                }
            }`,
        },
        pagination: continuousPagination,
        transform: {
            readResponseData: data => data.data.allUsers.edges.map(e => e.node),
            createResponseData: data => {
                if (data.data.createUser.errors) {
                    throw transformErrors(data.data.createUser.errors)
                }
                return data.data.createUser.user
            },
        },
    },
    user: {
        query: {
            read: `{user(id: "%id"){id, originalId, username, firstName, lastName, email, isStaff, isActive, dateJoined}}`,
            update: `mutation ($input: ChangeUserInput!) {
                changeUser(input: $input) {
                    errors
                    user {id, originalId, username, firstName, lastName, email, isActive, isStaff, dateJoined}
                }
            }`,
            delete: `mutation ($input: DeleteUserInput!) {
                deleteUser(input: $input) {
                    deleted
                }
            }`,
        },
        transform: {
            readResponseData: data => {
                if (!data.data.user) {
                    throw crudl.notFoundError('The requested user was not found')
                }
                return data.data.user
            },
            updateResponseData: data => {
                console.log("updateResponseData", data)
                if (data.data.changeUser.errors) {
                    throw transformErrors(data.data.changeUser.errors)
                }
                return data.data.changeUser.user
            },
            deleteRequestData: data => ({ id: data.id }),
            deleteResponseData: data => data.data,
        }
    },

    // SECTIONS
    sections: {
        query: {
            read: listQuery({
                name: 'allSections',
                fields: 'id, originalId, name, slug, position, counterEntries',
                args: { first: 20 }
            }),
            create: `mutation ($input: CreateSectionInput!) {
                createSection(input: $input) {
                    errors
                    section {id, name, slug, position}
                }
            }`,
        },
        pagination: continuousPagination,
        transform: {
            readResponseData: data => data.data.allSections.edges.map(e => e.node),
            createResponseData: data => {
                if (data.data.createSection.errors) {
                    throw transformErrors(data.data.createSection.errors)
                }
                return data.data.createSection.section
            },
        },
    },
    section: {
        query: {
            read: `{section(id: "%id"){id, name, slug, position}}`,
            update: `mutation ($input: ChangeSectionInput!) {
                changeSection(input: $input) {
                    errors
                    section {id, name, slug, position}
                }
            }`,
            delete: `mutation ($input: DeleteSectionInput!) {
                deleteSection(input: $input) {
                    deleted
                }
            }`,
        },
        transform: {
            readResponseData: data => {
                if (!data.data.section) {
                    throw crudl.notFoundError('The requested section was not found')
                }
                return data.data.section
            },
            updateResponseData: data => {
                if (data.data.changeSection.errors) {
                    throw transformErrors(data.data.changeSection.errors)
                }
                return data.data.changeSection.section
            },
            deleteRequestData: data => ({ id: data.id }),
            deleteResponseData: data => data.data,
        }
    },

    // CATEGORIES
    categories: {
        query: {
            read: listQuery({
                name: 'allCategories',
                fields: 'id, originalId, section{id,name}, name, slug, position, counterEntries',
                args: { first: 20 }
            }),
            create: `mutation ($input: CreateCategoryInput!) {
                createCategory(input: $input) {
                    errors
                    category {id, section{id,name}, name, slug, position}
                }
            }`,
        },
        pagination: continuousPagination,
        transform: {
            readResponseData: data => data.data.allCategories.edges.map(e => e.node),
            createResponseData: data => {
                if (data.data.createCategory.errors) {
                    throw transformErrors(data.data.createCategory.errors)
                }
                return data.data.createCategory.category
            },
        },
    },
    category: {
        query: {
            read: `{category(id: "%id"){id, section{id,name}, name, slug, position}}`,
            update: `mutation ($input: ChangeCategoryInput!) {
                changeCategory(input: $input) {
                    errors
                    category {id, section{id,name}, name, slug, position}
                }
            }`,
            delete: `mutation ($input: DeleteCategoryInput!) {
                deleteCategory(input: $input) {
                    deleted
                }
            }`,
        },
        transform: {
            readResponseData: data => {
                if (!data.data.category) {
                    throw crudl.notFoundError('The requested category was not found')
                }
                return data.data.category
            },
            updateResponseData: data => {
                if (data.data.changeCategory.errors) {
                    throw transformErrors(data.data.changeCategory.errors)
                }
                return data.data.changeCategory.category
            },
            deleteRequestData: data => ({ id: data.id }),
            deleteResponseData: data => data.data,
        }
    },

    // TAGS
    tags: {
        query: {
            read: listQuery({
                name: 'allTags',
                fields: 'id, originalId, name, slug, counterEntries',
                args: { first: 20 }
            }),
            create: `mutation ($input: CreateTagInput!) {
                createTag(input: $input) {
                    errors
                    tag {id, name, slug}
                }
            }`,
        },
        pagination: continuousPagination,
        transform: {
            readResponseData: data => data.data.allTags.edges.map(e => e.node),
            createResponseData: data => {
                if (data.data.createTag.errors) {
                    throw transformErrors(data.data.createTag.errors)
                }
                return data.data.createTag.tag
            },
        },
    },
    tag: {
        query: {
            read: `{tag(id: "%id"){id, name, slug}}`,
            update: `mutation ($input: ChangeTagInput!) {
                changeTag(input: $input) {
                    errors
                    tag {id, name, slug}
                }
            }`,
            delete: `mutation ($input: DeleteTagInput!) {
                deleteTag(input: $input) {
                    deleted
                }
            }`,
        },
        transform: {
            readResponseData: data => {
                if (!data.data.tag) {
                    throw crudl.notFoundError('The requested tag was not found')
                }
                return data.data.tag
            },
            updateResponseData: data => {
                if (data.data.changeTag.errors) {
                    throw transformErrors(data.data.changeTag.errors)
                }
                return data.data.changeTag.tag
            },
            deleteRequestData: data => ({ id: data.id }),
            deleteResponseData: data => data.data,
        }
    },

    // ENTRIES
    entries: {
        query: {
            read: listQuery({
                name: 'allEntries',
                fields: 'id, originalId, title, status, date, sticky, section{id, name}, category{id, name}, owner{id, originalId, username}, counterLinks, counterTags',
                args: { first: 20 }
            }),
            create: `mutation ($input: CreateEntryInput!) {
                createEntry(input: $input) {
                    errors
                    entry {id, title, status, date, sticky, section{id, name}, category{id, name}, summary, body, owner{id, username}, createdate, updatedate}
                }
            }`,
        },
        pagination: continuousPagination,
        transform: {
            readResponseData: data => data.data.allEntries.edges.map(e => e.node),
            /* set owner on add. alternatively, we could use denormalize with
            the admin, see collections/entries.js */
            createRequestData: data => {
                if (crudl.auth.user) data.owner = crudl.auth.user
                return data
            },
            createResponseData: data => {
                if (data.data.createEntry.errors) {
                    throw transformErrors(data.data.createEntry.errors)
                }
                return data.data.createEntry.entry
            },
        },
    },
    entry:{
        query: {
            read: `{entry(id: "%id"){id, title, status, date, sticky, section{id, name}, category{id, name}, tags{id, name}, summary, body, owner{id, username}, createdate, updatedate}}`,
            update: `mutation ($input: ChangeEntryInput!) {
                changeEntry(input: $input) {
                    errors
                    entry {id, title, status, date, sticky, section{id, name}, category{id, name}, tags{id, name}, summary, body, owner{id, username}, createdate, updatedate}
                }
            }`,
            delete: `mutation ($input: DeleteEntryInput!) {
                deleteEntry(input: $input) {
                    deleted
                }
            }`,
        },
        transform: {
            readResponseData: data => {
                if (!data.data.entry) {
                    throw crudl.notFoundError('The requested entry was not found')
                }
                return data.data.entry
            },
            updateResponseData: data => {
                if (data.data.changeEntry.errors) {
                    throw transformErrors(data.data.changeEntry.errors)
                }
                return data.data.changeEntry.entry
            },
            deleteRequestData: data => ({ id: data.id }),
            deleteResponseData: data => data.data,
        }
    },

    // ENTRYLINKS
    links: {
        query: {
            read: listQuery({
                name: 'allLinks',
                fields: 'id, entry{id}, url, title, description, position',
            }),
            create: `mutation ($input: CreateEntrylinkInput!) {
                createEntrylink(input: $input) {
                    errors
                    entrylink {id, entry{id}, url, title, description, position}
                }
            }`,
        },
        transform: {
            readResponseData: data => data.data.allLinks.edges.map(e => e.node),
            createResponseData: data => {
                if (data.data.createEntrylink.errors) {
                    throw transformErrors(data.data.createEntrylink.errors)
                }
                return data.data.createEntrylink.entrylink
            },
        },
    },
    link: {
        query: {
            read: `{link(id: "%id"){id, entry{id}, url, title, description, position}}`,
            update: `mutation ($input: ChangeEntrylinkInput!) {
                changeEntrylink(input: $input) {
                    errors
                    entrylink {id, entry{id}, url, title, description, position}
                }
            }`,
            delete: `mutation ($input: DeleteEntrylinkInput!) {
                deleteEntrylink(input: $input) {
                    deleted
                }
            }`,
        },
        transform: {
            readResponseData: data => {
                if (!data.data.entrylink) {
                    throw crudl.notFoundError('The requested entry link was not found')
                }
                return data.data.entrylink
            },
            updateResponseData: data => {
                if (data.data.changeEntrylink.errors) {
                    throw transformErrors(data.data.changeEntrylink.errors)
                }
                return data.data.changeEntrylink.entrylink
            },
            deleteRequestData: data => ({ id: data.id }),
            deleteResponseData: data => data.data,
        }
    },

    // SPECIAL CONNECTORS

    // sectionsOptions
    // a helper for retrieving the sections used with select fields
    sectionsOptions: {
        query: {
            read: `{allSections(orderBy:\"slug\"){edges{node{id, name}}}}`,
        },
        transform: {
            readResponseData: data => ({
                options: data.data.allSections.edges.map(function(item) {
                    return { value: item.node.id, label: item.node.name }
                }),
            })
        },
    },

    // categoryOptions
    // a helper for retrieving the categories used with select fields
    categoriesOptions: {
        query: {
            read: listQuery({
                name: 'allCategories',
                args: { orderBy: 'slug' },
                fields: 'id, name, slug'
            }),
        },
        transform: {
            readResponseData: data => ({
                options: data.data.allCategories.edges.map(function(item) {
                    return { value: item.node.id, label: item.node.name }
                }),
            })
        },
    },

    // tagsOptions
    // a helper for retrieving the tags used with select fields
    tagsOptions: {
        query: {
            read: listQuery({
                name: 'allTags',
                args: { orderBy: 'slug' },
                fields: 'id, name'
            }),
        },
        transform: {
            readResponseData: data => ({
                options: data.data.allTags.edges.map(function(item) {
                    return { value: item.node.id, label: item.node.name }
                }),
            })
        },
    },

    // AUTHENTICATION
    login: {
        url: '/rest-api/login/',
        mapping: { read: 'post', },
        transform: {
            readResponse: res => {
                if (res.status >= 400) {
                    const error = res.data
                    if (error !== null && typeof error === 'object') {
                        error._error = error.non_field_errors
                    }
                    throw error
                }
                return res
            },
            readResponseData: data => ({
                requestHeaders: { "Authorization": `Token ${data.token}` },
                info: data,
            })
        }
    }
}

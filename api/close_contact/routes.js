const inputValidations = require('./validations/input')

module.exports = (server) =>{
    const handlers = require('./handlers')(server)
    const getCaseById = require('./route_prerequesites').getCasebyId(server)
    const getCloseContactbyId = require('./route_prerequesites').getCloseContactbyId(server)

    return [
        {
            method: 'GET',
            path: '/close-contacts',
            config: {
                auth: 'jwt',
                description: 'show list of all close-contacts',
                tags: ['api', 'close_contacts'],
                validate: inputValidations.QueryValidations
            },
            handler: handlers.ListCloseContact
        },
        {
            method: 'GET',
            path: '/cases/{caseId}/close-contacts',
            config: {
                auth: 'jwt',
                description: 'show list of all close-contacts per-case',
                tags: ['api', 'close_contacts']
            },
            handler: handlers.ListCloseContactCase
        },
        {
            method: 'GET',
            path: '/cases/{caseId}/close-contacts/{closeContactId}',
            config: {
                auth: 'jwt',
                description: 'show a specific close contact',
                tags: ['api', 'close_contacts'],
                pre: [
                    getCaseById
                ]
            },
            handler: handlers.DetailCloseContact
        },
        {
            method: 'POST',
            path: '/cases/{caseId}/close-contacts',
            config: {
                auth: 'jwt',
                description: 'create new close contacts',
                tags: ['api', 'close_contacts'],
                validate: inputValidations.RequestPayload,
                pre: [ getCaseById ]
            },
            handler: handlers.CreateCloseContact
        },
        {
            method: 'PUT',
            path: '/cases/{caseId}/close-contacts/{closeContactId}',
            config: {
                auth: 'jwt',
                description: 'update close contacts',
                tags: ['api', 'close_contacts'],
                validate: inputValidations.RequestPayload,
                pre: [
                    getCaseById,
                    getCloseContactbyId
                ]
            },
            handler: handlers.UpdateCloseContact
        },
        {
            method: 'DELETE',
            path: '/cases/{caseId}/close-contacts/{closeContactId}',
            config: {
                auth: 'jwt',
                description: 'delete specific close contact',
                tags: ['api', 'close_contacts'],
                pre: [
                    getCaseById,
                    getCloseContactbyId
                ]
            },
            handler: handlers.DeleteCloseContact
        },
    ]
}
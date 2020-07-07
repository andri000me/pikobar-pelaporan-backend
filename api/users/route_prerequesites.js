const { ROLE } = require('../../helpers/constant');
const CheckRoleView = server => {
    return {
        method: (request, reply) => {

            if (request.auth.credentials.user.role === ROLE.ADMIN ||
                request.auth.credentials.user.role === ROLE.PROV ||
                request.auth.credentials.user.role === ROLE.FASKES ||
                request.auth.credentials.user.role === ROLE.KOTAKAB) {
                return reply(request.auth.credentials.user.role)
            } else {
                return reply({
                    status: 403,
                    message: 'Anda Tidak Mempunyai Akses!',
                    data: null
                }).code(403).takeover()
            }

        },
        assign: 'roles'
    }
}

const CheckRoleCreate = server => {
    return {
        method: (request, reply) => {

            if (request.auth.credentials.user.role === ROLE.ADMIN ||
                request.auth.credentials.user.role === ROLE.FASKES ||
                request.auth.credentials.user.role === ROLE.KOTAKAB) {
                return reply(request.auth.credentials.user.role)
            } else {
                return reply({
                    status: 403,
                    message: 'Anda Tidak Mempunyai Akses!',
                    data: null
                }).code(403).takeover()
            }

        },
        assign: 'roles'
    }
}

const CheckRoleUpdate = server => {
    return {
        method: (request, reply) => {

            if (request.auth.credentials.user.role === ROLE.ADMIN ||
                request.auth.credentials.user.role === ROLE.KOTAKAB ||
                request.auth.credentials.user.role === ROLE.FASKES) {
                return reply(request.auth.credentials.user.role)
            } else {
                return reply({
                    status: 403,
                    message: 'Anda Tidak Mempunyai Akses!',
                    data: null
                }).code(403).takeover()
            }

        },
        assign: 'roles'
    }
}

const CheckRoleDelete = server => {
    return {
        method: (request, reply) => {
            if (request.auth.credentials.user.role === ROLE.ADMIN ||
                request.auth.credentials.user.role === ROLE.KOTAKAB ||
                request.auth.credentials.user.role === ROLE.FASKES) {
                return reply(request.auth.credentials.user.role)
            } else {
                return reply({
                    status: 403,
                    message: 'Anda Tidak Mempunyai Akses!',
                    data: null
                }).code(403).takeover()
            }

        },
        assign: 'roles'
    }
}



module.exports = {
    CheckRoleView,
    CheckRoleCreate,
    CheckRoleUpdate,
    CheckRoleDelete
}

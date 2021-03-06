'use strict';
const setPwd = (payload) => {
    const crypto = require('crypto');
    payload.salt = crypto.randomBytes(16).toString('hex');
    payload.hash = crypto.pbkdf2Sync(payload.password, payload.salt, 10000, 512, 'sha512').toString('hex');
    payload.password = payload.hash;
    return payload;
}

const deletedSave = (payloads, author) => {
    const date = new Date();
    payloads.delete_status = "deleted";
    payloads.deletedAt = date.toISOString();
    payloads.deletedBy = author;
    return payloads;
}

const isObject = (value) => {
    return value && typeof value === 'object'
}

const deleteProps = (arrProps, obj) => {
    if (!isObject(obj) || !Array.isArray(arrProps)) return
    arrProps.map(x => delete obj[x])
}

const jsonParse = (str) => {
    try {
        return JSON.parse(str)
    } catch (e) {
        return false
    }
}

const convertDate = (dates) => {
    return new Date(dates.getTime()).toLocaleDateString("id-ID");
}

const isDirty = (oldData, newData) => {     
    function isEqual (a, b) {
        if (Array.isArray(a))
            return JSON.stringify(a) === JSON.stringify(b)
        else if (typeof(a) === 'object')
            return String(a) === String(b)
        return a === b
    }

    let result = false
    let changed_props = [];
    for (let prop in newData) {
        if (typeof oldData[prop] === 'undefined') continue
        if (!isEqual(oldData[prop], newData[prop])) {
            result = true
            changed_props.push(prop)
        }
    }

    return result
}

module.exports = {
    setPwd, deletedSave, isObject, deleteProps, jsonParse,
    convertDate, isDirty
}

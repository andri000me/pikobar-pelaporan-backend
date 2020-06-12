const Joi = require('joi')
const { validateOptions, HeadersPayLoad } = require('../../validations')
const _ = require('lodash')

// --------------------------------------------------
//    Schema - Input Validations
// --------------------------------------------------

const SurveyCreatePayload = Joi.object().keys({
    survey_name: Joi.string().required().description('Nama survey'),
    category: Joi.string().description('Kategori survei'),
    using_for: Joi.string().description('Pengguna survei privat/public'),
    description: Joi.string().description('Penjelasan survei'),
    introduction: Joi.string().description('Teks pembukaan survei'),
    periode_start: Joi.date().required().description('Tanggal survei dimulai'),
    periode_end: Joi.date().required().description('Tanggal survei berakhir'),
    respondent_target: Joi.number().description('Target survei respondent'),
    status: Joi.string().description('Status publikasi survei')
})

const SurveyUpdatePayload = Joi.object().keys({
    survey_name: Joi.string().optional(),
    category: Joi.string().optional(),
    using_for: Joi.string().optional(),
    description: Joi.string().optional(),
    introduction: Joi.string().optional(),
    periode_start: Joi.date().optional(),
    periode_end: Joi.date().optional(),
    respondent_target: Joi.number().optional(),
    status: Joi.string().optional()
})

const SurveyParamsValidations = {
    params: {
        id: Joi.string().required()
    }
}


// --------------------------------------------------
//    Config - Input Validations
// --------------------------------------------------
const RdtQueryValidations = {
    query: {
        limit: Joi.number().integer().default(10).description('limit result set'),
        offset: Joi.number().integer().default(0).description('number of record to skip'),
        page: Joi.number().integer().default(0).description('number of page'),
        sort: Joi.string().empty('', 'desc').default('{createdAt:"desc"}').description('sorting by create date'),
        address_district_code: Joi.string().empty('', null).default('').description('search data by survey name'),
        category: Joi.string().empty('', null).default('').description('search by category'),
        final_result: Joi.string().empty('', null).default('').description('search by final_result'),
        mechanism: Joi.string().empty('', null).default('').description('search by mechanism'),
        test_method: Joi.string().empty('', null).default('').description('search by test_method'),
        test_address_district_code: Joi.string().empty('', null).default('').description('search by test_address_district_code'),
        search: Joi.string().empty('', null).default('').description('search data'),
        start_date: Joi.string().empty('', null).default('').description('search data by test date'),
        end_date: Joi.string().empty('', null).default('').description('search data by test date')
    },
    options: validateOptions.options,
    failAction: validateOptions.failAction
}



const SurveyCreatePayloadValidations = {
    payload: SurveyCreatePayload,
    headers: HeadersPayLoad,
    options: validateOptions.options,
    failAction: validateOptions.failAction
}


const SurveyUpdatePayloadValidations = Object.assign({
    payload: SurveyUpdatePayload,
    headers: HeadersPayLoad,
    options: validateOptions.options,
    failAction: validateOptions.failAction
}, SurveyParamsValidations)


const SurveyDeletePayloadValidations = Object.assign({
    headers: HeadersPayLoad,
    options: validateOptions.options,
    failAction: validateOptions.failAction
}, SurveyParamsValidations)

module.exports = {
    SurveyParamsValidations,
    RdtQueryValidations,
    SurveyCreatePayloadValidations,
    SurveyUpdatePayloadValidations,
    SurveyDeletePayloadValidations
}
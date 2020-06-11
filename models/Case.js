const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
const check = require("../helpers/historycheck")
var uniqueValidator = require('mongoose-unique-validator')

const CaseSchema = new mongoose.Schema({
    // (NIK/Nomor Kasus) ex : covid_kodeprovinsi_kodekota/kab_nokasus
    id_case : {type: String, lowercase: true, unique: true, index: true},
    // NIK sumber terkait kontak erat
    id_case_national : {type:String},
    nik : { type:String},
    id_case_related : {type:String},
    name_case_related : {type:String},
    name: {type:String},
    // tentatif jika diisi usia, required jika tidak
    birth_date : { type: Date},
    age : {type:Number},
    gender : {type:String},
    address_street: {type:String},
    address_village_code: { type: String, required: [true, "can't be blank"]},
    address_village_name: { type: String, required: [true, "can't be blank"]},
    // kecamatan
    address_subdistrict_code: { type: String, required: [true, "can't be blank"]},
    address_subdistrict_name: { type: String, required: [true, "can't be blank"]},
    // kab/kota
    address_district_code: { type: String, required: [true, "can't be blank"]},
    address_district_name: { type: String, required: [true, "can't be blank"]},
    address_province_code: { type: String, default:32},
    address_province_name: { type: String, default:"Jawa Barat"},
    office_address: {type:String},
    phone_number: {type:String},
    nationality: {type:String},
    nationality_name: {type: String},
    occupation: {type:String},
    last_history : {type: mongoose.Schema.Types.ObjectId, ref: 'History'},
    author : { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    author_district_code : { type:String},
    author_district_name : { type: String},
    stage: String,
    status: String,
    final_result: {type: String, default: null},
    delete_status: String,
    deletedAt: Date,
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    verified_status: { type: String, lowercase: true },
    verified_comment: {type: String, default: null},
    is_test_masif: {type: Boolean, default: false}

},{ timestamps:true, usePushEach: true })

CaseSchema.index( { verified_status: 1 } )
CaseSchema.index( { address_district_code: 1 } )

CaseSchema.plugin(mongoosePaginate)
CaseSchema.plugin(uniqueValidator, { message: 'ID already exists in the database.' })


CaseSchema.methods.toJSONFor = function () {
    return {
        _id: this._id,
        id_case: this.id_case,
        name: this.name,
        age: this.age,
        nik: this.nik,
        nationality: this.nationality,
        nationality_name: this.nationality_name,
        gender: this.gender,
        current_location_address: this.last_history.current_location_address,
        address_district_name: this.address_district_name,
        address_district_code: this.address_district_code,
        phone_number: this.phone_number,
        stage: this.stage,
        status: this.status,
        verified_status: this.verified_status,
        verified_comment: this.verified_comment,
        final_result: this.final_result,
        delete_status: this.delete_status,
        deletedAt: this.deletedAt,
        author: this.author.JSONCase(),
        last_history: this.last_history,
        is_test_masif: this.is_test_masif,
        createdAt : this.createdAt,
        updatedAt : this.updatedAt
    }
}


CaseSchema.methods.JSONFormCase = function () {
    let covid = this.id_case 
    let nik = this.nik === null || this.nik === undefined ? "-" : this.nik
    return {
        display: this.name + '/'+nik+'/'+this.phone_number,
        id_case: this.id_case,
        id: this._id,
        last_status: this.status,
        source_data: "internal"
    }
}

CaseSchema.methods.JSONFormIdCase = function () {
    return {
        _id: this._id,
        id_case: this.id_case,
        name: this.name,
        relateds: `${this.name} (${this.id_case})`
    }
}


CaseSchema.methods.JSONSeacrhOutput = function () {
    return {
       id: this._id,
       id_case: this.id_case,
       target: null,
       nik: this.nik,
       name: this.name,
       birth_date: this.birth_date,
       age: this.age,
       gender: this.gender,
       address_detail: this.address_street,
       address_district_code: this.address_district_code,
       address_district_name: this.address_district_name,
       address_subdistrict_code: this.address_subdistrict_code,
       address_subdistrict_name: this.address_subdistrict_name,
       address_village_code: this.address_village_code,
       address_village_name: this.address_village_name,
       phone_number: this.phone_number,
       category: null,
       mechanism: null,
       nationality: this.nationality,
       nationality_name: this.nationality_name,
       final_result: this.final_result,
       test_location_type: null,
       test_location: null,
       status: null
    }
}

function convertDate(dates){
    return new Date(dates.getTime()).toLocaleDateString("id-ID")
}

CaseSchema.methods.JSONExcellOutput = function () {
    let finals,stages,birthDate,createDate,diagnosis,diagnosis_other
    
    if(this.final_result == '0'){
        finals = 'NEGATIF'
    }else if(this.final_result == '1'){
        finals = 'SEMBUH'
    }else if(this.final_result == '2'){
        finals = 'MENINGGAL'
    }else{
        finals = null
    }

    stages = (this.stage == 0 ? "Prosess" : "Selesai")    
    birthDate = (this.birth_date != null ? convertDate(this.birth_date) : null)
    createDate = (this.createdAt != null ? convertDate(this.createdAt) : null)
    diagnosis = (this.last_history.diagnosis > 1 ? "" : this.last_history.diagnosis.toString())
    diagnosis_other = (this.last_history.diseases > 1 ? "" : this.last_history.diseases.toString())
    
    return {
       "Kode Kasus": this.id_case,
       "Kode Kasus Pusat": this.id_case_national,
       "Tanggal Lapor": createDate,
       "Sumber Lapor":(this.last_history !== null ? this.last_history.report_source : null),
       "NIK": this.nik,
       "Nama": this.name,
       "Tanggal Lahir": birthDate,
       "Usia": this.age,
       "Jenis Kelamin": this.gender,
       "Provinsi": "Jawa Barat",
       "Kota": this.address_district_name,
       "Kecamatan": this.address_subdistrict_name,
       "Kelurahan": this.address_village_name,
       "Alamat detail": `${this.address_street}`,
       "No Telp": this.phone_number,
       "Kewarganegaraan": this.nationality,
       "Negara":(this.nationality == "WNI" ? "Indonesia" : this.nationality_name),
       "Pekerjaan": this.occupation,
       "Gejala": diagnosis,
       "Kondisi Penyerta": diagnosis_other,
       "Riwayat": check.historyCheck(this.last_history),
       "Status": this.status,
       "Tahapan":stages,
       "Hasil":finals,
       "Lokasi saat ini": (this.last_history !== null ? this.last_history.current_location_address : null),
       "Tanggal Input": createDate,
       "Catatan Tambahan": (this.last_history !== null ? this.last_history.other_notes : ''),
       "Author": this.author.fullname
    }
}


module.exports = mongoose.model('Case', CaseSchema)

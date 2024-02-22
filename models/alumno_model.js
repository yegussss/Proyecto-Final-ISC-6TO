const mongoose = require('mongoose');
const alumnoSchema = new mongoose.Schema({
    matr:{
        type: String,
        required: true
    },
    nom:{
        type: String,
        required: true
    },
    apat:{
        type:String,
        required:true
    },
    amat:{
        type:String,
        default:""
    },
    carrera:{
        type:String,
        required:true,
    },
    asist:{
        type:Boolean,
        default:true
    }
},{
    timestamps:true,
    versionKey:false
});

module.exports = mongoose.model("Alumno",alumnoSchema)
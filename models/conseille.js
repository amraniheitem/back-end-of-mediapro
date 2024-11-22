const mongoose = require('mongoose');

const conseilleSchema = new mongoose.Schema({
    conseille: { 
        type: String, 
        required: true, 
        trim: true 
    }, 
    video: { 
        type: String, 
        required: true, 
        validate: {
            validator: function (v) {
                return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/.test(v);
            },
            message: props => `${props.value} n'est pas un lien YouTube valide !`
        }
}
},
 { 
    timestamps: true 
});

module.exports = mongoose.model('Conseille', conseilleSchema);

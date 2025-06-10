import mongoose from "mongoose";

const chatbotschema = mongoose.Schema({
    name:{
        type:String,
        require:true,
    },

    PhoneNumber:{
        type:Number,
        require:true,
    },

    email:{
        type:String,
        require:true,
    },

    querystring:{
        type:String,
        require:true,
    },
    
});

const Chatbotschema = mongoose.models.Chatbotschema || mongoose.model('Chatbotschema', chatbotschema);

export default Chatbotschema;
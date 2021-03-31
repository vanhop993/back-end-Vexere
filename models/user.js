const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require('bcryptjs');

const userSchema = mongoose.Schema({
    provider:{
        type:String,
        default:""
    },
    name:{
        type:String,
        trim:true,
        required:true,
    },
    username:{
        type:String,
        trim:true,
        default:null,
    },
    password:{
        type:String,
        trim:true,
        default:null,
    },
    email:{
        type:String,
        required:true,
        trim:true,
        validate(value){
            if (!validator.isEmail(value)) {
              throw new Error("Email không hợp lệ");
            }
          }
    },
    gender:{
        type:String,
    },
    phone:{
        type:String,
        trim:true,
    },
    role:{
        type:String,
        default:"user",
    },
    avatar:{
        type:String,
        default:'',
    },
    tokens: {
        type: [String],
        default: [],
    },
    secretToken:{
        type:String,
    },
    verify:{
        type:String,
        default:'notActive',
    }
},{
    timestamps:true,
});

userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    delete user.tokens;
    delete user.secretToken;
    return user;
  };

userSchema.pre("save", async function(next){
    if(this.isModified("password")){{
        this.password = await bcryptjs.hash(this.password, 8);
    }}
    next();
})

const User = mongoose.model("User",userSchema);
module.exports = User;
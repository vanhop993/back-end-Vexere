const Utility = require("../models/utility");
const convertCode = require("../slug");


const postNewUtility = async(req,res) => {
    const {name,description} = req.body;
    try{
        const code = convertCode(name)
        const foundedUtility = await Utility.findOne({code});
        if(foundedUtility && foundedUtility.status === true)return res.status(200).send({message:"Tiện ích đã tồn tại"});
        let newUtility
        if(!foundedUtility){
            newUtility = await new Utility({
                name,code,description
            });
        }else{
            foundedUtility.status=true;
            newUtility =foundedUtility;
        };
        let result = await newUtility.save();
        res.status(200).send(result);
    }catch(err){
        res.status(500).send({ message: "You are not authorized" });
    }
};

const getAllUtility = async(req,res)=>{
    try{
        const foundedUtility = await Utility.find({status:true});
        res.status(200).send(foundedUtility)
    }catch(err){
        res.status(500).send({ message: "You are not authorized" });
    }
}

const deleteUtility = async(req,res) => {
    const {code} = req.query;
    try{
        const foundedUtility = await Utility.findOne({code,status:true});
        if(!foundedUtility) return res.status(200).send({message:"Tiện ích không tồn tại!"});
        foundedUtility.status = false;
        await foundedUtility.save();
        res.status(200).send({message:"Xóa thành công!!"})
    }catch(err){
        res.status(500).send({ message: "You are not authorized" });
    }
}

module.exports = {postNewUtility,deleteUtility,getAllUtility};
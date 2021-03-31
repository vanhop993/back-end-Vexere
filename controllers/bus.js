const Bus = require("../models/bus");
const Company = require("../models/company");
const Trip = require("../models/trip");


const postNewBus = async(req,res) => {
    const {companyId,licensePlate,typeBus,images,seats} = req.body;
    try{
        const foundedCompany = await Company.findById(companyId);
        if(!foundedCompany) return res.status(200).send({message:"Công ty không tồn tại!!"});
        const foundedBus = await Bus.findOne({licensePlate});
        if(foundedBus && foundedBus.status === true)return res.status(200).send({message:"Xe đã tồn tại!!"});
        let newBus;
        if(!foundedBus){
            newBus = new Bus({
                company:companyId,
                licensePlate,
                typeBus,
                images,
                seats
            });
        }else{
            foundedBus.status = true;
            newBus = foundedBus;
        }
        const result = await newBus.save()
        res.status(200).send(result);
    }catch(err){
        console.log(err);
        res.status(500).send({ message: "You are not authorized" });
    }
};

const getAllBus = async(req,res) => {
    try{
        const foundedAllBus = await Bus.find({status:true}).populate("company","name code");
        res.status(200).send(foundedAllBus);
    }catch(err){
        res.status(500).send({ message: "You are not authorized" });
    }
};

const getAllBusByCompany = async(req,res) => {
    const {code} = req.query;
    try{
        const foundedAllBus = await Bus.find({status:true}).populate("company","name code");
        const foundedBus = foundedAllBus.filter(bus => bus.company.code === code);
        res.status(200).send(foundedBus);
    }catch(err){
        res.status(500).send({ message: "You are not authorized" });
    }
};

const getBus = async(req,res) => {
    const {licensePlate} = req.query;
    try{
        const foundedBus = await Bus.findOne({licensePlate,status:true}).populate("company","name code");
        if(!foundedBus) return res.status(401).send({message:"Xe không tồn tại!!"});
        res.status(200).send(foundedBus)
    }catch(err){
        res.status(500).send({ message: "You are not authorized" });
    }
};

const deleteBus = async (req,res) => {
    const {id} = req.query;
    try{
        const foundedBus = await Bus.findOne({_id:id,status:true});
        if(!foundedBus) return res.status(401).send({message:"Xe không tồn tại"});
        const foundedTripOfBus = await Trip.findOne({bus:id,status:true});
        if(foundedTripOfBus) return res.status(401).send({message:"Xe đang còn chuyến đang chạy"});
        foundedBus.status = false;
        await foundedBus.save();
        res.status(200).send({message:"Xóa thành công!!"});
    }
    catch(err){
        console.log(err);
        res.status(500).send({message:"You are not authorize!!",err})
    }
}

// const putBus = async(req,res) => {
//     const {id} = req.query;
//     const {companyId,licensePlate,typeBus,images,seats} = req.body;
//     try{
//         const foundedBus = await Bus.findOne({_id:id,status:true});
//         if(!foundedBus)
//     }
//     catch(err){
//         console.log(err);
//         res.status(500).send({message:"You are not authorize!!",err})
//     }
// }


module.exports = {postNewBus,getAllBus,getAllBusByCompany,getBus,}
const Place = require("../models/place");
const convertCode = require("../slug");


const postNewPlace = async(req,res) =>{
    const {proviceCity,district} = req.body;
    try{
        const foundedPlace = await Place.findOne({"proviceCity.name":proviceCity,"district.name":district});
        if(foundedPlace) return res.status(401).send({message:"Địa điểm đã tồn tại"});
        const result = await new Place({
            proviceCity:{name:proviceCity},district:{name:district}
        }).save();
        res.status(200).send(result);
    }catch(err){
        console.log(err);
        res.status(500).send({message:"You are not authorized"});
    }
}

module.exports = {postNewPlace};
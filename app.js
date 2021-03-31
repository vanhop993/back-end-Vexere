const express = require("express");
const bodyParsen = require("body-parser");
const app = express();
const cors = require("cors");
const path = require("path");


require("./db/connect");

const userRouter = require('./routers/user');
const companyRouter = require('./routers/company');
const busRouter = require("./routers/bus");
const utilityRouter = require("./routers/utility");
const proviceCityRouter = require("./routers/proviceCity");
const districtRouter = require("./routers/district");
const stationRouter = require("./routers/station");
const tripRouter = require("./routers/trip");
const commentCompanyRouter = require("./routers/commentCompany");
const commentStationRouter = require("./routers/commentStation");
const ticketRouter = require("./routers/ticket");

app.use(cors({
    origin: "http://localhost:8080",
    optionsSuccessStatus: 200
}));


app.use(bodyParsen.json());
app.use("/images",express.static(path.join(__dirname,"images")));
app.use(userRouter);
app.use(proviceCityRouter);
app.use(districtRouter);
app.use(companyRouter);
app.use(busRouter);
app.use(utilityRouter);
app.use(stationRouter);
app.use(tripRouter);
app.use(commentCompanyRouter);
app.use(commentStationRouter);
app.use(ticketRouter);

const config = require("config");
const PORT = process.env.PORT || config.get("port");
app.listen(PORT,()=>{
    console.log("listening!!!");
})
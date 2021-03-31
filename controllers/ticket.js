const Ticket = require("../models/ticket");

const getTicket = async (req, res) => {
  try {
    const foundedTickets = await Ticket.find({ user: req.user._id })
      .populate("user","name username")
      .populate({
        path: ("trip"),select: "departurePlace arrivalPlace departureTime",
        populate: { path: "company",select: "name"},
      });
    res.status(200).send(foundedTickets);
  } catch (err) {
    res.status(500).send({ massage: "You are not authorized!!" });
  }
};

module.exports = { getTicket };

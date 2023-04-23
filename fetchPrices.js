require("dotenv").config();
const axios = require("axios");
const token = process.env.APITOKEN;

const url =
  "https://api.device-specs.io/api/smartphones?filters[cpu_type][$eq]=Apple&populate=*";

const fetchPrices = async () => {
  try {
    const response = await axios({
      method: "get",
      url: url,
      headers: { Authorization: `Bearer ${token}` },
    });
    return response;
  } catch (err) {
    console.log(err);
    return err.message;
  }
};

module.exports = fetchPrices;

require("dotenv").config();
const APIToken = process.env.APITOKEN;

const fetchPrices = async () => {
  try {
    const response = await fetch(
      "https://api.device-specs.io/api/smartphones?filters[cpu_type][$eq]=Apple&populate=*",
      {
        headers: {
          Authorization: "Bearer " + APIToken,
        },
      }
    );
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
    return err.message;
  }
};

module.exports = fetchPrices;

const CONSTANTS = {
  MARKET_NAME: "부엉 마켓",
  API_SERVER:
    process.env.NODE_ENV === "production" ? "http://localhost:3000" : "",
};

export default CONSTANTS;

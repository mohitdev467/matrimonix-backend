const crypto = require("crypto");

const generateRandomId = async () => {
  const uniqueId = await crypto.randomBytes(16).toString("hex");

  const hash = crypto.createHash("sha256");
  hash.update(uniqueId);

  const orderId = hash.digest("hex");
  return orderId.substr(0, 12);
};

module.exports = { generateRandomId };

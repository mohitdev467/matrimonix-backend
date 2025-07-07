const crypto = require("crypto");

const generateRandomId = async () => {
  const uniqueId = await crypto.randomBytes(16).toString("hex");

  const hash = crypto.createHash("sha256");
  hash.update(uniqueId);

  const orderId = hash.digest("hex");
  return orderId.substr(0, 12);
};

function calculateAge(dobString) {
  const [day, month, year] = dobString.split("-").map(Number);
  const dob = new Date(year, month - 1, day);
  const diff = Date.now() - dob.getTime();
  const ageDate = new Date(diff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}



function generateRandomEmail(index = 0, domain = "example.com") {
  const randomStr = Math.random().toString(36).substring(2, 8);
  const timestamp = Date.now();
  return `user_${randomStr}_${timestamp}_${index}@${domain}`;
}


module.exports = { generateRandomId, calculateAge,generateRandomEmail };
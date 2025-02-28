const getUsers = (req, res) => {
  res.json({ message: "List of users" });
};

module.exports = { getUsers };

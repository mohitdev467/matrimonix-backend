const Complexion = require("../models/adminModel/ComplexionSchema");

module.exports.addDefaultComplexion = async () => {
    const defaultComplexion = [
        {  complexion: 'Very fair' },
        {  complexion: 'Fair' },
        {  complexion: 'Wheatish' },
        {  complexion: 'Wheatish brown' },
        {  complexion: 'Dark' }
      ];
    const count = await Complexion.countDocuments();
  if (count === 0) {
    await Complexion.insertMany(defaultComplexion)
      .then(() => {
        console.log('Default values added successfully');
      })
      .catch((err) => {
        console.error('Error adding default values', err);
      })
    } else {
      console.log('Challenges  already exist, skipping default insertion');
    }
  }
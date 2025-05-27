const Challanged = require("../models/adminModel/ChallangedSchema");
module.exports.addDefaultChallanged = async () => {
  const defaultChallanged = [
      { challanged_id: 1, challanged: 'None' },
      { challanged_id: 2, challanged: 'Physically Handicapped from birth' },
      { challanged_id: 3, challanged: 'Physically Handicapped due to accident' },
      { challanged_id: 4, challanged: 'Mentally Challenged from birth' },
      { challanged_id: 5, challanged: 'Mentally Challenged due to accident' }
    ];
    const count = await Challanged.countDocuments();
  if (count === 0) {
    await Challanged.insertMany(defaultChallanged)
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
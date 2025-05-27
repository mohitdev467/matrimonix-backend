const cron = require('node-cron');
const UserSchema = require('../models/adminModel/UserSchema');

const membershipExpiryJob = cron.schedule('0 0 * * *', async () => {
  console.log('Running membership expiry check job...');

  try {
    const now = new Date();

    // Find all users with active membership and a subscription end date
    const users = await UserSchema.find({
      membershipStatus: 'active',
      end_subscription_date: { $ne: null }
    });

    for (const user of users) {
      const expiryDate = new Date(user.end_subscription_date);

      if (expiryDate <= now) {
        user.membershipStatus = 'expired';
        await user.save();
        console.log(`Membership expired for user: ${user._id}`);
      }
    }

    console.log('Membership expiry check completed.');
  } catch (error) {
    console.error('Error in membership expiry job:', error);
  }
}, {
  scheduled: false, // we will start it manually
});

module.exports = membershipExpiryJob;

const axios = require('axios');
const dotenv = require('../../config/dotenv');

dotenv();

const VIDEOSDK_API_KEY = "ac9f491a-fc53-4a91-a2cc-80c964d5412a";
const VIDEOSDK_API_BASE_URL = 'https://api.videosdk.live/v2';

const generateVideoCallToken = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    // Generate authentication token
    const tokenResponse = await axios.post(
      `${VIDEOSDK_API_BASE_URL}/auth/tokens`,
      {},
      {
        headers: {
          Authorization: `Bearer ${VIDEOSDK_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const token = tokenResponse.data.token;

    // Create a meeting
    const meetingResponse = await axios.post(
      `${VIDEOSDK_API_BASE_URL}/meetings`,
      {},
      {
        headers: {
          Authorization: `Bearer ${VIDEOSDK_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const meetingId = meetingResponse.data.meetingId;

    res.status(200).json({
      success: true,
      data: { token, meetingId },
    });
  } catch (error) {
    console.error('Error generating VideoSDK token:', error.response?.data || error.message);
    res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
};

module.exports = { generateVideoCallToken };
// controllers/meetController.js

const { google } = require('googleapis');
const { oauth2Client, SCOPES } = require('../../config/googleAuth');


let oauthTokens = null;
// GET /auth-url
const getAuthUrl = (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  res.send({ authUrl });
};

// GET /callback
const handleOAuthCallback = async (req, res) => {
    const { code } = req.query;
    try {
      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);
      oauthTokens = tokens; // Save tokens
      res.send('Authenticated Successfully! You can now create a Meet.');
    } catch (error) {
      res.status(500).send('OAuth Callback Error');
    }
  };

// POST /create-meet
const createMeet = async (req, res) => {
    try {
      if (!oauthTokens) {
        return res.status(401).send('User not authenticated. Please authenticate first.');
      }
  
      oauth2Client.setCredentials(oauthTokens); // Set the saved credentials
  
      const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
      const event = await calendar.events.insert({
        calendarId: 'primary',
        conferenceDataVersion: 1,
        requestBody: {
          summary: 'Video Meeting',
          description: 'Meeting with user',
          start: { dateTime: new Date().toISOString() },
          end: { dateTime: new Date(Date.now() + 15 * 60 * 1000).toISOString() },
          conferenceData: {
            createRequest: {
              requestId: Math.random().toString(36).substring(7),
              conferenceSolutionKey: { type: 'hangoutsMeet' },
            },
          },
        },
      });
  
      const meetLink = event.data.hangoutLink;
      res.send({ meetLink });
    } catch (error) {
      console.error('Error creating meet:', error);
      res.status(500).send('Error creating meet link');
    }
  };
  

module.exports = {
  getAuthUrl,
  handleOAuthCallback,
  createMeet,
};

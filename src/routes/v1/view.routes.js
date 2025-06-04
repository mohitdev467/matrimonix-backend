const express = require('express');
const router = express.Router();

router.get('/refund-policy', (req, res) => {
  console.log("Refund policy page accessed");
  res.render('refund-policy', {}, (err, html) => {
    if (err) {
      console.error("Error rendering EJS:", err);
      return res.status(500).send("Error rendering page");
    }
    res.send(html);
  });
});

router.get('/privacy-policy', (req, res) => {
  console.log("Privacy policy page accessed");
  res.render('privacy-policy', {}, (err, html) => {
    if (err) {
      console.error("Error rendering EJS:", err);
      return res.status(500).send("Error rendering page");
    }
    res.send(html);
  });
});

router.get('/terms-conditions', (req, res) => {
  console.log("Terms and conditions page accessed");
  res.render('terms-conditions', {}, (err, html) => {
    if (err) {
      console.error("Error rendering EJS:", err);
      return res.status(500).send("Error rendering page");
    }
    res.send(html);
  });
});

module.exports = router;

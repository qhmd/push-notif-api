const express = require('express');
const admin = require('firebase-admin');
const fs = require('fs');

const app = express();
app.use(express.json());

// Inisialisasi Firebase Admin SDK
const serviceAccount = JSON.parse(process.env.FIREBASE_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.post('/send', async (req, res) => {
  try {
    const { token, title, body, newsUrl ,commentUid } = req.body;
    console.log("isinya adalah", token + title + body + newsUrl + commentUid);
    const message = {
      token,
      title: title ?? '',
      body: body ?? '',
      newsUrl: newsUrl ?? '',
      commentUid: commentUid ?? '',
    }

  const response = await admin.messaging().send(message);
  res.json({ message: 'Notification sent', id: response });
  console.log(response);
} catch (error) {
  console.error('FCM error:', error);
  res.status(500).json({ error: 'Failed to send notification' });
}
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

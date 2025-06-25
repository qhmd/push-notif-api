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
    const { token, title, body, data } = req.body;
    console.log("isinya adalah" , token + title + body + data);
    const message = {
      token,
      data: {
        click_action: "FLUTTER_NOTIFICATION_CLICK",
        title: title ?? '',
        body: body ?? '',
        newsUrl: data?.newsUrl ?? '',
        commendUid: data?.commendUid ?? '',
      }
    };


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

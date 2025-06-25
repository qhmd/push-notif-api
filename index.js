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
    const { token, data } = req.body;

    // Pastikan setiap value dalam data adalah string
    const stringifiedData = {};
    for (const key in data) {
      stringifiedData[key] = String(data[key]);
    }

    const message = {
      token,
      data: stringifiedData,
    };

    const response = await admin.messaging().send(message);
    console.log("✅ Notification sent:", response);
    res.json({ message: 'Notification sent', id: response });
  } catch (error) {
    console.error('❌ FCM error:', error);
    res.status(500).json({ error: 'Failed to send notification' });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

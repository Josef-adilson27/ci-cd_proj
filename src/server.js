import express from 'express';
import webhookRoutes from './webhooks/github.js';
import notificationRoutes from './notifications/telegram.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

/// https://myawesomewebhook.loca.lt/webhooks/github

app.use('/webhooks', webhookRoutes);

//app.use('/notifications', notificationRoutes);

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'CI/CD Bot',
    timestamp: new Date().toISOString()
  });
});

app.listen(port, () => {
  console.log(`🚀 CI/CD Bot running on port ${port}`);
});
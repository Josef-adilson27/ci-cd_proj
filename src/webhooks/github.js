import express from 'express';
import axios from 'axios';

import telegram from '../notifications/telegram.js';

const router = express.Router();

// Webhook для GitHub
router.post('/github', async (req, res) => {
  const event = req.headers['x-github-event'];
  const payload = req.body;
  
  console.log(`📦 Received GitHub event: ${event}`);
  
  // Быстро отвечаем GitHub
  res.status(202).json({ status: 'processing' });
  
  // Обрабатываем в фоне
  try {
    if (event === 'push' && payload.ref === 'refs/heads/main') {
      await handlePushEvent(payload);
    }
    
    if (event === 'deployment_status') {
      await handleDeploymentEvent(payload);
    }
    
  } catch (error) {
    telegram.sendDeployFailed(repo, branch, error, author)
    console.error('Error processing webhook:', error);
  }
});

async function handlePushEvent(payload) {
  const { repository, commits, sender } = payload;
  telegram.sendPushNotification()
  await sendNotification(
    `🔨 New push to ${repository.name}\n` +
    `👤 By: ${sender.login}\n` +
    `📝 Commits: ${commits.length}\n` +
    `🔗 ${repository.html_url}`
  );
}

async function handleDeploymentEvent(payload) {
  const { deployment, deployment_status, repository } = payload;
  telegram.sendDeploySuccess()
  const status = deployment_status.state;
  const emoji = status === 'success' ? '✅' : '❌';
  
  await sendNotification(
    `${emoji} Deployment ${status}\n` +
    `📦 ${repository.name}\n` +
    `🌿 ${deployment.ref}\n` +
    `👤 ${deployment.creator.login}`
  );
}

async function sendNotification(message) {
 
  console.log('📢 Notification:', message);
}

export default router;
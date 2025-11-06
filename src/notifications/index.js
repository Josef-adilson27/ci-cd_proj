import telegram from './telegram.js';


class NotificationManager {
  constructor() {
    this.providers = [];
    
    if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
      this.providers.push('telegram');
    }
    
    if (process.env.SLACK_WEBHOOK_URL) {
      this.providers.push('slack');
    }
    
    console.log(`🔔 Notification providers: ${this.providers.join(', ') || 'none'}`);
  }
  
  async notifyDeploySuccess(repo, branch, commit, author) {

    console.log(`🚀 Deploy success: ${repo} ${branch}`);
    
    const promises = [];
    
    if (this.providers.includes('telegram')) {
      promises.push(telegram.sendDeploySuccess(repo, branch, commit, author));
    }
    
    console.log(`✅ DEPLOY SUCCESS: ${repo}@${branch} by ${author}`);
    
    return Promise.allSettled(promises);

  }

  async notifyDeployFailed(repo, branch, error, author) {
    console.log(`❌ Deploy failed: ${repo} ${branch}`, error);
    
    const promises = [];
    
    if (this.providers.includes('telegram')) {
      promises.push(telegram.sendDeployFailed(repo, branch, error, author));
    }
    
    console.log(`🚨 DEPLOY FAILED: ${repo}@${branch} - ${error}`);
    
    return Promise.allSettled(promises);
  }

  async notifyPush(repo, branch, commits, author) {
    console.log(`🔨 New push: ${repo} ${branch} (${commits.length} commits)`);
    
    const promises = [];
    
    if (this.providers.includes('telegram')) {
      promises.push(telegram.sendPushNotification(repo, branch, commits, author));
    }
    
    
    console.log(`📝 PUSH: ${repo}@${branch} - ${commits.length} commits by ${author}`);
    
    return Promise.allSettled(promises);
  }

  async sendRawMessage(text) {
    const promises = [];
    
    if (this.providers.includes('telegram')) {
      promises.push(telegram.sendMessage(text));
    }
    
    if (this.providers.includes('slack')) {
      promises.push(slack.sendMessage({ text }));
    }
    
    return Promise.allSettled(promises);
  }

}

export default new NotificationManager();
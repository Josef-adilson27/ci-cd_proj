import axios from "axios";

class TelegramNotifier {

  constructor() {
    this.token = process.env.TELEGRAM_BOT_TOKEN;
    this.chatId = process.env.TELEGRAM_CHAT_ID;
  }

  async sendMessage(text, options = {}) {
    
    if (!this.token || !this.chatId) {
      console.log("📢 Telegram notification (not configured):", text);
      return;
    }


    try {
      const url = `https://api.telegram.org/bot${this.token}/sendMessage`;

      const response = await axios.post(url, {
        chat_id: this.chatId,
        text: text,
        parse_mode: "HTML",
        disable_web_page_preview: options.disablePreview || true,
        ...options,
      });

      console.log("✅ Telegram message sent");
      return response.data;
    } catch (error) {
      console.error(
        "❌ Telegram error:",
        error.response?.data || error.message
      );
    }
  }

  
  async sendDeploySuccess(repo, branch, commit, author) {
    const message = `
          🚀 <b>Deployment Successful</b>
          📦 <b>Repository:</b> ${repo}
          🌿 <b>Branch:</b> ${branch}
          📝 <b>Commit:</b> ${commit}
          👤 <b>By:</b> ${author}
          ⏰ <b>Time:</b> ${new Date().toLocaleString()}
              `.trim();

    return this.sendMessage(message);
  }


  async sendDeployFailed(repo, branch, error, author) {
    const message = `
          ❌ <b>Deployment Failed</b>
          📦 <b>Repository:</b> ${repo}
          🌿 <b>Branch:</b> ${branch}
          🚨 <b>Error:</b> <code>${error}</code>
          👤 <b>By:</b> ${author}
          ⏰ <b>Time:</b> ${new Date().toLocaleString()}
    `.trim();

    return this.sendMessage(message);
  }

  async sendPushNotification(repo, branch, commits, author) {

    const commitList = commits.slice(0, 3).map((commit) => `• ${commit.message}`).join("\n");

    const message = `
          🔨 <b>New Push</b>
          📦 <b>Repository:</b> ${repo}
          🌿 <b>Branch:</b> ${branch}
          👤 <b>By:</b> ${author}
          📝 <b>Commits (${commits.length}):</b>
          ${commitList}
          ${commits.length > 3 ? `\n... and ${commits.length - 3} more` : ""}
    `.trim();

    return this.sendMessage(message);
  }

}

export default new TelegramNotifier();
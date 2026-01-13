/**
 * Discord Webhook Client Module
 *
 * Provides functions for posting to Discord using webhooks.
 * No bot account required - uses Discord Webhook URLs.
 */

/**
 * Validate and create Discord webhook client
 * @returns {Object} Discord webhook client configuration
 */
export function createDiscordClient() {
  const { DISCORD_WEBHOOK_URL } = process.env;

  if (!DISCORD_WEBHOOK_URL) {
    throw new Error('DISCORD_WEBHOOK_URL environment variable is required');
  }

  // Validate webhook URL format
  if (!DISCORD_WEBHOOK_URL.startsWith('https://discord.com/api/webhooks/') &&
      !DISCORD_WEBHOOK_URL.startsWith('https://discordapp.com/api/webhooks/')) {
    throw new Error('Invalid Discord webhook URL format');
  }

  return {
    webhookUrl: DISCORD_WEBHOOK_URL
  };
}

/**
 * Create a Discord Embed for rich message formatting
 * @param {string} title - Release title
 * @param {string} url - Release URL
 * @param {string} summary - Optional summary/description
 * @param {Object} options - Additional options
 * @returns {Object} Discord webhook payload with embed
 */
export function createDiscordEmbed(title, url, summary = null, options = {}) {
  const {
    color = 5814783, // Discord blurple color
    footer = 'Release Note X',
    timestamp = true
  } = options;

  const embed = {
    embeds: [{
      title: `🚀 ${title}`,
      url: url,
      description: summary || '新しいリリースが利用可能です！',
      color: color,
      fields: [
        {
          name: '📦 リリース',
          value: `[${title}](${url})`,
          inline: true
        },
        {
          name: '🔗 リンク',
          value: '[GitHub Releases](' + url + ')',
          inline: true
        }
      ]
    }]
  };

  // Add timestamp if enabled
  if (timestamp) {
    embed.embeds[0].timestamp = new Date().toISOString();
  }

  // Add footer if specified
  if (footer) {
    embed.embeds[0].footer = {
      text: footer,
      icon_url: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png'
    };
  }

  return embed;
}

/**
 * Post a message to Discord webhook
 * @param {Object} client - Discord client from createDiscordClient()
 * @param {Object} payload - Discord webhook payload
 * @returns {Promise<Object>} Response from Discord API
 */
export async function postToDiscord(client, payload) {
  try {
    console.log('📝 Discord投稿内容:');
    console.log('---');
    console.log(JSON.stringify(payload, null, 2));
    console.log('---');

    const response = await fetch(client.webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`HTTP ${response.status}: ${JSON.stringify(errorData)}`);
    }

    const result = await response.json();
    console.log('✅ Discord投稿成功！');
    console.log(`   Message ID: ${result.id}`);

    return result;
  } catch (error) {
    console.error('❌ Discord投稿に失敗しました');
    console.error(`   ${error.message}`);

    // Discord-specific error handling
    if (error.message.includes('400')) {
      console.error('\n⚠️  リクエスト形式エラー（400）');
      console.error('   Webhook URLやEmbed形式を確認してください');
    } else if (error.message.includes('404') || error.message.includes('Invalid URL')) {
      console.error('\n⚠️  Webhookが見つかりません（404）');
      console.error('   Webhook URLが正しいか確認してください');
    } else if (error.message.includes('429')) {
      console.error('\n⚠️  レート制限（429エラー）');
      console.error('   数秒待ってから再試行してください');
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('fetch failed')) {
      console.error('\n⚠️  ネットワークエラー');
      console.error('   インターネット接続を確認してください');
    }

    throw error;
  }
}

/**
 * Create a simple text message for Discord (no embed)
 * @param {string} text - Message text
 * @returns {Object} Discord webhook payload
 */
export function createDiscordMessage(text) {
  return {
    content: text
  };
}

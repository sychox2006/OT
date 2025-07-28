const TelegramBot = require('node-telegram-bot-api');
const express = require('express');

// Bot configuration
const token = process.env.TELEGRAM_BOT_TOKEN || '8117225688:AAE1kpb83NZKgQ_ywvE9ps-8Oqcsy7mYHGM';
const bot = new TelegramBot(token, { polling: true });

// Configuration
const ADMIN_ID = 6920443520;
const FORCE_CHANNELS = [
  { username: 'learnWithUs_3', url: 'https://t.me/learnWithUs_3' },
  { username: 'lwu_backup', url: 'https://t.me/lwu_backup' }
];
const IMAGE_API_URL = 'https://botfather.cloud/Apis/ImgGen/?prompt=';

// In-memory storage (in production, use a database)
const users = new Map();
const bannedUsers = new Set();

// Helper functions
function isAdmin(userId) {
  return userId === ADMIN_ID;
}

function isBanned(userId) {
  return bannedUsers.has(userId);
}

function getUserData(userId) {
  if (!users.has(userId)) {
    users.set(userId, {
      id: userId,
      credits: 5, // Default credits
      joinedAt: new Date(),
      lastActive: new Date()
    });
  }
  return users.get(userId);
}

function updateUserActivity(userId) {
  const user = getUserData(userId);
  user.lastActive = new Date();
  users.set(userId, user);
}

async function checkChannelMembership(userId) {
  try {
    for (const channel of FORCE_CHANNELS) {
      const member = await bot.getChatMember(`@${channel.username}`, userId);
      if (member.status === 'left' || member.status === 'kicked') {
        return false;
      }
    }
    return true;
  } catch (error) {
    console.error('Error checking channel membership:', error);
    return false;
  }
}

function getForceJoinKeyboard() {
  return {
    inline_keyboard: [
      [
        { text: '📢 Join Channel 1', url: FORCE_CHANNELS[0].url },
        { text: '📢 Join Channel 2', url: FORCE_CHANNELS[1].url }
      ],
      [{ text: '✅ I Joined Both Channels', callback_data: 'check_membership' }]
    ]
  };
}

function getMainMenuKeyboard() {
  return {
    keyboard: [
      ['🎨 Generate Image', '💰 Check Credits'],
      ['❓ Help', 'ℹ️ About'],
      ['📸 Examples', '👤 Profile']
    ],
    resize_keyboard: true,
    one_time_keyboard: false
  };
}

function getAdminKeyboard() {
  return {
    keyboard: [
      ['👥 User Stats', '💰 Manage Credits'],
      ['🚫 Ban User', '✅ Unban User'],
      ['📢 Broadcast', '📊 Bot Stats'],
      ['🔙 Back to Main Menu']
    ],
    resize_keyboard: true,
    one_time_keyboard: false
  };
}

// Middleware to check if user is banned
function checkBanned(msg, next) {
  if (isBanned(msg.from.id)) {
    bot.sendMessage(msg.chat.id, '🚫 You are banned from using this bot.');
    return;
  }
  next();
}

// Middleware to check channel membership
async function checkMembership(msg, next) {
  if (isAdmin(msg.from.id)) {
    next();
    return;
  }

  const isMember = await checkChannelMembership(msg.from.id);
  if (!isMember) {
    const forceJoinMessage = `
🔒 *Access Restricted*

To use this bot, you must join our channels first:

📢 **Required Channels:**
• ${FORCE_CHANNELS[0].url}
• ${FORCE_CHANNELS[1].url}

After joining both channels, click "✅ I Joined Both Channels" button below.
    `;
    
    bot.sendPhoto(msg.chat.id, 'https://via.placeholder.com/400x200/4CAF50/white?text=Join+Our+Channels', {
      caption: forceJoinMessage,
      parse_mode: 'Markdown',
      reply_markup: getForceJoinKeyboard()
    });
    return;
  }
  
  next();
}

// Start command
bot.onText(/\/start/, checkBanned, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const firstName = msg.from.first_name || 'User';
  
  updateUserActivity(userId);
  
  if (isAdmin(userId)) {
    const adminWelcome = `
🔥 *Welcome Admin ${firstName}!* 🔥

You have full access to all bot features and admin panel.

🎨 *User Features:*
• Generate unlimited images
• Access all commands

⚡ *Admin Features:*
• Manage user credits
• Ban/Unban users
• Broadcast messages
• View statistics

Choose an option from the menu below:
    `;
    
    bot.sendPhoto(chatId, 'https://via.placeholder.com/400x200/FF5722/white?text=Admin+Panel', {
      caption: adminWelcome,
      parse_mode: 'Markdown',
      reply_markup: getAdminKeyboard()
    });
    return;
  }
  
  // Check channel membership for regular users
  const isMember = await checkChannelMembership(userId);
  if (!isMember) {
    const forceJoinMessage = `
🔒 *Access Restricted*

To use this bot, you must join our channels first:

📢 **Required Channels:**
• ${FORCE_CHANNELS[0].url}
• ${FORCE_CHANNELS[1].url}

After joining both channels, click "✅ I Joined Both Channels" button below.
    `;
    
    bot.sendPhoto(chatId, `./public/images/welcome_image.png`, {
      caption: forceJoinMessage,
      parse_mode: 'Markdown',
      reply_markup: getForceJoinKeyboard()
    });
    return;
  }
  
  // Welcome message for verified users
  const user = getUserData(userId);
  const welcomeMessage = `
🎉 *Welcome ${firstName}!* 🎉

🎨 *AI Image Generator Bot* - Create amazing images with AI!

💰 *Your Credits:* ${user.credits}
📝 *Available Commands:*
• Generate beautiful images from text
• Check your credits and profile
• Get help and examples

✨ *Ready to create some magic?* Choose an option below:
  `;
  
  bot.sendPhoto(chatId, `./public/images/welcome_image.png`, {
    caption: welcomeMessage,
    parse_mode: 'Markdown',
    reply_markup: getMainMenuKeyboard()
  });
});

// Handle callback queries
bot.on('callback_query', async (callbackQuery) => {
  const msg = callbackQuery.message;
  const chatId = msg.chat.id;
  const userId = callbackQuery.from.id;
  const data = callbackQuery.data;
  
  if (data === 'check_membership') {
    const isMember = await checkChannelMembership(userId);
    if (isMember) {
      const user = getUserData(userId);
      const welcomeMessage = `
🎉 *Welcome ${callbackQuery.from.first_name}!* 🎉

✅ Channel membership verified!

🎨 *AI Image Generator Bot* - Create amazing images with AI!

💰 *Your Credits:* ${user.credits}
📝 *Available Commands:*
• Generate beautiful images from text
• Check your credits and profile
• Get help and examples

✨ *Ready to create some magic?* Choose an option below:
      `;
      
      bot.editMessageCaption(welcomeMessage, {
        chat_id: chatId,
        message_id: msg.message_id,
        parse_mode: 'Markdown',
        reply_markup: { inline_keyboard: [] }
      });
      
      bot.sendMessage(chatId, '🎨 Choose an option:', {
        reply_markup: getMainMenuKeyboard()
      });
    } else {
      bot.answerCallbackQuery(callbackQuery.id, {
        text: '❌ Please join both channels first!',
        show_alert: true
      });
    }
  }
  
  bot.answerCallbackQuery(callbackQuery.id);
});

// Generate command
bot.onText(/\/generate (.+)/, checkBanned, checkMembership, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const prompt = match[1];
  
  updateUserActivity(userId);
  
  if (!prompt || prompt.trim().length === 0) {
    bot.sendMessage(chatId, "❌ Please provide a prompt!\n\nExample: `/generate beautiful cat`", {
      parse_mode: 'Markdown'
    });
    return;
  }
  
  // Check credits (admin has unlimited)
  if (!isAdmin(userId)) {
    const user = getUserData(userId);
    if (user.credits <= 0) {
      bot.sendMessage(chatId, "❌ You don't have enough credits!\n\n💰 Contact admin to get more credits.", {
        parse_mode: 'Markdown'
      });
      return;
    }
    
    // Deduct credit
    user.credits -= 1;
    users.set(userId, user);
  }
  
  // Send generating message
  const generatingMsg = await bot.sendMessage(chatId, "🎨 Generating your image... Please wait ⏳");
  
  try {
    // Call image generation API
    const imageUrl = `${IMAGE_API_URL}${encodeURIComponent(prompt)}`;
    
    const user = getUserData(userId);
    const caption = isAdmin(userId) 
      ? `✨ *Generated Image* (Admin)\n📝 *Prompt:* ${prompt}`
      : `✨ *Generated Image*\n📝 *Prompt:* ${prompt}\n💰 *Remaining Credits:* ${user.credits}`;
    
    // Send the image
    await bot.sendPhoto(chatId, imageUrl, {
      caption: caption,
      parse_mode: 'Markdown'
    });
    
    // Delete the generating message
    bot.deleteMessage(chatId, generatingMsg.message_id);
    
  } catch (error) {
    console.error('Error generating image:', error);
    
    // Refund credit if generation failed
    if (!isAdmin(userId)) {
      const user = getUserData(userId);
      user.credits += 1;
      users.set(userId, user);
    }
    
    bot.editMessageText("❌ Sorry, couldn't generate image. Please try again!", {
      chat_id: chatId,
      message_id: generatingMsg.message_id
    });
  }
});

// Handle text messages
bot.on('message', checkBanned, checkMembership, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const text = msg.text;
  
  if (!text || text.startsWith('/')) return;
  
  updateUserActivity(userId);
  
  // Main menu options
  if (text === '🎨 Generate Image') {
    bot.sendMessage(chatId, "Please type: `/generate your prompt here`\n\n📝 *Example:* `/generate beautiful sunset over mountains`", {
      parse_mode: 'Markdown'
    });
  } else if (text === '💰 Check Credits') {
    const user = getUserData(userId);
    const creditsMessage = isAdmin(userId) 
      ? "💰 *Credits:* Unlimited (Admin)"
      : `💰 *Your Credits:* ${user.credits}\n\n💡 *Tip:* Each image generation costs 1 credit.`;
    
    bot.sendMessage(chatId, creditsMessage, { parse_mode: 'Markdown' });
  } else if (text === '❓ Help') {
    const helpMessage = `
🤖 *AI Image Generator Bot Help*

📝 *Available Commands:*
• \`/start\` - Start the bot
• \`/generate <prompt>\` - Generate image
• \`/help\` - Show this help
• \`/about\` - About this bot

*Tips for better images:*
• Be specific with descriptions
• Add style keywords like 'realistic', 'cartoon', 'oil painting'
• Mention colors, lighting, mood
• Use descriptive adjectives

*Examples:*
• \`/generate realistic portrait of a cat\`
• \`/generate cartoon style sunny beach\`
• \`/generate oil painting of mountain landscape\`

Happy creating! 🎨
    `;
    
    bot.sendMessage(chatId, helpMessage, { parse_mode: 'Markdown' });
  } else if (text === 'ℹ️ About') {
    const aboutMessage = `
ℹ️ *About AI Image Generator Bot*

🎨 This bot uses advanced AI to generate beautiful images from your text descriptions.

*Features:*
• Fast image generation
• High-quality results
• Multiple art styles
• Easy to use commands
• Credit system

*Powered by:* Botfather Cloud API
*Channels:* @learnWithUs_3 | @lwu_backup

🚀 Version: 2.0.0
    `;
    
    bot.sendMessage(chatId, aboutMessage, { parse_mode: 'Markdown' });
  } else if (text === '📸 Examples') {
    const examplesMessage = `
📸 *Example Prompts:*

🎭 *Artistic Styles:*
• \`/generate oil painting of a rose\`
• \`/generate watercolor mountain landscape\`
• \`/generate digital art futuristic city\`

🐾 *Animals:*
• \`/generate cute kitten playing with yarn\`
• \`/generate majestic lion in savanna\`
• \`/generate colorful parrot on branch\`

🌅 *Nature:*
• \`/generate serene lake at sunset\`
• \`/generate misty forest in morning\`
• \`/generate cherry blossoms in spring\`

🏙️ *Architecture:*
• \`/generate modern skyscraper at night\`
• \`/generate ancient castle on hill\`
• \`/generate cozy cottage in countryside\`

Try any of these or create your own! 🎨
    `;
    
    bot.sendMessage(chatId, examplesMessage, { parse_mode: 'Markdown' });
  } else if (text === '👤 Profile') {
    const user = getUserData(userId);
    const profileMessage = `
👤 *Your Profile*

🆔 *User ID:* ${userId}
💰 *Credits:* ${isAdmin(userId) ? 'Unlimited (Admin)' : user.credits}
📅 *Joined:* ${user.joinedAt.toDateString()}
⏰ *Last Active:* ${user.lastActive.toDateString()}
🎭 *Status:* ${isAdmin(userId) ? 'Admin' : 'User'}
    `;
    
    bot.sendMessage(chatId, profileMessage, { parse_mode: 'Markdown' });
  }
  
  // Admin panel options
  if (isAdmin(userId)) {
    if (text === '👥 User Stats') {
      const totalUsers = users.size;
      const activeUsers = Array.from(users.values()).filter(u => 
        (new Date() - u.lastActive) < 24 * 60 * 60 * 1000
      ).length;
      const totalCredits = Array.from(users.values()).reduce((sum, u) => sum + u.credits, 0);
      
      const statsMessage = `
📊 *Bot Statistics*

👥 *Total Users:* ${totalUsers}
🟢 *Active Today:* ${activeUsers}
💰 *Total Credits:* ${totalCredits}
🚫 *Banned Users:* ${bannedUsers.size}
      `;
      
      bot.sendMessage(chatId, statsMessage, { parse_mode: 'Markdown' });
    } else if (text === '💰 Manage Credits') {
      bot.sendMessage(chatId, "💰 *Credit Management*\n\nSend: `/addcredits <user_id> <amount>`\nExample: `/addcredits 123456789 10`", {
        parse_mode: 'Markdown'
      });
    } else if (text === '🚫 Ban User') {
      bot.sendMessage(chatId, "🚫 *Ban User*\n\nSend: `/ban <user_id>`\nExample: `/ban 123456789`", {
        parse_mode: 'Markdown'
      });
    } else if (text === '✅ Unban User') {
      bot.sendMessage(chatId, "✅ *Unban User*\n\nSend: `/unban <user_id>`\nExample: `/unban 123456789`", {
        parse_mode: 'Markdown'
      });
    } else if (text === '📢 Broadcast') {
      bot.sendMessage(chatId, "📢 *Broadcast Message*\n\nSend: `/broadcast <message>`\nExample: `/broadcast Hello everyone!`", {
        parse_mode: 'Markdown'
      });
    } else if (text === '📊 Bot Stats') {
      const uptime = process.uptime();
      const hours = Math.floor(uptime / 3600);
      const minutes = Math.floor((uptime % 3600) / 60);
      
      const botStatsMessage = `
🤖 *Bot System Stats*

⏰ *Uptime:* ${hours}h ${minutes}m
💾 *Memory Usage:* ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB
🔄 *Node Version:* ${process.version}
📅 *Started:* ${new Date(Date.now() - uptime * 1000).toLocaleString()}
      `;
      
      bot.sendMessage(chatId, botStatsMessage, { parse_mode: 'Markdown' });
    } else if (text === '🔙 Back to Main Menu') {
      bot.sendMessage(chatId, '🎨 Choose an option:', {
        reply_markup: getMainMenuKeyboard()
      });
    }
  }
});

// Admin commands
bot.onText(/\/addcredits (\d+) (\d+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  
  if (!isAdmin(userId)) {
    bot.sendMessage(chatId, "❌ You don't have permission to use this command.");
    return;
  }
  
  const targetUserId = parseInt(match[1]);
  const creditsToAdd = parseInt(match[2]);
  
  const user = getUserData(targetUserId);
  user.credits += creditsToAdd;
  users.set(targetUserId, user);
  
  bot.sendMessage(chatId, `✅ Added ${creditsToAdd} credits to user ${targetUserId}.\nNew balance: ${user.credits} credits.`);
});

bot.onText(/\/ban (\d+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  
  if (!isAdmin(userId)) {
    bot.sendMessage(chatId, "❌ You don't have permission to use this command.");
    return;
  }
  
  const targetUserId = parseInt(match[1]);
  bannedUsers.add(targetUserId);
  
  bot.sendMessage(chatId, `🚫 User ${targetUserId} has been banned.`);
});

bot.onText(/\/unban (\d+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  
  if (!isAdmin(userId)) {
    bot.sendMessage(chatId, "❌ You don't have permission to use this command.");
    return;
  }
  
  const targetUserId = parseInt(match[1]);
  bannedUsers.delete(targetUserId);
  
  bot.sendMessage(chatId, `✅ User ${targetUserId} has been unbanned.`);
});

bot.onText(/\/broadcast (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  
  if (!isAdmin(userId)) {
    bot.sendMessage(chatId, "❌ You don't have permission to use this command.");
    return;
  }
  
  const message = match[1];
  const userIds = Array.from(users.keys());
  let successCount = 0;
  let failCount = 0;
  
  const statusMsg = await bot.sendMessage(chatId, `📢 Broadcasting to ${userIds.length} users...`);
  
  for (const targetUserId of userIds) {
    try {
      await bot.sendMessage(targetUserId, `📢 *Broadcast Message*\n\n${message}`, {
        parse_mode: 'Markdown'
      });
      successCount++;
    } catch (error) {
      failCount++;
    }
  }
  
  bot.editMessageText(`✅ Broadcast completed!\n\n✅ Sent: ${successCount}\n❌ Failed: ${failCount}`, {
    chat_id: chatId,
    message_id: statusMsg.message_id
  });
});

// Error handling
bot.on('polling_error', (error) => {
  console.error('Polling error:', error);
});

bot.on('error', (error) => {
  console.error('Bot error:', error);
});

// Health check endpoint for Railway
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.json({ 
    status: 'Bot is running!', 
    timestamp: new Date().toISOString(),
    users: users.size,
    uptime: process.uptime()
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Bot server running on port ${PORT}`);
  console.log('Telegram bot is active!');
});

module.exports = bot;


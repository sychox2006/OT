# Telegram AI Image Generator Bot 🎨

A powerful Telegram bot that generates AI images from text prompts using Botfather Cloud API.

## Features ✨

- 🎨 Generate high-quality AI images from text prompts
- 📱 User-friendly inline keyboard interface
- 🚀 Fast image generation
- 💡 Example prompts and tips
- 🛡️ Error handling and user feedback

## Commands 📝

- `/start` - Start the bot and show welcome message
- `/generate <prompt>` - Generate an image from your prompt
- `/help` - Show help and usage tips
- `/about` - About the bot

## Setup for Railway Deployment 🚀

### 1. Create Telegram Bot

1. Message [@BotFather](https://t.me/BotFather) on Telegram
2. Send `/newbot` command
3. Choose a name and username for your bot
4. Copy the bot token (keep it safe!)

### 2. Deploy to Railway

1. Fork this repository
2. Connect your GitHub to Railway
3. Create new project on Railway
4. Connect your forked repository
5. Add environment variable:
   - `TELEGRAM_BOT_TOKEN` = your bot token from BotFather

### 3. Environment Variables

Required:
```
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
```

Optional:
```
PORT=3000
```

### 4. Local Development

```bash
# Install dependencies
npm install

# Set environment variable
export TELEGRAM_BOT_TOKEN=your_token_here

# Run in development mode
npm run dev

# Or run in production mode
npm start
```

## Usage Examples 💡

### Basic Commands:
```
/generate beautiful sunset over ocean
/generate cartoon style cute cat
/generate realistic portrait of a dog
```

### Advanced Prompts:
```
/generate oil painting of mountain landscape at dawn
/generate digital art futuristic city with neon lights
/generate watercolor flowers in spring garden
```

## API Integration 🔌

This bot uses the Botfather Cloud Image Generation API:
```
https://botfather.cloud/Apis/ImgGen/?prompt=your_prompt_here
```

## Project Structure 📁

```
telegram-image-bot/
├── bot.js              # Main bot logic
├── package.json        # Dependencies and scripts
├── telegram-bot-readme.md  # Bot documentation
└── .gitignore         # Git ignore file
```

## Railway Deployment Steps 🚀

1. **Create Repository:**
   - GitHub pe new repository banao
   - Bot files upload karo

2. **Railway Setup:**
   - Railway.app pe account banao
   - "New Project" click karo
   - GitHub se repository connect karo

3. **Environment Variables:**
   - Railway dashboard mein "Variables" tab
   - Add: `TELEGRAM_BOT_TOKEN=your_bot_token`
   - Add: `PORT=3000`

4. **Deploy:**
   - Railway automatically deploy kar dega
   - Bot link mil jayega

## Error Handling 🛡️

- Validates user input
- Handles API errors gracefully
- Provides user-friendly error messages
- Logs errors for debugging

## Hindi Instructions 🇮🇳

### Bot Banane ke Steps:

1. **Telegram Bot Token:**
   - @BotFather ko message karo
   - `/newbot` send karo
   - Bot name aur username choose karo
   - Token copy karo

2. **Railway Deployment:**
   - Railway.app pe account banao
   - GitHub repository connect karo
   - Environment variable add karo: `TELEGRAM_BOT_TOKEN`

3. **Testing:**
   - Deploy hone ke baad bot ko Telegram pe test karo
   - `/start` command try karo

## Support 💬

Agar koi problem aa rahi hai:
1. Railway logs check karo
2. Bot token verify karo
3. API accessible hai ya nahi check karo
4. Network connectivity check karo

Happy bot building! 🚀
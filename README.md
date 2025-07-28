# Telegram AI Image Generator Bot

🎨 A powerful Telegram bot with AI image generation, force channel join, admin panel, and modern UI.

## Features

### 🔒 Force Channel Join
- Users must join specified channels before using the bot
- Automatic membership verification
- Beautiful join prompts with images

### 🎨 Image Generation
- AI-powered image generation from text prompts
- Credit-based system for users
- High-quality results using Botfather Cloud API

### ⚡ Admin Panel
- Complete admin control panel
- User credit management
- Ban/Unban functionality
- Broadcast messages to all users
- User statistics and bot analytics

### 🎯 Modern UI
- Beautiful inline keyboards
- Responsive menu system
- Professional welcome messages
- Image-rich interactions

## Setup Instructions

### 1. Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Telegram Bot Token from @BotFather

### 2. Installation
```bash
# Clone the repository
git clone <repository-url>
cd telegram-bot

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

### 3. Configuration
Edit the `.env` file or set environment variables:
```env
TELEGRAM_BOT_TOKEN=your_bot_token_here
PORT=3000
```

### 4. Bot Configuration
Update the following in `bot.js`:
- `ADMIN_ID`: Your Telegram user ID
- `FORCE_CHANNELS`: Channels users must join
- `IMAGE_API_URL`: Image generation API endpoint

### 5. Run Locally
```bash
npm start
```

## Deployment

### Railway Deployment
1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard:
   - `TELEGRAM_BOT_TOKEN`: Your bot token
3. Deploy automatically

### Manual Deployment
1. Upload files to your server
2. Install dependencies: `npm install`
3. Set environment variables
4. Run: `npm start`

## Bot Commands

### User Commands
- `/start` - Start the bot and show main menu
- `/generate <prompt>` - Generate image from text
- `/help` - Show help information
- `/about` - About the bot

### Admin Commands
- `/addcredits <user_id> <amount>` - Add credits to user
- `/ban <user_id>` - Ban a user
- `/unban <user_id>` - Unban a user
- `/broadcast <message>` - Send message to all users

## Menu Options

### Main Menu
- 🎨 Generate Image
- 💰 Check Credits
- ❓ Help
- ℹ️ About
- 📸 Examples
- 👤 Profile

### Admin Menu
- 👥 User Stats
- 💰 Manage Credits
- 🚫 Ban User
- ✅ Unban User
- 📢 Broadcast
- 📊 Bot Stats

## API Integration

The bot uses Botfather Cloud API for image generation:
```
https://botfather.cloud/Apis/ImgGen/?prompt=<encoded_prompt>
```

## Security Features

- Admin-only commands protection
- User ban system
- Channel membership verification
- Error handling and logging

## File Structure

```
telegram-bot/
├── bot.js              # Main bot file
├── package.json        # Dependencies
├── railway.json        # Railway deployment config
├── .env.example        # Environment variables template
└── README.md          # This file
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `TELEGRAM_BOT_TOKEN` | Bot token from @BotFather | Yes |
| `PORT` | Server port (default: 3000) | No |

## Support

For support and updates, join our channels:
- @learnWithUs_3
- @lwu_backup

## Version

Current version: 2.0.0

## License

This project is licensed under the ISC License.


@echo off
echo Starting Apex TG Bot with PM2...
pm2.cmd start bot.js --name "apex-tg-bot" --watch
pm2.cmd save
echo Bot is now running in the background.
echo To see logs, type: pm2.cmd logs apex-tg-bot
pause

const TelegramBot = require('node-telegram-bot-api');

// Bot token
const token = '8244682613:AAHzrXUqLrDWv36BiOxgyxkTtOUfTBXy0l0';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

// Set bot commands menu
bot.setMyCommands([
  {command: '/start', description: 'Botni ishga tushirish va Chat ID olish'},
  {command: '/info', description: 'Bot vazifalari haqida ma`lumot'}
]);

// Set bot descriptions
bot.setMyDescription({
  description: "Assalomu alaykum! Men Apex Point Smart POS tizimining rasmiy botiman. Mening vazifam do'koningizdagi savdolarni, foydani va ombor qoldig'ini real vaqtda kuzatish va sizga xabar berishdan iborat. Bot orqali har bir savdo va foyda haqida tezkor xabarlar olasiz."
});

bot.setMyShortDescription({
  short_description: "Smart POS do'kon nazorati va savdo hisobotlari boti."
});

console.log("Bot ishga tushdi...");

// Handle polling errors
bot.on('polling_error', (error) => {
  console.error(`[${new Date().toLocaleTimeString()}] Polling error:`, error.code, error.message);
});

// Handle general errors
bot.on('error', (error) => {
  console.error(`[${new Date().toLocaleTimeString()}] General error:`, error);
});

const infoText = `📊 *Apex Point Smart POS Boti*

Bu bot sizning do'koningiz bilan to'g'ridan-to'g'ri bog'langan.
Quyidagi vazifalarni avtomatik bajaradi:
1️⃣ *Yangi sotuv:* Har bir xarid haqida (mahsulot, narxi va qancha sof foyda ko'rilgani) darhol xabar yuboradi.
2️⃣ *Kassa yopilishi:* Kun oxirida umumiy aylanma va tushumlar hisobotini beradi.
3️⃣ *Ogohlantirish:* Omborda biror mahsulot qolmasa, zudlik bilan xabar beradi.
4️⃣ *Moliyaviy hisobot:* Saytdan turib yuborilgan barcha hisobotlarni qabul qiladi.

Sayt bilan ulash uchun shunchaki \`/start\` tugmasini bosing va ID raqamingizni saytga kiriting!`;

// Listen for any kind of message.
bot.on('message', async (msg) => {
  try {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (text === '/start') {
      const welcomeMsg = `Assalomu alaykum, ${msg.from.first_name || 'Hurmatli foydalanuvchi'}! 👋\n\nSmart POS tizimiga ulanish uchun quyidagi Chat ID ni nusxalab, dasturdagi sozlamalar yoki profil bo'limiga kiriting:\n\nSizning Chat ID raqamingiz: \`${chatId}\`\n\nEndi barcha xabarlar va hisobotlar ushbu bot orqali sizga kelib tushadi! Qanday xabarlar kelishini bilish uchun /info ni bosing.`;
      await bot.sendMessage(chatId, welcomeMsg, { parse_mode: 'Markdown' });
    } else if (text === '/info') {
      await bot.sendMessage(chatId, infoText, { parse_mode: 'Markdown' });
    } else if (text) {
      // Reply to other messages if necessary
      await bot.sendMessage(chatId, "Yordam uchun /start yoki /info tugmasini bosing.");
    }
  } catch (error) {
    console.error('Error handling message:', error);
  }
});

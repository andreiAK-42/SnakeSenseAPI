import TelegramBot from "node-telegram-bot-api";
require("dotenv").config();

const TELEGRAM_CHAT_ID = 1429506743; // Замени на ID пользователя

export async function sendTelegramMessage(
  text: string,
  chatId: number = TELEGRAM_CHAT_ID,
): Promise<{ success: boolean; message?: string; error?: any }> {
  // Создаём экземпляр бота без прослушивания (polling: false)
  const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN!!, {
    polling: false, // Важно! Отключаем прослушивание
  });

  try {
    const result = await bot.sendMessage(chatId, text, {
      parse_mode: "HTML", // Можно использовать HTML в сообщениях
      disable_web_page_preview: true, // Отключаем предпросмотр ссылок
      disable_notification: false, // Включаем уведомление
    });

    console.log(
      `✅ Сообщение отправлено пользователю ${chatId}:`,
      result.message_id,
    );
    return {
      success: true,
      message: `Сообщение отправлено (ID: ${result.message_id})`,
    };
  } catch (error) {
    console.error("❌ Ошибка отправки в Telegram:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Неизвестная ошибка",
    };
  }
}

export async function sendFormattedMessage(
  title: string,
  temperature?: number,
  humidity?: number,
  gas?: number,
  alert?: string
) {
  let message = `<b>${title}</b>\n`;
  message += `━━━━━━━━━━━━━━━\n`;

  if (temperature !== undefined) {
    message += `🌡️ Температура: ${temperature}°C\n`;
  }
  if (humidity !== undefined) {
    message += `💧 Влажность: ${humidity}%\n`;
  }
  if (gas !== undefined) {
    message += `⚠️ Газ: ${gas} AU\n`;
  }
  if (alert) {
    message += `\n🚨 <b>${alert}</b>\n`;
  }

  message += `\n🕐 ${new Date().toLocaleString("ru-RU")}`;

  message += `\nКомната 525`;

  return sendTelegramMessage(message);
}

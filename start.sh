#!/bin/bash

set -e

echo "🔍 Перевіряємо наявність Node.js..."
if ! command -v node &> /dev/null
then
    echo "❌ Node.js не знайдено. Встановіть його та спробуйте знову."
    exit 1
fi

echo "📦 Встановлюємо залежності бекенду..."
cd backend
npm install

echo "🚀 Запускаємо бекенд..."
npm start

cd ../frontend
echo "📦 Встановлюємо залежності фронтенду..."
npm install

echo "⚙️ Будуємо фронтенд..."
npm run build

echo "🌍 Запускаємо фронтенд..."
npm run preview

# Очікуємо кілька секунд, щоб сервери стартували
sleep 3

# Відкриваємо фронтенд у браузері
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    xdg-open http://localhost:4173
elif [[ "$OSTYPE" == "darwin"* ]]; then
    open http://localhost:4173
fi

echo "✅ Проєкт запущено! Бекенд: http://localhost:5000, Фронтенд: http://localhost:4173"

# Тримаємо скрипт активним, поки працюють сервери
wait

# Використовуємо офіційний образ Node.js
FROM node:18

# Встановлюємо робочу директорію в контейнері
WORKDIR /app

# Копіюємо package.json і встановлюємо залежності
COPY package.json package-lock.json ./
RUN npm install --production

# Копіюємо код проєкту
COPY . .

# Вказуємо порт, який використовує сервер
EXPOSE 3000

# Команда для запуску
CMD ["node", "index.js"]

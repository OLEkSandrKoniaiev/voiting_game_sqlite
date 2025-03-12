#!/bin/bash

ARCHIVE_NAME="voiting_game.tar.gz"

# Перехід до каталогу backend і запуск тестів
cd backend
npm test

# Якщо тести не пройшли, зупиняємо скрипт
if [ $? -ne 0 ]; then
    echo "Тести не пройшли! Зупиняємо білд."
    exit 1
fi

cd ..

# Видаляємо старий архів, якщо він існує
rm -f $ARCHIVE_NAME

# Додаємо файли до архіву разом з проєктом
tar --exclude="frontend/dist" --exclude="frontend/node_modules" --exclude="backend/node_modules" -czf $ARCHIVE_NAME frontend backend start.bat start.sh

echo "Архів $ARCHIVE_NAME створено успішно!"

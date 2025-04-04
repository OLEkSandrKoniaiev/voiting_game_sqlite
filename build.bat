@echo off
set ARCHIVE_NAME=voiting_game.zip

cd backend
call npm test

:: Якщо тести не пройшли, зупиняємо скрипт
if %ERRORLEVEL% neq 0 (
    echo Tests failed! Stopping build.
    exit /b 1
)

cd ..

:: Видаляємо старий архів, якщо він є
if exist %ARCHIVE_NAME% del %ARCHIVE_NAME%

:: Додаємо файли до архіву разом з проєктом
tar -cf %ARCHIVE_NAME% --exclude=frontend/dist --exclude=frontend/node_modules --exclude=backend/node_modules frontend backend start.bat start.sh

echo Archive %ARCHIVE_NAME% has been created successfully!

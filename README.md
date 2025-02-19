## Інструкція з запуску

1. **Клонувати репозиторій**  
   ```sh
   git clone <repository_url>
   cd <repository_folder>
   ```  

2. **Встановити залежності**  
   - **Frontend**  
     ```sh
     cd frontend
     npm install
     cd ..
     ```  
   - **Backend**  
     ```sh
     cd backend
     npm install
     cd ..
     ```  

3. **Запустити проєкт у Docker**  
   ```sh
   docker compose up --build
   ```  

4. **Відкрити в браузері**  
   [http://localhost:5173/](http://localhost:5173/)  

## Додатково  
У репозиторії є JSON-файл для Postman, який можна використати для тестування бекенду.
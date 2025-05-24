# Используем официальный Node.js образ
FROM node:18-alpine

# Рабочая директория в контейнере
WORKDIR /app

# Копируем package.json и package-lock.json (если есть)
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь проект в контейнер
COPY . .

# Собираем приложение (для production)
RUN npm run build

# Порт, который будет слушать Next.js
EXPOSE 3000

# Запускаем Next.js в режиме production
CMD ["npm", "start"]

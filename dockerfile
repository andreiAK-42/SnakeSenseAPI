FROM node:18-alpine

WORKDIR /app

# Устанавливаем зависимости для разработки
COPY package*.json ./

RUN npm install

# Копируем исходный код
COPY . .

# Собираем TypeScript
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
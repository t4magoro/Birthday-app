FROM node:20-alpine
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

EXPOSE 5173

# The --host flag is required for Vite to expose the network to Docker
CMD ["npm", "run", "dev", "--", "--host"]
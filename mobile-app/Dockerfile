FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy project files
COPY . .

EXPOSE 19006 8081

CMD ["npm", "start"] 
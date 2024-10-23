FROM node:20

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy application code
COPY . .

# Expose app port
EXPOSE 4000

# Command to run the app
CMD ["npx", "nodemon", "index.js"]

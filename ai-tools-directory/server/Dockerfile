# Use Node.js LTS version
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy app source
COPY . .

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "const http = require('http'); \
    const options = { \
      host: 'localhost', \
      port: 5000, \
      path: '/api/debug/ping', \
      timeout: 2000 \
    }; \
    const request = http.get(options, (res) => { \
      console.log('STATUS:', res.statusCode); \
      if (res.statusCode == 200) { \
        process.exit(0); \
      } else { \
        process.exit(1); \
      } \
    }); \
    request.on('error', function(err) { \
      console.error('ERROR:', err); \
      process.exit(1); \
    }); \
    request.end();"

# Start the application
CMD ["node", "index.js"]

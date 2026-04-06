# Build stage
FROM node:18-alpine as builder

WORKDIR /app

# Copy package files
COPY lab_sign_off_fe/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application files
COPY lab_sign_off_fe/ .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built application from builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
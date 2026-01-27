# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build arguments for environment variables
ARG VUE_APP_POSTHOG_API_KEY
ARG VUE_APP_API_URL

# Set environment variables for build
ENV VUE_APP_POSTHOG_API_KEY=$VUE_APP_POSTHOG_API_KEY
ENV VUE_APP_API_URL=$VUE_APP_API_URL

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

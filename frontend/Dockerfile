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
ARG VUE_APP_GOOGLE_CLIENT_ID
ARG VUE_APP_OUTLOOK_CLIENT_ID
ARG VUE_APP_API_URL
ARG VUE_APP_SELF_HOSTED_MODE=false

# Set environment variables for build
ENV VUE_APP_POSTHOG_API_KEY=$VUE_APP_POSTHOG_API_KEY
ENV VUE_APP_GOOGLE_CLIENT_ID=$VUE_APP_GOOGLE_CLIENT_ID
ENV VUE_APP_OUTLOOK_CLIENT_ID=$VUE_APP_OUTLOOK_CLIENT_ID
ENV VUE_APP_API_URL=$VUE_APP_API_URL
ENV VUE_APP_SELF_HOSTED_MODE=$VUE_APP_SELF_HOSTED_MODE

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

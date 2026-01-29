# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Accept build arguments for Vite environment variables
ARG VITE_API_URL=http://localhost:8000/api/v1
ARG VITE_STRIPE_PUBLISHABLE_KEY

# Set environment variables for build
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_STRIPE_PUBLISHABLE_KEY=$VITE_STRIPE_PUBLISHABLE_KEY

# Copy package files
COPY package.json ./

# Install dependencies (use --legacy-peer-deps to handle peer dependency issues)
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

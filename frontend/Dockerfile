# Stage 1: Build React / Vite application
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci || npm install

# Copy source files
COPY . .

# Build arguments for environment variables
ARG VITE_API_BASE_URL=""
ARG VITE_TOKEN_KEY="monitoring_token"
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_TOKEN_KEY=$VITE_TOKEN_KEY

# Build production bundle into /app/dist
RUN npm run build

# Stage 2: Serve with lightweight Nginx
FROM nginx:alpine

# Clean default Nginx html
RUN rm -rf /usr/share/nginx/html/*

# Copy build artifacts to Nginx docroot
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx config for Single Page Application routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

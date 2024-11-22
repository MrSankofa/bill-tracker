# Step 1: Build the Angular app
FROM node:18 AS build

WORKDIR /apps/bill-tracker

# Install dependencies
COPY package.json package-lock.json ./

RUN npm install -g npm@10.9.1

RUN npm install -g npm@10.9.1

# Copy all files
COPY . .

# Build the app
RUN npm run build:bill-tracker

# Step 2: Serve the app with Nginx
FROM nginx:latest

COPY --from=build /app/dist/apps/bill-tracker /usr/share/nginx/html

# Copy the Nginx configuration file
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
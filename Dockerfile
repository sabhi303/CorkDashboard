# Stage 1: Build stage
FROM node:20 AS build

# Create and change to the app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the app directory
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code to the app directory
COPY . .

# Stage 2: Final stage
FROM node:20

# Create and change to the app directory
WORKDIR /usr/src/app

# Copy only the necessary files from the build stage
COPY --from=build /usr/src/app /usr/src/app

# Copy the .env file to the app directory
COPY .env .env

# Set the environment to production
ENV NODE_ENV=production

# Rebuild native modules
RUN npm rebuild bcrypt --build-from-source

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the application
CMD ["npm", "start"]

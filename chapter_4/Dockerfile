# Use an official node.js runtime as a parent image. 
FROM node:22-alpine

# Set the working directory in the container.
WORKDIR /app

# Copy package.json and package-lock.json files into the container
COPY  package*.json .

# install dependencies
RUN npm install

# copy the rest of the files into the container
COPY . .

# Expose the port that the app runs on
EXPOSE 5003

# define the command to run the application
CMD ["node", "./src/server.js"]

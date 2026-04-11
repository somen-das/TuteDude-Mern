# my project node version
FROM node:24.13.0

# create a folder under the container
WORKDIR /app

# atfirst copy the depengency and packages
COPY package*.json ./
# install all depengency
RUN npm install

# Forr all code copy 
COPY . .

# my local port
EXPOSE 5000

# this is my app running command
CMD ["npm", "run", "dev"]
# Dockerfile for Hardhat Blockchain
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY blockchain/package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY blockchain/ .

# Expose port
EXPOSE 8545

# Start Hardhat node
CMD ["npx", "hardhat", "node", "--hostname", "0.0.0.0"]

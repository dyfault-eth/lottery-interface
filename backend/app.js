const express = require('express');
const { ethers } = require('ethers');
const contractABI = require('./ABI/LotteryABI');
const http = require('http');
const { Server } = require('socket.io');
const PORT = 3001;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // L'URL de votre client
    methods: ["GET", "POST"], // Les méthodes HTTP autorisées
  }
});

const provider = new ethers.WebSocketProvider('wss://polygon-mumbai.g.alchemy.com/v2/Y1dXbX0bQGVW4kkmmWASXEqakJyW2UHm');
const contractAddress = '0x6b0d05E25e2eC742D63C96bD9469714Df2Aaf3D0';
const contract = new ethers.Contract(contractAddress, contractABI, provider);

contract.on('Winner', (winner) => {
    io.emit('winnerInfo', { winner: winner });
});

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
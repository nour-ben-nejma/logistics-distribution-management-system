import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = createServer(app);

// Middleware CORS
app.use(cors({
  origin: ['http://localhost:5173', 'https://logistics-distribution-management-system-bxnn-aqq8xm1ug.vercel.app'],
  credentials: true,
}));

// Serveur Socket.IO
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'https://logistics-distribution-management-system-bxnn-aqq8xm1ug.vercel.app'], // front Vue
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Liste des sockets connectés avec leur ID entreprise
const connectedUsers = new Map();

// Lorsqu'un client se connecte
io.on("connection", (socket) => {
  console.log("🟢 Nouveau client connecté :", socket.id);

  // L'entreprise s'identifie
  socket.on("register", (entrepriseId) => {
    console.log(`✅ Entreprise ${entrepriseId} enregistrée avec socket ${socket.id}`);
    connectedUsers.set(entrepriseId, socket.id);
  });

  // Lorsqu’un client se déconnecte
  socket.on("disconnect", () => {
    console.log("🔴 Client déconnecté :", socket.id);
    for (const [entrepriseId, sockId] of connectedUsers.entries()) {
      if (sockId === socket.id) {
        connectedUsers.delete(entrepriseId);
        break;
      }
    }
  });
});

// Fonction pour envoyer une notification à une entreprise
export const sendNotificationToEntreprise = (entrepriseId, message) => {
  const socketId = connectedUsers.get(entrepriseId);
  if (socketId) {
    io.to(socketId).emit("notification", message);
    console.log(`📨 Notification envoyée à l'entreprise ${entrepriseId} :`, message);
  } else {
    console.log(`⚠️ Entreprise ${entrepriseId} non connectée.`);
  }
};

export { io };

const express = require('express');
const http = require('http');
const dotenv = require('dotenv');
dotenv.config();

const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./src/routes/authRoute');
const messageRoutes = require('./src/routes/messageRoute');
const groupRoutes = require('./src/routes/groupRoute');
const sequelize = require('./src/utils/db-connection');
require('./src/models');

const { initSocket } = require('./socket_io'); // ✅ updated import

const app = express();
const server = http.createServer(app);
initSocket(server); // ✅ this sets up io

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

app.get('/', (req, res) => res.send('Server is running'));
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/groups', groupRoutes);

const port = process.env.PORT || 4000;

sequelize.sync().then(() => {
  console.log("Database connected & synced");
  server.listen(port, () => console.log(`Server running on port ${port}`));
}).catch(err => console.error("DB connection failed:", err));

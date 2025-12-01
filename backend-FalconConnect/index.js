const express = require('express') // Crear un servidor HTTP 
const mongoose = require("mongoose") // Libria para conectar a MongoDB y trabajar con esquemas de datos 
const bodyParser = require('body-parser')// Permite leer el cuerpo de las peticiones HTTP enviadas desde el frontend
const dotenv = require('dotenv') // Permite cagar las variables del archivo env a process.env
const cors = require('cors') // Permite que el fronted llame al backend sin que el navegador bloquee la petición 


dotenv.config(); // Cargar variables del archivo .env

// Crear aplicación de Express
const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// -----------------------------
// Conexión a MongoDB
// -----------------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch((err) => console.error("❌ Error al conectar MongoDB:", err));


// -----------------------------
// Importar rutas de tu proyecto
// -----------------------------
const blockRoutes = require('./routes/block.routes');
const calendarEventRoutes = require('./routes/calendarEvent.routes');
const commentRoutes = require('./routes/comment.routes');
const communityRoutes = require('./routes/community.routes');
const courseRoutes = require('./routes/course.routes');
const followRoutes = require('./routes/follow.routes');
const friendRoutes = require('./routes/friend.routes');
const likeRoutes = require('./routes/like.routes');
const memberRoutes = require('./routes/member.routes');
const messageRoutes = require('./routes/message.routes');
const noteRoutes = require('./routes/note.routes');
const notificationRoutes = require('./routes/notification.routes');
const postRoutes = require('./routes/post.routes');
const projectRoutes = require('./routes/project.routes');
const reportRoutes = require('./routes/report.routes');
const shareRoutes = require('./routes/share.routes');
const userRoutes = require('./routes/user.routes');

// -----------------------------
// Usar rutas con prefijo /api/v1
// -----------------------------
app.use('/api/v1', blockRoutes);
app.use('/api/v1', calendarEventRoutes);
app.use('/api/v1', commentRoutes);
app.use('/api/v1', communityRoutes);
app.use('/api/v1', courseRoutes);
app.use('/api/v1', followRoutes);
app.use('/api/v1', friendRoutes);
app.use('/api/v1', likeRoutes);
app.use('/api/v1', memberRoutes);
app.use('/api/v1', messageRoutes);
app.use('/api/v1', noteRoutes);
app.use('/api/v1', notificationRoutes);
app.use('/api/v1', postRoutes);
app.use('/api/v1', projectRoutes);
app.use('/api/v1', reportRoutes);
app.use('/api/v1', shareRoutes);
app.use('/api/v1', userRoutes);

// -----------------------------
// Levantar servidor
// -----------------------------
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(` Servidor backend corriendo en http://localhost:${PORT}`);
});
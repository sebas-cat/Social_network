const express = require('express') // Crear un servidor HTTP 
const mongoose = require("mongoose") // Libreria para conectar a MongoDB y trabajar con esquemas de datos 
const bodyParser = require('body-parser')// Permite leer el cuerpo de las peticiones HTTP enviadas desde el frontend
const dotenv = require('dotenv') // Permite cagar las variables del archivo env a process.env
const cors = require('cors') // Permite que el fronted llame al backend sin que el navegador bloquee la petición 


dotenv.config(); // Cargar variables del archivo .env a process.env

// Crea una instancia de aplicación Express, encargada de manejar las rutas y middleware 
const app = express();

// Middlewares
app.use(cors()); //Agrega middlewares de CORS  a todas las rutas
app.use(bodyParser.json()); // 
app.use(express.json());  // Convierte la información JSON en objetos de javascript

/*
Conexión a MongoDB

Utiliza el URL guardado en env. para conectarse.
*/
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log(" Conectado a MongoDB"))
  .catch((err) => console.error(" Error al conectar MongoDB:", err));

/*Se importan las rutas */
const blockRoutes = require('./routes/blockRoute');
const calendarEventRoutes = require('./routes/calendarEventRoute');
const commentRoutes = require('./routes/commentRoute');
const communityRoutes = require('./routes/communityRoute');
const courseRoutes = require('./routes/courseRoute');
const followRoutes = require('./routes/followRoute');
const friendRoutes = require('./routes/friendRoute');
const likeRoutes = require('./routes/likeRoute');
const memberRoutes = require('./routes/memberRoute');
const messageRoutes = require('./routes/messageRoute');
const noteRoutes = require('./routes/noteRoute');
const notificationRoutes = require('./routes/notificationRoute');
const postRoutes = require('./routes/postRoute');
const projectRoutes = require('./routes/projectRoute');
const reportRoutes = require('./routes/reportRoute');
const shareRoutes = require('./routes/shareRoute');
const userRoutes = require('./routes/userRoute');

/*Prefijos de las rutas */
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
const PORT = process.env.PORT || 3000; // Define el puerto por donde se comunica el backend, ya sea si se definio en el env. o en 3000

app.listen(PORT, () => {
  console.log(` Servidor backend corriendo en http://localhost:${PORT}`); //Arranca el servidor
});
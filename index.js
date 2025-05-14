const express = require("express");
const cors = require("cors");
const usuariosRoutes = require("./routes/usuariosRoutes");
const productosRoutes = require("./routes/productosRoutes")
const obrasRoutes = require('./routes/obrasRoutes');
const movimientosRoutes = require('./routes/movimientosRoutes');
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');



require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/obras', obrasRoutes);
app.use('/api/movimientos', movimientosRoutes);
app.use('/api/dashboard', dashboardRoutes);
const path = require("path");

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, "../cobra-frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../cobra-frontend/dist/index.html"));
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

const express = require('express');
const cors = require('cors');
const {PORT,FRONTEND_URL}= require('./src/config/config.js');
const cookieParser = require('cookie-parser');
const UsuarioService= require('./src/routes/usuario.route.js')
const UsuarioRolService=require('./src/routes/usuario.rol.route.js')
const rolService=require('./src/routes/rol.route.js')
const rolPermisoService=require('./src/routes/rol.permiso.route.js')
const permisoService=require('./src/routes/permiso.route.js')
const wishlistService=require('./src/routes/wishlist.route.js')
const cartService=require('./src/routes/cart.route.js')
const productoService=require('./src/routes/producto.route.js') 
const marcaService=require('./src/routes/marca.route.js')
const categoriaService=require('./src/routes/categoria.route.js')
const colorService=require('./src/routes/color.route.js')
const tallaService=require('./src/routes/talla.route.js')
const productoColorService=require('./src/routes/producto.color.route.js')
const productoTallaService=require('./src/routes/producto.talla.route.js')

class Server {
  constructor() {
    this.app = express();
    this.port = PORT
    this.app.use(express.json()); // Middleware para parsear JSON
    this.app.use(cookieParser()); 
    this.configureMiddlewares();
    this.configureRoutes();
  }

  configureMiddlewares() {
    this.app.use(cors({
      origin: FRONTEND_URL,
      credentials: true // Permitir cookies y credenciales
    }));
    this.app.use(express.urlencoded({ extended: true }));
  }

  configureRoutes() {
    new UsuarioService(this.app);
    new rolPermisoService(this.app);
    new rolService(this.app);
    new permisoService(this.app);
    new UsuarioRolService(this.app);
    new wishlistService(this.app);
    new cartService(this.app);
    new productoService(this.app);
    new marcaService(this.app);
    new categoriaService(this.app);
    new colorService(this.app);
    new tallaService(this.app);
    new productoColorService(this.app);
    new productoTallaService(this.app);
  }

  start() {
    this.app.listen(this.port, () => {
      console.log(`Servidor corriendo en el puerto ${this.port}`);
    });
  }
}

const server = new Server();
server.start();

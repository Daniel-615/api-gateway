const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { APP_PORT,FRONTEND_URL}= require('./src/config/config.js');
const cookieParser = require('cookie-parser');
const UsuarioService= require('./src/routes/usuario.route.js')
class Server {
  constructor() {
    this.app = express();
    this.port = APP_PORT
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
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
  }

  configureRoutes() {
    new UsuarioService(this.app);
  }

  start() {
    this.app.listen(this.port, () => {
      console.log(`Servidor corriendo en el puerto ${this.port}`);
    });
  }
}

const server = new Server();
server.start();

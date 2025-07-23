const express = require("express");
const axios=require("axios");
const {USUARIO_SERVICE,NODE_ENV}= require("../config/config.js");
const verifyToken=require('../middleware/auth.js')
class UsuarioRoutes {
  constructor(app) {
    this.router = express.Router();
    this.registerRoutes();
    app.use("/api-gateway/usuario", this.router);
  }

  registerRoutes() {
    this.router.post('/login', async (req, res) => {
      try {
        const response = await axios.post(
          `${USUARIO_SERVICE}/auth-service/usuario/login`,
          req.body,
          {
            withCredentials: true,  // Permitir el envío de cookies
          }
        );

       // Reenviar las cookies de auth-service al cliente
        const setCookieHeaders = response.headers['set-cookie'];
        if (setCookieHeaders) {
          setCookieHeaders.forEach(cookie => {
            res.append('Set-Cookie', cookie); // Reenvía cookies
          });
        }

        res.status(response.status).send(response.data);
      } catch (err) {
        console.error("Error al iniciar sesión:", err.message);
        res.status(500).send({ message: "Error al comunicarse con auth-service" });
      }
    });
    //Esta ruta será útil para verificar el token JWT
    this.router.get('/',verifyToken, async(req,res)=>{
      res.status(200).send({
        message: "Token verificado correctamente.",
        userId: req.user.id,
        email: req.user.email,
        rol: req.user.rol
      })
    })
    this.router.post("/register",async(req,res)=>{
      try{
        
        const response= await axios.post(
          `${USUARIO_SERVICE}/auth-service/usuario/register`, req.body, 
          {
          withCredentials: true
          }
        );
        return res.status(response.status).send(response.data);
      }catch(err){
        console.error("Error al registrar usuario:", err.message);
        res.status(500).send({ message: "Error al comunicarse con auth-service" });
      }
    })
    this.router.post("/refreshToken",async(req,res)=>{
      try{
        const response=await axios.post(
          `${USUARIO_SERVICE}/auth-service/usuario/refreshToken`, 
          {},
          {
            withCredentials: true, // Permitir el envío de cookies
            headers: {
              'Cookie': req.headers.cookie // Enviar las cookies del cliente
            }
          }
        )
        return res.status(response.status).send(response.data);
      }catch(err){
        console.error("Error al refrescar el token:", err.message);
        return res.status(500).send({ message: "Error al comunicarse con auth-service" });
      }
    })
    this.router.post("/forgot-password",async(req,res)=>{
      try{
        const response=await axios.post(
          `${USUARIO_SERVICE}/auth-service/usuario/forgot-password`, 
          req.body,
          {
            withCredentials: true, // Permitir el envío de cookies
            headers: {
              'Cookie': req.headers.cookie // Enviar las cookies del cliente
            }
          }
        )
        return res.status(response.status).send(response.data);
      }catch(err){
        console.error("Error al enviar el correo de recuperación:", err.message);
        return res.status(500).send({ message: "Error al comunicarse con auth-service" });
      }
    })
    this.router.post("/reset-password",async(req,res)=>{
      const token = req.query.token;
      try{
        const response= await axios.post(
          `${USUARIO_SERVICE}/auth-service/usuario/reset-password?token=${token}`, 
          req.body,
          {
            withCredentials: true, // Permitir el envío de cookies
            headers: {
              'Cookie': req.headers.cookie // Enviar las cookies del cliente
            }
          }
        )
        return res.status(response.status).send(response.data);
      }catch(err){
        console.error("Error al restablecer la contraseña:", err.message);
        return res.status(500).send({ message: "Error al comunicarse con auth-service" });
      }
    })
    //redirecciona a la ruta de autenticación de Google del servicio de usuario
    this.router.get("/auth/google", (req, res) => {
      const redirectURL = `${USUARIO_SERVICE}/auth-service/usuario/auth/google`;
      res.redirect(redirectURL); // Redirige directamente al auth-service
    });

  }
}
module.exports = UsuarioRoutes;

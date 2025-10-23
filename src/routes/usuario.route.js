const express = require("express");
const axios = require("axios");
const { USUARIO_SERVICE } = require("../config/config.js");
const verifyToken = require('../middleware/auth.js');
const { checkPermisosDesdeRoles } = require('../middleware/checkRole.js');

class UsuarioRoutes {
  constructor(app) {
    this.router = express.Router();
    this.registerRoutes();
    app.use("/api-gateway/usuario", this.router);
  }

  registerRoutes() {
    // LOGIN
    this.router.post('/login', async (req, res) => {
      try {
        const response = await axios.post(
          `${USUARIO_SERVICE}/auth-service/usuario/login`,
          req.body,
          { withCredentials: true }
        );
        const setCookieHeaders = response.headers['set-cookie'];
        if (setCookieHeaders) {
          setCookieHeaders.forEach(cookie => {
            res.append('Set-Cookie', cookie);
          });
        }
        res.status(response.status).send(response.data);
      } catch (err) {
        if (err.response) {
          const errorMessage = err.response.data?.message || "Error desconocido al registrar usuario.";
          return res.status(err.response.status).send({ success: false, error: errorMessage });
        }
      }
    });

    // REGISTRO NORMAL
    this.router.post("/register", async (req, res) => {
      try {
        const response = await axios.post(
          `${USUARIO_SERVICE}/auth-service/usuario/register`,
          req.body,
          { withCredentials: true }
        );
        const setCookieHeaders = response.headers['set-cookie'];
        if (setCookieHeaders) {
          setCookieHeaders.forEach(cookie => {
            res.append('Set-Cookie', cookie);
          });
        }
        res.status(response.status).send(response.data);
      } catch (err) {
        console.error("Error al registrar usuario:", err.message);
        if (err.response) {
          const errorMessage = err.response.data?.message || "Error desconocido al registrar usuario.";
          return res.status(err.response.status).send({ success: false, error: errorMessage });
        }
        return res.status(500).send({ success: false, error: "Error de conexión con auth-service." });
      }
    });

    // REGISTRO DE ADMIN
    this.router.post("/register-admin", verifyToken, checkPermisosDesdeRoles(["asignar_roles"]), async (req, res) => {
      try {
        const response = await axios.post(
          `${USUARIO_SERVICE}/auth-service/usuario/register-admin`,
          req.body,
          {
            withCredentials: true,
            headers: { 'Cookie': req.headers.cookie }
          }
        );
        res.status(response.status).send(response.data);
      } catch (err) {
        if(err.response){
          const errorMessage = err.response.data?.message || "Error desconocido al procesar la solicitud.";
          return res.status(err.response.status).send({ success: false, error: errorMessage });
        }
        res.status(500).send({ message: "Error al comunicarse con auth-service" });
      }
    });

    // LOGOUT
    this.router.post("/logout", verifyToken, checkPermisosDesdeRoles(["logout_usuario"]), async (req, res) => {
      try {
        const response = await axios.post(
          `${USUARIO_SERVICE}/auth-service/usuario/logout`,
          req.body,
          {
            withCredentials: true,
            headers: { 'Cookie': req.headers.cookie }
          }
        );
        res.status(response.status).send(response.data);
      } catch (err) {
        if(err.response){
          const errorMessage = err.response.data?.message || "Error desconocido al procesar la solicitud.";
          return res.status(err.response.status).send({ success: false, error: errorMessage });
        }
        res.status(500).send({ message: "Error al comunicarse con auth-service" });
      }
    });

    // REFRESH TOKEN
    this.router.post("/refreshToken", async (req, res) => {
      try {
        const response = await axios.post(
          `${USUARIO_SERVICE}/auth-service/usuario/refreshToken`,
          {},
          {
            withCredentials: true,
            headers: { 'Cookie': req.headers.cookie }
          }
        );
        res.status(response.status).send(response.data);
      } catch (err) {
        if(err.response){
          const errorMessage = err.response.data?.message || "Error desconocido al procesar la solicitud.";
          return res.status(err.response.status).send({ success: false, error: errorMessage });
        }
        res.status(500).send({ message: "Error al comunicarse con auth-service" });
      }
    });

    // FORGOT PASSWORD
    this.router.post("/forgot-password", async (req, res) => {
      try {
        const response = await axios.post(
          `${USUARIO_SERVICE}/auth-service/usuario/forgot-password`,
          req.body,
          {
            withCredentials: true,
            headers: { 'Cookie': req.headers.cookie }
          }
        );
        res.status(response.status).send(response.data);
      } catch (err) {
        console.log(err);
        if(err.response){
          const errorMessage = err.response.data?.message || "Error desconocido al procesar la solicitud.";
          return res.status(err.response.status).send({ success: false, error: errorMessage });
        }
        res.status(500).send({ message: "Error al comunicarse con auth-service" });
      }
    });

    // RESET PASSWORD
    this.router.post("/reset-password", async (req, res) => {
      const token = req.query.token;
      try {
        const response = await axios.post(
          `${USUARIO_SERVICE}/auth-service/usuario/reset-password?token=${token}`,
          req.body,
          {
            withCredentials: true,
            headers: { 'Cookie': req.headers.cookie }
          }
        );
        res.status(response.status).send(response.data);
      } catch (err) {
        if(err.response){
          const errorMessage = err.response.data?.message || "Error desconocido al procesar la solicitud.";
          return res.status(err.response.status).send({ success: false, error: errorMessage });
        }
        res.status(500).send({ message: "Error al comunicarse con auth-service" });
      }
    });

    // ACTUALIZAR USUARIO
    this.router.put("/:id", verifyToken, checkPermisosDesdeRoles(["actualizar_usuario"]), async (req, res) => {
      try {
        const response = await axios.put(
          `${USUARIO_SERVICE}/auth-service/usuario/${req.params.id}`,
          req.body,
          {
            withCredentials: true,
            headers: { 'Cookie': req.headers.cookie }
          }
        );
        res.status(response.status).send(response.data);
      } catch (err) {
        if(err.response){
          const errorMessage = err.response.data?.message || "Error desconocido al procesar la solicitud.";
          return res.status(err.response.status).send({ success: false, error: errorMessage });
        }
        res.status(500).send({ message: "Error al comunicarse con auth-service" });
      }
    });

    // DESACTIVAR CUENTA
    this.router.post("/deactivateAccount/:id", verifyToken, checkPermisosDesdeRoles(["desactivar_cuenta"]), async (req, res) => {
      try {
        const response = await axios.post(
          `${USUARIO_SERVICE}/auth-service/usuario/deactivateAccount/${req.params.id}`,
          req.body,
          {
            withCredentials: true,
            headers: { 'Cookie': req.headers.cookie }
          }
        );
        res.status(response.status).send(response.data);
      } catch (err) {
        if(err.response){
          const errorMessage = err.response.data?.message || "Error desconocido al procesar la solicitud.";
          return res.status(err.response.status).send({ success: false, error: errorMessage });
        }
        res.status(500).send({ message: "Error al comunicarse con auth-service" });
      }
    });

    // FIND ONE
    this.router.get("/findOne/:id", verifyToken, checkPermisosDesdeRoles(["ver_usuario"]), async (req, res) => {
      try {
        const response = await axios.get(
          `${USUARIO_SERVICE}/auth-service/usuario/findOne/${req.params.id}`,
          {
            withCredentials: true,
            headers: { 'Cookie': req.headers.cookie }
          }
        );
        res.status(response.status).send(response.data);
      } catch (err) {
        if(err.response){
          const errorMessage = err.response.data?.message || "Error desconocido al procesar la solicitud.";
          return res.status(err.response.status).send({ success: false, error: errorMessage });
        }
        res.status(500).send({ message: "Error al comunicarse con auth-service" });
      }
    });

    // FIND ALL
    this.router.get("/findAll", verifyToken, checkPermisosDesdeRoles(["ver_usuarios"]), async (req, res) => {
      try {
        const response = await axios.get(
          `${USUARIO_SERVICE}/auth-service/usuario/findAll`,
          {
            withCredentials: true,
            headers: { 'Cookie': req.headers.cookie }
          }
        );
        res.status(response.status).send(response.data);
      } catch (err) {
        if(err.response){
          const errorMessage = err.response.data?.message || "Error desconocido al procesar la solicitud.";
          return res.status(err.response.status).send({ success: false, error: errorMessage });
        }
        res.status(500).send({ message: "Error al comunicarse con auth-service" });
      }
    });

    // FIND ALL ACTIVOS
    this.router.get("/findAllActivos", verifyToken, checkPermisosDesdeRoles(["ver_usuarios_activos"]), async (req, res) => {
      try {
        const response = await axios.get(
          `${USUARIO_SERVICE}/auth-service/usuario/findAllActivos`,
          {
            withCredentials: true,
            headers: { 'Cookie': req.headers.cookie }
          }
        );
        res.status(response.status).send(response.data);
      } catch (err) {
        if(err.response){
          const errorMessage = err.response.data?.message || "Error desconocido al procesar la solicitud.";
          return res.status(err.response.status).send({ success: false, error: errorMessage });
        }
        res.status(500).send({ message: "Error al comunicarse con auth-service" });
      }
    });

    // DELETE USUARIO
    this.router.delete("/:id", verifyToken, checkPermisosDesdeRoles(["eliminar_usuario"]), async (req, res) => {
      try {
        const response = await axios.delete(
          `${USUARIO_SERVICE}/auth-service/usuario/${req.params.id}`,
          {
            withCredentials: true,
            headers: { 'Cookie': req.headers.cookie }
          }
        );
        res.status(response.status).send(response.data);
      } catch (err) {
        if(err.response){
          const errorMessage = err.response.data?.message || "Error desconocido al procesar la solicitud.";
          return res.status(err.response.status).send({ success: false, error: errorMessage });
        }
        res.status(500).send({ message: "Error al comunicarse con auth-service" });
      }
    });

    // GOOGLE OAUTH2
    this.router.get("/auth/google", (req, res) => {
      const redirectURL = `${USUARIO_SERVICE}/auth-service/usuario/auth/google`;
      res.redirect(redirectURL);
    });
  this.router.get("/auth/google/callback", async (req, res) => {
    try {
      const qs = req.originalUrl.split("?")[1] || "";
      const url = `${USUARIO_SERVICE}/auth-service/usuario/auth/google/callback${qs ? "?" + qs : ""}`;

      const response = await axios.get(url, {
        withCredentials: true,
        headers: { Cookie: req.headers.cookie || "" },
        maxRedirects: 0,
        validateStatus: (status) => status >= 200 && status < 400,
      });

      const setCookie = response.headers["set-cookie"];
      if (setCookie) {
        setCookie.forEach((c) => res.append("Set-Cookie", c));
      }

      const location = response.headers["location"];
      if (location) {
        return res.redirect(location);
      }

      return res.status(response.status).send(response.data);
    } catch (err) {
      const status = err.response?.status || 500;
      const msg = err.response?.data?.message || "Error en callback de Google.";
      return res.status(status).send({ success: false, error: msg });
    }
  });

    // VERIFICACIÓN DE TOKEN
    this.router.get("/", async (req, res) => {
      try {
        const response = await axios.get(
          `${USUARIO_SERVICE}/auth-service/usuario/verifyToken`, 
          {
            withCredentials: true,
            headers: { Cookie: req.headers.cookie }
          }
        );
        res.status(response.status).send(response.data);
      } catch (err) {
        if(err.response){
          
          const errorMessage = err.response.data?.message || "Error desconocido al procesar la solicitud.";
          
          return res.status(err.response.status).send({ success: false, error: errorMessage });
        }
        res.status(500).send({ message: "Error al comunicarse con auth-service" });
      }
    });
  }
}

module.exports = UsuarioRoutes;

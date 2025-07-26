const express = require("express");
const axios = require("axios");
const { USUARIO_SERVICE } = require("../config/config.js");
const verifyToken = require("../middleware/auth.js");
const { checkPermisosDesdeRoles } = require("../middleware/checkRole.js");

class UsuarioRolRoutes {
  constructor(app) {
    this.router = express.Router();
    this.registerRoutes();
    app.use("/api-gateway/usuario-rol", this.router);
  }

  registerRoutes() {
    // Crear una relación usuario-rol
    this.router.post("/", verifyToken, checkPermisosDesdeRoles(["asignar_roles"]), async (req, res) => {
      try {
        const response = await axios.post(
          `${USUARIO_SERVICE}/auth-service/usuario-rol/`,
          req.body,
          {
            withCredentials: true,
            headers: { Cookie: req.headers.cookie }
          }
        );
        res.status(response.status).send(response.data);
      } catch (err) {
        console.error("Error al crear relación usuario-rol:", err.message);
        res.status(500).send({ message: "Error al comunicarse con auth-service" });
      }
    });

    // Obtener todas las relaciones usuario-rol
    this.router.get("/", verifyToken, checkPermisosDesdeRoles(["ver_roles", "ver_usuarios"]), async (req, res) => {
      try {
        const response = await axios.get(
          `${USUARIO_SERVICE}/auth-service/usuario-rol/`,
          {
            withCredentials: true,
            headers: { Cookie: req.headers.cookie }
          }
        );
        res.status(response.status).send(response.data);
      } catch (err) {
        console.error("Error al obtener relaciones usuario-rol:", err.message);
        res.status(500).send({ message: "Error al comunicarse con auth-service" });
      }
    });

    // Obtener una relación específica por usuarioId y rolId
    this.router.get("/:usuarioId/:rolId", verifyToken, checkPermisosDesdeRoles(["ver_rol", "ver_usuario"]), async (req, res) => {
      const { usuarioId, rolId } = req.params;
      try {
        const response = await axios.get(
          `${USUARIO_SERVICE}/auth-service/usuario-rol/${usuarioId}/${rolId}`,
          {
            withCredentials: true,
            headers: { Cookie: req.headers.cookie }
          }
        );
        res.status(response.status).send(response.data);
      } catch (err) {
        console.error("Error al obtener relación usuario-rol específica:", err.message);
        res.status(500).send({ message: "Error al comunicarse con auth-service" });
      }
    });

    // Eliminar una relación específica por usuarioId y rolId
    this.router.delete("/:usuarioId/:rolId", verifyToken, checkPermisosDesdeRoles(["eliminar_rol", "eliminar_usuario"]), async (req, res) => {
      const { usuarioId, rolId } = req.params;
      try {
        const response = await axios.delete(
          `${USUARIO_SERVICE}/auth-service/usuario-rol/${usuarioId}/${rolId}`,
          {
            withCredentials: true,
            headers: { Cookie: req.headers.cookie }
          }
        );
        res.status(response.status).send(response.data);
      } catch (err) {
        console.error("Error al eliminar relación usuario-rol:", err.message);
        res.status(500).send({ message: "Error al comunicarse con auth-service" });
      }
    });
  }
}

module.exports = UsuarioRolRoutes;

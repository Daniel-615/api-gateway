const express = require("express");
const axios = require("axios");
const { USUARIO_SERVICE } = require("../config/config.js");
const verifyToken = require("../middleware/auth.js");
const { checkPermisosDesdeRoles } = require("../middleware/checkRole.js");

class PermisoRoutes {
  constructor(app) {
    this.router = express.Router();
    this.registerRoutes();
    app.use("/api-gateway/permiso", this.router);
  }

  registerRoutes() {
    // Crear un nuevo permiso
    this.router.post("/", verifyToken, checkPermisosDesdeRoles(["asignar_permisos"]), async (req, res) => {
      try {
        const response = await axios.post(
          `${USUARIO_SERVICE}/auth-service/permiso`,
          req.body,
          {
            withCredentials: true,
            headers: { Cookie: req.headers.cookie }
          }
        );
        res.status(response.status).send(response.data);
      } catch (err) {
        console.error("Error al crear permiso:", err.message);
        res.status(500).send({ message: "Error al comunicarse con auth-service" });
      }
    });

    // Obtener todos los permisos
    this.router.get("/", verifyToken, checkPermisosDesdeRoles(["ver_permisos"]), async (req, res) => {
      try {
        const response = await axios.get(
          `${USUARIO_SERVICE}/auth-service/permiso`,
          {
            withCredentials: true,
            headers: { Cookie: req.headers.cookie }
          }
        );
        res.status(response.status).send(response.data);
      } catch (err) {
        console.error("Error al obtener permisos:", err.message);
        res.status(500).send({ message: "Error al comunicarse con auth-service" });
      }
    });

    // Obtener un permiso por ID
    this.router.get("/:id", verifyToken, checkPermisosDesdeRoles(["ver_permiso"]), async (req, res) => {
      try {
        const response = await axios.get(
          `${USUARIO_SERVICE}/auth-service/permiso/${req.params.id}`,
          {
            withCredentials: true,
            headers: { Cookie: req.headers.cookie }
          }
        );
        res.status(response.status).send(response.data);
      } catch (err) {
        console.error("Error al obtener permiso:", err.message);
        res.status(500).send({ message: "Error al comunicarse con auth-service" });
      }
    });

    // Actualizar un permiso
    this.router.put("/:id", verifyToken, checkPermisosDesdeRoles(["actualizar_permiso"]), async (req, res) => {
      try {
        const response = await axios.put(
          `${USUARIO_SERVICE}/auth-service/permiso/${req.params.id}`,
          req.body,
          {
            withCredentials: true,
            headers: { Cookie: req.headers.cookie }
          }
        );
        res.status(response.status).send(response.data);
      } catch (err) {
        console.error("Error al actualizar permiso:", err.message);
        res.status(500).send({ message: "Error al comunicarse con auth-service" });
      }
    });

    // Eliminar un permiso
    this.router.delete("/:id", verifyToken, checkPermisosDesdeRoles(["eliminar_permiso"]), async (req, res) => {
      try {
        const response = await axios.delete(
          `${USUARIO_SERVICE}/auth-service/permiso/${req.params.id}`,
          {
            withCredentials: true,
            headers: { Cookie: req.headers.cookie }
          }
        );
        res.status(response.status).send(response.data);
      } catch (err) {
        console.error("Error al eliminar permiso:", err.message);
        res.status(500).send({ message: "Error al comunicarse con auth-service" });
      }
    });
  }
}

module.exports = PermisoRoutes;

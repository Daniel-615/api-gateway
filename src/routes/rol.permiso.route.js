const express = require("express");
const axios = require("axios");
const { USUARIO_SERVICE } = require("../config/config.js");
const verifyToken = require("../middleware/auth.js");
const { checkPermisosDesdeRoles } = require("../middleware/checkRole.js");

class RolPermisoRoutes {
  constructor(app) {
    this.router = express.Router();
    this.registerRoutes();
    app.use("/api-gateway/rol-permiso", this.router);
  }

  registerRoutes() {
    // Crear una relación rol-permiso
    this.router.post("/", verifyToken, checkPermisosDesdeRoles(["asignar_permisos", "asignar_roles"]), async (req, res) => {
      try {
        const response = await axios.post(
          `${USUARIO_SERVICE}/auth-service/rol-permiso/`,
          req.body,
          {
            withCredentials: true,
            headers: { Cookie: req.headers.cookie }
          }
        );
        res.status(response.status).send(response.data);
      } catch (err) {
        console.error("Error al crear relación rol-permiso:", err.message);
        res.status(500).send({ message: "Error al comunicarse con auth-service" });
      }
    });

    // Crear múltiples relaciones rol-permiso
    this.router.post("/many", verifyToken, checkPermisosDesdeRoles(["asignar_permisos", "asignar_roles"]), async (req, res) => {
      try {
        const response = await axios.post(
          `${USUARIO_SERVICE}/auth-service/rol-permiso/many`,
          req.body,
          {
            withCredentials: true,
            headers: { Cookie: req.headers.cookie }
          }
        );
        res.status(response.status).send(response.data);
      } catch (err) {
        console.error("Error al crear múltiples relaciones rol-permiso:", err.message);
        res.status(500).send({ message: "Error al comunicarse con auth-service" });
      }
    });

    // Obtener todas las relaciones rol-permiso
    this.router.get("/", verifyToken, checkPermisosDesdeRoles(["ver_roles", "ver_permisos"]), async (req, res) => {
      try {
        const response = await axios.get(
          `${USUARIO_SERVICE}/auth-service/rol-permiso/`,
          {
            withCredentials: true,
            headers: { Cookie: req.headers.cookie }
          }
        );
        res.status(response.status).send(response.data);
      } catch (err) {
        console.error("Error al obtener relaciones rol-permiso:", err.message);
        res.status(500).send({ message: "Error al comunicarse con auth-service" });
      }
    });

    // Obtener una relación específica por rolId y permisoId
    this.router.get("/:rolId/:permisoId", verifyToken, checkPermisosDesdeRoles(["ver_permiso", "ver_rol"]), async (req, res) => {
      const { rolId, permisoId } = req.params;
      try {
        const response = await axios.get(
          `${USUARIO_SERVICE}/auth-service/rol-permiso/${rolId}/${permisoId}`,
          {
            withCredentials: true,
            headers: { Cookie: req.headers.cookie }
          }
        );
        res.status(response.status).send(response.data);
      } catch (err) {
        console.error("Error al obtener relación específica:", err.message);
        res.status(500).send({ message: "Error al comunicarse con auth-service" });
      }
    });

    // Eliminar una relación específica por rolId y permisoId
    this.router.delete("/:rolId/:permisoId", verifyToken, checkPermisosDesdeRoles(["eliminar_rol", "eliminar_permiso"]), async (req, res) => {
      const { rolId, permisoId } = req.params;
      try {
        const response = await axios.delete(
          `${USUARIO_SERVICE}/auth-service/rol-permiso/${rolId}/${permisoId}`,
          {
            withCredentials: true,
            headers: { Cookie: req.headers.cookie }
          }
        );
        res.status(response.status).send(response.data);
      } catch (err) {
        console.error("Error al eliminar relación rol-permiso:", err.message);
        res.status(500).send({ message: "Error al comunicarse con auth-service" });
      }
    });
  }
}

module.exports = RolPermisoRoutes;

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
        this.handleError(err,res);
      }
    });
    
    // Obtener relaciones rol-permiso con paginación
    this.router.get("/", verifyToken, checkPermisosDesdeRoles(["ver_roles", "ver_permisos"]), async (req, res) => {
      const { page = 1, limit = 10 } = req.query;
      try {
        const response = await axios.get(
          `${USUARIO_SERVICE}/auth-service/rol-permiso/?page=${page}&limit=${limit}`,
          {
            withCredentials: true,
            headers: { Cookie: req.headers.cookie }
          }
        );
        res.status(response.status).send(response.data);
      } catch (err) {
        this.handleError(err,res);
      }
    });

    // Obtener permisos no asignados a un rol
    this.router.get("/rol-no-asignado/:rolId", verifyToken, checkPermisosDesdeRoles(["ver_roles", "ver_permisos"]), async (req, res) => {
      const { rolId } = req.params;
      try {
        const response = await axios.get(
          `${USUARIO_SERVICE}/auth-service/rol-permiso/rol-no-asignado/${rolId}`,
          {
            withCredentials: true,
            headers: { Cookie: req.headers.cookie }
          }
        );
        res.status(response.status).send(response.data);
      } catch (err) {
        this.handleError(err,res);
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
        this.handleError(err,res);
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
        this.handleError(err,res);
      }
    });
  }
  handleError(err, res) {
    if (err.response) {
      const errorMessage =
        err.response.data?.message || "Error desconocido al procesar la solicitud.";
      return res
        .status(err.response.status)
        .send({ success: false, error: errorMessage });
    }
    res.status(500).send({ message: "Error al comunicarse con auth-service" });
  }
}

module.exports = RolPermisoRoutes;

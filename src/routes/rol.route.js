const express = require("express");
const axios = require("axios");
const { USUARIO_SERVICE } = require("../config/config.js");
const verifyToken = require("../middleware/auth.js");
const { checkPermisosDesdeRoles } = require("../middleware/checkRole.js");

class RolRoutes {
  constructor(app) {
    this.router = express.Router();
    this.registerRoutes();
    app.use("/api-gateway/rol", this.router);
  }

  registerRoutes() {
    // Crear un nuevo rol
    this.router.post("/", verifyToken, checkPermisosDesdeRoles(["asignar_roles"]), async (req, res) => {
      try {
        const response = await axios.post(
          `${USUARIO_SERVICE}/auth-service/rol`,
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

    // Obtener todos los roles
    this.router.get("/", verifyToken, checkPermisosDesdeRoles(["ver_roles"]), async (req, res) => {
      try {
        const response = await axios.get(
          `${USUARIO_SERVICE}/auth-service/rol`,
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

    // Obtener un rol por ID
    this.router.get("/:id", verifyToken, checkPermisosDesdeRoles(["ver_rol"]), async (req, res) => {
      try {
        const response = await axios.get(
          `${USUARIO_SERVICE}/auth-service/rol/${req.params.id}`,
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

    // Actualizar un rol
    this.router.put("/:id", verifyToken, checkPermisosDesdeRoles(["actualizar_rol"]), async (req, res) => {
      try {
        const response = await axios.put(
          `${USUARIO_SERVICE}/auth-service/rol/${req.params.id}`,
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

    // Eliminar un rol
    this.router.delete("/:id", verifyToken, checkPermisosDesdeRoles(["eliminar_rol"]), async (req, res) => {
      try {
        const response = await axios.delete(
          `${USUARIO_SERVICE}/auth-service/rol/${req.params.id}`,
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

module.exports = RolRoutes;

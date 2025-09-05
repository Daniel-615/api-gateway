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
        this.handleError(err,res);
      }
    });

    // Obtener todos los permisos
    this.router.get("/", verifyToken, checkPermisosDesdeRoles(["ver_permisos"]), async (req, res) => {
      try {
        const {page,limit}= req.query;
        const queryParams=new URLSearchParams();
        if(page) queryParams.append("page",page);
        if(limit) queryParams.append("limit",limit);

        const response = await axios.get(
          `${USUARIO_SERVICE}/auth-service/permiso?${queryParams.toString()}`,
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
        this.handleError(err,res);
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
        this.handleError(err,res);
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
    res.status(500).send({ message: "Error al comunicarse con permiso-service" });
  }
}

module.exports = PermisoRoutes;

const express = require("express");
const axios = require("axios");
const { PRODUCTO_SERVICE } = require("../config/config.js");
const verifyToken = require("../middleware/auth.js");
const { checkPermisosDesdeRoles } = require("../middleware/checkRole.js");

class DeseoRoutes {
  constructor(app) {
    this.router = express.Router();
    this.registerRoutes();
    app.use("/api-gateway/deseo", this.router);
  }

  registerRoutes() {
    this.router.post(
      "/usuarios/:usuario_id/deseos",
      verifyToken,
      checkPermisosDesdeRoles(["crear_deseo"]),
      async (req, res) => {
        try {
          const response = await axios.post(
            `${PRODUCTO_SERVICE}/producto-service/deseo/usuarios/${req.params.usuario_id}/deseos`,
            req.body,
            {
              withCredentials: true,
              headers: { "Content-Type": "application/json" },
            }
          );
          return res.status(response.status).send(response.data);
        } catch (err) {
          this.handleError(err, res, "crear deseo en producto-service");
        }
      }
    );

    this.router.get(
      "/usuarios/:usuario_id/deseos",
      verifyToken,
      checkPermisosDesdeRoles(["obtener_deseos"]),
      async (req, res) => {
        try {
          const response = await axios.get(
            `${PRODUCTO_SERVICE}/producto-service/deseo/usuarios/${req.params.usuario_id}/deseos`,
            {
              withCredentials: true,
              params: req.query, 
            }
          );
          return res.status(response.status).send(response.data);
        } catch (err) {
          this.handleError(err, res, "obtener deseos del producto-service");
        }
      }
    );


    this.router.get(
      "/deseos/:deseo_id",
      verifyToken,
      checkPermisosDesdeRoles(["obtener_deseo"]),
      async (req, res) => {
        try {
          const response = await axios.get(
            `${PRODUCTO_SERVICE}/producto-service/deseo/deseos/${req.params.deseo_id}`,
            { withCredentials: true }
          );
          return res.status(response.status).send(response.data);
        } catch (err) {
          this.handleError(err, res, "obtener deseo del producto-service");
        }
      }
    );


    this.router.patch(
      "/deseos/:deseo_id/consumir",
      verifyToken,
      checkPermisosDesdeRoles(["consumir_deseo"]),
      async (req, res) => {
        try {
          const response = await axios.patch(
            `${PRODUCTO_SERVICE}/producto-service/deseo/deseos/${req.params.deseo_id}/consumir`,
            req.body, 
            { withCredentials: true }
          );
          return res.status(response.status).send(response.data);
        } catch (err) {
          this.handleError(err, res, "consumir deseo en producto-service");
        }
      }
    );


    this.router.delete(
      "/deseos/:deseo_id",
      verifyToken,
      checkPermisosDesdeRoles(["eliminar_deseo"]),
      async (req, res) => {
        try {
          const response = await axios.delete(
            `${PRODUCTO_SERVICE}/producto-service/deseo/deseos/${req.params.deseo_id}`,
            { withCredentials: true }
          );
          return res.status(response.status).send(response.data);
        } catch (err) {
          this.handleError(err, res, "eliminar deseo en producto-service");
        }
      }
    );
  }

  handleError(err, res, contexto = "procesar la solicitud") {
    if (err?.response) {
      const status = err.response.status || 500;
      const message =
        err.response.data?.message ||
        err.response.data?.error ||
        `Error desconocido al ${contexto}.`;
      return res.status(status).send({ success: false, error: message });
    }
    return res
      .status(500)
      .send({ success: false, error: `Error interno al ${contexto}.` });
  }
}

module.exports = DeseoRoutes;

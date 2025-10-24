const express = require("express");
const axios = require("axios");
const { PRODUCTO_SERVICE } = require("../config/config.js");
const verifyToken = require("../middleware/auth.js");
const { checkPermisosDesdeRoles } = require("../middleware/checkRole.js");

class PromocionRoutes {
  constructor(app) {
    this.router = express.Router();
    this.registerRoutes();
    app.use("/api-gateway/promocion", this.router);
  }

  registerRoutes() {
    this.router.post(
      "/",
      verifyToken,
      checkPermisosDesdeRoles(["crear_promocion"]),
      async (req, res) => {
        try {
          const response = await axios.post(
            `${PRODUCTO_SERVICE}/producto-service/promocion`,
            req.body,
            {
              withCredentials: true,
              headers: { "Content-Type": "application/json" },
            }
          );
          return res.status(response.status).send(response.data);
        } catch (err) {
          this.handleError(err, res, "crear promoción en producto-service");
        }
      }
    );

    this.router.get(
      "/",
      verifyToken,
      checkPermisosDesdeRoles(["obtener_promociones"]),
      async (req, res) => {
        try {
          const response = await axios.get(
            `${PRODUCTO_SERVICE}/producto-service/promocion`,
            {
              withCredentials: true,
              params: req.query,
            }
          );
          return res.status(response.status).send(response.data);
        } catch (err) {
          this.handleError(err, res, "obtener promociones del producto-service");
        }
      }
    );


    this.router.get(
      "/:promocion_id",
      verifyToken,
      checkPermisosDesdeRoles(["obtener_promocion"]),
      async (req, res) => {
        try {
          const response = await axios.get(
            `${PRODUCTO_SERVICE}/producto-service/promocion/${req.params.promocion_id}`,
            { withCredentials: true }
          );
          return res.status(response.status).send(response.data);
        } catch (err) {
          this.handleError(err, res, "obtener promoción del producto-service");
        }
      }
    );

    this.router.patch(
      "/:promocion_id",
      verifyToken,
      checkPermisosDesdeRoles(["actualizar_promocion"]),
      async (req, res) => {
        try {
          const response = await axios.patch(
            `${PRODUCTO_SERVICE}/producto-service/promocion/${req.params.promocion_id}`,
            req.body,
            {
              withCredentials: true,
              headers: { "Content-Type": "application/json" },
            }
          );
          return res.status(response.status).send(response.data);
        } catch (err) {
          this.handleError(err, res, "actualizar promoción en producto-service");
        }
      }
    );

    this.router.delete(
      "/:promocion_id",
      verifyToken,
      checkPermisosDesdeRoles(["eliminar_promocion"]),
      async (req, res) => {
        try {
          const response = await axios.delete(
            `${PRODUCTO_SERVICE}/producto-service/promocion/${req.params.promocion_id}`,
            { withCredentials: true }
          );
          return res.status(response.status).send(response.data);
        } catch (err) {
          this.handleError(err, res, "desactivar promoción en producto-service");
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

module.exports = PromocionRoutes;

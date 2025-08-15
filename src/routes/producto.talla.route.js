const express = require("express");
const axios = require("axios");
const { PRODUCTO_SERVICE } = require("../config/config.js");
const verifyToken = require("../middleware/auth.js");
const { checkPermisosDesdeRoles } = require("../middleware/checkRole.js");

class ProductoTallaRoute {
  constructor(app) {
    this.router = express.Router();
    this.registerRoutes();
    app.use("/api-gateway/producto-talla", this.router);
  }

  registerRoutes() {
    this.router.post(
      "/",
      verifyToken,
      checkPermisosDesdeRoles(["crear_producto_talla"]),
      async (req, res) => {
        try {
          const response = await axios.post(
            `${PRODUCTO_SERVICE}/producto-service/producto-talla`,
            req.body,
            {
              withCredentials: true,
              headers: {
                Cookie: req.headers.cookie || "",
              },
            }
          );
          res.status(response.status).send(response.data);
        } catch (err) {
          this.handleError(err, res, "crear la talla de producto");
        }
      }
    );
    this.router.get(
      "/",
      verifyToken,
      checkPermisosDesdeRoles(["ver_producto_talla"]),
      async (req, res) => {
        try {
          const response = await axios.get(
            `${PRODUCTO_SERVICE}/producto-service/producto-talla`,
            {
              withCredentials: true,
              headers: { Cookie: req.headers.cookie || "" },
            }
          );
          res.status(response.status).send(response.data);
        } catch (err) {
          this.handleError(err, res, "obtener las tallas de producto");
        }
      }
    );

    this.router.get(
      "/:id",
      verifyToken,
      checkPermisosDesdeRoles(["ver_producto_talla"]),
      async (req, res) => {
        try {
          const response = await axios.get(
            `${PRODUCTO_SERVICE}/producto-service/producto-talla/${req.params.id}`,
            {
              withCredentials: true,
              headers: { Cookie: req.headers.cookie || "" },
            }
          );
          res.status(response.status).send(response.data);
        } catch (err) {
          this.handleError(err, res, "obtener la talla de producto");
        }
      }
    );
    this.router.put(
      "/:id",
      verifyToken,
      checkPermisosDesdeRoles(["actualizar_producto_talla"]),
      async (req, res) => {
        try {
          const response = await axios.put(
            `${PRODUCTO_SERVICE}/producto-service/producto-talla/${req.params.id}`,
            req.body,
            {
              withCredentials: true,
              headers: { Cookie: req.headers.cookie || "" },
            }
          );
          res.status(response.status).send(response.data);
        } catch (err) {
          this.handleError(err, res, "actualizar la talla de producto");
        }
      }
    );
    this.router.delete(
      "/:id",
      verifyToken,
      checkPermisosDesdeRoles(["eliminar_producto_talla"]),
      async (req, res) => {
        try {
          const response = await axios.delete(
            `${PRODUCTO_SERVICE}/producto-service/producto-talla/${req.params.id}`,
            {
              withCredentials: true,
              headers: { Cookie: req.headers.cookie || "" },
            }
          );
          res.status(response.status).send(response.data);
        } catch (err) {
          this.handleError(err, res, "eliminar la talla de producto");
        }
      }
    );
  }

  handleError(err, res, accion) {
    const status = err?.response?.status || 500;
    const data = err?.response?.data || { message: `Error al ${accion}.` };

    if ([401, 403].includes(status)) {
      return res
        .status(status)
        .send(data?.message ? data : { message: `Acceso denegado al ${accion}.` });
    }
    if (status === 404) {
      return res
        .status(404)
        .send(data?.message ? data : { message: `Recurso no encontrado al ${accion}.` });
    }
    return res.status(status).send(data?.message ? data : { message: `Error al ${accion}.` });
  }
}

module.exports = ProductoTallaRoute;

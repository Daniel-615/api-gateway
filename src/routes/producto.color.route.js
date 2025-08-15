const express = require("express");
const axios = require("axios");
const FormData = require("form-data");
const multer = require("multer");
const { PRODUCTO_SERVICE } = require("../config/config.js");
const verifyToken = require("../middleware/auth.js");
const { checkPermisosDesdeRoles } = require("../middleware/checkRole.js");

const uploadMem = multer({ storage: multer.memoryStorage() });

class ProductoColorRoute {
  constructor(app) {
    this.router = express.Router();
    this.registerRoutes();
    app.use("/api-gateway/producto-color", this.router);
  }

  registerRoutes() {
    this.router.post(
      "/",
      verifyToken,
      checkPermisosDesdeRoles(["crear_producto_color"]),
      uploadMem.single("imagen"),
      async (req, res) => {
        try {
          const form = new FormData();
          Object.entries(req.body || {}).forEach(([k, v]) => form.append(k, v));
          if (req.file) {
            form.append("imagen", req.file.buffer, {
              filename: req.file.originalname || "imagen.jpg",
              contentType: req.file.mimetype || "application/octet-stream",
            });
          }

          const response = await axios.post(
            `${PRODUCTO_SERVICE}/producto-service/producto-color`,
            form,
            {
              headers: {
                ...form.getHeaders(),
                Cookie: req.headers.cookie || "",
              },
              withCredentials: true,
            }
          );

          res.status(response.status).send(response.data);
        } catch (err) {
          this.handleError(err, res, "crear el color de producto");
        }
      }
    );

    this.router.get(
      "/",
      verifyToken,
      checkPermisosDesdeRoles(["ver_producto_color"]),
      async (req, res) => {
        try {
          const response = await axios.get(
            `${PRODUCTO_SERVICE}/producto-service/producto-color`,
            {
              withCredentials: true,
              headers: { Cookie: req.headers.cookie || "" },
            }
          );
          res.status(response.status).send(response.data);
        } catch (err) {
          this.handleError(err, res, "obtener los colores de producto");
        }
      }
    );

    this.router.get(
      "/:id",
      verifyToken,
      checkPermisosDesdeRoles(["ver_producto_color"]),
      async (req, res) => {
        try {
          const response = await axios.get(
            `${PRODUCTO_SERVICE}/producto-service/producto-color/${req.params.id}`,
            {
              withCredentials: true,
              headers: { Cookie: req.headers.cookie || "" },
            }
          );
          res.status(response.status).send(response.data);
        } catch (err) {
          this.handleError(err, res, "obtener el color de producto");
        }
      }
    );
    this.router.put(
      "/:id",
      verifyToken,
      checkPermisosDesdeRoles(["actualizar_producto_color"]),
      uploadMem.single("imagen"),
      async (req, res) => {
        try {
          const form = new FormData();
          Object.entries(req.body || {}).forEach(([k, v]) => {
            if (v !== undefined && v !== null) form.append(k, v);
          });
          if (req.file) {
            form.append("imagen", req.file.buffer, {
              filename: req.file.originalname || "imagen.jpg",
              contentType: req.file.mimetype || "application/octet-stream",
            });
          }

          const response = await axios.put(
            `${PRODUCTO_SERVICE}/producto-service/producto-color/${req.params.id}`,
            form,
            {
              headers: {
                ...form.getHeaders(),
                Cookie: req.headers.cookie || "",
              },
              withCredentials: true,
            }
          );

          res.status(response.status).send(response.data);
        } catch (err) {
          this.handleError(err, res, "actualizar el color de producto");
        }
      }
    );

    this.router.delete(
      "/:id",
      verifyToken,
      checkPermisosDesdeRoles(["eliminar_producto_color"]),
      async (req, res) => {
        try {
          const response = await axios.delete(
            `${PRODUCTO_SERVICE}/producto-service/producto-color/${req.params.id}`,
            {
              withCredentials: true,
              headers: { Cookie: req.headers.cookie || "" },
            }
          );
          res.status(response.status).send(response.data);
        } catch (err) {
          this.handleError(err, res, "eliminar el color de producto");
        }
      }
    );
  }

  handleError(err, res, accion) {
    const status = err?.response?.status || 500;
    const data = err?.response?.data || { message: `Error al ${accion}.` };

    if ([401, 403].includes(status)) {
      return res.status(status).send(
        data?.message
          ? data
          : { message: `Acceso denegado al ${accion}.` }
      );
    }

    if (status === 404) {
      return res.status(404).send(
        data?.message ? data : { message: `Recurso no encontrado al ${accion}.` }
      );
    }

    return res.status(status).send(
      data?.message ? data : { message: `Error al ${accion}.` }
    );
  }
}

module.exports = ProductoColorRoute;

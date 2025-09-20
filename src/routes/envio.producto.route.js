const express = require("express");
const axios = require("axios");
const { ENVIOS_SERVICE } = require("../config/config.js");
const verifyToken = require("../middleware/auth.js");

class EnvioProductoRoutes {
  constructor(app) {
    this.router = express.Router();
    this.registerRoutes();
    app.use("/api-gateway/envio_producto", this.router);
  }

  registerRoutes() {
    // Crear un nuevo envio_producto
    this.router.post("/", verifyToken, async (req, res) => {
      try {
        const response = await axios.post(
          `${ENVIOS_SERVICE}/envio-service/envio_producto`,
          req.body,
          { withCredentials: true, headers: { Cookie: req.headers.cookie } }
        );
        res.status(response.status).send(response.data);
      } catch (err) {
        this.handleError(err, res);
      }
    });

    // Obtener todos los envio_productos
    this.router.get("/", verifyToken, async (req, res) => {
      try {
        const response = await axios.get(
          `${ENVIOS_SERVICE}/envio-service/envio_producto`,
          { withCredentials: true, headers: { Cookie: req.headers.cookie } }
        );
        res.status(response.status).send(response.data);
      } catch (err) {
        this.handleError(err, res);
      }
    });

    // Obtener todos los productos de un envío específico
    this.router.get("/envio/:id_envio", verifyToken, async (req, res) => {
      try {
        const response = await axios.get(
          `${ENVIOS_SERVICE}/envio-service/envio_producto/envio/${req.params.id_envio}`,
          { withCredentials: true, headers: { Cookie: req.headers.cookie } }
        );
        res.status(response.status).send(response.data);
      } catch (err) {
        this.handleError(err, res);
      }
    });

    // Obtener un envio_producto por ID
    this.router.get("/:id", verifyToken, async (req, res) => {
      try {
        const response = await axios.get(
          `${ENVIOS_SERVICE}/envio-service/envio_producto/${req.params.id}`,
          { withCredentials: true, headers: { Cookie: req.headers.cookie } }
        );
        res.status(response.status).send(response.data);
      } catch (err) {
        this.handleError(err, res);
      }
    });

    // Actualizar un envio_producto
    this.router.put("/:id", verifyToken, async (req, res) => {
      try {
        const response = await axios.put(
          `${ENVIOS_SERVICE}/envio-service/envio_producto/${req.params.id}`,
          req.body,
          { withCredentials: true, headers: { Cookie: req.headers.cookie } }
        );
        res.status(response.status).send(response.data);
      } catch (err) {
        this.handleError(err, res);
      }
    });

    // Eliminar un envio_producto
    this.router.delete("/:id", verifyToken, async (req, res) => {
      try {
        const response = await axios.delete(
          `${ENVIOS_SERVICE}/envio-service/envio_producto/${req.params.id}`,
          { withCredentials: true, headers: { Cookie: req.headers.cookie } }
        );
        res.status(response.status).send(response.data);
      } catch (err) {
        this.handleError(err, res);
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
    res.status(500).send({ message: "Error al comunicarse con envios-service" });
  }
}

module.exports = EnvioProductoRoutes;
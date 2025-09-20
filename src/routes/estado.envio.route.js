const express = require("express");
const axios = require("axios");
const { ENVIOS_SERVICE } = require("../config/config.js");
const verifyToken = require("../middleware/auth.js");

class EstadoEnvioRoutes {
  constructor(app) {
    this.router = express.Router();
    this.registerRoutes();
    app.use("/api-gateway/estado_envio", this.router);
  }

  registerRoutes() {
    // Crear un nuevo estado de envío
    this.router.post("/", verifyToken, async (req, res) => {
      try {
        const response = await axios.post(
          `${ENVIOS_SERVICE}/envio-service/estado_envio`,
          req.body,
          { withCredentials: true, headers: { Cookie: req.headers.cookie } }
        );
        res.status(response.status).send(response.data);
      } catch (err) {
        this.handleError(err, res);
      }
    });

    // Obtener todos los estados de envío
    this.router.get("/", verifyToken, async (req, res) => {
      try {
        const response = await axios.get(
          `${ENVIOS_SERVICE}/envio-service/estado_envio`,
          { withCredentials: true, headers: { Cookie: req.headers.cookie } }
        );
        res.status(response.status).send(response.data);
      } catch (err) {
        this.handleError(err, res);
      }
    });

    // Obtener todos los estados de un envío específico
    this.router.get("/envio/:id_envio", verifyToken, async (req, res) => {
      try {
        const response = await axios.get(
          `${ENVIOS_SERVICE}/envio-service/estado_envio/envio/${req.params.id_envio}`,
          { withCredentials: true, headers: { Cookie: req.headers.cookie } }
        );
        res.status(response.status).send(response.data);
      } catch (err) {
        this.handleError(err, res);
      }
    });

    // Actualizar un estado de envío por id_estado
    this.router.put("/:id_estado", verifyToken, async (req, res) => {
      try {
        const response = await axios.put(
          `${ENVIOS_SERVICE}/envio-service/estado_envio/${req.params.id_estado}`,
          req.body,
          { withCredentials: true, headers: { Cookie: req.headers.cookie } }
        );
        res.status(response.status).send(response.data);
      } catch (err) {
        this.handleError(err, res);
      }
    });

    // Eliminar un estado de envío por id_estado
    this.router.delete("/:id_estado", verifyToken, async (req, res) => {
      try {
        const response = await axios.delete(
          `${ENVIOS_SERVICE}/envio-service/estado_envio/${req.params.id_estado}`,
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

module.exports = EstadoEnvioRoutes;
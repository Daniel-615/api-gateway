const express = require("express");
const axios = require("axios");
const { ENVIOS_SERVICE } = require("../config/config.js");
const verifyToken = require("../middleware/auth.js");

class EnvioRoutes {
  constructor(app) {
    this.router = express.Router();
    this.registerRoutes();
    app.use("/api-gateway/envio", this.router);
  }

  registerRoutes() {
    // Crear un nuevo envío
    this.router.post("/", verifyToken, async (req, res) => {
      try {
        const response = await axios.post(
          `${ENVIOS_SERVICE}/envio-service/envio`,
          req.body,
          { withCredentials: true, headers: { Cookie: req.headers.cookie } }
        );
        res.status(response.status).send(response.data);
      } catch (err) {
        this.handleError(err, res);
      }
    });

    // Obtener todos los envíos
    this.router.get("/", verifyToken, async (req, res) => {
      try {
        const response = await axios.get(
          `${ENVIOS_SERVICE}/envio-service/envio`,
          { withCredentials: true, headers: { Cookie: req.headers.cookie } }
        );
        res.status(response.status).send(response.data);
      } catch (err) {
        this.handleError(err, res);
      }
    });

    // Obtener un envío por número de guía
    this.router.get("/:numero_guia", verifyToken, async (req, res) => {
      try {
        const response = await axios.get(
          `${ENVIOS_SERVICE}/envio-service/envio/${req.params.numero_guia}`,
          { withCredentials: true, headers: { Cookie: req.headers.cookie } }
        );
        res.status(response.status).send(response.data);
      } catch (err) {
        this.handleError(err, res);
      }
    });

    // Actualizar un envío por número de guía
    this.router.put("/:numero_guia", verifyToken, async (req, res) => {
      try {
        const response = await axios.put(
          `${ENVIOS_SERVICE}/envio-service/envio/${req.params.numero_guia}`,
          req.body,
          { withCredentials: true, headers: { Cookie: req.headers.cookie } }
        );
        res.status(response.status).send(response.data);
      } catch (err) {
        this.handleError(err, res);
      }
    });

    // Eliminar un envío por id_envio
    this.router.delete("/:id_envio", verifyToken, async (req, res) => {
      try {
        const response = await axios.delete(
          `${ENVIOS_SERVICE}/envio-service/envio/${req.params.id_envio}`,
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

module.exports = EnvioRoutes;
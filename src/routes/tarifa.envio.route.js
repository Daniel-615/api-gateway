const express = require("express");
const axios = require("axios");
const { ENVIOS_SERVICE } = require("../config/config.js");
const verifyToken = require("../middleware/auth.js");

class TarifaEnvioRoutes {
  constructor(app) {
    this.router = express.Router();
    this.registerRoutes();
    app.use("/api-gateway/tarifa_envio", this.router);
  }

  registerRoutes() {
    // Crear una nueva tarifa de envío
    this.router.post("/", verifyToken, async (req, res) => {
      try {
        const response = await axios.post(
          `${ENVIOS_SERVICE}/envio-service/tarifa_envio`,
          req.body,
          { withCredentials: true, headers: { Cookie: req.headers.cookie } }
        );
        res.status(response.status).send(response.data);
      } catch (err) {
        this.handleError(err, res);
      }
    });
    this.router.post("/calcular", verifyToken, async (req, res) => {
      try {
        const response = await axios.post(
          `${ENVIOS_SERVICE}/envio-service/tarifa_envio/calcular`,
          req.body,
          {
            withCredentials: true,
            headers: {
              Cookie: req.headers.cookie || "",
              Authorization: req.headers.authorization || "", 
              "Content-Type": "application/json",
            },
          }
        );
        res.status(response.status).send(response.data);
      } catch (err) {
        this.handleError(err, res);
      }
    });


    // Obtener todas las tarifas de envío
    this.router.get("/", verifyToken, async (req, res) => {
      try {
        const response = await axios.get(
          `${ENVIOS_SERVICE}/envio-service/tarifa_envio`,
          { withCredentials: true, headers: { Cookie: req.headers.cookie } }
        );
        res.status(response.status).send(response.data);
      } catch (err) {
        this.handleError(err, res);
      }
    });

    // Obtener una tarifa de envío por ID
    this.router.get("/:id", verifyToken, async (req, res) => {
      try {
        const response = await axios.get(
          `${ENVIOS_SERVICE}/envio-service/tarifa_envio/${req.params.id}`,
          { withCredentials: true, headers: { Cookie: req.headers.cookie } }
        );
        res.status(response.status).send(response.data);
      } catch (err) {
        this.handleError(err, res);
      }
    });

    // Actualizar una tarifa de envío
    this.router.put("/:id", verifyToken, async (req, res) => {
      try {
        const response = await axios.put(
          `${ENVIOS_SERVICE}/envio-service/tarifa_envio/${req.params.id}`,
          req.body,
          { withCredentials: true, headers: { Cookie: req.headers.cookie } }
        );
        res.status(response.status).send(response.data);
      } catch (err) {
        this.handleError(err, res);
      }
    });

    // Eliminar una tarifa de envío
    this.router.delete("/:id", verifyToken, async (req, res) => {
      try {
        const response = await axios.delete(
          `${ENVIOS_SERVICE}/envio-service/tarifa_envio/${req.params.id}`,
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

module.exports = TarifaEnvioRoutes;
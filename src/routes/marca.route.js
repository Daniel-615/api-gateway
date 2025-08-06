const express = require("express");
const axios = require("axios");
const { PRODUCTO_SERVICE } = require("../config/config.js");
const verifyToken = require("../middleware/auth.js");
const { checkPermisosDesdeRoles } = require("../middleware/checkRole.js");

class MarcaRoutes {
  constructor(app) {
    this.router = express.Router();
    this.registerRoutes();
    app.use("/api-gateway/marca", this.router);
  }

  registerRoutes() {
    // Crear marca
    this.router.post("/", verifyToken, checkPermisosDesdeRoles(["crear_marca"]), async (req, res) => {
      try {
        const response = await axios.post(`${PRODUCTO_SERVICE}/producto-service/marca`, req.body, {
          withCredentials: true,
          headers: { Cookie: req.headers.cookie },
        });
        res.status(response.status).send(response.data);
      } catch (err) {
        console.error("Error al crear marca:", err.message);
        res.status(500).send({ message: "Error al comunicarse con producto-service" });
      }
    });

    // Obtener todas las marcas
    this.router.get("/", verifyToken, checkPermisosDesdeRoles(["ver_marcas"]), async (req, res) => {
      try {
        const response = await axios.get(`${PRODUCTO_SERVICE}/producto-service/marca`, {
          withCredentials: true,
          headers: { Cookie: req.headers.cookie },
        });
        res.status(response.status).send(response.data);
      } catch (err) {
        console.error("Error al obtener marcas:", err.message);
        res.status(500).send({ message: "Error al comunicarse con producto-service" });
      }
    });

    // Obtener marca por ID
    this.router.get("/:id", verifyToken, checkPermisosDesdeRoles(["ver_marca"]), async (req, res) => {
      try {
        const response = await axios.get(`${PRODUCTO_SERVICE}/producto-service/marca/${req.params.id}`, {
          withCredentials: true,
          headers: { Cookie: req.headers.cookie },
        });
        res.status(response.status).send(response.data);
      } catch (err) {
        console.error("Error al obtener marca:", err.message);
        res.status(500).send({ message: "Error al comunicarse con producto-service" });
      }
    });

    // Actualizar marca
    this.router.put("/:id", verifyToken, checkPermisosDesdeRoles(["actualizar_marca"]), async (req, res) => {
      try {
        const response = await axios.put(`${PRODUCTO_SERVICE}/producto-service/marca/${req.params.id}`, req.body, {
          withCredentials: true,
          headers: { Cookie: req.headers.cookie },
        });
        res.status(response.status).send(response.data);
      } catch (err) {
        console.error("Error al actualizar marca:", err.message);
        res.status(500).send({ message: "Error al comunicarse con producto-service" });
      }
    });

    // Eliminar marca
    this.router.delete("/:id", verifyToken, checkPermisosDesdeRoles(["eliminar_marca"]), async (req, res) => {
      try {
        const response = await axios.delete(`${PRODUCTO_SERVICE}/producto-service/marca/${req.params.id}`, {
          withCredentials: true,
          headers: { Cookie: req.headers.cookie },
        });
        res.status(response.status).send(response.data);
      } catch (err) {
        console.error("Error al eliminar marca:", err.message);
        res.status(500).send({ message: "Error al comunicarse con producto-service" });
      }
    });
  }
}

module.exports = MarcaRoutes;

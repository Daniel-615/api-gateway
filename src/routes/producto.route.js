const express = require("express");
const axios = require("axios");
const { PRODUCTO_SERVICE } = require("../config/config.js");
const verifyToken = require("../middleware/auth.js");
const { checkPermisosDesdeRoles } = require("../middleware/checkRole.js");

class ProductoRoutes {
    constructor(app) {
        this.router = express.Router();
        this.registerRoutes();
        app.use("/api-gateway/product", this.router);
    }

    registerRoutes() {
        // Crear un producto
        this.router.post("/", verifyToken, checkPermisosDesdeRoles(["crear_productos"]), async (req, res) => {
            try {
                const response = await axios.post(
                    `${PRODUCTO_SERVICE}/producto-service/producto`,
                    req.body,
                    {
                        withCredentials: true,
                        headers: { Cookie: req.headers.cookie }
                    }
                );
                res.status(response.status).send(response.data);
            } catch (err) {
                res.status(500).send({ message: "Error al comunicarse con producto-service" });
            }
        });

        // Obtener todos los productos
        this.router.get("/", verifyToken, checkPermisosDesdeRoles(["ver_productos"]), async (req, res) => {
            try {
                const response = await axios.get(
                    `${PRODUCTO_SERVICE}/producto-service/producto`,
                    {
                        withCredentials: true,
                        headers: { Cookie: req.headers.cookie }
                    }
                );
                res.status(response.status).send(response.data);
            } catch (err) {
                console.log(err.response.data)
                res.status(500).send({ message: "Error al comunicarse con producto-service" });
            }
        });

        // Obtener producto por ID
        this.router.get("/:id", verifyToken, checkPermisosDesdeRoles(["ver_productos"]), async (req, res) => {
            try {
                const response = await axios.get(
                    `${PRODUCTO_SERVICE}/producto-service/producto/${req.params.id}`,
                    {
                        withCredentials: true,
                        headers: { Cookie: req.headers.cookie }
                    }
                );
                res.status(response.status).send(response.data);
            } catch (err) {
                res.status(500).send({ message: "Error al comunicarse con producto-service" });
            }
        });

        // Actualizar producto
        this.router.put("/:id", verifyToken, checkPermisosDesdeRoles(["editar_productos"]), async (req, res) => {
            try {
                const response = await axios.put(
                    `${PRODUCTO_SERVICE}/producto-service/producto/${req.params.id}`,
                    req.body,
                    {
                        withCredentials: true,
                        headers: { Cookie: req.headers.cookie }
                    }
                );
                res.status(response.status).send(response.data);
            } catch (err) {
                res.status(500).send({ message: "Error al comunicarse con producto-service" });
            }
        });

        // Eliminar producto
        this.router.delete("/:id", verifyToken, checkPermisosDesdeRoles(["eliminar_productos"]), async (req, res) => {
            try {
                const response = await axios.delete(
                    `${PRODUCTO_SERVICE}/producto-service/producto/${req.params.id}`,
                    {
                        withCredentials: true,
                        headers: { Cookie: req.headers.cookie }
                    }
                );
                res.status(response.status).send(response.data);
            } catch (err) {
                res.status(500).send({ message: "Error al comunicarse con producto-service" });
            }
        });
    }
}

module.exports = ProductoRoutes;

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
                this.handleError(err,res);
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
                this.handleError(err,res);
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
                this.handleError(err,res);
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
                this.handleError(err,res);
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
        res.status(500).send({ message: "Error al comunicarse con producto-service" });
    }
}

module.exports = ProductoRoutes;

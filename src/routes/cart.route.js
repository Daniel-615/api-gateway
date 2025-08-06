const express = require("express");
const axios = require("axios");
const { WISHLIST_SERVICE } = require("../config/config.js");
const verifyToken = require("../middleware/auth.js");
const { checkPermisosDesdeRoles } = require("../middleware/checkRole.js");

class CartRoutes {
  constructor(app) {
    this.router = express.Router();
    this.registerRoutes();
    app.use("/api-gateway/cart", this.router);
  }

  registerRoutes() {
    // Agregar producto al carrito
    this.router.post(
      "/",
      verifyToken,
      checkPermisosDesdeRoles(["agregar_carrito"]),
      async (req, res) => {
        try {
          const response = await axios.post(
            `${WISHLIST_SERVICE}/cart-wishlist-service/cart`,
            req.body,
            {
              withCredentials: true,
              headers: { Cookie: req.headers.cookie },
            }
          );
          res.status(response.status).send(response.data);
        } catch (err) {
          this.handleError(err, res);
        }
      }
    );

    // Obtener carrito de un usuario
    this.router.get(
      "/:user_id",
      verifyToken,
      checkPermisosDesdeRoles(["ver_carrito"]),
      async (req, res) => {
        try {
          const response = await axios.get(
            `${WISHLIST_SERVICE}/cart-wishlist-service/cart/${req.params.user_id}`,
            {
              withCredentials: true,
              headers: { Cookie: req.headers.cookie },
            }
          );
          res.status(response.status).send(response.data);
        } catch (err) {
          this.handleError(err, res);
        }
      }
    );

    // Actualizar cantidad de un producto en el carrito
    this.router.put(
      "/:user_id/:product_id",
      verifyToken,
      checkPermisosDesdeRoles(["editar_carrito"]),
      async (req, res) => {
        try {
          const response = await axios.put(
            `${WISHLIST_SERVICE}/cart-wishlist-service/cart/${req.params.user_id}/${req.params.product_id}`,
            req.body,
            {
              withCredentials: true,
              headers: { Cookie: req.headers.cookie },
            }
          );
          res.status(response.status).send(response.data);
        } catch (err) {
          this.handleError(err, res);
        }
      }
    );

    // Eliminar producto del carrito
    this.router.delete(
      "/:user_id/:product_id",
      verifyToken,
      checkPermisosDesdeRoles(["eliminar_item_carrito"]),
      async (req, res) => {
        try {
          const response = await axios.delete(
            `${WISHLIST_SERVICE}/cart-wishlist-service/cart/${req.params.user_id}/${req.params.product_id}`,
            {
              withCredentials: true,
              headers: { Cookie: req.headers.cookie },
            }
          );
          res.status(response.status).send(response.data);
        } catch (err) {
          this.handleError(err, res);
        }
      }
    );

    // Vaciar carrito completo
    this.router.delete(
      "/clear/:user_id",
      verifyToken,
      checkPermisosDesdeRoles(["vaciar_carrito"]),
      async (req, res) => {
        try {
          const response = await axios.delete(
            `${WISHLIST_SERVICE}/cart-wishlist-service/cart/clear/${req.params.user_id}`,
            {
              withCredentials: true,
              headers: { Cookie: req.headers.cookie },
            }
          );
          res.status(response.status).send(response.data);
        } catch (err) {
          this.handleError(err, res);
        }
      }
    );
  }

  handleError(err, res) {
    if (err.response) {
      const errorMessage =
        err.response.data?.message || "Error desconocido al procesar la solicitud.";
      return res
        .status(err.response.status)
        .send({ success: false, error: errorMessage });
    }
    res.status(500).send({ message: "Error al comunicarse con cart-service" });
  }
}

module.exports = CartRoutes;

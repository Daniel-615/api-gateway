const express = require("express");
const axios = require("axios");
const { WISHLIST_SERVICE } = require("../config/config.js");
const verifyToken = require("../middleware/auth.js");
const { checkPermisosDesdeRoles } = require("../middleware/checkRole.js");

class WishListRoutes {
  constructor(app) {
    this.router = express.Router();
    this.registerRoutes();
    app.use("/api-gateway/wishlist", this.router);
  }

  registerRoutes() {
    // Agregar producto a la wishlist
    this.router.post(
      "/",
      verifyToken,
      checkPermisosDesdeRoles(["agregar_wishlist"]),
      async (req, res) => {
        try {
          const response = await axios.post(
            `${WISHLIST_SERVICE}/producto-service/wishlist`,
            req.body,
            {
              withCredentials: true,
              headers: { Cookie: req.headers.cookie }
            }
          );
          res.status(response.status).send(response.data);
        } catch (err) {
          this.handleError(err, res);
        }
      }
    );

    // Obtener wishlist de un usuario
    this.router.get(
      "/:user_id",
      verifyToken,
      checkPermisosDesdeRoles(["ver_wishlist"]),
      async (req, res) => {
        try {
          const response = await axios.get(
            `${WISHLIST_SERVICE}/producto-service/wishlist/${req.params.user_id}`,
            {
              withCredentials: true,
              headers: { Cookie: req.headers.cookie }
            }
          );
          res.status(response.status).send(response.data);
        } catch (err) {
          this.handleError(err, res);
        }
      }
    );

    // Eliminar un producto de la wishlist
    this.router.delete(
      "/:user_id/:product_id",
      verifyToken,
      checkPermisosDesdeRoles(["eliminar_item_wishlist"]),
      async (req, res) => {
        try {
          const response = await axios.delete(
            `${WISHLIST_SERVICE}/producto-service/wishlist/${req.params.user_id}/${req.params.product_id}`,
            {
              withCredentials: true,
              headers: { Cookie: req.headers.cookie }
            }
          );
          res.status(response.status).send(response.data);
        } catch (err) {
          this.handleError(err, res);
        }
      }
    );

    // Vaciar wishlist completa del usuario
    this.router.delete(
      "/clear/:user_id",
      verifyToken,
      checkPermisosDesdeRoles(["vaciar_wishlist"]),
      async (req, res) => {
        try {
          const response = await axios.delete(
            `${WISHLIST_SERVICE}/producto-service/wishlist/clear/${req.params.user_id}`,
            {
              withCredentials: true,
              headers: { Cookie: req.headers.cookie }
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
    res.status(500).send({ message: "Error al comunicarse con wishlist-service" });
  }
}

module.exports = WishListRoutes;

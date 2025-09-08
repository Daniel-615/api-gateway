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
    this.router.post(
      "/share/:userId",
      verifyToken,
      checkPermisosDesdeRoles(["agregar_wishlist"]),
      async (req, res) => {
        try {
          const response = await axios.post(
            `${WISHLIST_SERVICE}/cart-wishlist-service/wishlist/share/${req.params.userId}`,
            // body: { expiresInHours, forceRefresh }
            req.body,
            {
              withCredentials: true,
              headers: {
                Cookie: req.headers.cookie || "",
                "Content-Type": "application/json",
              },
            }
          );
          return res.status(response.status).send(response.data);
        } catch (err) {
          this.handleError(err, res, "generar/renovar el enlace público de la wishlist");
        }
      }
    );

  // PRIVADA
    this.router.delete(
      "/share/:userId",
      verifyToken,
      checkPermisosDesdeRoles(["agregar_wishlist"]),
      async (req, res) => {
        try {
          const response = await axios.delete(
            `${WISHLIST_SERVICE}/cart-wishlist-service/wishlist/share/${req.params.userId}`,
            {
              withCredentials: true,
              headers: {
                Cookie: req.headers.cookie || "",
              },
            }
          );
          return res.status(response.status).send(response.data);
        } catch (err) {
          this.handleError(err, res, "revocar el enlace público de la wishlist");
        }
      }
    );

  // URL PÚBLICA
    this.router.get(
      "/shared/:shareId",
      async (req, res) => {
        try {
          const response = await axios.get(
            `${WISHLIST_SERVICE}/cart-wishlist-service/wishlist/shared/${req.params.shareId}`
          );
          return res.status(response.status).send(response.data);
        } catch (err) {
          this.handleError(err, res, "obtener la wishlist pública");
        }
      }
    );
    // Agregar producto a la wishlist
    this.router.post(
      "/",
      verifyToken,
      checkPermisosDesdeRoles(["agregar_wishlist"]),
      async (req, res) => {
        try {
          const response = await axios.post(
            `${WISHLIST_SERVICE}/cart-wishlist-service/wishlist`,
            req.body,
            {
              withCredentials: true,
              headers: {
                Cookie: req.headers.cookie || "",
                "Content-Type": "application/json"
              }
            }
          );
          return res.status(response.status).send(response.data);
        } catch (err) {
          this.handleError(err, res, "agregar producto a la wishlist");
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
            `${WISHLIST_SERVICE}/cart-wishlist-service/wishlist/${req.params.user_id}`,
            {
              withCredentials: true,
              headers: {
                Cookie: req.headers.cookie || ""
              }
            }
          );
          
          return res.status(response.status).send(response.data);
        } catch (err) {
          this.handleError(err, res, "obtener la wishlist");
        }
      }
    );
    this.router.delete(
      "/clear/:user_id",
      verifyToken,
      checkPermisosDesdeRoles(["vaciar_wishlist"]),
      async (req, res) => {
        try {
          const response = await axios.delete(
            `${WISHLIST_SERVICE}/cart-wishlist-service/wishlist/clear/${req.params.user_id}`,
            {
              withCredentials: true,
              headers: {
                Cookie: req.headers.cookie || ""
              }
            }
          );
          return res.status(response.status).send(response.data);
        } catch (err) {
          this.handleError(err, res, "vaciar la wishlist");
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
            `${WISHLIST_SERVICE}/cart-wishlist-service/wishlist/${req.params.user_id}/${req.params.product_id}`,
            {
              withCredentials: true,
              headers: {
                Cookie: req.headers.cookie || ""
              }
            }
          );
          return res.status(response.status).send(response.data);
        } catch (err) {
          this.handleError(err, res, "eliminar producto de la wishlist");
        }
      }
    );
  }
  handleError(err, res, contexto = "procesar la solicitud") {
    if (err.response) {
      const status = err.response.status || 500;
      const message =
        err.response.data?.message ||
        `Error desconocido al ${contexto}.`;

      return res.status(status).send({
        success: false,
        error: message
      });
    }

    res.status(500).send({
      success: false,
      error: `Error interno al ${contexto}.`
    });
  }
}

module.exports = WishListRoutes;

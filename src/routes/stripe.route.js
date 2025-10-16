const express = require("express");
const axios = require("axios");
const { STRIPE_SERVICE } = require("../config/config.js");
const verifyToken = require("../middleware/auth.js");
const { checkPermisosDesdeRoles } = require("../middleware/checkRole.js");

class StripeRoutes {
  constructor(app) {
    this.router = express.Router();
    this.registerRoutes();
    app.use("/api-gateway/stripe", this.router);
  }

  registerRoutes() {
    // Crea la sesión de checkout con todos los datos necesarios
    this.router.post(
      "/checkout",
      verifyToken,
      checkPermisosDesdeRoles(["pago_stripe"]),
      async (req, res) => {
        try {
          const {
            items,
            nit,
            direccion_destino,
            costo_envio,
            fecha_estimada,
          } = req.body || {};

          const userId = req.user?.id;

          if (!userId) {
            return res.status(400).json({ error: "No se encontró userId en el token." });
          }

          console.log("[gateway/stripe] Payload recibido del frontend =>", {
            userId,
            nit,
            direccion_destino,
            costo_envio,
            fecha_estimada,
            items_count: Array.isArray(items) ? items.length : 0,
          });

          // Enviar todos los datos al servicio de Stripe
          const resp = await axios.post(
            `${STRIPE_SERVICE}/api/payment/create-checkout-session`,
            {
              userId,
              nit,
              items,
              direccion_destino,
              costo_envio,
              fecha_estimada,
            },
            { timeout: 10000 }
          );

          return res.status(200).json(resp.data);
        } catch (err) {
          console.error(
            "[gateway/stripe] Error al crear checkout:",
            err?.response?.data || err.message
          );
          return res.status(500).json({ error: "No se pudo iniciar el pago." });
        }
      }
    );
  }
}

module.exports = StripeRoutes;

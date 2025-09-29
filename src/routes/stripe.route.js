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
    // Crea la sesión de checkout
    this.router.post(
      "/checkout",
      verifyToken,
      checkPermisosDesdeRoles(["pago_stripe"]),
      async (req, res) => {
        try {
          const items = req.body?.items || [];
          const userId = req.user?.id; 

          const resp = await axios.post(
            `${STRIPE_SERVICE}/api/payment/create-checkout-session`,
            { items, userId },
            { timeout: 10000 }
          );

          return res.status(200).json(resp.data);
        } catch (err) {
          console.error("Gateway/stripe/checkout error:", err?.response?.data || err.message);
          return res.status(500).json({ error: "No se pudo iniciar el pago" });
        }
      }
    );
  }
}

module.exports = StripeRoutes;
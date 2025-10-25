const express = require("express");
const axios = require("axios");
const { PRODUCTO_SERVICE } = require("../config/config.js");
const verifyToken = require("../middleware/auth.js");
const { checkPermisosDesdeRoles } = require("../middleware/checkRole.js");
class InvocarRoutes{
    constructor(app){
        this.router=express.Router();
        this.registerRoutes();
        app.use("/api-gateway/invocar",this.router);
    }
    registerRoutes(){
        this.router.patch('/:usuarioId',
            verifyToken,
            checkPermisosDesdeRoles(["modificar_estado_invocacion"]),
            async(req,res)=>{
                try{
                    const response=await axios.patch(
                        `${PRODUCTO_SERVICE}/producto-service/invocar/${req.params.usuarioId}`,
                        req.body,
                        {
                            withCredentials:true,
                        }
                    );
                    return res.status(response.status).send(response.data);
                }catch(err){
                    this.handleError(err,res,"modificar estado de invocación del producto-service");
                }
            }
        )
        this.router.get(
            "/:usuario_id",
            verifyToken,
            checkPermisosDesdeRoles(["ver_estado_invocacion"]),
            async(req,res)=>{
                try{
                    const response=await axios.get(
                        `${PRODUCTO_SERVICE}/producto-service/invocar/${req.params.usuario_id}`,
                        {
                            withCredentials:true,
                        }
                    );
                    return res.status(response.status).send(response.data);
                }catch(err){
                    this.handleError(err,res,"obtener estado de invocación del producto-service");
                }
            }
        );
    }
}
module.exports=InvocarRoutes;
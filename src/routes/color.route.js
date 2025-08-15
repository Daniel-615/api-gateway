const express=require("express");
const axios=require("axios");
const {PRODUCTO_SERVICE}= require("../config/config.js")
const verifyToken=require("../middleware/auth.js")
const {checkPermisosDesdeRoles}= require("../middleware/checkRole.js")
class ColorRoutes{
    constructor(app){
        this.router=express.Router();
        this.registerRoutes();
        app.use("/api-gateway/color",this.router);
    }
    registerRoutes(){
        this.router.post(
            "/",
            verifyToken,
            checkPermisosDesdeRoles(["agregar_color"]),
            async(req,res)=>{
                try{
                    const response=await axios.post(
                        `${PRODUCTO_SERVICE}/producto-service/color`,
                        req.body,
                        {
                            withCredentials: true,
                            headers: {
                                "Content-Type": "application/json"
                            }
                        }
                    )
                    return res
                        .status(response.status)
                        .send(response.data)
                }catch(err){
                    this.handleError(err,res,"crear color en producto-service")
                }
            }
        )
        this.router.get(
            "/",
            verifyToken,
            checkPermisosDesdeRoles(["obtener_colores"]),
            async(req,res)=>{
                try{
                    const response=await axios.get(
                        `${PRODUCTO_SERVICE}/producto-service/color`,
                        {
                            withCredentials: true
                        }
                    )
                    return res
                        .status(response.status) //envia el estado del servico
                        .send(response.data) //envia la data del servicio
                }catch(err){
                    this.handleError(err,res,"obtener colores del producto-service")
                }
            }
        )
        this.router.get(
            "/:color_id",
            verifyToken,
            checkPermisosDesdeRoles(["obtener_color"]),
            async(req,res)=>{
                try{
                    const response=await axios.get(
                        `${PRODUCTO_SERVICE}/producto-service/color/${req.params.color_id}`,
                        {
                            withCredentials: true
                        }
                    )
                    return res.status(response.status).send(response.data)
                }catch(err){
                    this.handleError(err,res,"obtener color del producto-service")
                }
            }
        )
        this.router.put(
            "/:color_id",
            verifyToken,
            checkPermisosDesdeRoles(["actualizar_color"]),
            async(req,res)=>{
                try{
                    const response=await axios.put(
                       `${PRODUCTO_SERVICE}/producto-service/color/${req.params.color_id}`,
                       req.body,
                       {
                        withCredentials: true
                       } 
                    )
                    return res
                        .status(response.status)
                        .send(response.data)
                }catch(err){
                    this.handleError(err,res,"actualizar color de producto-service")
                }
            }
        )
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
        return res.status(500).send({
            success: false,
            error: `Error interno al ${contexto}.`
        });
    }
}
module.exports= ColorRoutes;
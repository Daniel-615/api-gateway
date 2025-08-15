const express= require("express")
const axios=require("axios")
const {PRODUCTO_SERVICE}= require("../config/config.js")
const verifyToken= require("../middleware/auth.js")
const { checkPermisosDesdeRoles}= require("../middleware/checkRole.js")
class TallaRoutes{
    constructor(app){
        this.router=express.Router();
        this.registerRoutes();
        app.use("/api-gateway/talla",this.router);
    }
    registerRoutes(){
        this.router.post("/",
            verifyToken,
            checkPermisosDesdeRoles(["agregar_talla"]),
            async(req,res)=>{
                try{
                    const response=await axios.post(
                        `${PRODUCTO_SERVICE}/producto-service/talla`,
                        req.body,
                        {
                            withCredentials: true,
                            headers:{
                                "Content-Type": "application/json"
                            }
                        }
                    )
                    res.status(response.status).send(response.data);
                }catch(err){
                    this.handleError(err,res,"agregar talla al producto-service")
                }
            }
        )
        this.router.get("/:talla_id",verifyToken,checkPermisosDesdeRoles(["ver_tallas"]),
            async (req,res)=>{
                try{
                    const response=await axios.get(
                    `${PRODUCTO_SERVICE}/producto-service/talla/${req.params.talla_id}`,
                        {
                            withCredentials: true
                        }
                    );
                    res.status(response.status).send(response.data);
                }catch(err){
                    this.handleError(err,res,"obtener talla del producto-service")
                }
            }
        );
        this.router.get("/",verifyToken,checkPermisosDesdeRoles(["ver_tallas"]),
            async(req,res)=>{
                try{
                    const response=await axios.get(
                        `${PRODUCTO_SERVICE}/producto-service/talla`,
                        {
                            withCredentials: true
                        }
                    )
                    res.status(response.status).send(response.data);
                }catch(err){
                    this.handleError(err,res,"obtener tallas del producto-service")
                }
            }
        )
        this.router.put("/:talla_id",verifyToken,checkPermisosDesdeRoles(["actualizar_talla"]),
            async(req,res)=>{
                try{
                    const response=await axios.put(
                       `${PRODUCTO_SERVICE}/producto-service/talla/${req.params.talla_id}`, 
                       req.body
                    )
                    res.status(response.status).send(response.data);
                }catch(err){
                    this.handleError(err,res,"actualizar talla del producto-service")
                }
            }
        )
        this.router.delete("/:talla_id",verifyToken,checkPermisosDesdeRoles(["eliminar_talla"]),
            async(req,res)=>{
                try{
                    const response=await axios.delete(
                        `${PRODUCTO_SERVICE}/producto-service/talla/${req.params.talla_id}`,
                        {
                            withCredentials:true
                        }
                    )
                    res.status(response.status).send(response.data);
                }catch(err){
                    this.handleError(err,res,"eliminar talla del producto-service")
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

        res.status(500).send({
            success: false,
            error: `Error interno al ${contexto}.`
        });
    }
}

module.exports= TallaRoutes;
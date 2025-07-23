const checkPermisosDesdeToken = (permisosRequeridos) => {
  return (req, res, next) => {
    const permisosUsuario = req.user.permisos || [];

    const tienePermisos = permisosRequeridos.every(p => permisosUsuario.includes(p));

    if (!tienePermisos) {
      return res.status(403).json({ message: "No tienes permiso para acceder a esta ruta." });
    }

    next();
  };
};

module.exports = {
  checkPermisosDesdeRoles: checkPermisosDesdeToken
};

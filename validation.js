
// Validación de Acceso por Cookies
const loggerMiddleware = (req, res, next) => {
  if (req.cookies.accessToken) {
    next()
  } else {
    res.redirect('/login.html')
  }
};

module.exports = loggerMiddleware;

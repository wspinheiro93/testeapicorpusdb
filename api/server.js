// See https://github.com/typicode/json-server#module
const jsonServer = require("json-server");
const auth = require("basic-auth");
require("dotenv").config();

const server = jsonServer.create();

// Middleware de autenticação
function authenticate(req, res, next) {
  const user = auth(req);

  if (
    !user ||
    user.name !== process.env.AUTH_USER ||
    user.pass !== process.env.AUTH_PASS
  ) {
    res.set("WWW-Authenticate", 'Basic realm="Access to the API"');
    return res.status(401).json({ message: "Authentication required" });
  }

  next();
}

// Middlewares padrão
const middlewares = jsonServer.defaults();
server.use(middlewares);

// Middleware de autenticação antes das rotas
server.use(authenticate);

// Reescrita de rotas
server.use(
  jsonServer.rewriter({
    "/api/*": "/$1",
    "/blog/:resource/:id/show": "/:resource/:id",
  })
);

// Router para o arquivo JSON
const router = jsonServer.router("db.json");
server.use(router);

// Inicialização do servidor
server.listen(3000, () => {
  console.log("JSON Server is running");
});

// Export do servidor
module.exports = server;

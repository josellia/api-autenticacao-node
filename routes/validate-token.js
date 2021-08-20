import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  const token = req.header("auth-token");

  if (!token) {
    res.status(400).json({
      error: "Acesso negado",
    });
  }
  try {
    const verify = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verify;
    next();
  } catch (error) {
    res.status(400).json({
      error: "Token inválido",
    });
  }
};

export default verifyToken;

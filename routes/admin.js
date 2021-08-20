import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    error: null,
    data: {
      title: "Rota protegida",
      use: req.user,
    },
  });
});

export default router;

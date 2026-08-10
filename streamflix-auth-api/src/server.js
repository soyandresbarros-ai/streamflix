import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { supabase } from "./config/supabaseClient.js";
import { crearAuthRoutes } from "./routes/authRoutes.js";

dotenv.config();

const app = express();
const PUERTO = process.env.PORT || 3000;


app.use(cors());
app.use(express.json()); 

app.get("/api/health", (_req, res) => {
  res.status(200).json({ ok: true, mensaje: "Servicio de autenticación en linea." });
});

app.use("/api/auth", crearAuthRoutes(supabase));

app.use((_req, res) => {
  res.status(404).json({ ok: false, error: "Recurso no encontrado." });
});

app.listen(PUERTO, () => {
  console.log(`Servicio de autenticacion escuchando en http://localhost:${PUERTO}`);
});

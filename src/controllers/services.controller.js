import Service from "../models/service.model.js";
import Request from "../models/request.model.js";

// Obtener todos los servicios
export const getAllServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener los servicios" });
  }
};

// Buscar por categoría o nombre
export const searchServices = async (req, res) => {
  try {
    const { q, categoria } = req.query;
    const filtro = {};

    if (categoria && categoria !== "Todos") {
      filtro.categoria = categoria;
    }
    if (q) {
      filtro.nombre = { $regex: q, $options: "i" }; // búsqueda parcial
    }

    const services = await Service.find(filtro);
    res.json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error en la búsqueda" });
  }
};

// Obtener servicios destacados
export const getHighlightedServices = async (req, res) => {
  try {
    const destacados = await Service.find({ destacado: true });
    res.json(destacados);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener los destacados" });
  }
};
// Obtener detalle de un servicio
export const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const servicio = await Service.findById(id);
    if (!servicio) return res.status(404).json({ mensaje: "Servicio no encontrado" });
    res.json(servicio);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener el servicio" });
  }
};

// Crear solicitud de contratación
export const createServiceRequest = async (req, res) => {
  try {
    const { id } = req.params; // ID del servicio
    const { cliente, mensaje } = req.body;

    const servicio = await Service.findById(id);
    if (!servicio) return res.status(404).json({ mensaje: "Servicio no encontrado" });

    const nuevaSolicitud = new Request({
      servicio: id,
      cliente,
      mensaje,
    });

    await nuevaSolicitud.save();

    res.status(201).json({
      mensaje: "Solicitud enviada correctamente",
      solicitud: nuevaSolicitud,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al crear la solicitud" });
  }
};
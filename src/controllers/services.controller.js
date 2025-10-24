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

//Eliminar un servicio
export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const servicioEliminado = await Service.findByIdAndDelete(id);

    if (!servicioEliminado) {
      return res.status(404).json({ mensaje: "Servicio no encontrado" });
    }

    res.json({ mensaje: "Servicio eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error en deleteService:", error);
    res.status(500).json({ mensaje: "Error al eliminar el servicio" });
  }
};
// Cambiar disponibilidad del servicio
export const toggleAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const servicio = await Service.findById(id);

    if (!servicio) {
      return res.status(404).json({ mensaje: "Servicio no encontrado" });
    }

    // Cambiar disponibilidad
    servicio.disponible = !servicio.disponible;
    await servicio.save();

    res.json({
      mensaje: `El servicio ahora está ${servicio.disponible ? "disponible" : "no disponible"}`,
      servicio,
    });
  } catch (error) {
    console.error("❌ Error en toggleAvailability:", error);
    res.status(500).json({ mensaje: "Error al cambiar disponibilidad" });
  }
};

// AGREGAR RESEÑA Y CALIFICAION

export const addReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { usuario, comentario, calificacion } = req.body;

    const servicio = await Service.findById(id);
    if (!servicio) {
      return res.status(404).json({ mensaje: "Servicio no encontrado" });
    }

    // Agregar nueva reseña
    servicio.reseñas.push({ usuario, comentario, calificacion });

    // Actualizar número de opiniones
    servicio.opiniones = servicio.reseñas.length;

    // Recalcular calificación promedio
    const total = servicio.reseñas.reduce((acc, r) => acc + r.calificacion, 0);
    servicio.calificacion = (total / servicio.reseñas.length).toFixed(1);

    await servicio.save();

    res.json({
      mensaje: "Reseña agregada correctamente",
      servicio,
    });
  } catch (error) {
    console.error("❌ Error en addReview:", error);
    res.status(500).json({ mensaje: "Error al agregar reseña" });
  }
};

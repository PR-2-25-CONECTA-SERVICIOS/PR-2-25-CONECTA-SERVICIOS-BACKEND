import Request from "../models/request.model.js";

// Obtener todo el historial de un usuario
export const getUserHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    const history = await Request.find({ cliente: userId })
      .populate("servicio", "nombre categoria precio imagen")
      .sort({ createdAt: -1 });

    if (!history.length) {
      return res.status(404).json({ mensaje: "No hay solicitudes registradas" });
    }

    res.json(history);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener el historial" });
  }
};

// Calificar un servicio finalizado
export const rateService = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { calificacion, comentario } = req.body;

    const solicitud = await Request.findById(requestId);
    if (!solicitud) return res.status(404).json({ mensaje: "Solicitud no encontrada" });

    solicitud.calificacion = calificacion;
    solicitud.comentario = comentario;
    solicitud.estado = "finalizado";
    await solicitud.save();

    res.json({ mensaje: "Servicio calificado correctamente", solicitud });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al calificar el servicio" });
  }
};

// Repetir un servicio (crear nueva solicitud igual a una anterior)
export const repeatService = async (req, res) => {
  try {
    const { requestId } = req.params;
    const prev = await Request.findById(requestId);
    if (!prev) return res.status(404).json({ mensaje: "Solicitud anterior no encontrada" });

    const nueva = new Request({
      servicio: prev.servicio,
      cliente: prev.cliente,
      proveedor: prev.proveedor,
      descripcion: prev.descripcion,
      precio: prev.precio,
      categoria: prev.categoria,
      estado: "pendiente",
      imagen: prev.imagen,
    });
    await nueva.save();

    res.status(201).json({ mensaje: "Nueva solicitud creada correctamente", nueva });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al repetir servicio" });
  }
};

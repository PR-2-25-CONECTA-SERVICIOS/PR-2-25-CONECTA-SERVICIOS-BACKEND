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

    const servicio = await Service.findById(id)
      .populate("reseñas.usuario", "nombre avatar correo")
      .populate("propietarioId", "nombre telefono correo avatar verificado experiencia");

    if (!servicio) {
      return res.status(404).json({ mensaje: "Servicio no encontrado" });
    }

    // Convertir a objeto plano y eliminar propietario viejo
    const data = servicio.toObject();
    delete data.propietario;  // 🔥 BORRAMOS EL OBJETO VIEJO SIN TELEFONO

    res.json({
      ...data,
      propietario: servicio.propietarioId,  // 🔥 EL CORRECTO
    });

  } catch (error) {
    console.error("❌ Error en getServiceById:", error);
    res.status(500).json({ mensaje: "Error al obtener el servicio" });
  }
};


// ============================================================
// 📋 Obtener solicitudes de un servicio
// GET /api/servicios/:id/solicitudes
// ============================================================
// 📌 Añadir populate con telefono y foto
export const getServiceRequests = async (req, res) => {
  try {
    const { id } = req.params;

    const requests = await Request.find({ servicio: id })
      .populate("cliente", "nombre telefono avatar")  // 🔥 AQUI TELEFONO
      .populate("servicio", "nombre categoria precio");

    res.json(requests);
  } catch (err) {
    res.status(500).json({ mensaje: "Error obteniendo solicitudes" });
  }
};

// Crear servicio
export const createService = async (req, res) => {
  try {
    const { nombre, categoria, descripcion, precio } = req.body;

    // según tu schema: nombre/categoria/descripcion/precio son requeridos
    if (!nombre || !categoria || !descripcion || !precio) {
      return res.status(400).json({ mensaje: "nombre, categoria, descripcion y precio son obligatorios" });
    }

    const nuevo = await Service.create(req.body);
    res.status(201).json({ mensaje: "✅ Servicio creado correctamente", servicio: nuevo });
  } catch (error) {
    console.error("❌ Error en createService:", error);
    res.status(500).json({ mensaje: "Error al crear el servicio" });
  }
};

// Actualizar servicio (parcial)
export const updateService = async (req, res) => {
  try {
    const actualizado = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!actualizado) return res.status(404).json({ mensaje: "Servicio no encontrado" });
    res.json({ mensaje: "✅ Servicio actualizado", servicio: actualizado });
  } catch (error) {
    console.error("❌ Error en updateService:", error);
    res.status(500).json({ mensaje: "Error al actualizar el servicio" });
  }
};
// ============================================================
// 🔄 Actualizar estado de una solicitud
// PATCH /api/servicios/:id/solicitudes/:solicitudId
// body: { estado: "pendiente" | "aceptado" | "finalizado" | "cancelado" }
// ============================================================
export const updateRequestStatus = async (req, res) => {
  try {
    const { solicitudId } = req.params;
    const { estado } = req.body;

    const updated = await Request.findByIdAndUpdate(
      solicitudId,
      { estado },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ mensaje: "Solicitud no encontrada" });
    }

    res.json({
      mensaje: "Estado de solicitud actualizado correctamente",
      solicitud: updated,
    });
  } catch (error) {
    console.error("❌ Error en updateRequestStatus:", error);
    res
      .status(500)
      .json({ mensaje: "Error al actualizar estado de la solicitud" });
  }
};

// ============================================================
// 📅 Asignar cita (fecha y hora) a una solicitud
// PATCH /api/servicios/solicitudes/:solicitudId/appointment
// body: { fechaCita: "YYYY-MM-DD", horaCita: "HH:mm" }
// ============================================================
export const assignAppointment = async (req, res) => {
  try {
    const { solicitudId } = req.params;
    const { fechaCita, horaCita } = req.body;

    const updated = await Request.findByIdAndUpdate(
      solicitudId,
      { fechaCita, horaCita },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ mensaje: "Solicitud no encontrada" });
    }

    res.json({
      mensaje: "Cita asignada correctamente",
      solicitud: updated,
    });
  } catch (error) {
    console.error("❌ Error en assignAppointment:", error);
    res.status(500).json({ mensaje: "Error al asignar la cita" });
  }
};

// ============================================================
// ⭐ (Stub) Calificar una solicitud / servicio
// POST /api/servicios/solicitudes/:solicitudId/review
// De momento solo responde OK para que no rompa nada.
// Más adelante puedes conectar esto con addReview si quieres.
// ============================================================
export const reviewServiceRequest = async (req, res) => {
  try {
    const { solicitudId } = req.params;
    const { calificacion, reseña } = req.body;

    // 1️⃣ Buscar la solicitud
    const solicitud = await Request.findById(solicitudId);
    if (!solicitud) {
      return res.status(404).json({ mensaje: "Solicitud no encontrada" });
    }

    // 2️⃣ Guardar calificación y reseña en la solicitud
    solicitud.calificacion = calificacion;
    solicitud.reseña = reseña;
    await solicitud.save();

    // 3️⃣ Buscar el servicio relacionado
    const servicio = await Service.findById(solicitud.servicio);
    if (!servicio) {
      return res.status(404).json({ mensaje: "Servicio no encontrado" });
    }

    // 4️⃣ Agregar reseña en el servicio
    servicio.reseñas.push({
  usuario: solicitud.cliente,   // 👈 SIN .toString()
      comentario: reseña,
      calificacion,
      fecha: new Date(),
    });

    // 5️⃣ Recalcular calificación promedio
    const total = servicio.reseñas.reduce((acc, r) => acc + r.calificacion, 0);
    servicio.calificacion = Number((total / servicio.reseñas.length).toFixed(1));

    // 6️⃣ Actualizar número de opiniones
    servicio.opiniones = servicio.reseñas.length;

    await servicio.save();

    res.json({
      mensaje: "Calificación guardada correctamente",
      solicitud,
      servicio,
    });

  } catch (error) {
    console.error("❌ Error en reviewServiceRequest:", error);
    res.status(500).json({ mensaje: "Error al calificar la solicitud" });
  }
};

// Crear solicitud de contratación
export const createServiceRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { cliente, mensaje } = req.body;

    const servicio = await Service.findById(id);
    if (!servicio) return res.status(404).json({ mensaje: "Servicio no encontrado" });

    const nuevaSolicitud = await Request.create({
      servicio: id,
      cliente,
      proveedor: servicio.propietarioId, // 🔥 AQUÍ SE ASIGNA
      descripcion: mensaje || "",        // 🔥 Guardar mensaje
      estado: "pendiente"
    });

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

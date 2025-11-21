import User from "../models/user.model.js";
import Service from "../models/service.model.js";
import Local from "../models/local.model.js";
import Request from "../models/request.model.js";

/* ===============================
   📘 PERFIL DE USUARIO
================================= */

// Obtener perfil completo
export const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id)
      .populate("servicios")
      .populate("locales");

    if (!user)
      return res.status(404).json({ mensaje: "Usuario no encontrado" });

    res.json(user);
  } catch (error) {
    console.error("❌ Error en getUserProfile:", error);
    res.status(500).json({ mensaje: "Error al obtener perfil" });
  }
};

// Actualizar perfil
export const updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const cambios = req.body;

    const user = await User.findByIdAndUpdate(id, cambios, { new: true });

    if (!user)
      return res.status(404).json({ mensaje: "Usuario no encontrado" });

    res.json({
      mensaje: "Perfil actualizado correctamente",
      user,
    });
  } catch (error) {
    console.error("❌ Error en updateUserProfile:", error);
    res.status(500).json({ mensaje: "Error al actualizar perfil" });
  }
};

/* ===============================
   ⚙️ SERVICIOS DEL USUARIO
================================= */

// Crear servicio
export const addUserService = async (req, res) => {
  try {
    const { id } = req.params; // id del usuario
    const data = req.body;

    const nuevoServicio = new Service(data);
    await nuevoServicio.save();

    await User.findByIdAndUpdate(id, {
      $push: { servicios: nuevoServicio._id },
    });

    res.status(201).json({
      mensaje: "Servicio agregado correctamente",
      servicio: nuevoServicio,
    });
  } catch (error) {
    console.error("❌ Error en addUserService:", error);
    res.status(500).json({ mensaje: "Error al agregar servicio" });
  }
};

// Actualizar servicio
export const updateUserService = async (req, res) => {
  try {
    const { id, serviceId } = req.params;
    const data = req.body;

    const servicioActualizado = await Service.findByIdAndUpdate(
      serviceId,
      data,
      { new: true }
    );

    if (!servicioActualizado) {
      return res.status(404).json({ mensaje: "Servicio no encontrado" });
    }

    res.json({
      mensaje: "Servicio actualizado correctamente",
      servicio: servicioActualizado,
    });
  } catch (error) {
    console.error("❌ Error en updateUserService:", error);
    res.status(500).json({ mensaje: "Error al actualizar servicio" });
  }
};

// Eliminar servicio
export const deleteUserService = async (req, res) => {
  try {
    const { id, serviceId } = req.params;

    await Service.findByIdAndDelete(serviceId);
    await User.findByIdAndUpdate(id, { $pull: { servicios: serviceId } });

    res.json({ mensaje: "Servicio eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error en deleteUserService:", error);
    res.status(500).json({ mensaje: "Error al eliminar servicio" });
  }
};

/* ===============================
   🏪 LOCALES DEL USUARIO
================================= */

export const completeLocalRegistration = async (req, res) => {
  try {
    const { localId } = req.params;
    const { url, fotos, amenities, specialTags } = req.body;

    const updatedLocal = await Local.findByIdAndUpdate(
      localId,
      { url, fotos, amenities, specialTags },
      { new: true }
    );

    if (!updatedLocal)
      return res.status(404).json({ mensaje: "Local no encontrado" });

    res.json({
      mensaje: "Registro de local completado correctamente",
      local: updatedLocal,
    });
  } catch (error) {
    console.error("❌ Error en completeLocalRegistration:", error);
    res.status(500).json({ mensaje: "Error al completar registro del local" });
  }
};

/* ===============================
   📜 HISTORIAL DE SOLICITUDES
================================= */

// 🔥 NUEVO: solicitudes hechas por el usuario
export const getUserRequests = async (req, res) => {
  try {
    const { id } = req.params;

    const solicitudes = await Request.find({ cliente: id })
      .populate("servicio") // Populate completo
      .sort({ createdAt: -1 });

    const result = solicitudes.map(s => ({
      _id: s._id,
      servicio: s.servicio,
      estado: s.estado,
      fecha: s.fechaSolicitud?.toISOString().split("T")[0],
      hora: s.fechaSolicitud?.toISOString().split("T")[1].slice(0,5),
      calificacion: s.calificacion ?? null
    }));

    res.json(result);
  } catch (error) {
    console.log("❌ Error en getUserRequests:", error);
    res.status(500).json({ mensaje: "Error obteniendo historial" });
  }
};

/* ===============================
   🚪 CERRAR SESIÓN
================================= */
export const logoutUser = async (req, res) => {
  try {
    res.json({ mensaje: "Sesión cerrada exitosamente" });
  } catch (error) {
    console.error("❌ Error en logoutUser:", error);
    res.status(500).json({ mensaje: "Error al cerrar sesión" });
  }
};

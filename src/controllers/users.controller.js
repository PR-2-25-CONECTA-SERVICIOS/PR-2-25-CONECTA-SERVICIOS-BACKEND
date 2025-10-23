import User from "../models/user.model.js";
import Service from "../models/service.model.js";
import Local from "../models/local.model.js";

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

// Editar datos del perfil (nombre, teléfono, avatar, etc.)
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

// Agregar un nuevo servicio al usuario
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

// Eliminar un servicio del usuario
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

// Completar información de un local (fotos, tags, amenities)
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
   🚪 CERRAR SESIÓN
================================= */
export const logoutUser = async (req, res) => {
  try {
    // Si usas JWT, aquí eliminarías el token del lado del cliente
    res.json({ mensaje: "Sesión cerrada exitosamente" });
  } catch (error) {
    console.error("❌ Error en logoutUser:", error);
    res.status(500).json({ mensaje: "Error al cerrar sesión" });
  }
};

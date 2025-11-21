import Provider from "../models/provider.model.js";
import Request from "../models/request.model.js";
import User from "../models/user.model.js";
import Service from "../models/service.model.js";

/* ============================================================
   📋 Obtener todos los proveedores
============================================================ */
export const getAllProviders = async (req, res) => {
  try {
    const providers = await Provider.find().populate("usuario", "nombre correo rol");
    res.json(providers);
  } catch (error) {
    console.error("❌ Error en getAllProviders:", error);
    res.status(500).json({ mensaje: "Error al obtener los proveedores" });
  }
};

/* ============================================================
   ➕ Crear un nuevo proveedor
============================================================ */
export const createProvider = async (req, res) => {
  try {
    console.log("📦 Datos recibidos:", req.body);
    const { nombre, correo, telefono, descripcion, usuarioId } = req.body;

    // Evitar duplicados
    const existing = await Provider.findOne({ correo });
    if (existing)
      return res.status(400).json({ mensaje: "Ya existe un proveedor con ese correo" });

    const nuevoProveedor = new Provider({
      nombre,
      correo,
      telefono,
      descripcion,
      usuario: usuarioId || null,
      activo: true,
      verificado: false,
      servicios: [],
      rating: 0
    });

    await nuevoProveedor.save();
    res.status(201).json({ mensaje: "Proveedor creado correctamente", proveedor: nuevoProveedor });
  } catch (error) {
    console.error("❌ Error en createProvider:", error);
    res.status(500).json({ mensaje: "Error al crear proveedor" });
  }
};

/* ============================================================
   👤 Obtener perfil del proveedor
============================================================ */
export const getProviderProfile = async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id)
      .populate("usuario", "nombre correo telefono")
      .populate("servicios", "nombre categoria precio descripcion");

    if (!provider) return res.status(404).json({ mensaje: "Proveedor no encontrado" });

    res.json(provider);
  } catch (error) {
    console.error("❌ Error en getProviderProfile:", error);
    res.status(500).json({ mensaje: "Error al obtener el perfil del proveedor" });
  }
};

/* ============================================================
   ✏️ Actualizar perfil o datos del proveedor
============================================================ */
export const updateProviderProfile = async (req, res) => {
  try {
    const provider = await Provider.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!provider) return res.status(404).json({ mensaje: "Proveedor no encontrado" });
    res.json({ mensaje: "Perfil actualizado correctamente", provider });
  } catch (error) {
    console.error("❌ Error en updateProviderProfile:", error);
    res.status(500).json({ mensaje: "Error al actualizar perfil" });
  }
};

/* ============================================================
   🔄 Cambiar estado activo/inactivo
============================================================ */
export const toggleProviderStatus = async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id);
    if (!provider) return res.status(404).json({ mensaje: "Proveedor no encontrado" });

    provider.activo = !provider.activo;
    await provider.save();

    res.json({
      mensaje: `Proveedor ${provider.activo ? "activado" : "desactivado"}`,
      provider,
    });
  } catch (error) {
    console.error("❌ Error en toggleProviderStatus:", error);
    res.status(500).json({ mensaje: "Error al cambiar estado" });
  }
};

/* ============================================================
   🧾 Solicitudes recibidas del proveedor
============================================================ */
export const getProviderRequests = async (req, res) => {
  try {
    const requests = await Request.find({ proveedor: req.params.id })

      .populate("cliente", "nombre correo")
      .populate("servicio", "nombre categoria precio");
    res.json(requests);
  } catch (error) {
    console.error("❌ Error en getProviderRequests:", error);
    res.status(500).json({ mensaje: "Error al obtener solicitudes" });
  }
};

/* ============================================================
   🔁 Actualizar estado de una solicitud
============================================================ */
export const updateRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { estado } = req.body;

    const updated = await Request.findByIdAndUpdate(requestId, { estado }, { new: true });
    if (!updated) return res.status(404).json({ mensaje: "Solicitud no encontrada" });

    res.json({ mensaje: "Estado de solicitud actualizado", solicitud: updated });
  } catch (error) {
    console.error("❌ Error en updateRequestStatus:", error);
    res.status(500).json({ mensaje: "Error al actualizar solicitud" });
  }
};

/* ============================================================
   📊 Obtener estadísticas del proveedor
============================================================ */
export const getProviderStats = async (req, res) => {
  try {
    const { id } = req.params;

    const totalSolicitudes = await Request.countDocuments({ servicioProveedor: id });
    const completadas = await Request.countDocuments({ servicioProveedor: id, estado: "completada" });
    const canceladas = await Request.countDocuments({ servicioProveedor: id, estado: "cancelada" });

    const provider = await Provider.findById(id).select("nombre rating reseñas");
    if (!provider) return res.status(404).json({ mensaje: "Proveedor no encontrado" });

    res.json({
      proveedor: provider.nombre,
      ratingPromedio: provider.rating || 0,
      reseñas: provider.reseñas || 0,
      totalSolicitudes,
      completadas,
      canceladas
    });
  } catch (error) {
    console.error("❌ Error en getProviderStats:", error);
    res.status(500).json({ mensaje: "Error al obtener estadísticas" });
  }
};

/* ============================================================
   ❌ Eliminar proveedor
============================================================ */
export const deleteProvider = async (req, res) => {
  try {
    const eliminado = await Provider.findByIdAndDelete(req.params.id);
    if (!eliminado)
      return res.status(404).json({ mensaje: "Proveedor no encontrado" });

    res.json({ mensaje: "Proveedor eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error en deleteProvider:", error);
    res.status(500).json({ mensaje: "Error al eliminar proveedor" });
  }
};

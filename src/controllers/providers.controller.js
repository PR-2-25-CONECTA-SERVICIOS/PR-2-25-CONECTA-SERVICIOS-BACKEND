import Provider from "../models/provider.model.js";
import Request from "../models/request.model.js";

// Obtener perfil del proveedor
export const getProviderProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const provider = await Provider.findById(id);
    if (!provider) return res.status(404).json({ mensaje: "Proveedor no encontrado" });
    res.json(provider);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener el perfil del proveedor" });
  }
};

// Actualizar perfil o servicios
export const updateProviderProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const provider = await Provider.findByIdAndUpdate(id, req.body, { new: true });
    if (!provider) return res.status(404).json({ mensaje: "Proveedor no encontrado" });
    res.json({ mensaje: "Perfil actualizado correctamente", provider });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al actualizar perfil" });
  }
};

// Cambiar estado activo/inactivo
export const toggleProviderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const provider = await Provider.findById(id);
    if (!provider) return res.status(404).json({ mensaje: "Proveedor no encontrado" });

    provider.activo = !provider.activo;
    await provider.save();

    res.json({ mensaje: `Proveedor ${provider.activo ? "activado" : "desactivado"}`, provider });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al cambiar el estado del proveedor" });
  }
};

// Obtener solicitudes recibidas por el proveedor
export const getProviderRequests = async (req, res) => {
  try {
    const { id } = req.params; // id del proveedor
    const requests = await Request.find({ "servicioProveedor": id });
    res.json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener solicitudes" });
  }
};

// Actualizar estado de una solicitud (aceptar, cancelar, completar)
export const updateRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { estado } = req.body;

    const updated = await Request.findByIdAndUpdate(
      requestId,
      { estado },
      { new: true }
    );

    if (!updated) return res.status(404).json({ mensaje: "Solicitud no encontrada" });

    res.json({ mensaje: "Estado actualizado", solicitud: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al actualizar solicitud" });
  }
};

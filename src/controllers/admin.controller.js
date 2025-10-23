import Local from "../models/local.model.js";

/* ============================================================
   📋 Obtener todas las solicitudes de reclamo
   (Cada reclamo pertenece a un local)
============================================================ */
export const getAllClaims = async (req, res) => {
  try {
    const locales = await Local.find({}, "nombre categoria imagen reclamos");

    // Extraemos cada reclamo junto con su local
    const reclamos = locales.flatMap((local) =>
      (local.reclamos || []).map((r) => ({
        localId: local._id,
        localNombre: local.nombre,
        localCategoria: local.categoria,
        localImagen: local.imagen,
        ...r._doc,
      }))
    );

    res.json(reclamos);
  } catch (error) {
    console.error("❌ Error en getAllClaims:", error);
    res.status(500).json({ mensaje: "Error al obtener las solicitudes de reclamo" });
  }
};

/* ============================================================
   🔍 Obtener los detalles de un reclamo específico
============================================================ */
export const getClaimById = async (req, res) => {
  try {
    const { localId, claimId } = req.params;
    const local = await Local.findById(localId);
    if (!local) return res.status(404).json({ mensaje: "Local no encontrado" });

    const reclamo = local.reclamos.id(claimId);
    if (!reclamo) return res.status(404).json({ mensaje: "Reclamo no encontrado" });

    res.json({ local, reclamo });
  } catch (error) {
    console.error("❌ Error en getClaimById:", error);
    res.status(500).json({ mensaje: "Error al obtener el reclamo" });
  }
};

/* ============================================================
   ✅ Aprobar un reclamo
============================================================ */
export const approveClaim = async (req, res) => {
  try {
    const { localId, claimId } = req.params;

    const local = await Local.findById(localId);
    if (!local) return res.status(404).json({ mensaje: "Local no encontrado" });

    const reclamo = local.reclamos.id(claimId);
    if (!reclamo) return res.status(404).json({ mensaje: "Reclamo no encontrado" });

    reclamo.estado = "aprobado";
    await local.save();

    res.json({ mensaje: "Reclamo aprobado correctamente", reclamo });
  } catch (error) {
    console.error("❌ Error en approveClaim:", error);
    res.status(500).json({ mensaje: "Error al aprobar el reclamo" });
  }
};

/* ============================================================
   ❌ Rechazar un reclamo
============================================================ */
export const rejectClaim = async (req, res) => {
  try {
    const { localId, claimId } = req.params;
    const { motivo } = req.body;

    const local = await Local.findById(localId);
    if (!local) return res.status(404).json({ mensaje: "Local no encontrado" });

    const reclamo = local.reclamos.id(claimId);
    if (!reclamo) return res.status(404).json({ mensaje: "Reclamo no encontrado" });

    reclamo.estado = "rechazado";
    reclamo.motivoRechazo = motivo || "Sin motivo especificado";
    await local.save();

    res.json({ mensaje: "Reclamo rechazado correctamente", reclamo });
  } catch (error) {
    console.error("❌ Error en rejectClaim:", error);
    res.status(500).json({ mensaje: "Error al rechazar el reclamo" });
  }
};

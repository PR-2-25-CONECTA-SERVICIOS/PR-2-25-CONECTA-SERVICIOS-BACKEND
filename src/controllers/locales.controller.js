import Local from "../models/local.model.js";
import User from "../models/user.model.js";

/* ============================================================
   📍 Obtener todos los locales
============================================================ */
export const getAllLocales = async (req, res) => {
  try {
    const locales = await Local.find();
    res.json(locales);
  } catch (error) {
    console.error("❌ Error en getAllLocales:", error);
    res.status(500).json({ mensaje: "Error al obtener los locales" });
  }
};

/* ============================================================
   🔍 Buscar locales (por nombre o categoría)
============================================================ */
export const searchLocales = async (req, res) => {
  try {
    const { q, categoria } = req.query;
    const filtro = {};

    if (categoria && categoria !== "Todos") {
      filtro.categoria = categoria;
    }

    if (q) {
      filtro.nombre = { $regex: q, $options: "i" }; // búsqueda insensible a mayúsculas
    }

    const locales = await Local.find(filtro);
    res.json(locales);
  } catch (error) {
    console.error("❌ Error en searchLocales:", error);
    res.status(500).json({ mensaje: "Error en la búsqueda de locales" });
  }
};

/* ============================================================
   🌟 Obtener locales destacados
============================================================ */
export const getFeaturedLocales = async (req, res) => {
  try {
    const destacados = await Local.find({ destacado: true });
    res.json(destacados);
  } catch (error) {
    console.error("❌ Error en getFeaturedLocales:", error);
    res.status(500).json({ mensaje: "Error al obtener los locales destacados" });
  }
};

/* ============================================================
   🔎 Obtener detalles de un local específico
============================================================ */
export const getLocalById = async (req, res) => {
  try {
    const { id } = req.params;
    const local = await Local.findById(id).populate("creadoPor", "nombre correo");
    if (!local) return res.status(404).json({ mensaje: "Local no encontrado" });
    res.json(local);
  } catch (error) {
    console.error("❌ Error en getLocalById:", error);
    res.status(500).json({ mensaje: "Error al obtener el local" });
  }
};

/* ============================================================
   🧾 Reclamar un negocio (enviar solicitud)
============================================================ */
export const claimLocal = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombrePropietario, correo, telefono, mensaje, documentos } = req.body;

    const solicitud = {
      nombrePropietario,
      correo,
      telefono,
      mensaje,
      documentos: documentos || [],
      estado: "pendiente",
      fecha: new Date(),
    };

    await Local.findByIdAndUpdate(id, { $push: { reclamos: solicitud } });

    res.status(201).json({
      mensaje:
        "Solicitud de reclamo enviada correctamente. Será revisada por un administrador.",
      solicitud,
    });
  } catch (error) {
    console.error("❌ Error en claimLocal:", error);
    res.status(500).json({ mensaje: "Error al enviar la solicitud de reclamo" });
  }
};
const submitClaim = async () => {
  try {
    const res = await fetch(`${API_URL}/${id}/reclamar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombrePropietario: ownerName,
        correo: email,
        telefono: tel,
        mensaje: msg,
        documentos: docs,
      }),
    });

    const json = await res.json();
    console.log("📩 Reclamo enviado:", json);

    // 🔥 RECARGAR LOCAL PARA QUE DESAPAREZCA EL BOTÓN SIN SALIR DE LA VISTA
    await loadLocal();

    setOpen(false);
    setOwnerName("");
    setEmail("");
    setTel("");
    setMsg("");
    setDocs([]);
  } catch (err) {
    console.log("❌ Error enviando reclamo:", err);
  }
};


/* ============================================================
   🏢 Crear un nuevo local
============================================================ */

export const createLocal = async (req, res) => {
  try {
    const {
      nombre,
      categoria,
      telefono,
      direccion,
      lat,
      lng,
      imagen,
      userId,   // 👈 VIENE DEL FRONT
    } = req.body;

    if (!userId) {
      return res.status(400).json({ mensaje: "userId es requerido" });
    }

    // (Opcional pero recomendado) verificar que el usuario exista
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    // 1️⃣ Crear el local
    const nuevoLocal = await Local.create({
      nombre,
      categoria,
      telefono,
      direccion,
      lat,
      lng,
      imagen,
      creadoPor: userId, // relación con el usuario
    });

    // 2️⃣ Agregar el local al array de locales del usuario
    await User.findByIdAndUpdate(userId, {
      $push: { locales: nuevoLocal._id },
    });

    // 3️⃣ Volver a obtener el local ya populado (para el frontend)
    const localPopulado = await Local.findById(nuevoLocal._id).populate(
      "creadoPor",
      "_id nombre correo"
    );

    // 4️⃣ Responder
    res.status(201).json({
      mensaje: "Local creado correctamente",
      local: localPopulado,
    });
  } catch (error) {
    console.error("❌ Error en createLocal:", error);
    res.status(500).json({ mensaje: "Error al crear local" });
  }
};

/* ============================================================
   ✏️ Actualizar un local (PATCH)
============================================================ */
export const updateLocal = async (req, res) => {
  try {
    const { id } = req.params;

    const localActualizado = await Local.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!localActualizado)
      return res.status(404).json({ mensaje: "Local no encontrado" });

    res.json({
      mensaje: "Local actualizado correctamente",
      local: localActualizado,
    });
  } catch (error) {
    console.error("❌ Error en updateLocal:", error);
    res.status(500).json({ mensaje: "Error al actualizar el local" });
  }
};

/* ============================================================
   🗑️ Eliminar un local (DELETE)
============================================================ */
export const deleteLocal = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminado = await Local.findByIdAndDelete(id);

    if (!eliminado)
      return res.status(404).json({ mensaje: "Local no encontrado" });

    res.json({ mensaje: "✅ Local eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error en deleteLocal:", error);
    res.status(500).json({ mensaje: "Error al eliminar el local" });
  }
};
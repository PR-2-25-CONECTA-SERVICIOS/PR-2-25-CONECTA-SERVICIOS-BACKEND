import Category from "../models/category.model.js";

// Crear categoría
export const createCategory = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;

    if (!nombre)
      return res.status(400).json({ mensaje: "El nombre es obligatorio" });

    const nueva = await Category.create({ nombre, descripcion });

    res.status(201).json({ mensaje: "Categoría creada", categoria: nueva });
  } catch (err) {
    console.log("❌ Error creando categoría:", err);
    res.status(500).json({ mensaje: "Error al crear categoría" });
  }
};

// Obtener todas
export const getCategories = async (_req, res) => {
  try {
    const categorias = await Category.find().sort({ nombre: 1 });
    res.json(categorias);
  } catch (err) {
    res.status(500).json({ mensaje: "Error al obtener categorías" });
  }
};

// Actualizar
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.json({ mensaje: "Categoría actualizada", categoria: updated });
  } catch (err) {
    res.status(500).json({ mensaje: "Error al actualizar categoría" });
  }
};

// Eliminar
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await Category.findByIdAndDelete(id);
    res.json({ mensaje: "Categoría eliminada" });
  } catch (err) {
    res.status(500).json({ mensaje: "Error al eliminar categoría" });
  }
};

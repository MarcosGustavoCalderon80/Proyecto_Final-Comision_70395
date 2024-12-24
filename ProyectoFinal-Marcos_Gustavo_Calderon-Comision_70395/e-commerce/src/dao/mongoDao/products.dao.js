import { productModel } from "../models/product.model.js";

class ProductDao {

  async getAll(query, options) {
    return await productModel.paginate(query, options);
  }

  async getById(id) {
    return await productModel.findById(id);
  }

  async create(data) {
    // Validar si los campos obligatorios están presentes
    const { title, description, price, thumbnail, code, stock, category } = data;

    if (!title || !description || !price || !thumbnail || !code || !stock || !category) {
      throw new Error("Todos los campos son obligatorios");
    }

    // Validar si el código ya existe en la base de datos
    const existingProduct = await productModel.findOne({ code });
    if (existingProduct) {
      throw new Error(`Ya existe un producto con el código ${code}`);
    }

    // Crear el nuevo producto
    const newProduct = await productModel.create(data);
    return newProduct;
  }

  async update(id, data) {
    return await productModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return await productModel.findByIdAndDelete(id);
  }
}

export const productDao = new ProductDao();

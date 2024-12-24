import { v4 as uuid } from "uuid";
import { productModel } from "../models/product.model.js";

export class ProductManager {
  
  // Obtener producto por ID
  async getProductById(pid) {
    return await this.productDao.getById(pid);
  }
  // Método para obtener los productos de la base de datos
  async getProducts(limit) {
    try {
      const products = await productModel.find().limit(limit); 
      return products;
    } catch (error) {
      throw new Error("Error al obtener productos");
    }
  }

  // Método para agregar un nuevo producto
  async addProduct(product) {
    const { title, description, price, thumbnail, code, stock, category } = product;

    // Validar que todos los campos sean obligatorios
    const validateProperties = [title, description, price, thumbnail, code, stock, category];
    if (validateProperties.includes(undefined)) {
      throw new Error("Todos los campos son obligatorios");
    }

    // Validar que el código no exista en la base de datos
    const productExist = await productModel.findOne({ code });
    if (productExist) {
      throw new Error(`Ya existe un producto con el código ${code}`);
    }

    // Crear el nuevo producto
    const newProduct = new productModel({
      id: uuid(),
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      status: true,
      category,
    });

    // Guardar el nuevo producto en la base de datos MongoDB
    try {
      await newProduct.save();
      return newProduct;
    } catch (error) {
      throw new Error("No se pudo guardar el producto en MongoDB");
    }
  }

  // Método para obtener un producto por ID
  async getProductById(id) {
    try {
      const product = await productModel.findById(id);
      if (!product) throw new Error(`No se encuentra el producto con el id ${id}`);
      return product;
    } catch (error) {
      throw new Error("No se pudo obtener el producto");
    }
  }

  // Método para actualizar un producto
  async updateProduct(id, data) {
    try {
      const product = await productModel.findByIdAndUpdate(id, data, { new: true });
      if (!product) throw new Error(`No se encuentra el producto con el id ${id}`);
      return product;
    } catch (error) {
      throw new Error("No se pudo actualizar el producto");
    }
  }

  // Método para eliminar un producto
  async deleteProduct(id) {
    try {
      const product = await productModel.findByIdAndDelete(id);
      if (!product) throw new Error(`No se encuentra el producto con el id ${id}`);
      return `Producto con el id ${id} eliminado`;
    } catch (error) {
      throw new Error("No se pudo eliminar el producto");
    }
  }
}

import { v4 as uuid } from "uuid";
import { CartDao } from "../dao/mongoDao/carts.dao.js";
import { ProductManager } from "./productManager.js";

export class CartsManager {
  constructor() {
    this.cartDao = new CartDao();  
    this.productManager = new ProductManager();  
  }

  // Obtener los carritos
  async getCarts() {
    try {
      return await this.cartDao.getAll();  
    } catch (error) {
      throw new Error('Error al obtener los carritos.');
    }
  }

  // Crea un nuevo carrito
  async createCart() {
    try {
      const newCart = {
        id: uuid(),
        products: [],
      };
      return await this.cartDao.create(newCart);  
    } catch (error) {
      throw new Error('Falló al crear el carrito. Por favor, inténtalo nuevamente.');
    }
  }

  // Obtener un carrito por su ID
  async getCartById(cid) {
    try {
      const cart = await this.cartDao.getById(cid);
      if (!cart) throw new Error(`No se encuentra el carrito con el id ${cid}`);
      return cart;
    } catch (error) {
      throw new Error('Error al obtener el carrito.');
    }
  }

  // Agrega un producto a un carrito
  async addProductToCart(cid, pid, quantity) {
    try {
      const cart = await this.getCartById(cid);  
      const product = await this.productManager.getProductById(pid);  

      // Verificar si hay suficiente stock
      if (product.stock < quantity) {
        throw new Error(`No hay suficiente stock para el producto ${product.title}`);
      }

      // Verificar si el producto ya está en el carrito
      const existingProduct = cart.products.find((prod) => prod.product === pid);
      
      if (existingProduct) {
        // Si el producto ya está, aumentar la cantidad
        existingProduct.quantity += quantity;
      } else {
        // Si el producto no está en el carrito, agregarlo
        cart.products.push({ product: pid, quantity });
      }

      // Restar el stock del producto
      product.stock -= quantity;
      await this.productManager.updateProduct(pid, { stock: product.stock }); 

      // Actualizar el carrito en la base de datos
      await this.cartDao.update(cid, { products: cart.products });

      return cart;
    } catch (error) {
      throw new Error('Error al agregar el producto al carrito.');
    }
  }

  // Eliminar un producto del carrito
  async deleteProductInCart(cid, pid) {
    try {
      const cart = await this.getCartById(cid); 
      const updatedCart = await this.cartDao.deleteProductInCart(cid, pid);  

      return updatedCart;
    } catch (error) {
      throw new Error('Error al eliminar el producto del carrito.');
    }
  }

  // Actualizar la cantidad de un producto en el carrito
  async updateProductInCart(cid, pid, quantity) {
    try {
      const cart = await this.getCartById(cid);  
      const updatedCart = await this.cartDao.updateProductInCart(cid, pid, quantity);  

      return updatedCart;
    } catch (error) {
      throw new Error('Error al actualizar la cantidad del producto en el carrito.');
    }
  }

  // Borrar todos los productos del carrito
  async deleteProductsInCart(cid) {
    try {
      const cart = await this.getCartById(cid);  
      const updatedCart = await this.cartDao.deleteProductsInCart(cid); 

      return updatedCart;
    } catch (error) {
      throw new Error('Error al eliminar todos los productos del carrito.');
    }
  }
}

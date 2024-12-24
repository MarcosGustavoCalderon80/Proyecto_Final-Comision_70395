import { Router } from "express";
import { cartModel } from "../dao/models/cart.model.js";
import { productModel } from "../dao/models/product.model.js";
import { cartDao } from "../dao/mongoDao/carts.dao.js";
import { productDao } from "../dao/mongoDao/products.dao.js";

const router = Router();

// Crear un nuevo carrito
router.post("/", async (req, res) => {
  try {
    const cart = await cartModel.create({
      products: []
    });
    res.status(201).json({ status: "ok", payload: cart });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error al crear el carrito");
  }
});

// Obtener un carrito específico por su ID
router.get("/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    const cart = await cartModel.findById(cid);
    if (!cart) return res.status(404).json({ status: "error", message: `Cart con id ${cid} no encontrado` });

    res.status(200).json({ status: "ok", payload: cart });
  } catch (error) {
    console.log(error);
    res.status(500).send(`Error al obtener el carrito con el id ${cid}`);
  }
});

// Agregar un producto a un carrito específico
router.post("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;

  try {
    // Validar que el producto exista
    const findProduct = await productModel.findById(pid);
    if (!findProduct) {
      return res.status(404).json({ status: "error", message: `Product con id ${pid} no encontrado` });
    }

    // Verificar si el producto tiene stock disponible
    if (findProduct.stock <= 0) {
      return res.status(400).json({ status: "error", message: "Product sin stock" });
    }

    const findCart = await cartModel.findById(cid);
    if (!findCart) {
      return res.status(404).json({ status: "error", message: `Cart con id ${cid} no encontrado` });
    }

    // Verificar si el producto ya está en el carrito
    const productInCart = findCart.products.find((productCart) => productCart.product.toString() === pid);
    if (!productInCart) {
      // Agregar el producto al carrito si no existe
      findCart.products.push({ product: pid, quantity: 1 });
      // Reducir el stock del producto
      findProduct.stock--;
      await productModel.findByIdAndUpdate(pid, { stock: findProduct.stock });
    } else {
      // Incrementar la cantidad si el producto ya existe en el carrito
      productInCart.quantity++;
      // Reducir el stock del producto
      findProduct.stock--;
      await productModel.findByIdAndUpdate(pid, { stock: findProduct.stock });
    }

    // Guardar los cambios en el carrito
    const cart = await cartModel.findByIdAndUpdate(cid, { products: findCart.products }, { new: true });

    res.status(200).json({ status: "ok", payload: cart });
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});

// Eliminar un producto de un carrito
router.delete("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  try {
    const product = await productDao.getById(pid);
    if (!product) return res.status(404).json({ status: "error", message: `Product con id ${pid} no encontrado` });

    const cart = await cartDao.getById(cid);
    if (!cart) return res.status(404).json({ status: "error", message: `Cart con id ${cid} no encontrado` });

    const cartUpdated = await cartDao.deleteProductInCart(cid, pid);
    res.status(200).json({ status: "ok", payload: cartUpdated });
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});

// Actualizar la cantidad de un producto en el carrito
router.put("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  try {
    const product = await productDao.getById(pid);
    if (!product) return res.status(404).json({ status: "error", message: `Product con id ${pid} no encontrado` });

    const cart = await cartDao.getById(cid);
    if (!cart) return res.status(404).json({ status: "error", message: `Cart con id ${cid} no encontrado` });

    const cartUpdated = await cartDao.updateProductInCart(cid, pid, quantity);
    res.status(200).json({ status: "ok", payload: cartUpdated });
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});

// Eliminar todos los productos de un carrito
router.delete("/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    const cart = await cartModel.findById(cid);
    if (!cart) return res.status(404).json({ status: "error", message: `Cart con id ${cid} no encontrado` });

    const cartUpdated = await cartDao.deleteProductsInCart(cid);
    res.status(200).json({ status: "ok", payload: cartUpdated });
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});

export default router;

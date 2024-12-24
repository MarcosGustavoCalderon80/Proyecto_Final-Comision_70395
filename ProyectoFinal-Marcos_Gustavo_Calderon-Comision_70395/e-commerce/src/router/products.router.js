import { Router } from "express";
import { productDao } from "../dao/mongoDao/products.dao.js";
const router = Router();

router.get("/", async (req, res) => {
  const { limit, page, sort, category, status } = req.query;

  try {
    const options = {
      limit: limit || 10,
      page: page || 1,
      sort: {
        price: sort === "asc" ? 1 : -1,
      },
      lean: true,
    };

    if (status) {
      const products = await productDao.getAll({ status: status }, options);
      return res.status(200).json({ status: "ok", payload: products });
    }

    if (category) {
      const products = await productDao.getAll({ category: category }, options);
      return res.status(200).json({ status: "ok", payload: products });
    }

    const products = await productDao.getAll({}, options);
    res.status(200).json({ status: "ok", payload: products });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error de servidor.");
  }
});

router.get("/:pid", async (req, res) => {
  const { pid } = req.params;
  try {
    const product = await productDao.getById(pid);
    if (!product) return res.status(404).json({ status: "error", message: `Product con id ${pid} no encontrado` });

    res.status(200).json({ status: "ok", payload: product });
  } catch (error) {
    console.log(error);
    res.status(500).send(`Error al obtener el producto con el id ${pid}`);
  }
});

router.post("/", async (req, res) => {
  const body = req.body;
  try {
    const product = await productDao.create(body);
    res.status(201).json({ status: "ok", payload: product });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error al crear el producto.");
  }
});

router.put("/:pid", async (req, res) => {
  const { pid } = req.params;
  const body = req.body;
  try {
    const findProduct = await productDao.getById(pid);
    if (!findProduct) return res.status(404).json({ status: "error", message: `Product con id ${pid} no encontrado` });

    const product = await productDao.update(pid, body);
    res.status(200).json({ status: "ok", payload: product });
  } catch (error) {
    console.log(error);
    res.status(500).send(`Error al actualizar el producto con el id ${pid}`);
  }
});

router.delete("/:pid", async (req, res) => {
  const { pid } = req.params;
  try {
    const findProduct = await productDao.getById(pid);
    if (!findProduct) return res.status(404).json({ status: "error", message: `Product con id ${pid} no encontrado` });

    await productDao.delete(pid);
    res.status(200).json({ status: "ok", payload: `Product con id ${pid} eliminado` });
  } catch (error) {
    console.log(error);
    res.status(500).send(`Error al eliminar el producto con el id ${pid}`);
  }
});

export default router;

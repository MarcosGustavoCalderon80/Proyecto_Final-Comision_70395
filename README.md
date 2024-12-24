Proyecto Final - Backend

Descripción del Proyecto:
Este proyecto tiene como objetivo implementar un backend profesionalizado utilizando MongoDB como sistema de persistencia para gestionar productos y carritos. El backend proporcionará funcionalidades clave para consultar productos con filtros, paginación y ordenamiento, así como gestionar carritos de compras con distintas operaciones.

Objetivos Generales:

1)Implementar MongoDB como sistema de persistencia principal para el almacenamiento de productos y carritos.
2)Definir y desarrollar todos los endpoints necesarios para trabajar con productos y carritos.

Objetivos Específicos:
* Gestión de Productos 
* Consultar Productos

El endpoint GET /products permitirá realizar consultas profesionales con los siguientes parámetros:

limit: Número de productos a devolver. Si no se recibe, el valor predeterminado será 10.
page: Página a devolver. Si no se recibe, el valor predeterminado será 1.
query: Filtro para buscar productos por categoría o disponibilidad. Si no se recibe, se realiza una búsqueda general.
sort: Ordenamiento ascendente o descendente por precio (asc o desc). Si no se recibe, no se aplica ordenamiento.

El formato de respuesta será el siguiente:

{
  "status": "success/error",
  "payload": "Resultado de los productos solicitados",
  "totalPages": "Total de páginas",
  "prevPage": "Página anterior",
  "nextPage": "Página siguiente",
  "page": "Página actual",
  "hasPrevPage": "Indicador de página previa",
  "hasNextPage": "Indicador de página siguiente",
  "prevLink": "Link a la página previa",
  "nextLink": "Link a la página siguiente"
}

Gestión de Carrito:
Operaciones sobre el carrito: Los siguientes endpoints deben estar disponibles para gestionar los carritos:

DELETE /api/carts/:cid/products/:pid: Eliminar un producto específico del carrito.
PUT /api/carts/:cid: Actualizar el carrito con un arreglo de productos, con el formato adecuado.
PUT /api/carts/:cid/products/:pid: Actualizar la cantidad de ejemplares de un producto en el carrito.
DELETE /api/carts/:cid: Eliminar todos los productos de un carrito específico.

Relación entre Productos y Carritos:

En el modelo de Carrito, la propiedad products será un arreglo de IDs de productos, y estos IDs se referirán a los productos completos al realizar una consulta con la función populate en Mongoose.
El endpoint GET /api/carts/:cid deberá traer todos los productos de un carrito y los productos asociados con la información completa.

Endpoints:

Productos
GET /products
Parámetros: limit, page, query, sort
Descripción: Devuelve una lista de productos con soporte para filtros, paginación y ordenamiento.

GET /products/:pid
Descripción: Devuelve los detalles completos de un producto específico.

Carrito
GET /api/carts/:cid
Descripción: Devuelve todos los productos de un carrito específico, utilizando populate para obtener los detalles completos de cada producto.

PUT /api/carts/:cid
Descripción: Actualiza el carrito con un arreglo de productos.

PUT /api/carts/:cid/products/:pid
Descripción: Actualiza la cantidad de ejemplares de un producto específico en el carrito.

DELETE /api/carts/:cid/products/:pid
Descripción: Elimina un producto del carrito.

DELETE /api/carts/:cid
Descripción: Elimina todos los productos de un carrito específico.

Tecnologías Utilizadas:
Node.js: Entorno de ejecución para JavaScript.
Express.js: Framework para la creación de APIs.
MongoDB: Base de datos NoSQL para almacenar productos y carritos.
Mongoose: Librería para modelar los datos y realizar operaciones sobre MongoDB.

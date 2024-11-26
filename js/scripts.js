// Creamos todos los elementos

const filtersElement = document.getElementById('filters');
const galleryElement = document.getElementById('gallery');
const cartProductsElement = document.getElementById('cart-products');
const cartImageElement = document.getElementById('cart-image');
const cartQuantityElement = document.getElementById('cart-quantity');
const totalOrderContainerElement = document.getElementById('total-order-container');
const totalOrderElement = document.getElementById('total-order');

// Creamos un array donde se guardarán los productos agregados con su nombre, precio y cantidad
let cartContent = [];

// CREACIÓN DE FUNCIONES

// *** Actualizar el precio total del pedido. Esta función calcula el costo total del carrito sumando los precios de todos los productos, multiplicados por sus cantidades. Luego, actualiza el elemento totalOrderElement en el DOM. ***

// Reduce: Recorre el array cartContent, acumulando el precio total de los productos
// toFixed(2): Redondea el número a 2 decimales
const updateTotalOrderInDOM = () => {
  const totalOrder = cartContent.reduce((acc, product) => product.price * product.quantity + acc, 0);
  totalOrderElement.textContent = '$' + totalOrder.toFixed(2);
};

// *** Actualizar la cantidad total de productos. Esta función calcula la cantidad total de productos en el carrito y actualiza el elemento cartQuantityElement. Luego, llama a la función para actualizar el total del pedido. ***

const updateProductsQuantityInDOM = () => {
  const totalQuantity = cartContent.reduce((acc, product) => product.quantity + acc, 0);
  cartQuantityElement.textContent = totalQuantity;

  updateTotalOrderInDOM();
};

// *** Actualizar el contenido del carrito. Esta función construye dinámicamente el carrito en el DOM según los productos almacenados en cartContent. ***
const updateCartInDOM = () => {
  const fragment = document.createDocumentFragment();

  if (cartContent.length === 0) {
    cartImageElement.classList.remove('hide');
    totalOrderContainerElement.classList.add('hide');
  } else {
    cartImageElement.classList.add('hide');
    totalOrderContainerElement.classList.remove('hide');
  }

  // Recorrer los productos del carrito. Se utiliza el método forEach para iterar sobre todos los productos almacenados en el array cartContent
  cartContent.forEach(product => {
    const newCartProduct = document.createElement('div'); // Se crea un <div> que contendrá toda la información de un producto del carrito
    newCartProduct.classList.add('cart-product'); // Se le asigna la clase cart-product para que tenga estilos predefinidos del CSS

    const newCartProductName = document.createElement('p'); //Se crea un <p> para mostrar el nombre del producto.
    newCartProduct.classList.add('cart-product-name');
    newCartProductName.textContent = product.name; // Así se va a llamar

    newCartProduct.append(newCartProductName);

    const newCartProductInfo = document.createElement('div'); // Se crea otro <div> para contener los datos adicionales del producto, como la cantidad, precio unitario, precio total y un botón de eliminar.
    newCartProductInfo.classList.add('cart-product-info');

    const newCartProductQuantity = document.createElement('span'); // Se crea un <span> para mostrar la cantidad de este producto en el carrito.
    newCartProductQuantity.classList.add('cart-product-quantity');
    newCartProductQuantity.textContent = product.quantity + 'x'; // Se asigna el texto con el formato cantidad x (por ejemplo: 2x)

    const newCartProductPriceSingle = document.createElement('span'); // Se crea otro <span> para mostrar el precio unitario del producto, precedido por un símbolo @ (por ejemplo: @10.00).
    newCartProductPriceSingle.classList.add('cart-product-price-single');
    newCartProductPriceSingle.textContent = '@' + product.price; // Se crea otro <span> para mostrar el precio unitario del producto, precedido por un símbolo @ (por ejemplo: @10.00). ???

    const newCartProductPriceTotal = document.createElement('span');
    newCartProductPriceTotal.classList.add('cart-product-price-total');

    // Calcular el precio total del producto
    const totalPrice = product.price * product.quantity;
    newCartProductPriceTotal.textContent = '$' + totalPrice.toFixed(2);

    // Crear botón con img para eliminar el producto (product.name)
    const newCartProductIconRemove = document.createElement('img'); // Se crea un elemento <img> que servirá como botón para eliminar el producto.
    newCartProductIconRemove.classList.add('cart-product-icon-remove');
    newCartProductIconRemove.src = './assets/images/icon-remove-item.svg'; // Se asigna una imagen a través de su atributo src.

    newCartProductIconRemove.addEventListener('click', () => removeProductFromCart(product.name));

    // AGREGAR LOS ELEMENTOS AL CONTENEDOR DIV QUE HEMOS CREADO ANTERIORMENTE
    newCartProductInfo.append(
      newCartProductQuantity,
      newCartProductPriceSingle,
      newCartProductPriceTotal,
      newCartProductIconRemove
    );

    newCartProduct.append(newCartProductInfo); // Colocar todos los detalles del producto dentro del contenedor principal del producto

    fragment.append(newCartProduct);
  });

  // Actualizar el contenedor del carrito
  cartProductsElement.textContent = ''; // Con esta línea vaciamos el contenedor antes de agregar nuevos elementos. Si no se hace los productos anteriores se seguirían mostrando
  cartProductsElement.append(fragment);
  updateProductsQuantityInDOM();
};

const updateProductQuantityInDOM = (quantity, element) => {
  element.children[1].textContent = quantity;
  updateCartInDOM();
};

const addProductToCart = (name, price) => {
  cartContent.push({ name: name, price: price, quantity: 1 });
  updateCartInDOM();
};

// *** Activar los filtros ***

/* Recordemos: 

- event.target: HTML que se ha clicado. Este puede ser un botón, un enlace o cualquier otro elemento que tenga un evento asociado

- dataset: Es una propiedad que nos permite acceder a los atributos data-* definidos en el elemento HTML. */

const activateFilters = event => {
  const filter = event.target.dataset.filter;

  if (!filter) return;

  for (const filter of filtersElement.children) {
    // Aquí, estamos iterando sobre todos los elementos hijos de filtersElement, que es el contenedor que contiene los filtros
    filter.classList.remove('filter-active');
  }
  event.target.classList.add('filter-active');
};

filtersElement.addEventListener('click', activateFilters);

const filtersElement = document.getElementById('filters');
const galleryElement = document.getElementById('gallery');
const fullCartElement = document.getElementById('full-cart');
const cartImageElement = document.getElementById('cart-image');
const cartQuantityElement = document.getElementById('cart-quantity');
const emptyCartElement = document.getElementById('empty-cart');
const totalOrderContainerElement = document.getElementById('total-order-container');
const totalPriceElement = document.getElementById('total-price');

// Creamos un array donde se guardarán los productos agregados con su nombre, precio y cantidad
let cartContent = [];

// *** Actualizar el precio total del pedido. Esta función calcula el costo total del carrito sumando los precios de todos los productos, multiplicados por sus cantidades. Luego, actualiza el elemento totalPriceElement en el DOM. ***

// Reduce: Recorre el array cartContent, acumulando el precio total de los productos
// toFixed(2): Redondea el número a 2 decimales
const updateTotalOrderInDOM = () => {
  const totalPrice = cartContent.reduce((acc, product) => product.price * product.quantity + acc, 0);
  totalPriceElement.textContent = '$' + totalPrice.toFixed(2);
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
    // <div> que contendrá toda la información de un producto del carrito
    const newCartProduct = document.createElement('div'); 
    newCartProduct.classList.add('cart-product'); // Se le asigna la clase cart-product para que tenga estilos predefinidos del CSS

    //<p> para mostrar el nombre del producto
    const newCartProductName = document.createElement('p'); 
    newCartProduct.classList.add('cart-product-name');
    newCartProductName.textContent = product.name; // Así se va a llamar

    newCartProduct.append(newCartProductName);

     // otro <div> para contener los datos adicionales del producto, como la cantidad, precio unitario, precio total y un botón de eliminar.
    const newCartProductInfo = document.createElement('div');
    newCartProductInfo.classList.add('cart-product-info');

    // <span> para mostrar la cantidad de este producto en el carrito
    const newCartProductQuantity = document.createElement('span'); 
    newCartProductQuantity.classList.add('cart-product-quantity');
    newCartProductQuantity.textContent = product.quantity + 'x'; // Se asigna el texto con el formato cantidad x (por ej: 2x)

    // <span> para mostrar el precio unitario del producto
    const newCartProductPriceSingle = document.createElement('span'); 
    newCartProductPriceSingle.classList.add('cart-product-price-single');
    newCartProductPriceSingle.textContent = '@' + product.price; 

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

    // Colocar todos los detalles del producto dentro del contenedor principal del producto
    newCartProduct.append(newCartProductInfo); 

    fragment.append(newCartProduct);
  });

  // Actualizar el contenedor del carrito
  fullCartElement.textContent = ''; // Con esta línea vaciamos el contenedor antes de agregar nuevos elementos. Si no se hace los productos anteriores se seguirían mostrando
  fullCartElement.append(fragment);
  updateProductsQuantityInDOM();
};

// Creamos una función que actualizará si la cantidad de producto ha sido modificado, para ello le pasamos dos variables, quantity y element (del DOM, es decir, el contenedor donde están almacenados esos productos)

// ¿Cómo se modificará la cantidad automáticamente en el DOM? Pues bien, primero vamos al segundo hijo del elemento, si miramos en el html, coincidirá con cart-quantity, y le agregamos .textContent, para que se modifique el texto del h3 automaticamente del html

// Por último, llamamos a la función updateCartInDom para actualizar el carrito

const updateProductQuantityInDOM = (quantity, element) => {
  element.children[1].textContent = quantity;
  updateCartInDOM();
};

// Creamos una función para añadir productos al carrito, para ello le pasamos dos parametros, el nombre y el precio

// Con la segunda línea modificamos el carrito de compras, al agregar un nuevo producto a cartContent, lo haremos a través de push (método de los arrays), que se utiliza para agregar un nuevo elemento al final del array, en esto caso añadimos un objeto con tres propiedades

// quantity es 1 porque estamos agregando el producto por primera vez 

const addProductToCart = (name, price) => {
  cartContent.push({ name: name, price: price, quantity: 1 });
  updateCartInDOM();
  emptyCart();
};


// Creamos la función que nos indircará si la cantidad de producto ha sido aumentado, para ello le pasamos dos valores: el nombre del producto y el elemento (del DOM, es decir, el contenedor donde están almacenados esos productos)

// Después, creamos una constante donde almacenaremos y actualizaremos la cantidad nueva "newQuantity"

// Después, hacemos un contador para actualizar el carrito "cartContent", le pasamos la variable product y hacemos una condicional:
  // If. Verificamos si el nombre del producto (product.name) coindice con el producto que le pasamos como argumento (name). Si es así incrementamos la cantidad de producto. !!! product.name lo definimos anteriormente en el bucle forEach 

// Después de incrementar la cantidad, no olvidar escribir newQuantity = product.quantity, asignamos el nuevo valor de la cantidad a la variable newQuantity

const incrementProductQuantity = (name, element) => {
  let newQuantity;
  cartContent = cartContent.map(product => {
    if (product.name === name) {
      product.quantity++;
      newQuantity = product.quantity;
    }

    return product;
  });

  updateProductQuantityInDOM(newQuantity, element);
  emptyCart();
};

// Creamos una función para manejar el efecto de eliminar un producto al carrito, para ello, le pasamos un element
// Creamos otra función, con la que accederemos al abuelo del elemento (el button) para modificar los estilos que queramos
// Eliminamos la clase show-button de element
// Elminamos la clase product-image-container-selected

const setRemoveProductEffect = element => {
  const productContainer = element.parentElement.parentElement;
  element.classList.remove('show-button');
  productContainer.classList.remove('product-image-container-selected');
};

// Creamos una función para eliminar el producto del carrito, para ello, le pasamos dos valores, un name y un element
// Utilizamos filter para eliminar el producto cuyo nombre coincide con el parametro name. Es decir, La línea de código básicamente filtra todos los productos cuyo name no coincida con el nombre dado, eliminando de esta manera el producto que estás buscando (en este caso, el producto cuyo nombre es name).

// querySelectorAll selecciona todos los elementos que tienen un atributo data-name que coincida con el valor de name (el nombre del producto que queremos eliminar)

//La utilización de [1] más un parentElement.parentElement nos garantiza que todo el producto relacionado con el botón seleccionado deje de estar activo en la interfaz

// Reiniciar el contador de cantidad en el producto en el botón

const removeProductFromCart = (name, element) => {
  cartContent = cartContent.filter(product => product.name !== name);
  const productButtons = document.querySelectorAll(`[data-name="${name}"]`);
  productButtons[1].classList.remove('show-button');
  productButtons[1].parentElement.parentElement.classList.remove('product-image-container-selected');
  productButtons[1].children[1].textContent = 1;
  updateCartInDOM();
  if (!element) return;

  emptyCart();
  setRemoveProductEffect(element);
};

// Creamos una función y le damos dos valores, name y element
// Creamos otra función que nos dirá que si en el carrito hay un producto que es igual al product.name esté se añadirá ala variable product, si no, será undefined
// Si la cantidad es 1, llama a la función removeProductFromCart, que elimina el producto del carrito
// Si la cantidad es mayor a 1, se resta 1 a la cantidad del producto directamente.

const decrementProductQuantity = (name, element) => {
  const product = cartContent.find(product => product.name === name);
  if (product.quantity === 1) {
    removeProductFromCart(name, element);
  } else {
    product.quantity--;
    updateProductQuantityInDOM(product.quantity, element);
  }
  updateCartInDOM();
  emptyCart();
};

const emptyCart = () => {
  if (cartContent.length === 0) {
    fullCartElement.classList.add("hide");
    emptyCartElement.classList.remove("hide");
  } else {
    fullCartElement.classList.remove("hide");
    emptyCartElement.classList.add("hide");
  }
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


const addProductEffect = element => {
  const buttonQuantity = element.nextElementSibling;
  const productContainer = element.parentElement.parentElement;
  buttonQuantity.classList.add('show-button');
  productContainer.classList.add('product-image-container-selected');
  addProductToCart(element.dataset.name, element.dataset.price);
};

// Detecta el click en un elemento de la galería
// Extrae el tipo de acción desde data-type
// Si el tipo es add llama a addProductEffect 

const clickInGallery = event => {
  const type = event.target.dataset.type;

  if (!type) return;

  if (type === 'add') {
    addProductEffect(event.target);
    return;
  }

const name = event.target.parentElement.dataset.name;
  if (type === 'increment') {
    incrementProductQuantity(name, event.target.parentElement);
  } else if (type === 'decrement') {
    decrementProductQuantity(name, event.target.parentElement);
  }
  emptyCart();
};

galleryElement.addEventListener('click', clickInGallery);
filtersElement.addEventListener('click', activateFilters);

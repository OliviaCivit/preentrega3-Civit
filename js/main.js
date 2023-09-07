class Suplemento {
    constructor(nombre, precio) {
        this.nombre = nombre;
        this.precio = precio;
    }
}

class Carrito {
    constructor() {
        this.items = [];
    }

    agregarItem(suplemento) {
        if (suplemento && suplemento.nombre && suplemento.precio && !isNaN(suplemento.precio)) {
            this.items.push(suplemento);
            this.guardarCarrito();
            showMessage(`Se agregó ${suplemento.nombre} al carrito.`);
        } else {
            console.error('Los datos del suplemento no son válidos.');
    
        }
    }

    calcularTotal() {
        let total = 0;
        this.items.forEach(item => {
            total += item.precio;
        });
        return total;
    }

    limpiarCarrito() {
        this.items = [];
        this.guardarCarrito();
    }

    guardarCarrito() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    loadCart() {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                this.items = JSON.parse(savedCart);
            } catch (error) {
                console.error('Error al cargar el carrito desde localStorage:', error);
                
            }
        }
    }
}

const suplementos = [
    new Suplemento("Creatina", 15999),
    new Suplemento("Proteina", 9133),
    new Suplemento("PreWork", 11715),
    new Suplemento("Shaker", 1526)
];

document.addEventListener("DOMContentLoaded", function () {
    const productList = document.getElementById("productList");
    const cartList = document.getElementById("cartList");
    const totalAmount = document.getElementById("totalAmount");
    const checkoutButton = document.getElementById("checkoutButton");
    const messageContainer = document.getElementById("messageContainer");

    const carrito = new Carrito();

    function updateCartUI() {
        cartList.innerHTML = '';
        carrito.items.forEach((item, index) => {
            const listItem = document.createElement("li");
            listItem.textContent = `${index + 1}. ${item.nombre}: $${item.precio.toFixed(2)}`;
            cartList.appendChild(listItem);
        });

        const totalPrice = carrito.calcularTotal();
        totalAmount.textContent = totalPrice.toFixed(2);
    }

    checkoutButton.addEventListener("click", function () {
        const totalPrice = carrito.calcularTotal();
        if (totalPrice > 0) {
            showMessage(`Gracias por tu compra. Total: $${totalPrice.toFixed(2)}`);
            carrito.limpiarCarrito();
            updateCartUI();
            localStorage.removeItem('cart');
        } else {
            showMessage("El carrito está vacío.");
        }
    });

    suplementos.forEach((producto, index) => {
        const listItem = document.createElement("li");
        listItem.textContent = `${index + 1}. ${producto.nombre}: $${producto.precio.toFixed(2)}`;

        
        const addButton = document.createElement("button");
        addButton.textContent = "Agregar al Carrito";
        addButton.addEventListener("click", () => {
            carrito.agregarItem(producto);
            updateCartUI(); 
            showAddedToCartMessage(producto.nombre);
        });

        listItem.appendChild(addButton);
        productList.appendChild(listItem);
    });

    carrito.loadCart();
    updateCartUI();

    function showMessage(message) {
        messageContainer.textContent = message;
        messageContainer.classList.add('message');
    }

    function showAddedToCartMessage(productName) {
        const addedMessage = document.createElement("p");
        addedMessage.textContent = `Se agregó ${productName} al carrito.`;
        messageContainer.appendChild(addedMessage);
        setTimeout(() => {
            addedMessage.remove();
        }, 3000);
    }
});

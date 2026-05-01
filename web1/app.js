
// Importaciones
const express = require('express');
const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true })); //

// Datos (temporal)
let carrito = [];


let productos = [

  {
    categoria: "iPhone",
    id: 1,
    nombre: "iPhone 17",
    imagen: "/imagenes/iphone_17.jpg",
    descripcion: "El iPhone 17 combina diseño elegante con tecnología de última generación...",
    precio: 1500000,
    especificaciones: {
      pantalla: 'Super Retina XDR 6.3"',
      procesador: "Chip A19",
      camara: "48 MP",
      bateria: "Todo el día"
    }
  },

  {
    categoria: "iPhone",
    id: 2,
    nombre: "iPhone 16",
    imagen: "/imagenes/iphone_16.jpg",
    descripcion: "El iPhone 16 combina diseño moderno con un rendimiento potente...",
    precio: 1300000,
    especificaciones: {
      pantalla: 'Super Retina XDR 6.1"',
      procesador: "Chip A18",
      almacenamiento: "128GB / 256GB / 512GB",
      camara: "48 MP",
      bateria: "Todo el día"
    }
  },

  {
    categoria: "iPhone",
    id: 3,
    nombre: "iPhone 17e",
    imagen: "/imagenes/iphone_17e.jpg",
    descripcion: "El iPhone 17e está diseñado para ofrecer lo mejor de Apple a un precio accesible...",
    precio: 1200000,
    especificaciones: {
      pantalla: 'Super Retina XDR 6.1"',
      procesador: "Chip A19",
      camara: "48 MP",
      bateria: "Todo el día"
    }
  },

  {
    categoria: "iPhone",
    id: 4,
    nombre: "iPhone 17 Pro",
    imagen: "/imagenes/iphone_17pro.jpg",
    descripcion: "El iPhone 17 Pro lleva la innovación a otro nivel con potencia profesional...",
    precio: 2000000,
    especificaciones: {
      pantalla: 'Super Retina XDR 6.3"',
      procesador: "Chip A19 Pro",
      camara: "Triple 48 MP",
      bateria: "Todo el día"
    }
  },

  {
    categoria: "iPad",
    id: 5,
    nombre: "iPad Pro",
    imagen: "/imagenes/ipad_pro.png",
    descripcion: "El iPad Pro redefine lo que puede ser una tablet con potencia profesional...",
    precio: 2500000,
    especificaciones: {
      pantalla: 'Ultra Retina XDR',
      procesador: "Chip M4",
      almacenamiento: "256GB / 1TB",
      bateria: "10 horas"
    }
  },
  {
    categoria: "iPad",
    id: 6,
    nombre: "iPad Mini",
    imagen: "/imagenes/ipad_mini.png",
    descripcion: "El iPad mini es la combinación perfecta entre potencia y portabilidad...",
    precio: 900000,
    especificaciones: {
      pantalla: 'Liquid Retina 8.3"',
      resolucion: "2266 x 1488",
      procesador: "Chip A17 Pro",
      almacenamiento: "128GB / 256GB / 512GB",
      camara: "12 MP",
      bateria: "Hasta 10 horas"
    }
  },

  {
    categoria: "iPad",
    id: 7,
    nombre: "iPad Air",
    imagen: "/imagenes/ipad_air.png",
    descripcion: "El iPad Air combina potencia, diseño y versatilidad...",
    precio: 1200000,
    especificaciones: {
      pantalla: 'Liquid Retina 11"',
      procesador: "Chip M2",
      almacenamiento: "128GB / 256GB / 512GB",
      camara: "12 MP",
      bateria: "Hasta 10 horas"
    }
  },

  {
    categoria: "iPad",
    id: 8,
    nombre: "iPad (10ª generación)",
    imagen: "/imagenes/ipad.png",
    descripcion: "El iPad combina versatilidad, potencia y facilidad de uso...",
    precio: 800000,
    especificaciones: {
      pantalla: 'Liquid Retina 10.9"',
      procesador: "Chip A14 Bionic",
      almacenamiento: "64GB / 256GB",
      camara: "12 MP",
      bateria: "Hasta 10 horas"
    }
  },
];
    
  
// Configuración EJS
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views/pages');



// Función auxiliar (si la usás)
function obtenerAleatorios(array, cantidad) {
  return array.slice(0, cantidad);
}



// Rutas
app.get('/', (req, res) => {
  res.render('index', { productos, carrito});
});


app.get('/cart', (req, res) => {
    res.render('cart', { carrito, productos,});
});


app.get('/checkout', (req, res) => {
  res.render('checkout');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/register', (req, res) => {
  res.render('register');
});

//buscador

app.get('/search', (req, res) => {

  const query = (req.query.q || "").toLowerCase();

  const resultados = productos.filter(p =>
    p.nombre.toLowerCase().includes(query)
  );

  res.render('products', { productos: resultados, carrito
  });

});



// LISTADO DE PRODUCTOS
app.get('/products', (req, res) => {
    res.render('products', { productos, carrito });
});


// PRODUCTO POR ID
app.get('/products/:id', (req, res) => {
    const producto = productos.find(p => p.id == req.params.id);

    if (!producto) {
        const sugeridos = productos
            .sort(() => 0.5 - Math.random())
            .slice(0, 4);

        return res.status(404).render("error", {
            mensaje: "Producto no encontrado",
            sugeridos
        });
    }

    const relacionados = productos
        .filter(p =>
            p.categoria === producto.categoria &&
            p.id != producto.id
        )
        .slice(0, 4);

    return res.render("products", {
        producto,
        relacionados,
        carrito
    });
});
// Middleware para manejar datos de formularios

app.use(express.urlencoded({ extended: true }));

// Server
app.listen(3000, () => {
  console.log("Server is Ready! 🫡");
});


// Agregar al carrito
app.post('/cart/add/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const producto = productos.find(p => p.id === id);

    if (!producto) {
        return res.redirect('/products');
    }

    const existente = carrito.find(p => p.id === id);

    if (existente) {
        existente.cantidad++;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }

    res.redirect('/cart');
});


// Sumar cantidad
app.post('/carrito/sumar', (req, res) => {
    const id = parseInt(req.body.id);

    const item = carrito.find(p => p.id === id);

    if (item) item.cantidad++;

    res.redirect('/cart');
});

// Restar cantidad
app.post('/carrito/restar', (req, res) => {
    const id = parseInt(req.body.id);

    const item = carrito.find(p => p.id === id);

    if (item && item.cantidad > 1) {
        item.cantidad--;
    }

    res.redirect('/cart');
});

// Eliminar del carrito
app.post('/carrito/eliminar', (req, res) => {
    const id = parseInt(req.body.id);

    carrito = carrito.filter(p => p.id !== id);

    res.redirect('/cart');
});

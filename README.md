# Sombrerería Brave - React

Sitio web de presentación y gestión para **Sombrerería Brave**, una sombrerería artesanal chilena. La página muestra piezas destacadas (catálogo), un reportaje en Canal 13, contacto directo por WhatsApp y un panel de gestión de inventario.

---

## Qué es esta página
Esta es una landing page de presentación comercial y portafolio interactivo pensada para exhibir el catálogo de sombreros de cuero y fieltro hechos a mano, con un enfoque en la estética tradicional, el proceso creativo y el contacto rápido con los clientes a través de WhatsApp. Además, incluye un panel integrado para que el administrador pueda gestionar el stock y revisar pedidos entrantes.

---

## Para quién es
- **Taller de sombrerería o artesanos** que deseen exponer sus obras únicas.
- **Clientes y coleccionistas** interesados en adquirir sombreros hechos a mano y a medida.
- **Administradores del negocio** que necesitan controlar el stock del catálogo en línea y registrar pedidos de forma ágil.
- **Emprendedores locales** que buscan una presencia digital rápida e interactiva integrada con WhatsApp sin complejos de comercio electrónico tradicional.

---

## Tipo de página
- Página de destino / catálogo interactivo y portafolio.
- Panel de administración para gestión de stock de productos y pedidos.
- Experiencia responsiva y de carga rápida centrada en el diseño visual.

---

## Pila tecnológica
- **Vite** — empaquetador y servidor de desarrollo rápido.
- **React** — biblioteca UI para renderizar la interfaz.
- **Zustand** — gestor de estado global ligero para el carrito e inventario.
- **Supabase** — base de datos en la nube y backend para persistir productos y pedidos.
- **JavaScript (ES6+)** — lógica de la aplicación.
- **CSS3** — estilos y diseño artesanal personalizado (tonos cuero, miel y crema).
- **Git** — control de versiones.

---

## Estructura del proyecto
- `src/App.jsx` — enrutador y estructura principal de la aplicación.
- `src/main.jsx` — punto de entrada de React.
- `src/components/` — componentes comunes (`Navbar`, `ProductCard`, `ProductForm`, `ProductList`).
- `src/pages/` — páginas del sitio (`HomePage`, `CatalogoPage`, `NosotrosPage`, `ContactoPage`, `CartPage`, `CheckoutPage`, `InventarioPage`).
- `src/store/inventarioStore.js` — estado global de la tienda, carrito de compras y acciones de Supabase.
- `src/services/supabase.js` — cliente y métodos de persistencia para productos y pedidos.

---

## Siguientes pasos
1. **Seguridad**: Agregar autenticación con contraseña o login de Supabase Auth para restringir el acceso a la pestaña de Inventario a administradores autorizados.
2. **Pasarela de pago**: Integrar una pasarela para automatizar cobros antes de confirmar el pedido.
3. **Personalización**: Añadir campos para seleccionar talla, tipo de copa, color o accesorios (cintas, plumas) en la ficha del producto.
4. **Optimización de Medios**: Migrar las imágenes del catálogo a Supabase Storage para un renderizado óptimo en móviles.
5. **Animaciones**: Incorporar efectos de transición adicionales al pasar el mouse por las tarjetas del catálogo.
6. **Blog**: Agregar un blog para compartir historias y noticias relacionadas con la sombrerería.
7. **SEO**: Optimizar el sitio para motores de búsqueda.
8. **Despliegue** la página en un hosting gratuito, vercel para pruebas de paginas estaticas. No he probado con supabase.          
9. **Redes Sociales**: Agregar enlaces a redes sociales.
10. **Idioma**: Agregar un botón para cambiar el idioma del sitio web.
11. **Chat en vivo**: Agregar un chat en vivo para que los clientes puedan hacer preguntas en tiempo real.

---

## Despliegue
La aplicación está lista para ser desplegada en plataformas como **Vercel**. El despliegue automático se puede configurar para actualizarse con cada commit en la rama `main`:

1. Detecta que es un proyecto Vite.
2. Ejecuta `npm run build`.
3. Genera los archivos listos para producción en la carpeta `dist/`.
4. Sirve la app.

### Comandos locales básicos:
```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo local
npm run dev

# Compilar para producción
npm run build
```

---

## Enfoque de Desarrollo y Visión de Proyecto
Este proyecto se realiza de manera práctica y sencilla, buscando una fluidez que apoye directamente al posicionamiento de talleres locales y PYMEs en general, impulsando su transformación digital sin fricciones.

Este README documenta una primera versión funcional, pensada para crecer y adaptarse según las necesidades de la sombrerería y su presencia en línea.

import Home from "./Routes/Home.svelte";
import About from "./Routes/About.svelte";
import Contactos from "./Routes/Contactos.svelte";
import Propiedades from "./Routes/Propiedades.svelte";
import ToDo from "./Routes/ToDo.svelte";
import Login from "./Routes/Login.svelte";
import Registro from "./Routes/Registro.svelte";
import ContactosPrueba from "./Routes/ContactosPrueba.svelte";
import Producto from "./Routes/Producto.svelte";
// import { isGcsTfliteModelOptions } from "firebase-admin/lib/machine-learning/machine-learning-api-client";
// import Contacto from "./Routes/Contacto.svelte";
// import AltaPropiedad from './Routes/AltaPropiedad.svelte';


const routes = {
    '/': Home,
    '/about': About,
    '/contactos' : Contactos,
    '/propiedades' : Propiedades,
    '/todo' : ToDo,
    '/login' : Login,
    '/registro' : Registro,
    '/contactosPrueba' : ContactosPrueba,
    '/producto' : Producto,
    // '/altapropiedad': AltaPropiedad,

}

export default routes;
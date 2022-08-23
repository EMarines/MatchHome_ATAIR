<script>
import { link } from "svelte-spa-router";
import firebase from "@firebase/app";
import "@firebase/auth";

function cerrarSecion () {
  firebase.auth().signOut();
  console.log('saliste')
}

</script>

<nav class="navbar navbar-expand-lg navbar-light">
    <div class="container-fluid">
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <a class="navbar-brand" href="https://matchhome.net">MatchHome</a>
      <div class="collapse navbar-collapse" id="navbarTogglerDemo03">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">

          <!-- {#if firebase.auth = true} -->
            <li class="nav-item">
              <a class="nav-link active" aria-current="page" href="/">Home</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/contactos" use:link >Contactos</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/propiedades" use:link >Propiedades</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/todo" use:link >Tareas</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/about" use:link >About Us</a>
            </li>
            <li class="nav-item cursor:pointer">
              <p class="nav-link" href="#/login" on:click={cerrarSecion}>Cerrar Seción</p>
            </li>
            <!-- {:else} -->
            <li class="nav-item">
              <a class="nav-link" href="/login" use:link >Login</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/registro" use:link >Registro</a>
            </li> 
          <!-- {/if} -->
          </ul>


          <!-- {#if firebase.auth = true} -->
            <form class="d-flex">
              <input class="form-control me-2" type="search" placeholder="Buscar" aria-label="Search">
              <button class="btn btn-outline-success" type="submit">Contacto o Propiedad</button>
            </form>
          <!-- {/if} -->
      </div>
    </div>
  </nav>


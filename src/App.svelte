<script>
	// import Bitacora from './Bitacora.svelte';
	import Router from 'svelte-spa-router';
	import routes from './routes.js';
	import Navbar from './Navbar.svelte';
	// import Bitacora from '../src/Routes/Bitacora.svelte';
	// import toastr from 'toastr'
</script>
<Navbar />
<Router {routes} />


<main>
</main>


<style>

</style>
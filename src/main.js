import App from './App.svelte';
import './firebase'

// import 'bootswatch/dist/flatly/bootstrap.min.css';
import 'toastr/build/toastr.min.css';
import 'toastr/build/toastr.min.js';

const app = new App({
	target: document.body,
	props: {
	}
});

export default app;
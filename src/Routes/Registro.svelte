<script>
    import firebase from "@firebase/app";
    import "@firebase/auth";

    
    let email;
    let password;
    let confirmPassword;
    let show = false;
    let user = {};
    
    function handleSubmit(event) {
        event.preventDefault();
        firebase.auth().createUserWithEmailAndPassword(email, password)
        .then (function (credentials) {
            console.log(user)
    })           
    .catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage, errorCode);
        show = true;
          })
    .then(function(){
        window.location.href='/'
    })
}
firebase.auth().onAuthStateChanged(function(user){


})

</script>

    <div class="container">
        <form class='register form' name="register" on:submit|preventDefault={handleSubmit}>  
            <h3>Registro</h3>  
            <label class="form_label">Email
                <input required type="email" name='email' bind:value={email}>  
            </label>
            <label class="form_label">Password
                <input required type="password" name='password' bind:value={password} >
            </label>
            <label class="form_label">Confirmar Password
                <input required type="password" name='password' bind:value={confirmPassword} >
            </label>
            {#if show}  
                <p class="error" display="none">Ya existe un usuario registrado con este correo</p>  
            {/if}
            <button>
                Registrarme
            </button>
        </form>
    </div>
    

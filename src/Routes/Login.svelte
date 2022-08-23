<script>
import firebase from "@firebase/app";
import "@firebase/auth";

let email;
let password;

function handleSubmit() {
    // event.preventDefault();
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then(function(){
        console.log("Estas Logeado")
        window.location.href='/'
    })
    .catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
       console.log(errorMessage, errorCode);
       window.location.href='#/registro'
      })
};

</script>

    <div class="container">
        <form class='register form' on:submit|preventDefault={handleSubmit}>  
            <h3>Login</h3>  
            <label class="form_label">Email
                <input required type="email" name='email' bind:value={email}>  
            </label>
            <label class="form_label">Password
                <input required type="password" name='password' bind:value={password} >
            </label>
            <button>
                Registrarme
            </button>
        </form>
    </div>

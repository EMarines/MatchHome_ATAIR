<!-- <script>
  import firebase from "@firebase/app";
  import "@firebase/firestore";
  import "@firebase/storage";

  let avatar, fileinput;
  
  function onFileSelected(e) {
    let image = e.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = (e) => {
      avatar = e.target.result;

      const storageRef = firebase.storage().ref(); // crea la referencia a firebase
      let task = storageRef.child("propiedades/" + image.name).put(image); // crea un subcarpeta y guarda la imagen con el nombre de 
      task.on(
        "state_changed",
        function progress(snapshot) {
          var percentge =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          uploader.value = percentge;
        },
        function error(err) {
          console.log(err.message);
        },
        ()=> {uploader.value = 100;
            task.snapshot.ref.getDownloadURL().then((url)=> {
                avatar = url;
                console.log(avatar);
            })}
      );
    };
  }

 
</script>

<div id="app" class="app1">
  <h1>Upload Image</h1>

  {#if avatar}
    <img class="avatar" src={avatar} alt="d" />
  {:else}
    <img
      class="avatar"
      src="https://cdn4.iconfinder.com/data/icons/small-n-flat/24/user-alt-512.png"
      alt=""
    />
  {/if}

  <img
    class="upload"
    src="https://static.thenounproject.com/png/625182-200.png"
    alt=""
    on:click={() => {
      fileinput.click();
    }}
  />
  <div
    class="chan"
    on:click={() => {
      fileinput.click();
    }}
  >
    Choose Image
  </div>
  <input
    style="display:none"
    type="file"
    accept=".jpg, .jpeg, .png"
    on:change={(e) => onFileSelected(e)}
    bind:this={fileinput}
  />
  <progress vaule="0" max="100" id="uploader">0%</progress>
</div>

<style>
  .app1 {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-flow: column;
  }

  .upload {
    display: flex;
    height: 50px;
    width: 20px;
    cursor: pointer;
  }
  .avatar {
    display: flex;
    height: 50px;
    width: 50px;
  }
</style> -->

import { writable } from 'svelte/store'
import { db } from "../firebase";
import { properties } from '../Routes/assets/db'
import "@firebase/firestore";
import "@firebase/storage";

export const propId = writable();
export const contacSelec = writable();
export const propertiesC= writable();
// export const onFileSelected = writable();  //experimental no probado


// ***** Selecciona el archivo para subir la imagen con barra de progreso
//   function onFileSelected(e) {
//     let image = e.target.files[0];
//     let reader = new FileReader();
//     reader.readAsDataURL(image);
//     reader.onload = (e) => {
//       avatar = e.target.result;

//     const storageRef = firebase.storage().ref(); // crea la referencia a firebase
//       let task = storageRef.child("propiedades/" + image.name).put(image); // crea un subcarpeta y guarda la imagen con el nombre de
//       task.on(
//         "state_changed",
//         function progress(snapshot) {
//           var percentge =
//             (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//           uploader.value = percentge;
//         },
//         function error(err) {
//           console.log(err.message);
//         },
//         () => {
//           uploader.value = 100;
//           task.snapshot.ref.getDownloadURL().then((url) => {
//             avatar = url;
//             console.log(avatar);
//           });
//         }
//       );
//     };
//   }

export const updateContact = async () => {
    await db.collection("contacts").doc(currentId).update(contact);
    // toastr.success('Contacto editado correctamente', {
      //   timeOut: 1000,
      //   progressBar: true,
      //   positionClass: 'toast-bottom-full-width'
      // })
    // show = true;
    
    contact = {};
    window.location.href='/'   
};
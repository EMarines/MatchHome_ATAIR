<!-- <script>
  
import { db } from "../firebase";
// import firebase from "@firebase/app";
import "@firebase/firestore";
import { propId } from '../stores/store'
// const property = require("./Propiedades")

// $console.log("el producto es:" + $propId) 

// const selectProduct = async (id) => {
//     await db.collection("properties").doc(id).get()
//     .then;
//   };
function comeBack() {
  window.location.href='#/propiedades'
}

    // function gotoLink(){
    //   window.location='https://www.google.com/', target='_blank'
    // }
    const deleteProperty = async (id) => {
    console.log(property.id);
    await db.collection("properties").doc(id);
  };

  const editProperty = (currentProperty) => {
    window.location.href='#/altapropiedad'
    // console.log(currentProperty)
    // editStatus = true;
    // show = true;
    // property.nameProperty = currentProperty.nameProperty;
    // property.price = currentProperty.price;
    // property.beds = currentProperty.beds;
    // property.bathroom = currentProperty.bathroom;
    // property.areaBuilding = currentProperty.areaBuilding;
    // property.areaTotal = currentProperty.areaTotal;
    // property.urlImage = currentProperty.urlImage;
    // property.description = currentProperty.description;
    // currentId = currentProperty.id;
  };

  const viewProperty = () => {

    // window.location.href = {$propId.urlProp};
    console.log($propId.urlProp)
  }



  </script>

<div class="selectProduct">  
  
    <div class="selectImage">
      <img src={$propId.urlImage} alt={$propId.nameProperty}>
    </div>    
    
    <div class="descSelect">
      <h3>{$propId.nameProperty}</h3>
      <h6>{$propId.beds} Recamaras</h6>
        <h6>{$propId.bathroom} baños</h6>
        <h6>{$propId.areaBuilding} m2 de construcción</h6>
        <h6>{$propId.areaTotal} de terreno</h6>
        
        <p class="descSelec">{$propId.description}</p>
      </div>
  
      <div class="folowLink">
        <a href={$propId.urlProp} target='_blank'>Seguir Link en Otra Ventana</a>        
      </div>

      <div class="optionsSend" >
        <button>Enviar por WhatsApp</button>
        <button>Enviar por Mail</button>
      </div>
      <div class="backAnt">
        <button on:click={comeBack}>Regresar</button>
      </div>
  Material icons -->
      <!-- <div class="iconContent">
        <i on:click={editProperty($propId)}
          class="material-icons cursor:pointer edit">edit</i>
        <i on:click={viewProperty($propId)}
        class="material-icons irLink"> pageview </i>
        <i on:click={deleteProperty($propId)}
          class="material-icons cursor:pointer delete" >delete_forever</i>
      </div>
</div> -->
 

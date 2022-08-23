<script>
  import { db } from "../firebase";
  import firebase from "@firebase/app";
  import "@firebase/firestore";
  import "@firebase/storage";
  import { propId } from "../stores/store";

  let avatar, fileinput;
  let show = false;
  let properties = [];
  let editStatus = "false";
  let currentId;

  let property = {
    nameProperty: "",
    price: "",
    beds: "",
    bathroom: "",
    areaBuilding: "",
    areaTotal: "",
    description: "",
    urlImage: "",
    urlProp: "",
  };

  // Importa la Base de Contactos de Firebase
  db.collection("properties").onSnapshot((querySnapshot) => {
    let docs = [];
    querySnapshot.forEach((doc) => {
      docs.push({ ...doc.data(), id: doc.id });
    });
    properties = [...docs];
  });

  // Manejo de Propiedades
  const handleSubmit = () => {
    if (!editStatus) {
      addProperty();
    } else {
      updateProperty();
    }
    property = {};
  };

  const updateProperty = async () => {
    await db.collection("properties").doc(currentId).update(property);
    show = false;
  };

  const addProperty = async () => {
    await db
      .collection("properties")
      .doc()
      .set({ ...property, createdAt: Date.now() });
    property = {};
    show = false;
  };

  const onCancel = () => {
    editStatus = false;
    show = false;
    property = {};
  };

  const cleaFind = () => {
    show = true;
    editStatus = false;
    console.log(db);
  };

  const editProperty = (currentProperty) => {
    editStatus = true;
    show = true;
    property.nameProperty = currentProperty.nameProperty;
    property.price = currentProperty.price;
    property.beds = currentProperty.beds;
    property.bathroom = currentProperty.bathroom;
    property.areaBuilding = currentProperty.areaBuilding;
    property.areaTotal = currentProperty.areaTotal;
    property.urlImage = currentProperty.urlImage;
    property.description = currentProperty.description;
    currentId = currentProperty.id;
  };

  const deleteProperty = async (id) => {
    console.log(property.id);
    await db.collection("properties").doc(id);
  };

  const uploadImage = () => {
    //   ref = firebase.storage().ref();
    console.log(ref);
  };

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
        () => {
          uploader.value = 100;
          task.snapshot.ref.getDownloadURL().then((url) => {
            avatar = url;
            console.log(avatar);
          });
        }
      );
    };
  }

  const selectProduct = async (property) => {
    console.log(property.id);
    $propId = property;
    window.location.href = "#/producto";
  };

  let result = [];

  let venta;
  let renta;
  let selecTP;
  let selecTO;
  let numBeds;
  let numBaths;
  let numPark;
  let rangeProp;
  let lowRange;
  let upRange;

  
  const filClear =() =>{
    if (numBeds == "Recámaras")
    numBeds = 0
    if (numBaths == "Baños")
    numBaths = 0
    if (numPark == "Estacionamientos")
    numBeds = 0
  }

let select;
  function ranPrice ()  {

    switch (rangeProp) {
      case "Rango":
        lowRange = 0
        upRange = 999999999
        console.log("rango")
        break;
      case "PRM":
        lowRange = 0
        upRange = 1000000
        console.log("primer ")
        break;
      case "SGN":
        lowRange = 100001
        upRange = 2500000
        break;
      case "TRC":
        lowRange = 2500001
        upRange = 5000000
        break;
      case "CRT":
        lowRange = 5000001
        upRange = 8000000
        break;
      case "QNT":
        lowRange = 8000001
        upRange = 12000000
        break;
      case "SXT":
        lowRange = 12000001
        upRange = 99999999
        break;
    }
  }

  const buscarProp = () => {
    filClear()
    ranPrice()
    console.log(selecTP + numBeds + numBaths + rangeProp+ lowRange + upRange);
    let result = properties.filter(function (prop, index) {
      return (
        prop.price >= lowRange &&
        prop.price <= upRange &&
        prop.beds >= numBeds &&
        prop.bathroom >= numBaths
        );
      });
      if(result.length == 0){
      console.log("No hay resultados con este criterio de busqueda")
    }else{
      console.log("Hay " + result.length + " resultados con este criterio de busqueda")
      console.log(result)

    }
  };

  let typeProperties = [
    "Tipo de Propiedad",
    "Casa",
    "Terreno",
    "Departamento",
    "Casa o Departamento",
    "Local Comercial",
  ];

  let operations = ["Tipo de Operación", "Venta", "Renta"];
  let ranges = ["Rango", "PRM", "SGN", "TRC", "CRT", "QNT", "SXT", "SPT"];
  let numberBeds = ["Recámaras", 1, 2, 3, 4, "+5"];
  let numberBaths = ["Baños", 1, 2, 3, "+4"];
  let numberParks = ["Estacionamientos", 1, 2, 3, "+4"];

  
</script>


<main>
<!-- // Tarjeta para Mostar Propiedades -->
{#if show}
  <!-- Formulaio alta Propiedad -->
  <section>
    <form on:submit|preventDefault={handleSubmit}>
      <div class="container">
        <div class="form-group row">
          <div class="col">
            <input
              required
              type="text"
              placeholder="Nombre de la Propiedad"
              bind:value={property.nameProperty}
              class="form-control"
            />
          </div>
          <div class="col">
            <input
              type="number"
              placeholder="Recámaras"
              bind:value={property.beds}
              class="form-control"
            />
          </div>
        </div>

        <!-- // Rango Presupuesto -->
        <div class="form-group row">
          <div class="col">
            <input
              type="number"
              placeholder="Baños"
              bind:value={property.bathroom}
              class="form-control"
            />
          </div>
          <div class="col">
            <input
              type="number"
              placeholder="M2 de Construcción"
              bind:value={property.areaBuilding}
              class="form-control"
            />
          </div>
          <div class="col">
            <input
              type="number"
              placeholder="M2 de terreno"
              bind:value={property.areaTotal}
              class="form-control"
            />
            <input
              type="text"
              placeholder="url Imagen"
              bind:value={property.urlImage}
              class="form-control"
            />
            <div class="col">
              <input
                type="number"
                placeholder="Precio"
                bind:value={property.price}
                class="form-control"
              />
              <div class="col">
                <textarea
                  type="string"
                  placeholder="Descripción"
                  bind:value={property.description}
                  class="form-control"
                />
              </div>
            </div>
          </div>
        </div>
        <div>
          {#if avatar}
            <img class="avatar" style=" width: 200px" src={avatar} alt="d" />
          {:else}
            <img
              style=" width: 50px"
              class="avatar"
              src="https://cdn4.iconfinder.com/data/icons/small-n-flat/24/user-alt-512.png"
              alt=""
            />
          {/if}

          <img
            class="upload"
            style=" width: 50px"
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
            bind:value={property.urlImage}
          />
          <progress vaule="0" max="100" id="uploader">0%</progress>
        </div>

        <div class="align-center">
          <div class="col">
            <button class="btn-outline-primary col-3 row">
              {#if !editStatus}Guardar{:else}Editar{/if}
            </button>
            <button
              class="btn-outline-success col-3 row mt-2"
              on:click={uploadImage}>Subir Imagen</button
            >
          </div>

          <div class="col">
            <button
              class="btn-outline-warning col-3 row mt-2"
              on:click={onCancel}>Cancel</button
            >
          </div>
        </div>
      </div>
    </form>
  </section>
{/if}

<!-- Llenado de tarjeta de propiedades -->
<!-- {#if !show} -->
  <div class="contGral">
    <div class="filterProperties">
      <div class="fliterFeatures">
        <div class="filterFeaturesF">
          <!-- // TIPO DE PRIPIEDAD -->
          <select bind:value={selecTP}>
            {#each typeProperties as typeProperty}
              <option type="checkbox" value={typeProperty}
                >{typeProperty}</option
              >
            {/each}
          </select>

          <select bind:value={selecTO}>
            {#each operations as operation}
              <option type="checkbox" value={operation}>{operation}</option>
            {/each}
          </select>

          <select bind:value={rangeProp}>
            {#each ranges as range}
              <option type="checkbox" value={range}>{range}</option>
            {/each}
          </select>

        </div>

        <!-- // NUMERO DE RECÁMARAS -->

        <div class="filterFeaturesF">
          <select bind:value={numBeds}>
            {#each numberBeds as numberBed}
              <option type="checkbox" value={numberBed}>{numberBed}</option>
            {/each}
          </select>

          <select bind:value={numBaths}>
            {#each numberBaths as numberBath}
              <option type="checkbox" value={numberBath}>{numberBath}</option>
            {/each}
          </select>

          <select bind:value={numPark}>
            {#each numberParks as numberPark}
              <option type="checkbox" value={numberPark}>{numberPark}</option>
            {/each}
          </select>
        </div>
      </div>

      <div class="filterLacation">
        <div class="filterLacationOne">
          <label for="north"
            >/Norte
            <input type="checkbox" name="north" id="north" />
          </label>
        </div>

        <div class="filterLacationOne">
          <label for="northwest"
            >/NorOeste
            <input type="checkbox" name="northwest" id="northwest" />
          </label>
          <label for="northeast"
            >/NorEste
            <input type="checkbox" name="northeast" id="northeast" />
          </label>
        </div>

        <div class="filterLacationOne">
          <label for="west" name="north"
            >/Oeste
            <input type="checkbox" name="north" id="west" />
          </label>
          <label for="town"
            >/Centro
            <input type="checkbox" name="town" id="town" />
          </label>
          <label for="east"
            >/Oeste
            <input type="checkbox" name="east" id="east" />
          </label>
        </div>

        <div class="filterLacationOne">
          <label for="southwest"
            >/SurOeste
            <input type="checkbox" name="southwest" id="southwest" />
          </label>
          <label for="south"
            >/Sur
            <input type="checkbox" name="south" id="south" />
          </label>
          <label for="southeast"
            >/SurEste
            <input type="checkbox" name="southeast" id="southeast" />
          </label>
        </div>
      </div>
      <div class="labelsProperty">
        <label for="oneflor"
          >Una Planta
          <input type="checkbox" name="oneflor" id="oneflor" />
        </label>
        <label for="bedfirst"
          >Recámara en PB
          <input type="checkbox" name="bedfirst" id="bedfirst" />
        </label>
        <label for="privFracc"
          >Fraccionamiento Privado
          <input type="checkbox" name="privFracc" id="privFracc" />
        </label>
        <label for="frontpark"
          >Frente a Parque
          <input type="checkbox" name="frontpark" id="frontpark" />
        </label>
        <label for="readylive"
          >Lista para Habitarse
          <input type="checkbox" name="readylive" id="readylive" />
        </label>
        <label for="new"
          >Nueva
          <input type="checkbox" name="new" id="new" />
        </label>
      </div>
      <div class="desFind">
        <p>{selecTP} en {selecTO} en {rangeProp} rango de precio, con {numBeds} recámaras
          {numBaths} baños y {numPark} estacionamientos.</p>
        <button on:click={buscarProp}>Bucar Propiedades</button>
        
      </div>
    </div>

  </div>
<!-- {/if} -->
</main>
<script>
// *- C O D I G O
  // *- IMPORTACIONES
        import { db } from "../firebase";
        import "@firebase/firestore";
        import "@firebase/storage";
        import { scale } from 'svelte/transition';
        import { expoInOut } from 'svelte/easing';
        import Search from "./Search.svelte";
        import NoResults from "./NoResults.svelte";
        import { typeProperties, modeContact, typeContacts, modePays, ranges, oneTofive, oneToFour, contactMode, operations } from '../stores/parameters';
        import {propertiesI} from '../stores/jsonProperties'

  // *- DECLARACIONES Y ARRAYS
      // Variables
        let avatar, fileinput;
        let editStatus;
        let currentId;
        let selecTP;
        let selecTO;
        let numBeds;
        let numBaths;
        let numPark;
        let commBinnacle;
        let colonia;
        let rangeProp;
        let lowRange;
        let upRange;
        let systStatus = "start";
        let searchTerm = "";
        let message = "";
        let contacts = [];
        let checkedContacts = [];
    
      // Declaracion de Arrays
        let properties = [];
        let reqFiltered = [];
        let contact = [];
        let currentIdC;
    
      // Decraracion de Prperty
        let property = {
          typeProperty: "",
          claveEB: "",
          claveMH: "",
          nameProperty: "",
          price: "",
          beds: "",
          bathroom: "",
          halfBathroom: "",
          park: "",
          areaBuilding: "",
          areaTotal: "",
          description: "",
          urlImage: "",
          urlProp: "",
          urlSinergy: "",
          colonia: "",
          tagsProperty: [],
          locaProperty: [],
          binnacle: [],
        };

      // Decalracion de binnacle
        let binnacle = {
          date: "",
          commBinnacle: ""
        };


  // *- IMPORTA LA COLECCIÓN DE FIREBASE

        // Importa la base de propiedades
          db.collection("properties").onSnapshot((querySnapshot) => {
            let docs = [];
            querySnapshot.forEach((doc) => {
            docs.push({ ...doc.data(), id: doc.id });
            });
            properties = [...docs];
          });	

        // Base de contactos
          db.collection("contacts").onSnapshot((querySnapshot) => {
            let docs = [];
            querySnapshot.forEach((doc) => {
              docs.push({ ...doc.data(), id: doc.id });
            });
            contacts = [...docs];            
          });

        // Base de bitácora
            db.collection("binnacles").onSnapshot((querySnapshot) => {
            let docs = [];
            querySnapshot.forEach((doc) => {
              docs.push({ ...doc.data(), id: doc.id });
            });
            binnacle = [...docs];            
          });
    
  // *- FUNCIONES
      // Asignación de Rango
        function ranPrice() {
            switch (rangeProp) {
            case "Rango":
              lowRange = 0;
              upRange > 1;
              console.log("rango");
              break;
            case "PRM":
              lowRange = 0;
              upRange = 1000000;
              console.log("primer ");
              break;
            case "SGN":
              lowRange = 100001;
              upRange = 2500000;
              break;
            case "TRC":
              lowRange = 2500001;
              upRange = 5000000;
              break;
            case "CRT":
              lowRange = 5000001;
              upRange = 8000000;
              break;
            case "QNT":
              lowRange = 8000001;
              upRange = 12000000;
              break;
            case "SXT":
              lowRange = 12000001;
              upRange = 99999999;
              break;
            }
          }
    
    
  // *- CRUD PROPERTIES
      // Manejo de Propiedades OnSubmit
        // Alta o edición
            const handleSubmit = () => {
              if (!editStatus) {
                systStatus = "propAdd"
                addProperty(property);
              } else {
                systStatus = "propEditing"
                updateProperty(property.claveEB);
              }
              property = {};
            };

        // Agrega la propiedad
            const addProperty = async () => {
              console.log(typeof(property))
              commBinnacle = (`Se le agregó la propiedad: ${property.claveEB}`)
              binnacle = {"date": Date.now(), "comment": commBinnacle}
              await db.collection("properties").doc().set({ ...property, createdAt: Date.now() });
              saveBinnacle(binnacle);
              property = {};             
              systStatus = "start"
              window.location.href='/'
            };

        // Edita la propiedad
              const updateProperty = async () => {  
                commBinnacle = (`Se le editó la propiedad", ${property.claveEB}`)
                binnacle = {"date": Date.now(), "comment": commBinnacle}
                await db.collection("properties").doc(currentId).update(property);
                saveBinnacle(binnacle);
                property = {};
                systStatus = "start"
                window.location.href='/'
              };

        // Eliminar Propieadd
              const deleteProperty = async (id) => {
                  let confDelete = confirm("Deseas eliminarla definitivamente?")
                  if(confDelete == true){
                    commBinnacle = (`Se le eliminó: ${property.nameProperty}`)
                    binnacle = {"date": Date.now(), "comment": commBinnacle} 
                    await db.collection("properties").doc(id).delete();
                    systStatus = "start"
                    property = {};
                  }
              };

        // Muestra la propiedad seleccionada
              const showAddProperty = () => {
                systStatus = "propAdd"
              }

        // Subir Imagen 2
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

  

        // Botón Cancelar
            const onCancel = () => {
              editStatus = false;
              systStatus = "start"
              clearFind();
              searchTerm="";
            };

        // Limpiar Busqueda
              const cleaFind = () => {
                show = true;
                editStatus = false;
                // console.log(db);
              };

        // Editar Producto
              const editProperty = (property) => {
                systStatus ="propEditing"
              };

        // Llena el Formulario de propiedad seleccionada
              const selectProduct = (currentProperty) => {
                editStatus = true;
                property.selecTP = currentProperty.selecTP
                property.nameProperty = currentProperty.nameProperty;
                property.claveEB = currentProperty.claveEB;
                property.claveMH = currentProperty.claveMH;
                property.price = currentProperty.price;
                property.beds = currentProperty.beds;
                property.bathroom = currentProperty.bathroom;
                property.halfBathroom = currentProperty.halfBathroom;
                property.park = currentProperty.park;
                property.colonia = currentProperty.colonia;
                property.areaBuilding = currentProperty.areaBuilding;            
                property.areaTotal = currentProperty.areaTotal;
                property.tagsProperty = currentProperty.tagsProperty;
                property.locaProperty = currentProperty.locaProperty;
                property.urlImage = currentProperty.urlImage;
                property.urlProp = currentProperty.urlProp;
                property.urlSinergy = currentProperty.urlSinergy;
                property.description = currentProperty.description;
                currentId = currentProperty.id;
                searchTerm = "";
                systStatus = "propSelect"
                reqFiltered = "";
                // console.log(property)
              };

          // Limpia el Filtro Serch
              const cleaFilter = () => {
                reqFiltered = {};
                property = {};
                systStatus = "start"
              }


  // *- FILTRO
        // Filtro por caracterisísticas
              function fitRequires(){

                  reqFiltered = contacts;
                  // console.log(reqFiltered)

                  if (property.beds > 0) {
                    // console.log(reqFiltered)
                    reqFiltered = reqFiltered.filter((item) => item.numBeds <= property.beds);
                  // console.log(reqFiltered)
                  };
                  if (property.bathroom > 0) {
                  reqFiltered = reqFiltered.filter((item) => item.numBaths <= property.bathroom);
                  // console.log(reqFiltered)
                  };
                  if (property.park > 0) {
                    reqFiltered = reqFiltered.filter((item) => item.numParks <= property.park);
                  };
                  // console.log(reqFiltered)

                  // Filtra por Rango
              if(property.price){
                console.log("estas dentro de budget", contact.budget)

                lowRange=(property.price * .7)
                upRange=(property.price * 1.1)
                // console.log(lowRange, upRange, reqFiltered)
                reqFiltered = reqFiltered.filter(function (prop) {
                  return (
                    prop.budget >= lowRange &&
                    prop.budget <= upRange
                    );
                  });             
                }                  
                else {
                // console.log("estas dentro de range", contact.budget)


                  ranPrice(property.rangeProp);
                  reqFiltered = reqFiltered.filter(function (prop, index) {
                    return (
                      prop.price >= lowRange &&
                      prop.price <= upRange
                      );
                    });
                  };
                  // console.log(reqFiltered)

        // Filtra por Etiquetas
                  if(property.tagsProperty.length > 0){
                    reqFiltered = reqFiltered.filter(e => property.tagsProperty.some(c => e.tagsProperty.includes(c)))};
                    console.log("Estas en tagsProperty", reqFiltered.locaProperty.length)
                    
                    
        // Filtra por Ubicación     ******************************** DESACTIVADO POR QUE LA DB ESTÁ MAL ****************
                  //   if(property.locaProperty.length > 0){
                  //   console.log("propiedad", property.locaProperty, reqFiltered)
                  //   console.log("estoy dentro de locaProperty")
                  //   {reqFiltered = reqFiltered.filter(e => (property.locaProperty).some(c => (e.locaProperty).includes(c)))
                  //     console.log("filtro por ubiacion", reqFiltered.length)
                  //   };
                  // }

        // Filtra por rango de precios
                  console.log("elejiste rango", rangeProp);
                  if(property.price){
                    lowRange=(property.price * .7)
                    upRange=(property.price * 1.1);
                    reqFiltered = reqFiltered.filter(function (prop, index) {
                      return (
                        prop.budget >= lowRange &&
                        prop.budget <= upRange
                        );
                      });
                  }
                  
                  if (property.rangeProp) {
                    ranPrice(property.rangeProp);
                    reqFiltered = reqFiltered.filter(function (prop, index) {
                      return (
                      prop.price >= lowRange &&
                      prop.price <= upRange                      
                      );
                    })
                    console.log(reqFiltered)
                  };

          // Muestra resultados de la busqueda 
                  if (reqFiltered.length === 0) {
                    message = "No hay resultados con este criterio de busqueda";
                    console.log(message)
                  } else {
                    message = "Se encontraron " + reqFiltered.length + " propiedades con este criterio de busqueda";
                    // console.log(message);
                  }  
                  console.log(reqFiltered.length) 
                  console.log(reqFiltered)

              };
  // *- Otros
          // Limpia formato y filtro (Boton Borrar)
                  const clearFind = () => {
                    property = {};
                    // systStatus = "start"
                    // fitRequires();
                    window.location.href='#/'
                  };
    
          // Search input (nameProperty and colonia)
                  const searchBooks = () => {
                    systStatus = "propSearch"
                    return (reqFiltered = properties.filter((property) => {
                    let propTitle = (property.nameProperty + property.colonia).toLowerCase();
                    return propTitle.includes(searchTerm.toLowerCase());
                    }));
                  };
    
          // Muestra el Formulario alta o edición
                  const showFilters = () => {
                    searchTerm = "";
                    systStatus = "propFilter";
                  };

          // Abre el link de la propiedad (pendiente)
                const viewProperty = ()=> {
                  // window.open{property.urlProp}
                }
          // Busca posibles interesados de una propiedad

                const findCustomers = () => {
                  systStatus = "findPotContacts"
                  // console.log(reqFiltered)
                  fitRequires(reqFiltered)
                };    

  // *- Bitácora
        // Contactos posibles interesados para propiedades
              const checkedTCont = (checkedContacts, property) => {
                    if(checkedContacts.length == 0){
                      alert("Tienes que seleccionar al menos un contacto");
                    } else { 
                    checkedContacts.forEach((contact) => {       
                      commBinnacle = (`Se le envió a: ${contact.name} ${contact.lastname } ${property.claveEB} al ${ contact.telephon}`);
                      binnacle = {"date": Date.now(), "comment": commBinnacle}
                      saveBinnacle(binnacle);
                    });
                    };                    
                  };

        // Agrega entrada a la bitácora
                const saveBinnacle = async () => {
                await db.collection("binnacles") .doc().set({ ...binnacle});
                systStatus = "start"
                window.location.href='/'
                };

  // *- Formatos fecha y teléfono

                function dateFormat(date){
                  let dia = (fecha.getDate());
                  let mes = (mesAnyo[fecha.getMonth()]);
                  let ayo = (fecha.getfullYear())
                  return dateToshow= (dia,"/",mes,"/",ayo)
                }



</script>
<!-- *- L A Y O U T  -->
  <!-- *- SELECCION DE CARACTERISÍSTICAS PARA BUSQUEDA DE PROPIEDADES ""propFilter""-->
      <!-- Clases -->

        {#if systStatus === "propFilter"}
          <section class="contGral">
            <div class="filterProperties">
            <div class="fliterFeatures">
              <div class="filterFeaturesF">
      <!-- Tipo de Propiedad -->
            <select class="selTP" id="selTP" name="selTP" bind:value={selecTP}>
              <option disabled selected value="">Tipo de Propiedad</option>
              {#each typeProperties as typeProperty}
                <option type="checkbox" value={typeProperty}
                >{typeProperty}</option
              >
              {/each}
            </select>
    
      <!-- Tipo de Operación -->
            <select class="selTO" id="selTO" name="selTO" bind:value={selecTO}>
              <option disabled selected value="">Tipo de Operación</option>
              {#each operations as operation}
              <option type="checkbox" value={operation}>{operation}</option>
              {/each}
            </select>
    
            <select bind:value={rangeProp}>
              <option disabled selected value="">Rango Buscado</option>
              {#each ranges as range}
              <option type="checkbox" value={range}>{range}</option>
              {/each}
            </select>
            </div>
    
      <!-- Numero de Recámaras, Baños y Estacionamientos -->
            <div class="filterFeaturesF">
            <select bind:value={property.beds}>
              <option disabled selected value=""># Recámaras</option>
              {#each oneTofive as numBeds}
              <option type="checkbox" value={numBeds}
                >{numBeds} Recámaras</option
              >
              {/each}
            </select>
            <select bind:value={property.bathroom}>
              <option disabled selected value=""># Baños</option>
              {#each oneTofive as numBaths}
              <option type="checkbox" value={numBaths}
                >{numBaths} baños</option
              >
              {/each}
            </select>
            <select bind:value={property.park}>
              <option disabled selected value=""># Estacionamientos</option>
              {#each oneTofive as numPark}
              <option type="checkbox" value={numPark}
                >{numPark} estacionamientos</option
              >
              {/each}
            </select>
            </div>
          </div>
    
      <!-- Ubicación -->
            <section class="filterLocation">
           
              <div class="filterLocationOne">                        
                <label for="north">/Norte\
                  <input value="Norte" type="radio" name="north" id="north" bind:group={property.locaProperty} />
                </label>  
              </div>
      
              <div class="filterLocationOne">  
                <label for="northwest">/NorOeste
                  <input value="NorOeste" type="radio" name="northwest" id="northwest" bind:group={property.locaProperty} />
                </label>
  
                <label for="northeast">NorEste\
                  <input value="NorEste" type="radio" name="northeast" id="northeast" bind:group={property.locaProperty} />
                </label>
              </div>  
  
              <div class="filterLocationOne">
                <label for="west">/Oeste
                  <input value="Oeste" type="radio" name="west" id="west" bind:group={property.locaProperty} />
                </label>
  
                <label for="townNorth"
                  >Centro Norte
                  <input value="CentroNorte" type="radio" name="townNorth" id="townNorth" bind:group={property.locaProperty} />
                </label>
                
                <label for="east"
                  >Este\
                    <input value="Este" type="radio" name="east" id="east" bind:group={property.locaProperty} />
                  </label>
              </div>
              
              <div class="filterLocationOne">
                <label for="townsouth"
                  >/Centro Sur\
                  <input value="CentroSur" type="radio" name="townsouth" id="townsouth" bind:group={property.locaProperty} />
                </label>
              </div>
      
              <div class="filterLocationOne">
                <label for="southwest"
                  >/SurOeste
                  <input value="SurOeste" type="radio" name="southwest" id="southwest" bind:group={property.locaProperty} />
                </label>
  
                <label for="southeast"
                  >SurEste\
                  <input value="SurEste" type="radio" name="southeast" id="southeast" bind:group={property.locaProperty} />
                </label>              
              </div>
              
            </div>

    
      <!-- Seleccion y Botones -->
          <div class="desFind">
          <p>
            {selecTP} en {selecTO} en {rangeProp} rango de precio, con {numBeds} recámaras{numBaths}
            baños y {numPark} estacionamientos.
          </p>
          <button class="btnFind" on:click={findCustomers}>Bucar Propiedades</button>
          <button class="clearFind" on:click={clearFind}>Borrar Busqueda</button>
          </div>
        </section>
        {/if}
    
  <!-- *- TARJETAS CON PROPIEDADES ""start""-->
      <!-- Boton Filtrar y Search -->
        
        <main id="bookshelf">
          {#if systStatus === "start" || systStatus === "propSearch"}
            <section id="query-section">
              <button class="btnCommon"  on:click={showAddProperty}>Subir Propiedad</button>
              <button class="btnCommon" on:click={showFilters}>Filtrar Propiedades</button>
              <Search bind:searchTerm on:input={searchBooks} />
              <button class="btnCommon btnCancel"  on:click={cleaFilter}>Cancelar</button>
            </section>
          {/if}
          
          <!-- Usando Search -->
            {#if systStatus === "start" || systStatus === "propSearch"}
              {#if searchTerm && reqFiltered.length === 0}
                <NoResults />
                {:else if reqFiltered.length > 0}
                  {#each reqFiltered as property}
                    <section on:click={selectProduct(property)} class="book "
                        transition:scale={{duration: 500, easing: expoInOut}}>                  
                      <section class="book-top-info" >
                        <figure class="bkcont" >
                          <img src={property.urlImage} alt={property.nameProperty} class="bkcover" >
                          <div class="language">{property.colonia}</div>
                          <figcaption>{property.nameProperty}</figcaption>
                        </figure>
                      </section> 
                    
                    <section class="book-bottom-links">
                      <section class="from-pariyatti available-at">
                        <div class="buy-options-cont">
                          <div>Recámaras {property.beds}</div>
                          <div>Baños {property.bathroom}</div>
                          <div>Estacionamientos {property.park}</div>
                          <div>Contruccion {property.areaBuilding} m2</div>
                          <div>Terreno {property.areaTotal}</div>
                          <div>Precio {property.price}</div>
                        </div>
                      </section>
                    </section>                  
                  </section>
                {/each}
            <!-- Todas las Propiedades -->
              {:else}
                {#if systStatus === "start"}
                  {#each properties as property}
                  <section on:click={selectProduct(property)} class="book "
                      transition:scale={{duration: 500, easing: expoInOut}}>                  
                    <section class="book-top-info" >
                      <figure class="bkcont" >
                        <img src={property.urlImage} alt={property.nameProperty} class="bkcover" >
                        <div class="language">{property.colonia}</div>
                        <figcaption>{property.nameProperty}</figcaption>
                      </figure>
                    </section> 
                    
                    <section class="book-bottom-links">
                      <section class="from-pariyatti available-at">
                        <div class="buy-options-cont">
                          <div>Recámaras {property.beds}</div>
                          <div>Baños {property.bathroom}</div>
                          <div>Estacionamientos {property.park}</div>
                          <div>Contruccion {property.areaBuilding} m2</div>
                          <div>Terreno {property.areaTotal}</div>
                          <br>
                          <div>Precio {property.price}</div>
                        </div>
                      </section>
                    </section>                  
                  </section>
                  {/each}
              {/if}
            {/if}
          {:else}
      <!-- Filtra por Características Seleccionadas "START" -->
            {#if reqFiltered && systStatus == !"findPotContacts"}
            {#each reqFiltered as property}
                <section on:click={selectProduct(property)} class="book "
                transition:scale={{duration: 500, easing: expoInOut}}>                  
                <section class="book-top-info" >
                  <figure class="bkcont" >
                    <img src={property.urlImage} alt={property.nameProperty} class="bkcover" >
                    <div class="language">{property.colonia}</div>
                    <figcaption>{property.nameProperty}</figcaption>
                  </figure>
                </section> 
              
                  <section class="book-bottom-links">
                    <section class="from-pariyatti available-at">
                      <div class="buy-options-cont">
                        <div>Recámaras {property.beds}</div>
                        <div>Baños {property.bathroom}</div>
                        <div>Estacionamientos {property.park}</div>
                        <div>Contruccion {property.areaBuilding} m2</div>
                        <div>Terreno {property.areaTotal}</div>
                        <br>
                        <div>Precio {property.price}</div>
                      </div>
                    </section>
                  </section>                  
                </section>
              {/each}
            {/if}
          {/if}
        </main>

  <!-- *- PRODUCTO SELECCIONADO -->
        {#if systStatus === "propSelect" || systStatus === "findPotContacts"} 
          <div class="selectProduct">            
            <div class="selectImage">
              <img src={property.urlImage} alt={property.nameProperty}>
            </div>            
            <div class="descSelect">
              <h4>{property.nameProperty}</h4>
              <h5>Col: {property.colonia}</h5>
              <h6>Precio: {property.price}</h6>
              <h6>{property.beds} Recamaras</h6>
                <h6>{property.bathroom} Baños</h6>
                <h6>{property.halfBathroom} Medio Baño</h6>
                <h6>{property.areaBuilding} m2 de construcción</h6>
                <h6>{property.areaTotal} m2 de terreno</h6>              
                <p class="descSelec">{property.description}</p>
              </div>
              <div class="folowLink">
                <a href={property.urlProp} target='_blank'>Seguir Link en Otra Ventana</a>        
              </div>
              <div class="optionsSend" >

                <button class="btnCommon btnWhatsApp" on:click={checkedTCont(checkedContacts, property)}>Enviar por WhatsApp</button>
                <button class="btnCommon" on:click={findCustomers}>Buscar Interesados</button>
              </div>
              <div class="backAnt">
                <button class="btnCommon btnCancel" on:click={onCancel}>Regresar</button>
              </div>
            <!-- Material icons -->
              <div class="iconContent">
                <i on:click={editProperty(property)}
                  class="material-icons cursor:pointer edit">edit</i>
                <!-- <i on:click={viewProperty} class="material-icons irLink"> pageview </i> -->
                <i on:click={deleteProperty(currentId)}
                  class="material-icons cursor:pointer delete" >delete_forever</i>
              </div>
          </div>

        {/if}


  <!-- *- FORMULARIO PARA ALTA  O EDICION DE PROPIEDAD ""propEditing y propAdd""-->
      <!-- Características -->
        {#if systStatus === "propEditing" || systStatus === "propAdd"}
          <section>
            <form on:submit|preventDefault={handleSubmit}>
              <div class="container">
                <div class="form-group row">
                  <div class="col">
      
                       <!-- Tipo de propiedad buscada -->
                       <select class="selTP" id="selTP" name="selTP" bind:value={property.selecTP} required>
                        <option disabled selected value="">Tipo de Propiedad</option>
                        {#each typeProperties as typeProperty}
                            <option type="checkbox" value={typeProperty}
                              >{typeProperty}</option>
                        {/each}
                      </select>
                 
                      <label>Clave EB
                        <input type="text" class="form-control" bind:value={property.claveEB}/>
                      </label>
                      <label>Clave MH
                        <input type="text" class="form-control" bind:value={property.claveMH}/>
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="Nombre de la Propiedad"
                        bind:value={property.nameProperty}
                        class="form-control"/>
               

                    <select bind:value={property.beds}>
                        <option disabled selected value=""># Recámaras</option>
                        {#each oneTofive as numBed}
                          <option type="checkbox" value={numBed}
                          >{numBed} Recámaras</option>
                        {/each}
                    </select>

                    <select bind:value={property.bathroom}>
                        <option disabled selected value=""># Baños</option>
                        {#each oneTofive as numBath}
                        <option type="checkbox" value={numBath}
                          >{numBath} Baños</option
                        >
                        {/each}
                    </select>

                    <select bind:value={property.halfBathroom}>
                      <option disabled selected value=""># Medios Baños</option>
                      {#each oneTofive as numBath}
                      <option type="checkbox" value={numBath}
                        >{numBath} Medios Baños</option
                      >
                      {/each}
                  </select>

                      <select bind:value={property.park}>
                          <option disabled selected value=""># Estacionamientos</option>
                          {#each oneTofive as numPark}
                          <option type="checkbox" value={numPark}
                            >{numPark} estacionamientos</option
                          >
                          {/each}
                      </select>
                  </div>

                </div>

                <div class="form-group row">
                  <div class= "col">
                    <input
                      type="string"
                      placeholder="Colonia"
                      bind:value={property.colonia}
                      class="form-control"
                    />
                  </div>
                  <!-- <div class="col"> -->
                    <input
                      type="number"
                      placeholder="M2 de Construcción"
                      bind:value={property.areaBuilding}
                      class="form-control"
                    />
                  <!-- </div> -->
                  <!-- <div class="col"> -->
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
                    <!-- <div class="col"> -->
                      <input
                        type="number"
                        placeholder="Precio"
                        bind:value={property.price}
                        class="input-number"
                      />
                      <!-- <div class="col"> -->
                        <textarea
                          type="string"
                          placeholder="Descripción"
                          bind:value={property.description}
                          class="form-control"
                        />
                        <input
                        type="text"
                        placeholder="url Propiedad"
                        bind:value={property.urlProp}
                        class="form-control"
                      />
                      <input
                      type="text"
                      placeholder="url Sinergia"
                      bind:value={property.urlSinergy}
                      class="form-control"/>                      
                      <!-- </div> -->
                    <!-- </div> -->
                  <!-- </div> -->
                </div>

      <!-- Ubicacion -->    
                <div class="tarjeCont">

                <div class="filter-ubiaction">

                  <div class="filterLocationOne">
                    <label for="north">/Norte\
                        <input value="Norte" type="radio" name="north" id="north" bind:group={property.locaProperty} />
                      </label>          
                  </div>
              
                  <div class="filterLocationOne">          
                      <label for="northwest">/NorOeste
                        <input value="NorOeste" type="radio" name="northwest" id="northwest" bind:group={property.locaProperty} />
                      </label>
          
                      <label for="northeast">NorEste\
                        <input value="NorEste" type="radio" name="northeast" id="northeast" bind:group={property.locaProperty} />
                      </label>
                    </div>  
          
                    <div class="filterLocationOne">
                      <label for="west">/Oeste
                        <input value="Oeste" type="radio" name="west" id="west" bind:group={property.locaProperty} />
                      </label>
          
                      <label for="townNorth">Centro Norte
                        <input value="CentroNorte" type="radio" name="townNorth" id="townNorth" bind:group={property.locaProperty} />
                      </label>
                        
                      <label for="east">Este\
                          <input value="East" type="radio" name="east" id="east" bind:group={property.locaProperty} />
                        </label>
                    </div>
                      
                    <div class="filterLocationOne">
                      <label for="townsowth">/Centro Sur\
                        <input value="CentroSur" type="radio" name="townsowth" id="townsowth" bind:group={property.locaProperty} />
                      </label>
                    </div>
              
                    <div class="filterLocationOne">
                      <label for="southwest">/SurOeste
                        <input value="SurOeste" type="radio" name="southwest" id="southwest" bind:group={property.locaProperty} />
                      </label>
          
                      <label for="southeast">SurEste\
                        <input value="southeast" type="radio" name="southeast" id="southeast" bind:group={property.locaProperty} />
                      </label>
                    </div>

                </div>
       

      <!-- Etiquetas -->
                      <div class="filter-tags"> 
                        <div>
                          <label>
                            <input type="checkbox" value="Una Planta" bind:group={property.tagsProperty} name="unaPlanta" id="unaPlanta" />Un Piso
                          </label>
            
                          <label>
                            <input type="checkbox" value="Recamamara en PB" bind:group={property.tagsProperty} name="Recamara en PB" id="Recamamara en PB" />Recamara en Planta Baja
                          </label>
            
                          <label>
                            <input value="Fracc. Privado" bind:group={property.tagsProperty}  type="checkbox" name="FraccPrivado" id="FraccPrivado" />Fracionamiento Privado
                          </label>
            
                          <label>
                            <input value="Frente Parque" bind:group={property.tagsProperty} type="checkbox" name="frontPark" id="frontPark" />Frente a Parque
                          </label>
            
                          <label>
                            <input value="Patio Amplio" bind:group={property.tagsProperty} type="checkbox" name="patioAmplio" id="patioAmplio" />Patio Amplio
                          </label>
            
                          <label>
                            <input value="Sobre Avenida" bind:group={property.tagsProperty} type="checkbox" name="enAvenida" id="enAvenida" />Sobre Avenida
                          </label>
            
                          <label>
                            <input type="checkbox" value="Lista Habitarse" bind:group={property.tagsProperty} name="listaHabitar" id="listaHabitar" />lista Habitarse
                          </label>
            
                          <label>
                            <input type="checkbox" value="Nueva" bind:group={property.tagsProperty} name="nueva"/>Nueva
                          </label>
            
                          <label>
                            <input type="checkbox" value="Usada" bind:group={property.tagsProperty} name="Usada" id='usada'/> Usada
                          </label>


                        </div>  
                           
                      </div>
                </div> 
                <!-- </div> -->

      <!-- Subir imagen a firebase -->
                    <div class="upLoadImage">
                      {#if avatar}
                        <img class="avatar" style=" width: 500px" src={avatar} alt="d" />
                      {:else}
                        <img
                          style=" width: 50px"
                          class="avatar"
                          src="https://cdn4.iconfinder.com/data/icons/small-n-flat/24/user-alt-512.png"
                          alt=""/>
                      {/if}

                      <img class="upload"
                        style=" width: 50px"
                        src="https://static.thenounproject.com/png/625182-200.png"
                        alt=""
                        on:click={() => {
                          fileinput.click();
                        }}/>
                    <div class="chan"on:click={() => {fileinput.click();}}>
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

                   
          
      <!-- Botones -->
                <div class="align-center">
                  <div class="col">
                    <button class="btn-outline-primary col-3 row">
                      {#if !editStatus}Guardar{:else}Editar{/if}
                    </button>
                    <button
                      class="btn-outline-success col-3 row mt-2"
                      >Subir Imagen</button
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

  <!-- *- TARJETA PARA CONTACTOS FILTRADOS POR PROPIEDAD -->

          {#if systStatus == "findPotContacts"}
            <div class="cards-container">
              {#each reqFiltered as contact}
                <div class="contactCard">
                  <div >
                    <div class="nameDate"  >
                      <h5>{contact.name} {contact.lastname} </h5>
                      <p>Alta {contact.createdAt}</p>
                    </div >

                  <div>
                    <p>tel: {contact.telephon} email: {contact.email}</p>
                    <p>Presupuesto {contact.budget}</p>
                    <p>Tipo de Contacto: {contact.contactType}</p>
                  </div>
                  <input type="checkbox" value={contact} class="form-check" bind:group={checkedContacts}>  
                </div>
                </div>
              {/each}
            </div>
          {/if}




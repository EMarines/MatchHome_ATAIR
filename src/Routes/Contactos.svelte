<script>
  // *- IMPORTACIONES
    import { onMount } from "svelte"
    import { db } from "../firebase";
    import "@firebase/firestore";
    import "@firebase/storage";
    import Search from "./Search.svelte";
    import { scale } from 'svelte/transition';
	  import { expoInOut } from 'svelte/easing';
    import { typeProperties, modeContact, typeContacts, modePays, ranges, oneTofive, oneToFour, contactMode, diaSemana, mesAnyo } from '../stores/parameters';
    import AddToSchedule from '../components/AddToSchedule.svelte'
    // import { once } from "svelte/internal";
    // import schedule from '../components/Schedule.svelte'
    // import BinnacleContact from '../components/BinnacleContact.svelte'
    // import { get } from "svelte/store";
    // import { element } from "svelte/internal";
    // import Binnacle from "../components/Binnacle.svelte";

  // *- DECLARACIÓN DE VARIABLES  
      // Variables y arrays
          let editStatus;
          let currentId;
          let searchTerm = "";
          let lowRange;
          let upRange;
          let message;
          let commBinnacle;
          let commInpuyBinnacle;
          let fecha;
          let systStatus = "start";
          let showInput ="false";
          let rng;
          let noteBinnacle= [];
          let contacts = [];
          let filteredContacts = [];
          let properties = [];
          let porpInterest = [];
          let selecProperty = [];
          let checkedProperty = [];
          let allPropertiesName = [];
          let contactBinnacle = [];
          let reqFiltered = [];
          let ordeContacts = [];
          let dateC;
          let isActivated = false;
          let mostButtons = false;
          let mostPoperties = false;
          let mostComments = true;
          let propToSearch = "";
          let indice;
          let editingItem = ""
          let itemP;
          let itemPP;
          let imgToShow;
          let mostImageProp = false;

      // Decalracion de binnacle
          let binnacle = {
            date: "",
            commBinnacle: ""
        };
          
      // Array contacto
          let contact = {
            name: "",
            lastname: "",
            telephon: "",
            email: "",
            selecMC: "",      // Modo de contacto
            propCont: "",     // Propiedad de contacto
            comContact: "",   // Comentarios
            rangeProp: "",    // Rango buscado
            contMode: "",     // Modo de contacto
            budget: "",       // Presupuesto tope
            numBeds:"",
            numBaths:"",
            halfBathroom: "",
            numParks:"",
            modePay: "",      // Modo de pago
            selecMC: "",
            selecTP: "",      // Tipo de propiedad
            contactType: "",  // Modo de contacto
            contactStage: "", // Etapa del cliente
            locaProperty: [], // Localicacion buscada
            tagsProperty: [], // Etiquetas
            sendedProperties:[],  // Propiedades enviadas
            binnacle: [],     // Bitácora 
          };
      
  // *- IMPORTA LA BASE DE DATOS DE FIREBASE
      // Base de contactos
          db.collection("contacts").onSnapshot((querySnapshot) => {
            // let contactb = [];
            let docs = [];
            querySnapshot.forEach((doc) => {
              docs.push({ ...doc.data(), id: doc.id });
            });
            contacts = [...docs]; 
            return ordeContacts = contacts.sort((a, b)  => {return b.createdAt - a.createdAt
            })                         
          });

      // Base de propiedades 
          db.collection("properties").onSnapshot((querySnapshot) => {
          let docs = [];
          querySnapshot.forEach((doc) => {
          docs.push({ ...doc.data(), id: doc.id });
          });
          properties = [...docs];
        });	

      // Base de bitácora
          db.collection("binnacles").onSnapshot((querySnapshot) => {
            let docs = [];
            querySnapshot.forEach((doc) => {
              docs.push({ ...doc.data(), id: doc.id });
            });
            binnacle = [...docs];          
          });

      // Lista de propiedades
          const getPropertiesNames = () => {
            for(let eachProperty of properties) {
              // if(!allPropertiesName.includes(eachProperty.nameProperty)){
                allPropertiesName = [...allPropertiesName, eachProperty.nameProperty ]
              // }
            }
            allPropertiesName = allPropertiesName.sort();
          }
          onMount(() => getPropertiesNames)

  // *- CRUD 
      // Cancel Button ""start""
          const onCancel = () => {
            editStatus = false;
            contact = {};
            searchTerm = "";
            message = "";
            filteredContacts = [];
            systStatus = "start";
          };

      // Delete contact 
          const deleteContact = async (id) => {
            let confDelete = confirm("Quieres eliminarlo definitivamente?")
            if(confDelete == true){
              commBinnacle = (`Se le eliminó al contacto: ${contact.name} ${contact.lastname}`)
              binnacle = {"date": Date.now(), "comment": commBinnacle} 
              await db.collection("contacts").doc(id).delete();
              saveBinnacle(binnacle);
              systStatus = "start"
              contact = {};
            }
          };

      // Manejo de edicion o alta
          const handleSubmit = () => {
                   if  (!editStatus) {
                  addContact();
                  // console.log("Contacto guardado")
                } else {
                  updateContact();                
                }
          };

      // Confirma si queres crear una cita o tarea   ****************** DESACTIVADO  **********************
          // function creatEvent(){
          //   let event = confirm("Deseas programar un evanto?")
          //   if(event == true){
          //     isActivated = true;   // abre AddToSchedule
          //   }
          // }
          
          
          
      // Añadir contacto
            const addContact = async () => {    
                console.log("esta en addContact")          
                commBinnacle = (`Se le agregó al contacto: ${contact.name} ${contact.lastname} del ${contact.telephon}`)
                noteBinnacle = {"date": Date.now(), "comment": commBinnacle}            
                await db.collection("contacts").doc().set({ ...contact, createdAt: Date.now() });
                console.log(noteBinnacle, contact)
                saveBinnacle(noteBinnacle, contact);
                isActivated = true;  // abre AddToSchedule 
                // window.location.href = '/'
            };

      // Edita Contacto
            const updateContact = async (property, contact) => {
              console.log(property, contact)

              if (editingItem == "sendProperty") {
                // property = propertyCh
                console.log(contact, property.claveEB)
                contact.sendedProperties.push(property.claveEB)
                console.log("agregaste propidad enviada")
              } else {
                commBinnacle = (`Se le editó a: ${contact.name} ${contact.lastname} del ${contact.telephon}`)
                binnacle = {"date": Date.now(), "comment": commBinnacle}                
                saveBinnacle(binnacle);
              }
              await db.collection("contacts").doc(currentId).update(contact);
              console.log(contact)
              
              editingItem = "";
              isActivated = true; 
            };

      // Edicion de contacto llena el formulario
          const editContact = (currentContact) => {
              getPropertiesNames();
              editStatus = true;
              contact.selecTP = currentContact.selecTP
              contact.contactType = currentContact.contactType
              contact.name = currentContact.name;
              contact.lastname = currentContact.lastname;
              contact.rangeProp = currentContact.rangeProp;
              contact.budget = currentContact.budget;
              contact.propCont = currentContact.propCont
              contact.modePay = currentContact.modePay;
              contact.comContact = currentContact.comContact;
              contact.selecMC = currentContact.selecMC;
              contact.numBeds = currentContact.numBeds;
              contact.numBaths = currentContact.numBaths;
              contact.telephon = currentContact.telephon;
              contact.email = currentContact.email;
              contact.numParks = currentContact.numParks;
              contact.contactStage = currentContact.contactStage
              contact.tagsProperty = currentContact.tagsProperty;
              contact.locaProperty = currentContact.locaProperty;
              currentId = currentContact.id;
              systStatus = "contEditing"
          };

      // Abre formato de alta o edición de contacto
          const altaContacto = () => {
            getPropertiesNames();
              editStatus = false;
              systStatus = "contAdd"
          };
            
  // *- FILTROS
      // Contacto seleccionado ""selecContact""
            const contactSelect = (currentContact, binnacles) => {
              systStatus = "contSelect"
              contact.selecTP = currentContact.selecTP
              contact.contactType = currentContact.contactType
              contact.name = currentContact.name;
              contact.lastname = currentContact.lastname;
              contact.rangeProp = currentContact.rangeProp;
              contact.budget = currentContact.budget;
              contact.modePay = currentContact.modePay;
              contact.propCont = currentContact.propCont
              contact.comContact = currentContact.comContact;
              contact.selecMC = currentContact.selecMC;
              contact.numBeds = currentContact.numBeds;
              contact.numBaths = currentContact.numBaths;
              contact.halfBathroom= currentContact.halfBathroom
              contact.telephon = currentContact.telephon;
              contact.email = currentContact.email;
              contact.numParks = currentContact.numParks;
              contact.contactStage = currentContact.contactStage
              contact.tagsProperty = currentContact.tagsProperty;
              contact.locaProperty = currentContact.locaProperty;
              formatDate(contact.createdAt)
              currentId = currentContact.id;
              contact = currentContact;
              binnacleClient(contact, binnacle);
              searchTerm = "";
            };

                     

      // Input filter ""searchContact""
            const searchContact = () => {
              systStatus = "contSearch"
              console.log(searchTerm)
              return (filteredContacts = contacts.filter((contact) => {
              let contInfo = (contact.name + " " + contact.lastname + " " + contact.telephon).toLowerCase();
              return contInfo.includes(searchTerm.toLowerCase());
              }));
            };

      // Input filter ""searchProperty""      
            const searchProperty = () => {
                systStatus = "propSearch"
                console.log("estoy en searchProperty")
                return (porpInterest = properties.filter((property) => {
                let propTitle = (property.nameProperty + property.colonia).toLowerCase();
                return propTitle.includes(searchTerm.toLowerCase());
                }));
              };

      // Filtrar contact -- properties
            function filtContPropInte(){
          // systStatus === "porpInterest"
              porpInterest = properties
              
              porpInterest = porpInterest.filter((item) => item.selectTP >= contact.selecTP);

              if (contact.numBeds > 0) {
                porpInterest = porpInterest.filter((item) => item.beds >= contact.numBeds);
              }
              if (contact.numBaths > 0) {
                porpInterest = porpInterest.filter((item) => item.bathroom >= contact.numBaths);
              }
              if (contact.numParks > 0) {
                porpInterest = porpInterest.filter((item) => item.park >= contact.numParks);
              }
             
          // Filtra por Rango
              if(contact.budget){
                lowRange=(contact.budget * .7)
                upRange=(contact.budget * 1.1)
                porpInterest = porpInterest.filter(function (prop) {
                  return (
                    prop.price >= lowRange &&
                    prop.price <= upRange
                    );
                  });  
                                 
               } else {
                
                  ranPrice(contact.rangeProp);
                  porpInterest = porpInterest.filter(function (prop, index) {
                    return (
                      prop.price >= lowRange &&
                      prop.price <= upRange
                      );
                    });
                  };
                  
          // Filtra por Ubicación  
                  if(contact.locaProperty.length > 0){
                    {porpInterest = porpInterest.filter(e => (contact.locaProperty).some(c => (e.locaProperty).includes(c)))};
                  };
                  
          // Filtra por Etiquetas
                  if(contact.tagsProperty.length > 0){
                    // console.log("estas dentro de tags", contact.tagsProperty.length)
                    porpInterest= porpInterest.filter(e => contact.tagsProperty.every(c => e.tagsProperty.includes(c)));
                  };

                    if (porpInterest.length === 0) {
                        message = "No hay resultados con este criterio de busqueda"
                        // console.log(porpInterest.length, message)
                    } else {
                      message = ("Se encontraron" + porpInterest.length + "propiedades con este criterio de busqueda" )
                    };
                     
                    
                  systStatus = "porpInterest"
                  console.log(systStatus)
            }

            const selectProduct = () => {
              console.log("si")
            }
          
  // *- FUNCIONES *- 
        // Asignación los topes de presupesto por ragno
            function ranPrice() {
                switch (contact.rangeProp) {
                  case "Rango":
                    lowRange = 0;
                    upRange = 999999999;
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
                return lowRange, upRange;
              }

        // *- Formatos fecha
              let fechaActual;
                function formatDate(fecha){
                  fecha = new Date(fecha)
                  // console.log(fecha)
                  let dia = fecha.getDate();
                  let mes = fecha.getMonth()+1;
                  let ano = fecha.getFullYear();
                  return fechaActual = (`${dia}/${mes}/${ano}`)
                }

          // // Asignación de Rango
          // function priceRange(precio) {                 
          //         if(precio <= 1000000)						
          //           rng = "PRM"
					// 			  else if
          //         (precio <= 2500000)
          //           rng = "SGN"
					// 					 else if 
          //         (precio <= 5000000)
          //           rng = "TRC"
					// 					else if
          //         (precio <= 8000000)
          //           rng = "CRT"
					// 						else if													
          //         (precio <= 12000000)
          //           rng = "QNT"
					// 						else if
          //         (precio >= 12000000)
          //           rng = "SXT";
          //         console.log(rng);
          //       }
             
            
  // *- Envio de información por WhatsApp y email
      // Enviar a los checkbox seleccionados            
            const checkedT = (checkedProperty, contact) => {
              if(commInpuyBinnacle) {
                let link = (`https://api.whatsapp.com/send?phone=52${contact.telephon}&text=${commInpuyBinnacle}`)
                window.open(link)
                let name = (`${contact.name} ${contact.lastname}`)
                commBinnacle= (`Se envió el mensaje: ${commInpuyBinnacle} a ${name} al ${contact.telephon}`);
                binnacle = {"date": Date.now(), "comment": commBinnacle}
                console.log(binnacle)
                commInpuyBinnacle = "";
              } else {
                console.log("estas en checkedT")
                  if(checkedProperty.length === 0 ){
                    alert("Tienes que seleccionar al menos una propiedad");
                  } else if (checkedProperty.length == 1 ){

                    console.log(checkedProperty.length)
                    checkedProperty.forEach((propertyCh) => {                    
                      console.log(checkedProperty.length)
                      let link = (`https://api.whatsapp.com/send?phone=52${contact.telephon}&text=${propertyCh.urlProp}`)
                      window.open(link)
                      let name = (`${contact.name} ${contact.lastname}`)
                      commBinnacle= (`Se envió ${propertyCh.nameProperty} a ${contact.name} ${contact.lastname} al ${contact.telephon}`);
                      editingItem = "sendProperty";
                      // console.log(propertyCh, contact)
                      updateContact(propertyCh, contact)
                      binnacle = {"date": Date.now(), "comment": commBinnacle}
                    });               
                  } else {
                    alert("Solo puedes enviar una propiedad a la vez")
                  };
                  saveBinnacle(binnacle);

            }};

  // *- Bitácora
      // Guarda nota de contacto
            const saveNote = () => {
              commBinnacle = (`Nota para:  ${contact.name} ${contact.lastname} del ${contact.telephon}: ${commInpuyBinnacle}`)
              noteBinnacle = {"date": Date.now(), "comment": commBinnacle}
              saveBinnacle(noteBinnacle);
              systStatus = "start"
            }

      // Agregar info a bitácora i mostrar
            const callBinnacle = () => {
              showInput = true;
            };

      // Agrega entrada a la bitácora    
                const saveBinnacle = async (noteBinnacle) => {
                  await db.collection("binnacles") .doc().set({ ...noteBinnacle});
                  noteBinnacle=[];
                  console.log("entró a guardar en bitácora", noteBinnacle)
                };
              
      // Agrega la bitácora de cliente seleccionado          
              function binnacleClient(){
                contactBinnacle = [];
                binnacle.forEach(item => {
                  try {
                    indice = item.comment.indexOf(contact.telephon)                    
                  } catch (error) {
                    console.log(error)
                  }
                  if(indice >= 0){
                    let binnacleMessage = item;
                    contactBinnacle.push(binnacleMessage)        // desactivado para fines de pruebas ***************************************
                    // console.log(contactBinnacle, mostButtons)
                    return contactBinnacle = contactBinnacle.sort((a, b) => {return b.date - a.date})
                  }
                })
              };       

  // PopUp Schedule y ocultamientos
      // Close                        
              function close(){
                isActivated = false;
              }

      // Mostrar Schedule
              function addSchedule(){
                console.log("estas en addSchedule")
                isActivated = true;
              }
                                        
      // Muestra botones WhatsApp y Guardar Info
              function seleTypeAction (){
                mostButtons = true;
                mostPoperties = false;
              }
      // Muestra search Properties
              function mostSearch () {
                mostPoperties = true;
              }

      // Muestra la Imagen de la proiedad cuando el mouse está sobre la clave
              function mouseOverProp (itemP){
                mostImageProp = true;
                return imgToShow = (properties).filter((e) => e.claveEB === (itemP))
              }

      // Oculta la imagen
              function mouseLeaveProp() {
                mostImageProp = false

              }

      // Visitar la página de la propiedad dando doble click sobre la clave
              function visitPageProp(link) {
                window.open(link)
              }
      
           
</script>

<!-- *- FORMULARIO PARA ALTA O EDICION DE CONTACTO ""contEditing""-->
      <!-- Datos del contacto  -->
            {#if systStatus === "contEditing"  || systStatus === "contAdd"}

              <div class="altaContactos">
                <form class=""
                on:submit|preventDefault={handleSubmit}>
            
          <!-- Datos Personales del Contacto -->
                <div class="">
                    <h1 class="sectionTitle">Alta Contactos</h1>
                  <div class="">
                      <div class="contactInput">
                          <input
                            type="text"
                            placeholder="Nombre"
                            bind:value={contact.name}
                            />
                        </div>
                        <div class="contactInput">
                          <input
                            type="text"
                            placeholder="Apellido"
                            bind:value={contact.lastname}
                            class="form-control"/>
                        </div>
                        <div class="contactInput">
                          <input
                            type="tel"
                            placeholder="telefono"
                            bind:value={contact.telephon}
                            class="form-control"/>
                        </div>
                        <div class="contactInput"> 
                          <input
                            type="email"
                            placeholder="email"
                            bind:value={contact.email}
                            class="form-control"/>
                        </div> 

                      </div>

                    <div>
                      <!-- Tipo de Contacto -->
                        <select bind:value={contact.contactType}>
                          <option disabled selected value="">Tipo de Contacto</option>
                          {#each typeContacts as typeContact}
                            <option type="checkbox" value={typeContact}>{typeContact}</option>
                          {/each}
                        </select>

                      <!-- Tipo de propiedad buscada -->
                        <select class="selTP" id="selTP" name="selTP" bind:value={contact.selecTP}>
                            <option disabled selected value="">Tipo de Propiedad</option>
                            {#each typeProperties as typeProperty}
                                <option type="checkbox" value={typeProperty}
                                  >{typeProperty}</option
                                >
                            {/each}
                          </select>

                      <!-- Propiedad de Contacto -->
                        <select class="selTP" id="selTP" name="selTP" bind:value={contact.propCont}>
                          <option disabled selected value="">Propiedad de Contacto</option>
                          {#each allPropertiesName as typeProperty}
                              <option type="checkbox" value={typeProperty}
                                >{typeProperty}</option
                              >
                          {/each}
                        </select>

                    </div>
              
          <!-- Comentarios del contacto -->
              <div class="col">
                <input type="textarea" placeholder="Comentarios" bind:value={contact.comContact} class="form-control"/>
              </div>

              
          <!-- Tope de Presupuesto -->
                <div class="col">
                  <input type="number" placeholder="Presupuesto"bind:value={contact.budget} class="form-control"/>
                </div>
                  
          <!-- Modo de Contacto -->
                <select bind:value={contact.selecMC}>
                  <option disabled selected value="">Modo de Contacto</option>
                  {#each modeContact as mode}
                    <option type="checkbox" value={mode}>{mode}</option>
                  {/each}
                </select>

          <!-- Modo de Pago -->
                <select bind:value={contact.modePay}>
                  <option disabled selected value="">Modo de Pago</option>
                  {#each modePays as modeP}
                    <option type="checkb
                    
                    ox" value={modeP}>{modeP}</option>
                  {/each}
                </select>

                </div>
   
        <!-- Características buscadas -->

                <select bind:value={contact.numBeds}>
                  <option disabled selected value="" ># Recámaras</option>
                  {#each oneTofive as numberBed}
                    <option type="checkbox" value={numberBed} >{numberBed} Recámaras</option>
                  {/each}
                </select>

        <!-- NÚMERO DE BAÑOS -->
                <select bind:value={contact.numBaths}>
                  <option disabled selected value=""># Baños</option>
                  {#each oneToFour as numberBath}
                    <option type="checkbox" value={numberBath}>{numberBath} baños</option>
                  {/each}
                </select>

        <!-- Medios baños -->
              <select bind:value={contact.halfBathroom}>
                <option disabled selected value=""># Medios Baños</option>
                {#each oneToFour as numberHalfBath}
                  <option type="checkbox" value={numberHalfBath}>{numberHalfBath} Medios baños</option>
                {/each}
              </select>

        <!-- NÚMERO DE ESTACIONAMIENTOS -->
                <select bind:value={contact.numParks}>
                  <option disabled selected value=""># Estacionamientos</option>
                  {#each oneToFour as numberParks}
                    <option type="checkbox" value={numberParks}>{numberParks} Estacionamientos</option>
                  {/each}
                </select>

        <!-- RANGO DE PRECIOS -->
                <select bind:value={contact.rangeProp}>
                  <option disabled selected value="">Rango Buscado</option>
                  {#each ranges as range}
                    <option type="checkbox" value={range}>{range}</option>
                  {/each}
                </select>

        <!-- Modo de contacto -->
                <select bind:value={contact.contMode}>
                  <option disabled selected value="">Modo de Contacto</option>
                  {#each contactMode as mode}
                    <option type="checkbox" value={mode}>{mode}</option>
                  {/each}
                </select>



      <!-- Ubicación -->
      
        <div class="tarjeCont">

              <div class="filter-ubiaction">

                <div class="filterLocationOne">                        
                  <label for="north">/Norte\
                    <input value="Norte" type="checkbox" name="north" id="north" bind:group={contact.locaProperty} />
                  </label>    
                </div>

                <div class="filterLocationOne">
                  <label for="northwest">/NorOeste
                    <input value="NorOeste" type="checkbox" name="northwest" id="northwest" bind:group={contact.locaProperty} />
                  </label>
  
                  <label for="northeast">NorEste\
                    <input value="NorEste" type="checkbox" name="northeast" id="northeast" bind:group={contact.locaProperty} />
                  </label>
                </div>  
  
                <div class="filterLocationOne">
                  <label for="west">/Oeste
                    <input value="Oeste" type="checkbox" name="west" id="west" bind:group={contact.locaProperty} />
                  </label>
  
                  <label for="townNorth"
                    >Centro Norte
                    <input value="CentroNorte" type="checkbox" name="townNorth" id="townNorth" bind:group={contact.locaProperty} />
                  </label>
  
                  <label for="east"
                    >Este\
                    <input value="Este" type="checkbox" name="east" id="east" bind:group={contact.locaProperty} />
                  </label>
                </div>

                <div class="filterLocationOne"> 
                  <label for="townsouth"
                    >Centro Sur
                    <input value="CentroSur" type="checkbox" name="townsouth" id="townsouth" bind:group={contact.locaProperty} />
                  </label>
                </div>
        
                <div class="filterLocationOne">
                  <label for="southwest"
                    >/SurOeste
                    <input value="SurOeste" type="checkbox" name="southwest" id="southwest" bind:group={contact.locaProperty} />
                  </label>
  
                  <label for="southeast"
                    >SurEste\
                    <input value="SurEste" type="checkbox" name="southeast" id="southeast" bind:group={contact.locaProperty} />
                  </label>
                </div>

              </div>

      <!-- Stage (Etapas) -->

              <div class="filter-stage">

                <label>
                  <input type="radio" value="Etapa 1" bind:group={contact.contactStage} name="etapa1" id="etapa1" /> Etapa 1
                </label>
  
                <label>
                  <input type="radio" value="Etapa 2" bind:group={contact.contactStage} name="etapa2" id="etapa2" /> Etapa 2
                </label>

                <label>
                  <input type="radio" value="Etapa 3" bind:group={contact.contactStage} name="etapa3" id="etapa3" /> Etapa 3
                </label>

                <label>
                  <input type="radio" value="Etapa 4" bind:group={contact.contactStage} name="etapa4" id="etapa4" /> Etapa 4
                </label>

                <label>
                  <input type="radio" value="Etapa 5" bind:group={contact.contactStage} name="etapa5" id="etapa5" /> Etapa 5
                </label>

              </div>
      <!-- Etiquetas -->
            <div class="filter-tags">
              <div>                  
                <label>
                  <input type="checkbox" value="Una Planta" bind:group={contact.tagsProperty} name="unaPlanta" id="unaPlanta" />Un Piso
                </label>
  
                <label>
                  <input type="checkbox" value="Recamamara en PB" bind:group={contact.tagsProperty} name="Recamara en PB" id="Recamamara en PB" />Recamara en Planta Baja
                </label>
  
                <label>
                  <input value="Fracc. Privado" bind:group={contact.tagsProperty}  type="checkbox" name="FraccPrivado" id="FraccPrivado" />Fracionamiento Privado
                </label>
  
                <label>
                  <input value="Frente Parque" bind:group={contact.tagsProperty} type="checkbox" name="frontPark" id="frontPark" />Frente a Parque
                </label>
  
                <label>
                  <input value="Patio Amplio" bind:group={contact.tagsProperty} type="checkbox" name="patioAmplio" id="patioAmplio" />Frente a Parque
                </label>
  
                <label>
                  <input value="En Avenida" bind:group={contact.tagsProperty} type="checkbox" name="enAvenida" id="enAvenida" />Frente a Parque
                </label>
  
                <label>
                  <input type="checkbox" value="Lista Habitarse" bind:group={contact.tagsProperty} name="listaHabitar" id="listaHabitar" />lista Habitarse
                </label>
  
                <label>
                  <input type="checkbox" value="Nueva" bind:group={contact.tagsProperty} name="nueva"/>Nueva
                </label>
  
                <label>
                  <input type="checkbox" value="Usada" bind:group={contact.tagsProperty} name="Usada" id='usada'/> Usada
                </label>


              </div>  
            </div>
          </div>

            
      <!-- Botones -->
            
            <div class="row align-center">
              
              <div class="col">        
                <button class="btn-outline-primary col-3 row">
                  {#if !editStatus}Guardar{:else}Editar{/if}</button>
                </div>
                
                <div class="col">
                  <button class="btn-outline-warning col-3 row" on:click={onCancel}>Cancel</button>
                </div>
                <!-- 
                <div class="col">
                  <button class="btn-outline-success col-3 row" on:click={addSchedule}>Crear Evento</button>
                </div> -->
                <!--                   
                  <div class="col">                   
                    {#if isActivated}
                    <AddToSchedule on:closeIt = {close}/>
                    {/if}
                </div> -->
                
              </form>
            </div>
          {/if}


<!-- *- MUESTRA LOS CONTACTOS "" start "" -->
        <!-- Titulo, boton e input -->
          {#if systStatus === "start" || systStatus === "contSearch"}
              <div class="titleHeader">
                <h2>Contactos a Mostrar</h2>
                <div class="titleSecction">
                  <button class="btn-outline-success col-2" type="button" on:click={altaContacto}>Alta Contacto</button>
                  <button class="btn-outline-warning col-1" type="button" >Buscar</button>
                <Search bind:searchTerm on:input={searchContact} />
                </div>
              </div>

              {#if systStatus === "start"}
                <div>
                  {#each ordeContacts as contact}
                    <div class="contactCard" on:click={contactSelect(contact)}>
                      <div>
                        <input type="checkbox" name="chec[]" id="chec_" class="form-check">
                      </div>
          
                      <div class="nameDate">
                        <h5>{contact.name} {contact.lastname}</h5>
                        <p>Fecha Alta: {formatDate(contact.createdAt)}</p>
                      </div >
          
                      <div>
                        <p>tel: {contact.telephon} email: {contact.email}</p>
                        <p>Presupuesto {contact.budget}</p>
                        <p>Rango {contact.rangeProp}</p>
                      </div>
          
                    </div>
                  {/each}
                </div>
            {/if}
                  
        <!-- Lenado de tarjetas ""start""-->
            {#if systStatus === "start"}
              <div>
                {#each contacts as contact}
                  <div class="contactCard">
                    <div on:click={contactSelect(contact)}>
                    <div class="nameDate"  >
                      <h5>{contact.name} {contact.lastname} </h5>
                      <p>Fecha Alta: {formatDate(contact.createdAt)}</p>                      
                    </div >                    
                    <div>
                      <p>{contact.contactStage}</p>
                      <p>tel: {contact.telephon} email: {contact.email}</p>
                      <p>Presupuesto {contact.budget}</p>
                      <p>Tipo de Contacto: {contact.contactType}</p>
                    </div>
                  </div>
                  </div>
                {/each}
              </div>
            {/if}
          {/if}
          
        <!--  Tarjeta para mostrar contactos ""contSearch"" -->
            {#if systStatus === "contSearch"}
              <div>
                {#each filteredContacts as contact}
                  <div class="contactCard" on:click={contactSelect(contact)}>
           
                    <div class="nameDate">
                      <h5>{contact.name} {contact.lastname} </h5>
                      <p>Alta {contact.createdAt}</p>
                    </div >
        
                    <div>
                      <p>tel: {contact.telephon} email: {contact.email}</p>
                      <p>Presupuesto {contact.budget}</p>
                      <p>Rango {contact.rangeProp}</p>
                    </div>
        
                  </div>
                {/each}
              </div>
            {/if}

<!-- *- CONTACTO SELECCIONADO "" selecContact "" -->
        <!-- Tarjeta de contacto seleccionado para editar, eliminar o ver propieades -->
            {#if systStatus === "contSelect" || systStatus === "propSearch" || systStatus === "porpInterest"}

              <div class="container">
                <div>
                  <h4>Contacto</h4>                  
                  <h2>{contact.name} {contact.lastname}</h2>
                  <p>Fecha Alta: {formatDate(contact.createdAt)}</p> 
                  <p>Busca  {contact.selecTP}, de {contact.numBeds} recámaras,  {contact.numBaths} baños y {contact.numParks} estacionamientos </p>
                  <p>Presupuesto tope: {contact.budget}</p>
                  <p>Teléfono: <strong>{contact.telephon}</strong> ---- Email: <strong>{contact.email}</strong> </p>   
                  <p>Preferencias: {(contact.tagsProperty).join(',  ')}</p>
                  <p> Ubicaciones: {(contact.locaProperty).join(',  ')}</p>

                  <div class="propMost" >
                    <p> Propiedades enviadas:</p>
                    {#each contact.sendedProperties as itemP}                
                      <p value = {itemP} on:mouseenter = {mouseOverProp (itemP)} on:mouseout={mouseLeaveProp} on:dblclick = {visitPageProp(imgToShow[0].urlProp)}>{itemP}</p> 
                    {/each}
                    </div>
                    
                    {#if mostImageProp}        <!-- Muestra la imagen de la propiedad pasando el mouse sobre la clave -->
                        <h3>{imgToShow[0].nameProperty}</h3>
                        <img class="imgPropContSelect" height = "200" src={imgToShow[0].urlImage} alt={imgToShow[0].claveEB}> 
                    {/if}             

                  <p>{contact.contactStage}</p>
                  <p>{contact.comContact}</p>
                </div>

                  <div>
                    <button class="btnCommon" on:click= {addSchedule(contact)}>Programar Evento</button>
                    {#if isActivated}
                      <AddToSchedule on:closeIt = {close}/>
                    {/if}
                    <button class="btnCommon" on:click= {filtContPropInte}>Ver Propiedades de Interes</button>
                    <button class="btnCommon" on:click= {mostSearch}> Buscar Propiedad</button>
                    {#if mostPoperties}
                      <Search bind:searchTerm on:input={searchProperty} />
                    {/if}
                  </div>
                  
                  <div>
                    <button class="btnCommon btnCancel" on:click={onCancel}>Cancelar</button>
                  </div>
                  
                  <div>
                    <div>
                      <!-- <input  class="texArea" bind:value={commInpuyBinnacle} type="textarea" placeholder="Ingresa un comentario"> -->
                      <textarea on:keypress={seleTypeAction} class="texArea" cols="65" rows="5" bind:value = {commInpuyBinnacle} placeholder ="Ingresa un comentario"/>
                      <div>
                        {#if commInpuyBinnacle || checkedProperty.length >= 1 }
                          <button  class="btnCommon btnWhatsApp" on:click={checkedT(checkedProperty, contact)}>Enviar WhatsApp</button>
                          <button class="btnCommon" on:click={saveNote}>Guardar Info</button>
                        {/if}
                    </div>
                  </div>
                  <div class="iconContent">
                    <i on:click={editContact(contact)} class="material-icons edit">edit</i>
                    <i on:click={deleteContact(currentId)} class="material-icons delete">delete_forever</i>                               
                </div> 
              </div>
            </div>  

          {/if}

           

<!-- *- PROPIEDADES DE INTERES ""porpInterest""-->      
      <!-- Tarjeta de propiedades filtradas por contacto -->
        <main id="bookshelf">
          {#if systStatus === "porpInterest" || systStatus == "contSearch" || systStatus == "propSearch"}                  

              {#each porpInterest as property}
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
                        <div>
                          Precio {property.price}
                          <!-- <input type="checkbox" value={property.nameProperty} class="form-check" bind:group={checkedProperty}>  -->
                          <input type="checkbox" value={property} class="form-check" bind:group={checkedProperty}>                   

                        </div>
                      </div>
                    </section>
                  </section>                  
                </section>
              {/each}
              {/if}

              <div class="message">           
                {#if message}
                  <h4>{message}</h4>
                {/if}
              </div>

      <!-- PopUp Agenda -->
            <div class="col">                   
              {#if isActivated}
              <AddToSchedule on:closeIt = {close}/>
              {/if}
          </div>

      <!-- Carga la bitacora -->
              {#if  !isActivated}
                <div class="container">
                  <div class="binnacleHome">
                    <h1>Bitácora</h1>
                        {#each contactBinnacle as item}
                            <div class="int-binnacle">
                                <div class="date-binnacle">
                                    <p>{formatDate(item.date)}</p>
                                </div>
                                <div class="com-binnacle">
                                    <p>{item.comment}</p>
                                </div>
                            </div>
                        {/each}                  
                  </div>                      
                </div>                
              {/if}

            </main>
   
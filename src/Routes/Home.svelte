<script>
// IMPORTACIONES
  import { db } from "../firebase";
  import Binnacle from '../components/Binnacle.svelte'

// DECLARACIONES
  let error;
  let todos = [];
  let ordeTodos = [];
  let properties = [];
  let todaDate = + new Date();
  let todayDate = formatDateFiltrar(todaDate)
  
// Descarga la Base de todos
    db.collection("todos").onSnapshot((querySnapshot) => {
        let docs = [];
          querySnapshot.forEach(async(doc) => {
            docs.push({ ...doc.data(), id: doc.id });
          });
          todos = [...docs];                         
          return ordeTodos = todos.sort((b, a)  => {return new Date(b.endTask) - new Date(a.endTask)}) 
          // console.log(todos, todosO);
          // return todos
         });

// Importa la base de propiedades
    db.collection("properties").onSnapshot((querySnapshot) => {
            let docs = [];
            querySnapshot.forEach((doc) => {
            docs.push({ ...doc.data(), id: doc.id });
            });
            properties = [...docs];
            // console.log(properties)
          });	

// Router
    const goContacts = () => {
      window.location.href='#/contactos'
    }
  
    const goPropieties = () => {
      window.location.href='#/propiedades'
    }

    const goToDo = () => {
      window.location.href='#/todo'
    }

// Formato para fecha para Mostrar
    function formatDate(fecha){
        fecha = new Date(fecha)
         let dia = fecha.getDate()+1;
         let mes = fecha.getMonth()+1;
         let ano = fecha.getFullYear();
         return (`${dia}-${mes}-${ano}`)
      }

// Formato para fecha para Filtrar
    function formatDateFiltrar(fecha){
      fecha = new Date(+fecha)
         let dia = fecha.getDate();
         let mes = fecha.getMonth()+1;
         let ano = fecha.getFullYear();
         return (`${ano}-${mes}-${dia}`)
      }

    function buscarItems(){
      properties.forEach(element => console.log(element.locaProperty, element.nameProperty))
    
    }

</script>
<!-- ICONOS -->
  <body>
    <div class="wrapper-grid">
   
      <div class="container" on:click={goContacts}>
        <div class='banner-img'></div>
        <img src="images/add-user.png"  alt='Contactos' class="profile-img">
        <h1 class="name">Contactos</h1>
      </div>
  
      <div class="container" on:click={goPropieties}>
        <div class='banner-img'></div>
        <img src="images/house.png" alt='Propiedades' class="profile-img">
        <h1 class="name">Propiedades</h1>
      </div>
  
      <div class="container" on:click={goToDo}>
        <div class='banner-img'></div>
        <img src="images/schedule.png" alt='Buzon' class="profile-img">
        <h1 class="name">Agenda</h1>
      </div>
  
      <div class="container" >
        <div class='banner-img'></div>
        <img src='images/team.png' alt='Bolsa Inmobiliaria' class="profile-img">
        <h1 class="name">Sinergias</h1>
      </div>

    </div>
<!-- BOTON (provicional)-->
    <!-- <button on:click={buscarItems}>Buscar Info</button> -->

<!-- AGENDA -->
    <div class="show-home">

      <div class="container">
        <div class="schedule">
          <h1>Agenda</h1>    
          <h3>Tareas</h3>

          <ol>
            {#each ordeTodos as item}
              {#if new Date(item.endTask) <= new Date(todayDate)}
                {#if !item.timeTask}
                  <ul>
                    <li class:complete={item.isComplete}>               
                        {formatDate(item.endTask)} - -
                        {item.task} - -
                        {#if item.notes}
                            {item.notes} 
                        {/if}          
                    </li>
                  </ul>
                {/if}          
              {/if}
            {:else}
              <p>No Hay Tareas Pendientes Para Hoy</p>              
            {/each}
          </ol>

          <h3>Citas</h3>
          <ol>
            {#each todos as item}
              {#if new Date(item.endTask) <= new Date(todayDate)}
                {#if item.timeTask}
                  <ul>
                    <li class:complete={item.isComplete}>
                        <spam>
                          {item.timeTask} - -
                          {formatDate(item.endTask)} - -
                          {item.task} - -
                          {#if item.notes}
                              {item.notes} 
                          {/if}            
                        </spam>        
                    </li>
                  </ul>
                {/if}
              {/if}
            {:else}
                <p>No Hay Citas Pendientes Para Hoy</p>
            {/each}
                <!-- <p class="error">{error}</p> -->
          </ol>
        </div>
      </div>

<!-- BITÁCORA -->
      <div class="container">
        <div class="schedule">
          <Binnacle/> 
        </div>
      </div>

    </div>
  </body>
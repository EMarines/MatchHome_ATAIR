<script>
   import { db } from "../firebase.js";
   import Schedule from '../components/Schedule.svelte'

// Declaraciones
   let todo = {
         task: "",
         isComplete: "",
         createdAt: "",
         endTask: "",
         timeTask: "", 
         notes: ""         
      };

   let todos = [];
   let error = "";
   let ordeTodos = [];

// Descarga la Base de todos
    db.collection("todos").onSnapshot((querySnapshot) => {
            let docs = [];
            querySnapshot.forEach(async(doc) => {
               docs.push({ ...doc.data(), id: doc.id });
            });
            todos = [...docs];                         
            ordeTodos = todos.sort((b, a)  => {return new Date(b.endTask) - new Date(a.endTask)}) 
         });

// Agrega tarea nueva
   const addTodo = async() => {
      if (todo.task !== ""){
         await db.collection("todos").doc().set({ ...todo, createdAt: Date.now() });
         error = "";
      } else {
         error = "Task is empty"
      };
         todo = {};
      };

// Edita la tarea     
   const markTodoAsComplete = async (item) => {
      item.isComplete = !item.isComplete
      await db.collection("todos").doc(item.id).update(item);
      //   window.location.href='/'
   };

// Elimina la tarea
   const deleteTodo = async (item) => {
      let confDelete = confirm("Quieres borrarlo definitivmente?")
      if(confDelete == true){
         await db.collection("todos").doc(item.id).delete();
      }
   };

// Agrega la tarea con el "Enter"
   const keyIsPressed = (event) => {
      if (event.key ==="Enter"){
         addTodo()
      };
   };
 
</script>


<div class="container">

<h1>Agenda</h1>

<Schedule />
<h3>Tareas</h3>
<ol>
   {#each ordeTodos as item}
      {#if !item.timeTask}
         <li class="schedule" class:complete={item.isComplete}>
            <span>
               <button on:click={ () => markTodoAsComplete(item) }>✔</button>
               <button on:click={ () => deleteTodo(item) }>✖</button>
            </span>
            <spam>
               {item.endTask} -*-
               {item.task} -*-
               {#if item.notes}
                  {item.notes} 
               {/if}          
            </spam>        
         </li>
      {/if}
   {:else}
      <p>No Hay Tareas Pendientes</p>
   {/each}
      <p class="error">{error}</p>
</ol>
<h3>Agenda</h3>
<ol>
   {#each todos as item}
      {#if item.timeTask}
         <li class="schedule" class:complete={item.isComplete}>
            <span>
               <button on:click={ () => markTodoAsComplete(item) }>✔</button>
               <button on:click={ () => deleteTodo(item) }>✖</button>
            </span>
            <spam>
               {item.timeTask} -*-
               {item.endTask} -*-
               {item.task} -*-
               {#if item.notes}
                  {item.notes} 
               {/if}            
            </spam>        
         </li>
      {/if}
   {:else}
      <p>No Hay Tareas Pendientes</p>
   {/each}
      <p class="error">{error}</p>
</ol>
</div>
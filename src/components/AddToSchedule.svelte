<script>   
   // Importaciones
      import { createEventDispatcher } from 'svelte';
      import { fly, fade } from 'svelte/transition';
      import { db } from "../firebase";
      
   // Declaraciones
      let todo = {
         task: "",
         isComplete: "",
         createdAt: "",
         endTask: "",
         timeTask: "", 
         notes: ""         
      };
      
      let error = "";

   // *- Funciones
         const dispatch = createEventDispatcher();

         function close() {
            dispatch('closeIt')
            window.location.href='/'
         }
   
   // console.log(name)
         const addTodo = async() => {
            if (todo.task !== ""){
               await db.collection("todos").doc().set({ ...todo, createdAt: Date.now() });
               error = "";
               close();
            } else {
               error = "Task is empty"
            };
               todo = {};
         };
   
   // Agrega la tarea con el "Enter"
         const keyIsPressed = (event) => {
            if (event.key ==="Enter"){
               addTodo()
            };
         };

   </script>
   
   <div class="background" transition:fade on:click ={close}/>

      <div class="pop-up" transition:fly>         
         <div>
            <input type="text" class="inputTask" cols="56" rows="1"  placeholder = "Agrega una Tarea o Cita" bind:value = {todo.task} />
         </div>
         <div class="contDate">
            <input type="time"class="inputDate" bind:value = {todo.timeTask} />
            <input type="date" class="inputDate" bind:value = {todo.endTask} /> 
         </div>
         <div>
            <textarea name="notes" id="" cols="56" rows="5" bind:value = {todo.notes} placeholder ="descripción"></textarea>
         </div>
         
         <div>
            <button on:click={addTodo}>Guardar</button>
            <button on:click={close}>Cancelar</button>
         </div>
      </div>   
 
      
   <svelte:window on:keydown={keyIsPressed}/>
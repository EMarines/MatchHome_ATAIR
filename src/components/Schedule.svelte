<script>   
// Importaciones
   import { db } from "../firebase";

// Declaraciones
   let todo = {
      task: "" ,
      isComplete: "",
      createdAt: "",
      endTask: "",
      timeTask: "", 
      notes: ""         
   };
   
   let error = "";

      const addTodo = async() => {
         if (todo.task !== ""){
            await db.collection("todos").doc().set({ ...todo, createdAt: Date.now() });
            error = "";
            console.log("add todo")
            todo = {};
            window.location.href = '/'
         } else {
            error = "Task is empty"
         };
      };

   // Agrega la tarea con el "Enter"
      const enterIsPressed = (event) => {
         if (event.key ==="Enter"){
            addTodo()
         };
      };
</script>

      <div class="container">

         <div class="sched-container">
            <div>
               <input type="text" class="inputTask" placeholder = "Agrega una Tarea o Cita" bind:value = {todo.task} />
            </div>
               <input type="time" class="inputDate" bind:value = {todo.timeTask} />
               <input type="date" class="inputDate" bind:value = {todo.endTask} /> 
               <div>
                  <textarea name="notes" class="sched-note" cols="65" rows="5" bind:value = {todo.notes} placeholder ="descripción"></textarea>
               </div>
               <button class="sched-btn" on:click={addTodo}>Agregar</button>
            </div>
         
      </div>
   

   <svelte:window on:keydown={enterIsPressed}/>

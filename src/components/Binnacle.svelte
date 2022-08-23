<script>
// import Binnacle from './Binnacle.svelte';
    import { db } from "../firebase";

    let binnacles = [];
    let ordeBinnacle = [];

// Decalracion de binnacle
    let binnacle = {
        date: "",
        commBinnacle: ""
    };

// Base de bitácora
    db.collection("binnacles").onSnapshot((querySnapshot) => {
        let docs = [];
        querySnapshot.forEach(async(doc) => {
            docs.push({ ...doc.data(), id: doc.id });
        });
        binnacles = [...docs];                         
            return ordeBinnacle = binnacles.sort((a, b)  => {return b.date - a.date
            })  
        }); 

// *- Formatos fecha
        let fechaActual;
        function formatDate(fecha){
            fecha = new Date(fecha)
            let min = fecha.getMinutes();
            let hora = fecha.getHours();
            let dia = fecha.getDate();
            let mes = fecha.getMonth()+1;
            let ano = fecha.getFullYear();
            return fechaActual = (`${dia}/${mes}/${ano} -- ${hora}:${min}`)
        }

</script>
<main>

    <div class="container">
        <div class="schedule">
            <div class="binnacleHome">
                <h1>Bitácora</h1>
                {#each ordeBinnacle as item}
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
    </div>
</main>

<style>
    h1{
        color:red;
    }
</style>
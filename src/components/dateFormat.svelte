<script>
	import { onMount } from 'svelte';
	
	let now = new Date(), month, day, year;
	let dateString;
	
	onMount(()=> {
        month = '' + (now.getMonth() + 1),
        day = '' + now.getDate(),
        year = now.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    dateString = [year, month, day].join('-');
	})
</script>

<label>
   <input type=date bind:value={dateString}>
</label>
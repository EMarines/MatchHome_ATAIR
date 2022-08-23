<script>
	export let searchTerm;
</script>

<div id="search-input-cont">
	<input type="text" 
		id="search-field" 
		placeholder="Enter Search Term" 
		autocomplete="off"
		bind:value={searchTerm}
		on:input />
</div> 

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');


let properties =[];

// Decraracion de Prperty
  let property = {
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
 };

(async () => {
   const browser = await puppeteer.launch({headless: true});
   const page = await browser.newPage();

   
   const n = 2;
   var y = 1   

   for(y; y < n; y++){
      console.log("y=", y)        
      await page.goto(`https://www.matchhome.net/properties?page=${y}`);
         await page.setViewport({
            width: 1920,
            height: 1080,
            deviceScaleFactor: 1
            })
            
            const links = await page.evaluate(() => {
               return Array.from(document.querySelectorAll('.property-listing h4 a')).map(x => x.href)
            })

         const properties = [];
         let i = 0
         
         for(let link of links){
            await page.goto(link);
            await page.waitForSelector('#description');
               const property = await page.evaluate(() => {
               const tmp = {};
               tmp.description = (document.querySelector('#description > div.info').innerText).replace(/[\n+]/g, "");     
               tmp.colonia = document.querySelector('#property > div.section-head > div > div > div.col-sm-8 > h2 > a:nth-child(1)').innerText;
               tmp.price = (document.querySelector('#prices > ul > li > span').innerText).replace(/[$,]/g, "")
               operacion = (document.querySelector('#prices > ul > li > small').innerText).replace(/en /, "");
               tmp.operacion = operacion.replace(/\b[a-z]/g, c => c.toLocaleUpperCase())
               tmp.claveEB = document.querySelector('#summary > table > tbody > tr:nth-child(1) > td:nth-child(2)').textContent;
               tmp.urlImage = document.querySelector('#gallery > div > div.rsOverflow.grab-cursor > div.rsContainer > div:nth-child(1) > img').src;
               linkPropertyE = Array.from(document.querySelectorAll('#summary > table > tbody > tr:nth-child(1)')).map(x => x.baseURI);
               tmp.urlProp = linkPropertyE.toString();
               tmp.nameProperty = document.querySelector('#property > div.section-head > div > div > div.col-sm-8 > h2 > a:nth-child(1)').innerText;
               tmp.locaProperty = document.querySelector('#property > div.section-head > div > div > div.col-sm-8 > h2 > a:nth-child(1)').innerText;
               tmp.tagsProperty = document.querySelector('#property > div.section-head > div > div > div.col-sm-8 > h2 > a:nth-child(1)').innerText;
               detalles = Array.from(document.querySelectorAll('#summary > table > tbody > tr')).map(x => x.outerText);
               detalles.forEach(detalle => {
                  let indice = detalle.indexOf('Recámaras:')
                  if(indice == 0){
                  tmp.beds = detalle.replace('Recámaras:\t', "")}  
               })
               detalles.forEach(detalle => {
                  let indice = detalle.indexOf('Baños:')
                  if(indice == 0){
                  tmp.bathroom = detalle.replace('Baños:\t', "")}  
               })
               detalles.forEach(detalle => {
                  let indice = detalle.indexOf('Medios baños:')
                  if(indice == 0){
                  tmp.halfBathroom = detalle.replace('Medios baños:\t', "")}  
               })
               detalles.forEach(detalle => {
                  let indice = detalle.indexOf('Estacionamientos:')
                  if(indice == 0){
                  tmp.park = detalle.replace('Estacionamientos:\t', "")}  
               })
               detalles.forEach(detalle => {
                  let indice = detalle.indexOf('Construcción:')
                  if(indice == 0){
                     areaBuilding = detalle.replace('Construcción:\t', "")
                  tmp.areaBuilding = areaBuilding.replace(" m²", "")};           
               })
               detalles.forEach(detalle => {
                  let indice = detalle.indexOf('Terreno:')
                  if(indice == 0){
                     areaTotal = detalle.replace("Terreno:\t", "")
                  tmp.areaTotal = areaTotal.replace(" m²", "")}  
               })
               detalles.forEach(detalle => {
                  let indice = detalle.indexOf('Pisos:')
                  if(indice == 0){
                  tmp.flors = detalle.replace('Pisos:\t', "")}  
               })
               detalles.forEach(detalle => {
                  let indice = detalle.indexOf('Piso:')
                  if(indice == 0){
                  tmp.flors = detalle.replace('Piso:\t', "")}  
               })
               detalles.forEach(detalle => {
                  let indice = detalle.indexOf('Agente:')
                  if(indice == 0){
                  tmp.agent = detalle.replace('Agente:\t', "")}  
               }); 
               return tmp;
            });

            // properties.push(property)
            i=++i
            console.log(i, property)
            await db.collection("properties").doc().set({ ...property, createdAt: Date.now() });


            properties.push(property)
            // const jsonProperties = JSON.stringify(properties)
            fs.writeFileSync(path.join(__dirname, 'jsonProperties.json'), JSON.stringify(properties), 'utf8'
            );
         };
         console.log(properties)
   }

   await browser.close();
}) ();




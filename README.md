This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).
See also [README-create-react-app.md](README-create-react-app.md). 

## Garden

Purpose: to see the different color schema's of a selection of plants over time

Demo/test:  
* https://garden.tryx.com/
* http://test-garden.tryx.com/


to start: 

* npm install
* npm run watch-css
* npm run start
* http://localhost:3000
* https://test-garden.tryx.com 
* tests: 
     * I had problem to "npm test" 
     * Error watching file for changes: EMFILE 
     * brew install watchman 
   
* eazydraw
     * sources: save in sprite_src
     * export as png to src/sprite 
     * layers: select "show all below" --> only visible layers are exported
     
        
## Three.js

see [Three.js api documentation](https://threejs.org/docs/#manual/introduction/Creating-a-scene) 


## TODO

* gsm 
     * gsm weeknr slider niet goed
     
* BUG: import als file content fout

* NEED
     * link to tryx
   
* NICER
     * responsive responsive responsive
     * animate: add plant, delete area, delete plant
  
* USABILITY
     * add all possible features in menu
     * menu: predefined gardens in submenu 

* refactor
     * inline styling
      

## TODO LATER      
* NICER
     * camera pos delete
     * ico niet goed vanboven 
     * spinner when loading a garden
     * more and nicer plants
     * how/hide plantlist? 
     * close dialog / menu met escape
     * +area (dup): add after duplicated area
* gsm
     * fixed plantfiche: swipe for next fiche 

* usability of area-list-editor
     * type of plant: bol/vast/gras -> selecteer 
     * show area: show numbers to identify
     * select other plant for area ???
   
* persistance && data  
     * export: sorted per plant (or per flowerstart?)
     * save garden in googledrive
     * load garden from googledrive
   
* help / tutorial
     * legend for x,y,z
     * context menu for plantname 
   
* add debug to url to activate debug
* change size of garden
* BUG: size of area can not be <= 0
* dichtheid van de planten
* bodembedekker
* objects that throw shadow (tree, wall, haag)
* plant editor
* tuinman komt in februari ipv op 1 januari
* vlinders
* helper lines (grid)
* real moving sun summer/winter
* plants: variations: several png's per plant
* billboards iso sprites


## Refs 

* color schema https://coolors.co/080808-3e4237-9bc4bc-d3ffe9-8ddbe0

* faster? 
     * sprites
     * http://blog.sandromartis.com/2016/11/16/merging-geometries/
          * geometry.translate(x,y,z)
          * cube.position.set(x, y, z);
          * reuse geometry to create several meshes
          * merging geometries 
               * var mergedGeometry = new THREE.Geometry();
               * mergedGeometry.merge(boxGeometry);
     * http://www.ianww.com/blog/2012/11/04/optimizing-three-dot-js-performance-simulating-tens-of-thousands-of-independent-moving-objects/
          * HTML5 Web Workers: similar to multiple threads
      
      
* TODO TO LEARN
     * Flow (Flow Types)
     * CSS Modules / CSS-in-JS ( glamor, glamorous, styled components, ... )
     * GraphQL ( b.v. in GatsbyJS, of spelen met een serverke )
     * Webpack
     
     
## UI redesign

* nog veel processor use! 
* do you agree -- kleiner 
* tutorial weg
* lijst planten: 
    * sorteer cols met symbool boven cols
    * filter in cols?  
    * col: show only plants in this garden -> + filter
    * list met kleine pic?
    * show plants in garden   
    * show plants not in garden   
* view garden / edit garden 
* which plant is this? 
    * click on the plant - not on the area :-S
    * pop up window with name + pic + grow/flower period
    * edit button
        * show-area gaat aan voor deze area
        * of voor alle areas deze plant?? 
        * eventueel edit mode altijd automatisch in top-view 
        * maar wel NZOW zelfde houden
        * getallen zien nodig? beter bruikbaar genoeg zonder getallen! 
    * plant-pic: drag in world to add plant-area
* menu: import/export/etc -> open in groot venster 
* camera positions??? 
    * viewpoints 
    * 1 icoon in menu 
    * drop down (of dialog) om viewpoints te selecteren

 
## other
* loglevel
* upgrade alles om te debuggen
* react-emotion (styled)


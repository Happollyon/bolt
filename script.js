

/**
 * @fileoverview
 * Provides interactions for all pages in the UI.
 * Created by : Fagner Nunes
 * Date: april 2023 
 * 
 */


//================= Prepare UI =================


//atatching event listeners to all the nav buttons
document.addEventListener('DOMContentLoaded', () => {
    updatePannel("Targets")

    chrome.storage.local.get(null, function(items) {
      console.log(items);
    });
    const navBtn = document.querySelectorAll('.navBtn');
    navBtn.forEach(navBtn =>navBtn.addEventListener('click',(event)=>{
        select(event.target); // if you click a nav butoon you call the select function and pass the button as a parameter
    }));
  });

//this function is called when a nav button is clicked
function select(element){
  // you remove the id from all the nav buttons
    const navBtn = document.querySelectorAll('.navBtn');
    navBtn.forEach(navBtn =>navBtn.removeAttribute("id"));

    // you add the id to the nav button that was clicked
    element.id="selected";
    
    //you call updatePannel and pass the innerHTML of the nav button that was clicked => I.E. infoDisc
    updatePannel(element.innerHTML)

}


function updatePannel(doc)
{
  const xhr = new XMLHttpRequest();
  xhr.onload = () => {
    
    if (xhr.status === 200) {
      const div = document.createElement('div');
      div.innerHTML = xhr.responseText;

      
      // if the button clicked is infoDisc, it adds the infoDisc.html file to the pannel
      if(doc == "infoDisc"){
        //gets container from infoDisc.html
        const infoDiscContainer = div.querySelector('#infoDiscContainer');        
        const pannel = document.querySelector('#pannel'); // gets the pannel
        pannel.innerHTML = ""; // clears the pannel
        
        pannel.appendChild(infoDiscContainer); //append the infoDiscContainer to the pannel
        
        // adds an event listener to the infoDisc button
        const infoDisc = document.querySelector('#infoDisc');
        infoDisc.addEventListener('click', fetchAndCrawl);
        loadOptionsSelect()

        const selectAllBtn = document.querySelector('#select-all');
        selectAllBtn.addEventListener('click', selectAll);

        const clearAllBtn= document.querySelector('#clear');
        clearAllBtn.addEventListener('click', () => {clearAll()});

        const savebtn = document.querySelector('#save');
        savebtn.addEventListener('click', () => {save()});

        const infoSelectClose = document.querySelector('#infoSelect-close');
        infoSelectClose.addEventListener('click', () => {closeInfoSelect()});

        const infoDiscClear =document.querySelector('#infoDiscClear');
        infoDiscClear.addEventListener('click', () => {clearInfoDiscData()});

        const showConfig = document.querySelector('#config');
        showConfig.addEventListener('click', () => {showSettings()});

        loadInfoDisclosureData();

      }else if(doc=="Directory Fuzz"){
        //gets container from directoryFuzz.html
        
        const directoryFuzzContainer = div.querySelector('#directoryFuzzContainer');
        const pannel = document.querySelector('#pannel'); // gets the pannel
        pannel.innerHTML = ""; // clears the pannel

        pannel.appendChild(directoryFuzzContainer); //append the directoryFuzzContainer to the pannel

        // adds an event listener to the directoryFuzz button
        const directoryFuzzBtn = document.querySelector('#DirectoryFuzz');
        directoryFuzzBtn.addEventListener('click', directoryFuzz);
        const clearDataBtn = document.querySelector('#DirectoryFuzzStop');
        clearDataBtn.addEventListener('click', () => {clearData('DirectoryData')});

        loadDirectoryData();

      }else if(doc=="Path Transversal"){
        const pathTransversalContainer = div.querySelector('#pathTransversalContainer');
        const pannel = document.querySelector('#pannel'); // gets the pannel
        pannel.innerHTML = ""; // clears the pannel
        pannel.appendChild(pathTransversalContainer); //append the pathTransversalContainer to the pannel

        //=====add event listeners to the buttons=====
        const scanButton = document.querySelector('#scanButton');
        scanButton.addEventListener('click', scan);
      }else if(doc == "Targets"){

        const targetsContainer = div.querySelector('#targetsContainer');
        const pannel = document.querySelector('#pannel'); // gets the pannel
        pannel.innerHTML = ""; // clears the pannel
        pannel.appendChild(targetsContainer); //append the pathTransversalContainer to the pannel
        loadTargets();
        //=====implement draggin and droping of items=====
        const sortableList = document.querySelector('#targetsContainer');
        const dragbleItems = document.querySelectorAll('.targetItem');
      
        //adding event listeners to the dragble items
        dragbleItems.forEach(dragbleItem => {

          dragbleItem.addEventListener('dragstart', () => {
            // if the item is being dragged, add the dragging class
            alert("drag started")
            setTimeout(() =>  dragbleItem.classList.add('dragging'), 0);

          });

          dragbleItem.addEventListener('dragend', () => {
            // if the item is not being dragged, remove the dragging class
            dragbleItem.classList.remove('dragging');
            alert("drag ended")
            const nextSibling = dragbleItem.nextElementSibling;
            const nextSiblingId = nextSibling.getAttribute("id");
            const prevSibling = dragbleItem.previousElementSibling;
            const prevSiblingId = prevSibling.getAttribute("id");
            const targetId = dragbleItem.getAttribute("id");
            chrome.storage.local.get(['TargetsList']).then(targetList => {
              let targetListReturned = targetList['TargetsList']
              alert(targetId)
            });
          });
        })

        //adding event listeners to the sortable list
        const initSortableList = (e) => {
          // if the item is being dragged, prevent the default action
          e.preventDefault();
          const draggingItem = document.querySelector(".dragging"); // Getting the currently dragging item

          // Getting all items except currently dragging and making array of them
          let siblings = [...sortableList.querySelectorAll(".targetItem:not(.dragging)")];
          // Finding the sibling after which the dragging item should be placed
          let nextSibling = siblings.find(sibling => {
            // Moving the dragging item only when the cursor is above 50% of the sibling element
              return e.clientY <= sibling.offsetTop + sibling.offsetHeight / 2;
          });
          // Inserting the dragging item before the found sibling
          sortableList.insertBefore(draggingItem, nextSibling)}
      //adding event listeners to the sortable list
      sortableList.addEventListener("dragover", initSortableList);
      sortableList.addEventListener("dragenter", e => e.preventDefault());// Preventing default action on dragenter

      //=====add event listeners to the buttons=====
      const addTargetButton = document.querySelector('#addTargetButton');
      addTargetButton.addEventListener('click', addTargetItem);  
        
      }

    }
  };

  
  // if the inner html of the nav button is infoDisc, it fetches the infoDisc.html file and adds it to the pannel
  if(doc == "infoDisc"){
      xhr.open('GET', 'infoDisc.html');
      xhr.send();
  }else if(doc=="Directory Fuzz"){
      xhr.open('GET', 'directoryFuzz.html');
      xhr.send();
  }else if(doc=="Path Transversal"){
      xhr.open('GET', 'pathTransversal.html');
      xhr.send();
  }else if(doc=="Targets"){
    xhr.open('GET', 'target.html');
    xhr.send();
  }
}

//================= Targets =================

// This function adds a new target item to the pannel and to the storage
function addTargetItem(){
  chrome.storage.local.get(['TargetsList']).then(targetList => {
      if(targetList['TargetsList'] === undefined){

        chrome.storage.local.set({"TargetsList": []}).then(res=>{
          
          addTargetItem();

        })}else{
          let targetListReturned = targetList['TargetsList']
          let targetObj = {"name":"new target",
          "selected":false,"id":generateUUID(),
          "infoDisclosure":[],
          "directoryFuzz":[],
          "pathTransversal":[],
          "methodology":[]
        }
          targetListReturned.push(targetObj)
          chrome.storage.local.set({"TargetsList": targetListReturned})
          const targetItem = createTargetItem(targetListReturned[targetListReturned.length-1])
          document.getElementById("targetsContainer").appendChild(targetItem)
        }
   })
   // add to storage

 }
 // this function generates a unique id
 function generateUUID() {
  const timestamp = new Date().getTime(); // get the current time
  const random = Math.floor(Math.random() * 1000000);// get a random number
  return `${timestamp}-${random}`;// return the timestamp and the random number
}
 // this functions creates a target item and returns it
function createTargetItem(target){
    // create the target item and add the classes
    const targetItem = document.createElement('div')
    targetItem.classList.add('targetItem');
    targetItem.id = target.id;
    targetItem.draggable = true;

    // create toggle switch and add classes
    let targetToggle = document.createElement('div')
    targetToggle.classList.add('targetToggle');
    if(target.selected){
      targetToggle.classList.add('targetToggleOn');
    }
    // create the target name and add classes and innerHTML
    let targetName = document.createElement('div')
    targetName.classList.add('targetName')
    targetName.contentEditable = true;
    targetName.innerHTML = target.name;

    // create the target delete button and add classes and innerHTML
    let targetItemDelete = document.createElement('div')
    targetItemDelete.classList.add('targetDelete')
    targetItemDelete.innerHTML = "X";

    // build the target item by appending the elements to the target item
    targetItem.appendChild(targetToggle);
    targetItem.appendChild(targetName);
    targetItem.appendChild(targetItemDelete);

    // add event listeners to the target item

        targetItem.addEventListener('dragstart', () => {
          // if the item is being dragged, add the dragging class
          setTimeout(() =>  targetItem.classList.add('dragging'), 0);

        });

        targetItem.addEventListener('dragend', () => {
          // if the item is not being dragged, remove the dragging class
          targetItem.classList.remove('dragging');
          const targetId = targetItem.getAttribute("id");// get the id of the target item

          // try to find the target item in the target list and move it to the new position in the local.storage
          let allTargets = document.querySelectorAll('.targetItem');// get all the target items
          let targetList = [];// create an array to store the target items
          allTargets.forEach(target => {
            targetList.push(target.getAttribute("id"))// add the target item id to the array
          });
          let targetIndex = targetList.indexOf(targetId);// find the indext the target being dragged holds at the moment
          
          // change the position of the target in the storage to the new position the user dragged it to
          chrome.storage.local.get(['TargetsList']).then(targetList => {
            let targetListReturned = targetList['TargetsList']
            targetListReturned.forEach((target,index) => {
              if(target.id == targetId){
                targetListReturned.splice(index,1);// remove the target from the target list
                targetListReturned.splice(targetIndex,0,target);// add the target to the new position
                chrome.storage.local.set({"TargetsList": targetListReturned})// update the target list in storage
              }
            })
            
           
          });

        });
        
        //adding event listeners to the delete buttons
        targetItemDelete.addEventListener('click', () => { 
          deleteTargetItem(targetItemDelete.parentElement) 
        });
        //adding event listeners to the target name
        targetName.addEventListener("input", function() {
          
          updateTargetName(targetName.parentElement,targetName.innerHTML)
        });

        targetToggle.addEventListener("click", function() {
          toggleTarget(targetToggle.parentElement)
          let allToggles = document.querySelectorAll('.targetToggle');
          allToggles.forEach(toggle => { toggle.classList.remove("targetToggleOn")});
          targetToggle.classList.toggle("targetToggleOn");
        });

    return targetItem;
  }
// this function loads the targets from the storage and adds them targetsContainer
function loadTargets(){
  chrome.storage.local.get(['TargetsList']).then(targetList => {
    if(targetList['TargetsList'] === undefined){

      chrome.storage.local.set({"TargetsList": []}).then(res=>{
        loadTargets();
      })}else{
        let targetListReturned = targetList['TargetsList']
        targetListReturned.forEach(target => {
          const targetItem = createTargetItem(target)
          document.getElementById("targetsContainer").appendChild(targetItem)
        });
      }
 })

}
// this function deletes a target item from the pannel and from the storage
function deleteTargetItem(targetItem){
  chrome.storage.local.get(['TargetsList']).then(targetList => {
        //
        let targetListReturned = targetList['TargetsList']// get the target list from storage
        targetListReturned.forEach((target,index) => {// loop through the target list
          if(target.id == targetItem.id){ // if the target id is the same as the target item id
            targetListReturned.splice(index,1);// remove the target from the target list
            chrome.storage.local.set({"TargetsList": targetListReturned})// update the target list in storage
            targetItem.remove();// remove the target item from the pannel
          }
        });
      })
}
// this function toggles the target item in the storage and in the pannel
function toggleTarget(targetItem){
  chrome.storage.local.get(['TargetsList']).then(targetList => {
    let targetListReturned = targetList['TargetsList']
    targetListReturned.forEach((target,index) => {
      if(target.id == targetItem.id){
        target.selected = !target.selected
        chrome.storage.local.set({"TargetsList": targetListReturned})
        
      }else if(target.selected){
        target.selected = false
        chrome.storage.local.set({"TargetsList": targetListReturned})
      }

    })
  })

}
// this function updates the target name in the storage and in the pannel
function updateTargetName(targetItem,targetName){
chrome.storage.local.get(['TargetsList']).then(targetList => {
  let targetListReturned = targetList['TargetsList']
  targetListReturned.forEach((target,index) => {
    if(target.id == targetItem.id){
      target.name = targetName
      chrome.storage.local.set({"TargetsList": targetListReturned})
    }

  })
})
}

// This function gets the path from the url
function getPathFromUrl(url) {
  const parsedUrl = new URL(url);//parse the url
  const path = parsedUrl.pathname;//get the path from the url
  return path === '/' ? 'base url' : path; // if the path is / return base url else return the path
}

//===============Path transversal===================
async function scan(){
    const url = document.getElementById("pathTransversalWebsite").value;
    const payloads = [];
    const payloadsFiles = ['./fuzz/directoryTransversal.json']

    //query the payloads files
    for(let i = 0; i<payloadsFiles.length;i++){
      await fetch(payloadsFiles[i]).then(response=>response.json().then(txt=>{
        txt.forEach(payload => {
          payloads.push(payload);
        })

      }))
    }
    

    // calls Makes transversal requests
    makeTransversalRequests(payloads,url,50);

}
// This function  makes the thousands of requests to the server and needs to be brokent down into smaller payloads

async function makeTransversalRequests(payloads,url,batchsize)  {
  const batches = [];
  for (let i = 0; i < payloads.length; i += batchsize) {
    batches.push(payloads.slice(i, i + batchsize));
  }

  for(let i = 0;i<batches.length;i++){
    const batch = batches[i];
    try{
      const promises = batch.map(payload => fetch(url+payload, {timeout: 2000}));
      const responses = await Promise.all(promises);
      responses.forEach(response => {
        if(response.status != 404 && response.status != 403){
          responseURL = response.url;
          responseStatus = response.status;

          response.text().then(response=>{
          document.getElementById("table").innerHTML += "<div class='row'><div class='col'><a target=”_blank” href="+responseURL+">"+responseURL+"</a></div><div class='col'>"+response.length+"</div><div class='col'>"+responseStatus+"</div></div>";
          })}
      });
      }
    catch(err){
      console.log(err);
    }
  }

}

//======================== Directory Fuzz ========================

// This function  makes the thousands of requests to the server
async function makeRequests(urls, batchSize,url,type,recursiveDirectory)  {
  const batches = [];

  // split the urls into batches  
  for (let i = 0; i < urls.length; i += batchSize) {

    batches.push(urls.slice(i, i + batchSize));
  }

  const bar = document.getElementById('Directory-progress');//progress bar
 
  let loadedPercent = 0;
  let numberOfPayloads = urls.length;

  for (let i = 0; i < batches.length; i++) {
    
    const batch = batches[i];//batch of urls
    try{const promises = batch.map(url => fetch(url, {timeout: 2000}));

    const responses = await Promise.all(promises);

    responses.forEach(response => {

      if(response.status != 404 && response.status != 403){// if the response is not a 404 or 403
        var directoriesArrayReturned =[] 
        var isDirectoryInArray = false
        var targetItemIndex
        

        chrome.storage.local.get(['TargetsList']).then(targetListArray => { 
        let targetListArrayReturned =  targetListArray['TargetsList'] // get the array of targets from storage 
        targetListArrayReturned.forEach((target,index)=> {
            if(target.selected == true){// if the target is selected
              directoriesArrayReturned = target.directoryFuzz // get the array of directories from storage
              targetItemIndex = index
            }

        })
        
        

        // check if directory is already saved  
        if(directoriesArrayReturned.length == 0){
          isDirectoryInArray = false
        }else{

          // check if directory is already saved
          directoriesArrayReturned.map(obj=>{
            
          if(obj.url == response.url){
            isDirectoryInArray =  true;
            return true;
          }
            })
          }


           // if not already in storage => add to pannel and add to storage
          if(isDirectoryInArray===false){

            let directory = getPathFromUrl(response.url) // get the directory from the url
            document.getElementById("table").innerHTML += "<div class='row'><div class='col'><a target=”_blank” href="+response.url+">"+directory+"</a></div><div class='col'>"+type+"</div><div class='col'>"+response.status+"</div></div>";
            const newDirectory = 
            {
              "name":directory,
              "url":response.url,  //unique
              "code" :response.status,
              "type" : type,
              "complete": false
            }

            directoriesArrayReturned.push(newDirectory) // add to array
            targetListArrayReturned[targetItemIndex].directoryFuzz = directoriesArrayReturned // add to target
            chrome.storage.local.set({"TargetsList":targetListArrayReturned}) // add to storage
           } 

        })
}});
    
    loadedPercent = Math.round(((i*batchSize)*100)/numberOfPayloads);
    bar.style.width = loadedPercent.toString()+"%";  
    
  }catch(err){
      //err.preventDefault()
      {}
    }
  }

  

  // chrome.storage.local.get(['DirectoryData']).then(directoriesArray => {

  //   var directoriesArrayReturned =  directoriesArray['DirectoryData']
  //   let found = false;
  //   directoriesArrayReturned.forEach(obj => {
  //     if (!found && obj.complete == false && obj.type == "Directory" && obj.code == 200 && obj.name != "/" && obj.name != "" && obj.name != "//" && obj.name != "index/") {
  //       alert(obj.name);
  //       found = true;
  //       findDirectories(obj.url, obj.name);
        
  //     }
  //   });
  // })
  
}


// This function clears the data from the storage and the pannel
function clearData(){

  chrome.storage.local.get(['TargetsList']).then(TargetsList=>{ // get the array of targets from storage
    let targetListReturned = TargetsList['TargetsList']// get the array of targets from storage
    targetListReturned.map(target=>{ // loop through the targets
      if(target.selected == true){ // if the target is selected
        target.directoryFuzz = []// clear the directory fuzz array
        chrome.storage.local.set({"TargetsList": targetListReturned})// update the target list in storage
        document.getElementById("table").innerHTML = "";// clear the pannel
      }
    })
  })
  
}

// This function loads the data from the storage and adds it to the pannel
function loadDirectoryData(){

  chrome.storage.local.get(['TargetsList']).then(TargetsList =>{// get the array of targets from storage
    
    if (TargetsList["TargetsList"] === undefined) {// if the array is empty
      
      chrome.storage.local.set({"TargetsList": []}).then(res=>{
        
      })// create the array
    } else {
      // if the array is not empty
      TargetsList["TargetsList"].map(target=>{
       
        if(target.selected == true){// if the target is selected
          target.directoryFuzz.map(directory=>{// loop through the directories
            // add the data to the pannel
            document.getElementById("table").innerHTML += "<div class='row'><div class='col'><a target=”_blank” href="+directory.url+">"+directory.name+"</a></div><div class='col'>"+directory.type+"</div><div class='col'>"+directory.code+"</div></div>";
          })
          // end map
          return true;
        }
        
      })

    }
})

}



function directoryFuzz(){

  const url = document.getElementById("directoryWebsite").value;
  
  findDirectories(url,"");

}


// This function tries to find hiden directories in the website
async function findDirectories(url,recursiveDirectory){
    const urls=[] // an array of URLs to fetch
    const directoriesFiles = ['./fuzz/directory3.json','./fuzz/files.json','./fuzz/directory2.json'] // an array of files to fetch
    //get the directory1.txt file
    for(let i = 0; i<directoriesFiles.length;i++){
      
        await fetch(directoriesFiles[i]).then(response=>response.json().then(txt=>{
          // for each payload in the file, it creates a new url and adds it to the urls array
          txt.forEach(payload => {
           
            let newUrl;
            if(url.endsWith("/") && payload.startsWith("/")){ // if the url ends with / and the payload starts with /
              newUrl = url+payload.substring(1);
      
            }else if(url.endsWith("/") && !payload.startsWith("/")){// if the url ends with / and the payload doesnt start with /
            
              newUrl = url+payload;
            }else if(!url.endsWith("/") && payload.startsWith("/")){// if the url doesnt end with / and the payload starts with /
              newUrl = url+payload;
            }else if(!url.endsWith("/") && !payload.startsWith("/")){// if the url doesnt end with / and the payload doesnt start with /
              newUrl = url+"/"+payload;
            }
            
            urls.push(newUrl);// add the new url to the urls array
          })

        })) 
      }
      //update progress message
      let directory = getPathFromUrl(url);  // get the directory from the url
      document.getElementById('progress-message').innerHTML=directory;// update the progress message
      const batchSize = 50; // the number of requests to make at once
      makeRequests(urls, batchSize,url,"Directory",recursiveDirectory);// call the makeRequests function and pass the urls array, the batch size, the url and the type of request
}





//================= Information Disovery ===================

//this function selects all the checkboxes in infoslect

function showSettings(){
  document.getElementById("infoSelect").style.display = "flex";
  
}

function selectAll(){
  const checkboxes = document.querySelectorAll('input[name="items"]');
  checkboxes.forEach((checkbox) => {
    checkbox.checked = true;
  });
}

//this function unselects all the checkboxes in infoslect
function clearAll(){

  const checkboxes = document.querySelectorAll('input[name="items"]');
  checkboxes.forEach((checkbox) => {
  checkbox.checked = false;
})};

//this function saves the selected options in infoslect
// not tested yet

function save(){
  const checkboxes = document.querySelectorAll('input[name="items"]');
  const selectedItems = [];
  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      selectedItems.push(checkbox.value);
    }
  });
  chrome.storage.local.set({"selectedItems": selectedItems}).then(res=>{
    closeInfoSelect();
  })
}

//this function closes the info select pannel
function closeInfoSelect(){
  const infoSelect = document.getElementById('infoSelect');
  infoSelect.style.display = "none";
}

function loadOptionsSelect(){
  const checkboxContainer = document.createElement('div');
  const savedoptions = chrome.storage.local.get(['selectedItems']).then(res=>{
    fetch('./reg.json').then(response=>response.json().then(txt=>{
      for (key in txt){
        const checkbox = document.createElement('input');
        try{if(res['selectedItems'].includes(key)){
          checkbox.checked = true;
        }}catch(err){
          checkbox.checked = false;
        }
        checkbox.type = 'checkbox';
        checkbox.name = 'items';
        checkbox.value = key;
        const label = document.createElement('label');
        label.textContent = key;
        const tempDiv = document.createElement('div');
        tempDiv.appendChild(checkbox);
        tempDiv.appendChild(label);
        checkboxContainer.appendChild(tempDiv);
      };
      let add = document.getElementById('infoSelect-body-grid');
      add.appendChild(checkboxContainer);
    }))
  })


}

//this function calls itself recursively to crawl the website and check for info disclosure
var url;
var visitedUrl = []; // this is to keep track of the visited urls so it doesnt crawl the same url twice
var count = 0;


// Function to fetch a webpage and crawl links
async function fetchAndCrawl(newUrl) {
    
  // Fetch the webpage
       
    if(!url){
    url = document.getElementById("website").value; //get the url from the input field

    infoDisclosure(url);
    }else{
      url = newUrl;
    }
    const response = await fetch(url); //fetch the url
    const text = await response.text(); //get the text from the response
  
    // Get the base URL to compare against
    const baseUrl = new URL(url);
  
    // Regular expression to match links within the page
    const linkRegex = /<(?:a|script)[^>]+(?:href|src)="([^"]+)"/g;

    let match;
  
    // Crawl the links
    while ((match = linkRegex.exec(text)) !== null) {
      const link = match[1];
      const linkUrl = new URL(link, baseUrl);
      
      // Check if the link has the same host as the base URL and has not been visited yet
      if (linkUrl.host === baseUrl.host && !visitedUrl.includes(linkUrl.href)) {
        
         fetchAndCrawl(linkUrl.href);
        //call the infoDisclosure function to check for info disclosure and add the data to the table 
        infoDisclosure(linkUrl.href);

        // Add your logic to process the link here
        visitedUrl.push(linkUrl.href);//add the url to the visitedUrl array
      }
    }
  }


/*
*   
* Main function that loops through the regex and searches for them in the website
* 
*/
async function infoDisclosure(val){
    var findingsArray = []
    // gets the value of the website input
    //let val = document.getElementById("website").value;
     chrome.storage.local.get(['selectedItems']).then(async res=>{
      if(val != null){
        var response
        var body
        
        try{
           response =  await fetch(val,{mode:'no-cors'});
           body =  await response.text();
        }catch(err){
          console.log(err);
        }
        try {

            //fetches the website
          
           

            
            
            
            //gets the RegEx from the json file
           let reg = fetch('./reg.json').then(response=>response.json().then(data=>{
           
            // for each regex in the json file, it searches for the regex in the website
            for (const key in data) {

                    //checks if the key is in the json file
                    if (data.hasOwnProperty(key)) {
                      //creates a regex object  
                      const regex = new RegExp(data[key], 'g');
                      let match;
                      
                      //searches for the regex in the website
                      while ((match = regex.exec(body)) !== null) {
                        // this finds the last item in the path so i can display it in the table
                        const pathParts = val.split('/');
                        const lastPart = pathParts[pathParts.length - 1];
                        

                        //this is to limit the length of the match to 100 characters
                        match[0] = match[0].substring(0,100);
                        match[0] = match[0].replace(/</g, "&lt;").replace(/>/g, "&gt;");//this is to replace the < and > with html entities so it doesnt get rendered as html
                        if(res['selectedItems'].includes(key)){
                          let data = match[0]
                          document.getElementById("table").innerHTML += "<div class='row'><div class='col'><a target=”_blank” href="+val+" n>"+lastPart+"</a></div><div class='col'>"+key+"</div><div class='col'>"+match[0]+"fagner"+"</div></div>";
                          findingsArray.push({"url":val,"src":lastPart,"type":key,"data":data})
                          console.log(findingsArray.length)
                        }
                       //this adds the data to the table
                        
                       
                      }
                    }
              
              }
              chrome.storage.local.get(['TargetsList']).then(targetList => {
                let targetListReturned = targetList['TargetsList']
                targetListReturned.forEach((target,index) => {
                  if(target.selected == true){
                    if(findingsArray.length != 0){
                    console.log("targetlent: "+target.infoDisclosure.length+" findings: "+findingsArray.length)
                  }
                    target.infoDisclosure = [...target.infoDisclosure,...findingsArray]
                    
                   
                  }
                })
                chrome.storage.local.set({"TargetsList": targetListReturned})
               
              })

              count++;
              document.getElementById("ulr-done").innerHTML = "crawlled "+count+" pages";
              document.getElementById("ulr-left").innerHTML =  visitedUrl.length+" pages left";
           }))

            
          } catch (error) {
            console.error(error);
          }
    }
    })
   
    
}
// this function loads the data from the storage and adds it to the pannel
function loadInfoDisclosureData(){
  
  chrome.storage.local.get(['TargetsList']).then(TargetsList =>{// get the array of targets from storage
    
    if (TargetsList["TargetsList"] === undefined) {// if the array is empty
      
      chrome.storage.local.set({"TargetsList": []}).then(res=>{
        
      })// create the array
    } else {
      // if the array is not empty
      TargetsList["TargetsList"].map(target=>{
      
        if(target.selected == true){// if the target is selected
         
          target.infoDisclosure.map(infoDisclosure=>{// loop through the directories
            // add the data to the pannel
            document.getElementById("table").innerHTML += "<div class='row'><div class='col'><a target=”_blank” href="+infoDisclosure.url+">"+infoDisclosure.src+"</a></div><div class='col'>"+infoDisclosure.type+"</div><div class='col'>"+infoDisclosure.data+"</div></div>";
                    
          })
          // end map
          return true;
        }
        
      })

    }
})

}
function clearInfoDiscData(){
  chrome.storage.local.get(['TargetsList']).then(TargetsList =>{// get the array of targets from storage
    targetListReturned = TargetsList['TargetsList']
    targetListReturned.forEach((target,index) => {
      if(target.selected == true){
        target.infoDisclosure = []
        chrome.storage.local.set({"TargetsList": targetListReturned})
        document.getElementById("table").innerHTML = "";
      }
    })
  })
  }

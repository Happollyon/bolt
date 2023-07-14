

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


function updatePannel(doc){
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

        const showConfig = document.querySelector('#config');
        showConfig.addEventListener('click', () => {showSettings()});

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
        
        //=====implement draggin and droping of items=====
        const sortableList = document.querySelector('#targetsContainer');
        const dragbleItems = document.querySelectorAll('.targetItem');

        //adding event listeners to the dragble items
        dragbleItems.forEach(dragbleItem => {

          dragbleItem.addEventListener('dragstart', () => {
            // if the item is being dragged, add the dragging class
            setTimeout(() =>  dragbleItem.classList.add('dragging'), 0);

          });

          dragbleItem.addEventListener('dragend', () => {
            // if the item is not being dragged, remove the dragging class
            dragbleItem.classList.remove('dragging');
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
          sortableList.insertBefore(draggingItem, nextSibling);
      }
      //adding event listeners to the sortable list
      sortableList.addEventListener("dragover", initSortableList);
      sortableList.addEventListener("dragenter", e => e.preventDefault());
        
        
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

function getDragAfterElement(dragbleItem, y) {
  const draggableElements = [...targetsContainer.querySelectorAll('.targeItem:not(.dragging)')];

  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;

    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }

  }, { offset: Number.NEGATIVE_INFINITY }).element;
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
        var directoriesArrayReturned 
        var isDirectoryInArray = false

        chrome.storage.local.get(['DirectoryData']).then(directoriesArray => {  
        directoriesArrayReturned =  directoriesArray['DirectoryData'] // get the array of directories from storage
        

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
            chrome.storage.local.set({"DirectoryData":directoriesArrayReturned}) // add to storage
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
  chrome.storage.local.set({"DirectoryData": []}).then(res=>{
    document.getElementById("table").innerHTML = "";
  })
}

// This function loads the data from the storage and adds it to the pannel
function loadDirectoryData(){

  chrome.storage.local.get(['DirectoryData']).then(DirectoryData =>{
    
    if (DirectoryData["DirectoryData"] === undefined) {
      
      chrome.storage.local.set({"DirectoryData": []}).then(res=>{
        
      })
    } else {
      
      DirectoryData["DirectoryData"].map(directory=>{
        // add to pannel
        document.getElementById("table").innerHTML += "<div class='row'><div class='col'><a target=”_blank” href="+directory.url+">"+directory.name+"</a></div><div class='col'>"+directory.type+"</div><div class='col'>"+directory.code+"</div></div>";
         
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
    const directoriesFiles = ['./fuzz/directory3.json','./fuzz/files.json','./fuzz/directory2.json']
    //get the directory1.txt file
    for(let i = 0; i<directoriesFiles.length;i++){
      
        await fetch(directoriesFiles[i]).then(response=>response.json().then(txt=>{
          
          txt.forEach(payload => {
           
            let newUrl;
            if(url.endsWith("/") && payload.startsWith("/")){
              newUrl = url+payload.substring(1);
      
            }else if(url.endsWith("/") && !payload.startsWith("/")){
            
              newUrl = url+payload;
            }else if(!url.endsWith("/") && payload.startsWith("/")){
              newUrl = url+payload;
            }else if(!url.endsWith("/") && !payload.startsWith("/")){
              newUrl = url+"/"+payload;
            }
            
            urls.push(newUrl);
          })

        })) 
      }
      //update progress message
      let directory = getPathFromUrl(url);  
      document.getElementById('progress-message').innerHTML=directory;
      const batchSize = 50; // the number of requests to make at once
      makeRequests(urls, batchSize,url,"Directory",recursiveDirectory);
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
    
    // gets the value of the website input
    //let val = document.getElementById("website").value;
     chrome.storage.local.get(['selectedItems']).then(async res=>{
      if(val != null){
        try {

            //fetches the website
            const response =  await fetch(val,{mode:'no-cors'});
            const body =  await response.text();
            
            
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
                          document.getElementById("table").innerHTML += "<div class='row'><div class='col'><a target=”_blank” href="+val+" n>"+lastPart+"</a></div><div class='col'>"+key+"</div><div class='col'>"+match[0]+"</div></div>";
                        }
                       //this adds the data to the table
                        
                       
                      }
                    }
              
              }
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

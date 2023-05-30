

/**
 * @fileoverview
 * Provides interactions for all pages in the UI.
 * Created by : Fagner Nunes
 * Date: april 2023 
 * 
 */


// to dos
   // add loading animation
   // fix bug where subdomains are not being checked
   //add to table values found and code


let currentTabId = null;

chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
  currentTabId = tabs[0].id;
});

chrome.tabs.onActivated.addListener(function(activeInfo) {
  if (activeInfo.tabId !== currentTabId) {
    // User switched tabs, pause extension execution
    // You can use a flag to pause the execution of your extension
  } else {
    // User returned to original tab, resume extension execution
    // You can use a flag to resume the execution of your extension
  }
});
   chrome.runtime.onSuspend.addListener(function() {
    // Perform any necessary cleanup here
    return true; // Prevent the extension from being unloaded
  });
//atatching event listeners to all the nav buttons
document.addEventListener('DOMContentLoaded', () => {
    
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


      }else if(doc=="Directory Fuzz"){
        //gets container from directoryFuzz.html
        
        const directoryFuzzContainer = div.querySelector('#directoryFuzzContainer');
        const pannel = document.querySelector('#pannel'); // gets the pannel
        pannel.innerHTML = ""; // clears the pannel

        pannel.appendChild(directoryFuzzContainer); //append the directoryFuzzContainer to the pannel

        // adds an event listener to the directoryFuzz button
        const directoryFuzzBtn = document.querySelector('#DirectoryFuzz');
        directoryFuzzBtn.addEventListener('click', directoryFuzz);

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
}
}


async function makeRequests(urls, batchSize,url,type,recursiveDirectory)  {
  const batches = [];

  // split the urls into batches  
  for (let i = 0; i < urls.length; i += batchSize) {

    batches.push(urls.slice(i, i + batchSize));
  }

  const bar = document.getElementById('Directory-progress');
 
  let loadedPercent = 0;
  let numberOfPayloads = urls.length;

  for (let i = 0; i < batches.length; i++) {
    
    const batch = batches[i];
    try{const promises = batch.map(url => fetch(url,{timeout: 5000}));

    const responses = await Promise.all(promises);

    responses.forEach(response => {
      if(response.status != 404){
        
        let directory = response.url.replace(url,"");
        document.getElementById("table").innerHTML += "<div class='row'><div class='col'><a target=”_blank” href="+response.url+" n>"+recursiveDirectory+directory+"</a></div><div class='col'>"+type+"</div><div class='col'>"+response.status+"</div></div>";
        if(type=="Directory" && response.status == 200 && directory != "/" && directory != "" && directory != "//" && directory != "index/"){
          
          findDirectories(response.url,directory);
        }
      }});
    
    loadedPercent = Math.round(((i*batchSize)*100)/numberOfPayloads);
    bar.style.width = loadedPercent.toString()+"%";  
    
  }catch(err){
      console.log(err);
    }
  }
  
}



function directoryFuzz(){

  /*
   * 
   * 1- get the url from the input
   * 2- look for subdomains.txt
   * 3- look for directory1.txt
   * 4- look for directory2.txt
   * 5- look for files.txt and backups1.txt and backups2.txt
   */

  
  const url = document.getElementById("directoryWebsite").value;

  
  //findSubDomains(url);

  findDirectories(url,"");
 

}

async function findDirectories(url,directory){
    const urls=[] // an array of URLs to fetch
    const directoriesFiles = ['./fuzz/directory3.json','./fuzz/files.json','./fuzz/directory2.json','./fuzz/backup1.json','./fuzz/backup2.json']
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
      console.log(urls.length);
      const batchSize = 50; // the number of requests to make at once
      makeRequests(urls, batchSize,url,"Directory",directory);
}


async function findSubDomains(url){

  const urls = []; // an array of URLs to fetch
  //get the subdomains.txt file
  // how to add timeout to fetch
  fetch('./fuzz/subdomains.json').then(response=>response.json().then(data=>{
    data.map(subdomain=>{
      let newUrl;
      if(url.startsWith("http://") || url.startsWith("https://")){
        newUrl = url.replace("www",subdomain);
      }else{
        newUrl = subdomain+"."+url;
      }
      urls.push(newUrl);
      
    })
    
    const batchSize = 50; // the number of requests to make at once
    makeRequests(urls, batchSize,url,"Subdomain");
  
  
}));
}

//this function calls itself recursively to crawl the website and check for info disclosure
var url;
var visitedUrl = []; // this is to keep track of the visited urls so it doesnt crawl the same url twice
var count = 0;
// Function to fetch a webpage and crawl links
async function fetchAndCrawl(newUrl) {
    
  // Fetch the webpage
       
    if(!url){
    url = document.getElementById("website").value;

    infoDisclosure(url);
    }else{
      url = newUrl;
    }
    const response = await fetch(url);
    const text = await response.text();
  
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


//function to check for info disclosure
async function infoDisclosure(val){

    // gets the value of the website input
    //let val = document.getElementById("website").value;
   
    if(val != null){
        try {

            //fetches the website
            const response = await fetch(val,{mode:'no-cors'});
            const body = await response.text();
            
            
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
                       
                       //this adds the data to the table
                        document.getElementById("table").innerHTML += "<div class='row'><div class='col'><a target=”_blank” href="+val+" n>"+lastPart+"</a></div><div class='col'>"+key+"</div><div class='col'>"+match[0]+"</div></div>";

                       
                      }
                    }
              
              }
           }))

            
          } catch (error) {
            console.error(error);
          }
    }
}
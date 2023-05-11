
//atatching event listeners
document.addEventListener('DOMContentLoaded', () => {
    
    const navBtn = document.querySelectorAll('.navBtn');
    navBtn.forEach(navBtn =>navBtn.addEventListener('click',(event)=>{
        select(event.target);
    }));
  });


function select(element){
    const navBtn = document.querySelectorAll('.navBtn');
    navBtn.forEach(navBtn =>navBtn.removeAttribute("id"));
    element.id="selected";
    
    updatePannel(element.innerHTML)

}


function updatePannel(doc){
    const xhr = new XMLHttpRequest();
    xhr.onload = () => {
        if (xhr.status === 200) {
            const div = document.createElement('div');
            div.innerHTML = xhr.responseText;

            const infoDiscContainer = div.querySelector('#infoDiscContainer');
            const pannel = document.querySelector('#pannel');

            pannel.appendChild(infoDiscContainer);

            if(doc == "infoDisc"){
                const infoDisc = document.querySelector('#infoDisc');
                infoDisc.addEventListener('click', fetchAndCrawl);

            }
    }
};
if(doc == "infoDisc"){
    xhr.open('GET', 'infoDisc.html');
    xhr.send();
}


// Function to fetch a webpage and crawl links
async function fetchAndCrawl() {
    // Fetch the webpage
    let url = document.getElementById("website").value;

    infoDisclosure(url);
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
      console.log("linkUrl: "+linkUrl);
      // Check if the link has the same host as the base URL
      if (linkUrl.host === baseUrl.host) {
        console.log(linkUrl.href);
        infoDisclosure(linkUrl.href);
        // Add your logic to process the link here
      }
    }
  }
}
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
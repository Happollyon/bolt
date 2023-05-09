
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
                infoDisc.addEventListener('click', infoDisclosure);

            }
    }
};
if(doc == "infoDisc"){
    xhr.open('GET', 'infoDisc.html');
    xhr.send();
}



}
async function infoDisclosure(){
    let val = document.getElementById("website").value;
    console.log(val);
    if(val != null){
        try {
            const response = await fetch(val,{mode:'no-cors'});
            const body = await response.text();
            const statusCode = response.status;
           // console.log(`Response body: ${body}`);
            //console.log(`Status code: ${statusCode}`);
            
           let reg = fetch('./reg.json').then(response=>response.json().then(data=>{
            for (const key in data) {
                if(data.hasOwnProperty(key)){
                    //console.log(key + " -> " + data[key]);
                    let val = body.match(data[key]);
                    if(val != null){
                        document.getElementById("table").innerHTML += "<div class='row'><div class='col'>"+"home"+"</div><div class='col'>"+key+"</div><div class='col'>"+val+"</div></div>";
                        console.log(key + " -> " + data[key]+" value: "+val);
                    }
                }
              }
           }))

            
          } catch (error) {
            console.error(error);
          }
    }
}
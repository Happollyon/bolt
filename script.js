
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
            console.log(`Response body: ${body}`);
            console.log(`Status code: ${statusCode}`);
          } catch (error) {
            console.error(error);
          }
    }
}
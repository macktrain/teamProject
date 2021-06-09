let errorModal = document.getElementById("errorModal");
let errorModalcloseBtn = document.getElementById("errorModalCloseBtn");
errModalMsg = document.getElementById("errModalMsg");

errorModalcloseBtn.onclick = function(){
    errorModal.style.display = "none"
}
window.onclick = function(e){
  if(e.target == errorModal){
    errorModal.style.display = "none"
  }
}

function errorModalFunc(msg)
{
    errModalMsg.innerHTML = msg;
	errorModal.style.display = "block";
}
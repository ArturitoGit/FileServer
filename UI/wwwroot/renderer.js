// Get the elements from the page
const menu = document.getElementById("menu") ;
const menu_upload = document.getElementById("menu_upload") ;
const input_file = document.getElementById("input_file") ;
const btn_upload = document.getElementById("btn_upload") ;
const btn_upload_back = document.getElementById("btn_upload_back") ;
const menu_upload_label = document.getElementById("menu_upload_label") ;
const btn_download = document.getElementById("btn_download") ;

onStart() ;

// On button "Upload" clicked
btn_upload.onclick = function () {
    // Trigger the hidden file input
    input_file.click() ;
}

// On some document uploaded
input_file.oninput = function () {
    console.log(input_file.files[0]) ;
    showUploadMenu() ;
}

btn_upload_back.onclick = function () {
    showFirstMenu() ;
    // Reset the content of the input to make the upload button work again
    input_file.value = null ;
}

btn_download.onclick = function () {
    showDownloadMenu() ;
}

// Function called on page initialisation
function onStart()
{
    showFirstMenu() ;
}

/* Page switching methods */

function showFirstMenu ()
{
    menu_upload.style.display = "none" ;
    menu.style.display = "block" ;
}

function showUploadMenu ()
{
    menu_upload_label.innerHTML = "Your document is available at this address : "
    menu_upload.style.display = "flex" ;
    menu.style.display = "none" ;
}

function showDownloadMenu ()
{
    menu_upload_label.innerHTML = "Please upload your file there : " ;
    menu_upload.style.display = "flex" ;
    menu.style.display = "none" ;
}
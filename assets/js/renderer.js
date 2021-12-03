// Get the elements from the page
const menu              = document.getElementById("menu") ;
const menu_upload       = document.getElementById("menu_upload") ;
const input_file        = document.getElementById("input_file") ;
const btn_upload        = document.getElementById("btn_upload") ;
const btn_back          = document.getElementById("btn_upload_back") ;
const menu_upload_label = document.getElementById("menu_upload_label") ;
const btn_download      = document.getElementById("btn_download") ;
const link              = document.getElementById("link") ;
const qrcode            = document.getElementById("qrcode") ;

// Setup the page
onStart() ;

// On buttons click
btn_upload.onclick = async () => 
{
    // Call the pipeline
    var result = await window.electron.ipcRenderer.invoke('upload-request')
    if (result.canceled) return 
    // Go to upload page
    showUploadMenu(result.address)
}

btn_download.onclick = async () => 
{
    var result = await window.electron.ipcRenderer.invoke('download-request')
    showDownloadMenu(result.address)
}

btn_back.onclick = function () {
    showFirstMenu() ;
}

// Function called on page initialisation
function onStart()
{
    showFirstMenu() ;
}

/* Page switching methods */

function showFirstMenu ()
{
    // Erase the second menu
    menu_upload.style.display = "none" ;
    // Reset the qcrcode
    qrcode.innerHTML = '' ;
    // Make the first menu visible
    menu.style.display = "block" ;
}

function showUploadMenu (address)
{
    // Update label
    menu_upload_label.innerHTML = "Your document is available at this address : " ;
    // Show a QR code of the address
    new QRCode("qrcode", {
        text: address ,
        colorDark : "#adff2f",
        colorLight : "#000000",
        correctLevel : QRCode.CorrectLevel.H
    });    
    // Update link
    link.innerHTML = address ;
    // Make the second menu visible
    menu_upload.style.display = "flex" ;
    // Make the first menu invisible
    menu.style.display = "none" ;
}

function showDownloadMenu (address)
{
    menu_upload_label.innerHTML = "Please upload your file there : " ;
    new QRCode("qrcode", {
        text: address ,
        colorDark : "#adff2f",
        colorLight : "#000000",
        correctLevel : QRCode.CorrectLevel.H
    });
    link.innerHTML = address ;
    menu_upload.style.display = "flex" ;
    menu.style.display = "none" ;
}



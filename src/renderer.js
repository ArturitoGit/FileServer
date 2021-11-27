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
btn_upload.onclick = function () {
    port.postMessage({ type: "upload-clicked" }) ;
}

btn_download.onclick = function () {
    port.postMessage({ type: "download-clicked" }) ;
}

btn_back.onclick = function () {
    port.postMessage({ type: "back-clicked" }) ;
    showFirstMenu() ;
}

// On server response for the clicked event
var onUploadReady = address => showUploadMenu(address) ;
var onDownloadReady = address => showDownloadMenu(address) ; 
var onFileUploaded = () => {} ;
var onFileDownloaded = () => showFirstMenu ;


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

/* --------------------------- COMMUNICATION WITH MAIN --------------------------- */

// Will contain the access to the main 
var port ;

window.onmessage = (event) => {
    // If message is register-port type
    if (event.source === window && event.data === 'main-world-port') {
        // Register the port and subscribe to it
        port = event.ports[0] ;
        port.onmessage = onMessage ;
    }
}

function onMessage ( event )
{
    console.log("message received by renderer ! : ") ;
    console.log(event) ;
    
    // Extract the type from the message
    let type = event.data.type ;
    if (type == null) return ;

    // Map to the different functions depending on the type
    switch (type)
    {
        case "file-downloaded" :
            onFileDownloaded() ;
            break ;
        case "file-uploaded" :
            onFileUploaded() ;
            break ;
        case "upload-ready" :
            onUploadReady(event.data.address) ;
            break ;
        case "download-ready" :
            onDownloadReady(event.data.address) ;
            break ;
    }
}

/* ------------------------------------------------------------------------------- */



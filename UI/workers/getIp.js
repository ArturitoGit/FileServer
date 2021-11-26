module.exports = { getIp }

/** 
 * 
 * Get the wifi ip address of the computer 
 * 
 **/ 
function getIp ()
{
    // Get all interfaces
    var os = require('os');
    var allNetworkInterfaces = os.networkInterfaces();
    
    // Extract the wifi interface informations
    var wifiNetwork = getField(allNetworkInterfaces, "Wi-Fi") ;
    if (wifiNetwork == null) throw new Exception("Wifi interface not found ...") ;

    // Extract the ipv4 address
    var address = null ;
    for (const value of Object.values(wifiNetwork))
    {
        if (value["family"] == "IPv4") address = value["address"] ;
    }
    if (address == null) throw new Exception("IPv4 adress not found for Wi-Fi ...") ;

    return address ;
}

// Get the value associated with the <searched_key> in the json or null if not found
function getField (json, searched_key)
{
    var searched_value = null ;
    for (const [key, value] of Object.entries(json))
    {
        if (key == searched_key) searched_value = value ;
    }
    return searched_value ;
}


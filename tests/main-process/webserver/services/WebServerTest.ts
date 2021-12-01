import { WebServer } from "../../../../main-process/webserver/WebServer";
import * as path from 'path'

const server = new WebServer() ;

server.Init("localhost", 8080, 'D:/Archives/Prog/C#/FileServer/main-process/webserver/assets') ;

wait() ;

function delay (ms) {
    return new Promise(res => setTimeout(res, ms));
}

async function wait ()
{
    await delay(5000) ;

    server.PublishFile(
        "D:/Archives/Prog/C#/FileServer/src/index.html",
        "index.txt",
        () => console.log("Uploaded file callback called")
    )

    server.DownloadFile(
        (path, name) => console.log("Downloaded a file with path " + path + " and name " + name)
    )

    console.log("Here !")
}
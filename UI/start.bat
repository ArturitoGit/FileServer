
dotnet publish -r win-x64 -c "Debug" --output "D:\Archives\Prog\C#\FileServer\UI\obj\Host\bin" /p:PublishReadyToRun=false /p:PublishSingleFile=false --no-self-contained
obj/Host/node_modules/.bin/electron.cmd "obj\Host\main.js"

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ElectronNET.API;
using ElectronNET.API.Entities;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace UI
{
    public class Startup
    {
        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseRouting();


            app.UseDefaultFiles();
            app.UseStaticFiles();    

            // Open the Electron-Window here
            Task.Run(async () => await Electron.WindowManager.CreateWindowAsync());

            // Enable select file option
            Electron.IpcMain.On("select-file", async (args) => {
                var mainWindow = Electron.WindowManager.BrowserWindows.First();
                var options = new OpenDialogOptions {
                    Properties = new OpenDialogProperty[] {
                        OpenDialogProperty.openFile
                    }
                };

                string[] files = await Electron.Dialog.ShowOpenDialogAsync(mainWindow, options);
                if (files.Length <= 0) return ;
                //Electron.IpcMain.Send(mainWindow, "select-file-reply", files);

                var mediator = Core.Startup.MEDIATOR_INSTANCE ;
                if (mediator is null) return ;
                var result = await mediator.Send(new Core.Domain.Server.Pipelines.UploadFile.Request(files[0])) ;
                Electron.IpcMain.Send(mainWindow, "select-file-reply", result.Address) ;
                
            });
            
        }
    }
}

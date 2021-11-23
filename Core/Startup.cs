using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Core.Domain.Files;
using Core.Domain.Files.Services;
using Core.Domain.Host;
using Core.Domain.Host.Services;
using Core.Domain.Server.Pipelines;
using MediatR;
using MediatR.Pipeline;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace Core
{
    public class Startup
    {
        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            // Add scopes
            services.AddScoped<IHostResolver,HostResolver>() ;
            services.AddScoped<IFileMover,FileMover>() ;
            
            services.AddMediatR(typeof(Startup)) ;
            services.AddMvc() ;
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

            // Allow use of controllers
            app.UseEndpoints(endpoints => {
                endpoints.MapControllers() ;
            }) ;

        }
    }
}

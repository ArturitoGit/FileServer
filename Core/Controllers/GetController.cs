using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Core.Domain.Server.Pipelines;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Core.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class GetController : ControllerBase
    {
        private readonly IMediator _mediator;

        public GetController (IMediator mediator)
        {
            _mediator = mediator ?? throw new System.ArgumentNullException(nameof(mediator));
        }

        [HttpGet]
        [Route("upload")]
        public async Task<ActionResult> Upload(string localPath)
        {
            if (string.IsNullOrEmpty(localPath)) return NotFound() ;
            // Call the pipeline and get the result
            var result = await _mediator.Send(new UploadFile.Request(localPath)) ;
            // Convert the result to json
            var json = JsonSerializer.Serialize(result) ;
            // Return it
            return base.Ok(result) ;
        }

        [HttpGet]
        [Route("upload_over")]
        public ActionResult Upload_over()
        {
            // Call the pipeline
            // TODO

            return base.Ok() ;
        }

        [HttpGet]
        [Route("download")]
        public ActionResult Download()
        {
            // Call the pipeline
            // TODO

            return Ok();
        }

        [HttpGet]
        [Route("download_over")]
        public ActionResult Download_over()
        {
            // Call the pipeline
            // TODO

            return base.Ok() ;
        }
    }
}
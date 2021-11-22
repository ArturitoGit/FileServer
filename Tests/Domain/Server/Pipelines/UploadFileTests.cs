using System;
using System.IO;
using System.Threading;
using Core.Domain.Files;
using Core.Domain.Host.Services;
using Core.Domain.Server.Pipelines;
using Shouldly;
using Xunit;

namespace Tests.Domain.Server.Pipelines
{
    public class UploadFileTests
    {
        public static string TEST_FOLDER = Path.Combine(
            new DirectoryInfo(Environment.CurrentDirectory)
            .Parent.Parent.Parent
            .FullName,
            "Domain","Server","Pipelines"
        );

        public static string FILE_NAME = "content.txt" ;
        public static string FILE_PATH = Path.Combine(TEST_FOLDER, "src_folder", FILE_NAME);
        private UploadFile.Handler _handler ;
        public UploadFileTests()
        {
            // Copy the file into the src folder
            File.Copy(
                Path.Combine(TEST_FOLDER,FILE_NAME),
                FILE_PATH,
                true
            );

            _handler = new UploadFile.Handler (
                new FakeHostResolver(),
                new FileMover()
            );
        }

        [Fact]
        public void UploadFile_ReturnsSuccess ()
        {
            var result = _handler.Handle(
                new UploadFile.Request(FILE_PATH),
                CancellationToken.None
            )
            .GetAwaiter().GetResult() ;
            result.Success.ShouldBeTrue() ;
        }

        [Fact]
        public void UploadFile_ReturnsRightAddress ()
        {
            var expectedAddress = $"http://{FakeHostResolver.IP}:{FakeHostResolver.PORT}/{FILE_NAME}" ;
            var result = _handler.Handle(
                new UploadFile.Request(FILE_PATH),
                CancellationToken.None
            )
            .GetAwaiter().GetResult() ;

            result.Address.ShouldBe(expectedAddress) ;   
        }

        [Fact]
        public void UploadFile_MovesTheGivenFile ()
        {
            // Empty the target folder and erase it
            var target_file = Path.Combine(FakeHostResolver.WWWROOT_PATH, FILE_NAME) ;
            if (File.Exists(target_file)) File.Delete(target_file) ;

            var result = _handler.Handle(
                new UploadFile.Request(FILE_PATH),
                CancellationToken.None
            )
            .GetAwaiter().GetResult() ;

            File.Exists(target_file).ShouldBeTrue() ;
        }

        [Fact]
        public void UploadFile_FailsIfWrongPath ()
        {
            var wrong_path = "blabalba" ;
            var result = _handler.Handle(
                new UploadFile.Request(wrong_path),
                CancellationToken.None
            )
            .GetAwaiter().GetResult() ;

            result.Success.ShouldBeFalse() ;
        }
    }

    public class FakeHostResolver : IHostResolver
    {
        public static string IP = "189.78.197.1" ;
        public static string PORT = "8080" ;
        public static string WWWROOT_PATH = Path.Combine(UploadFileTests.TEST_FOLDER, "wwwroot_folder") ;
        public string GetHostIp() => IP ;
        public string GetPort() => PORT ;
        public string GetWWWRootPath() => WWWROOT_PATH ;
    }
}
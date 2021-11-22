using System;
using System.IO;
using Core.Domain.Files;
using Core.Domain.Files.Services;
using Shouldly;
using Xunit;

namespace Tests.Domain.Files.Services
{
    public class FileMoverTests
    {

        private IFileMover _fileMover ;

        public static string TEST_FOLDER = Path.Combine(
            new DirectoryInfo(Environment.CurrentDirectory)
            .Parent.Parent.Parent
            .FullName,
            "Domain","Files","Services"
        );

        public static string FILE_NAME = "content.txt" ;
        public static string OLD_FOLDER = Path.Combine(TEST_FOLDER, "source_folder") ;
        public static string NEW_FOLDER = Path.Combine(TEST_FOLDER, "target_folder") ;

        public FileMoverTests ()
        {
            _fileMover = new FileMover () ;
        }

        [Fact]
        public void MoveFile_CreatesAFileAtTheRightPlace ()
        {
            // Provide the source directory with the file
            File.Copy(
                Path.Combine(TEST_FOLDER, FILE_NAME),
                Path.Combine(TEST_FOLDER, OLD_FOLDER, FILE_NAME),
                true
            ) ;

            // Delete the content of the target folder
            foreach (var file in new DirectoryInfo(NEW_FOLDER).GetFiles())
            {
                File.Delete(file.FullName) ;
            }

            // Move the file
            _fileMover.MoveFile(OLD_FOLDER, NEW_FOLDER, FILE_NAME).GetAwaiter().GetResult() ;

            // The target file should contain a single element named as the source file
            var files = new DirectoryInfo(NEW_FOLDER).GetFiles() ;
            files.Length.ShouldBe(1) ;
            files[0].Name.ShouldBe(FILE_NAME) ;
        }

        [Fact]
        public void MoveFile_RemovesTheFileFromItsPreviousLocation ()
        {
            // Provide the source directory with the file
            File.Copy(
                Path.Combine(TEST_FOLDER, FILE_NAME),
                Path.Combine(TEST_FOLDER, OLD_FOLDER, FILE_NAME),
                true
            ) ;

            // Move the file
            _fileMover.MoveFile(OLD_FOLDER, NEW_FOLDER, FILE_NAME).GetAwaiter().GetResult() ;

            var files = new DirectoryInfo(OLD_FOLDER).GetFiles() ;
            files.Length.ShouldBe(0) ;
        }

        [Fact]
        public void MoveFile_CreatesTargetFileIfItDoesntExist () 
        {
            var targetFolder = Path.Combine(TEST_FOLDER, "non_existing_folder") ;

            // If the target folder already exists delete it
            if (System.IO.Directory.Exists(targetFolder))
            {
                // Delete its content
                foreach (var file in new DirectoryInfo(targetFolder).GetFiles())
                {
                    File.Delete(file.FullName) ;
                }

                // Delete the directory
                System.IO.Directory.Delete(targetFolder) ;
            }


            // Provide the source directory with the file
            File.Copy(
                Path.Combine(TEST_FOLDER, FILE_NAME),
                Path.Combine(TEST_FOLDER, OLD_FOLDER, FILE_NAME),
                true
            ) ;

            // Move the file
            _fileMover.MoveFile(OLD_FOLDER, targetFolder, FILE_NAME).GetAwaiter().GetResult() ;

            // The directory should now exist and contain the file
            System.IO.Directory.Exists(targetFolder).ShouldBeTrue() ;
            var files = new DirectoryInfo(targetFolder).GetFiles() ;
            files.Length.ShouldBe(1) ;
            files[0].Name.ShouldBe(FILE_NAME) ;
        }
    }
}
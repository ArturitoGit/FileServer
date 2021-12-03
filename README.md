# FileServer App information

## How to run it

FileServer is an electron application, you will need to install *electron*, *node*, *npm*.  
Run the following commands in the root folder :  

* `npm install` to install all the npm dependencies
* `npm build` to compile the *Typescript* code to *Javascript*
* `npm test` to run the tests of the code
* `npm run make` to compile the code into an executable

After runing the last command, an **out** folder should have been created in your folder, containing the executable.

## How to use it

The app is composed of two actions : **Download** and **Upload**.

* **Download** will allow you to move a file from another device toward your computer.  
For this click the *Download* button in your app, and use your second device to access the provided link. There you will be able to upload a file, which will then be available in your computer.

* **Upload** will allow you to move a file from your computer to another device.  
For this click the *Upload* button in your app, and select the file you want to move. Your file will then be available at the displayed address, for other devices.

*Note : In order to make it work, the computer and the second device must be in the same wifi network. Indeed the wifi address is used to publish or receive files.*

import { expect } from 'chai'
import * as path from 'path'
const fs = require('fs')
import * as webdriver from 'selenium-webdriver';
var remote = require('selenium-webdriver/remote');
const chrome = require('selenium-webdriver/chrome');
import { WebServer } from '../../../../main-process/webserver/WebServer';

describe('WebServer', function() {

  // Fake browser options
  let driver ;
  this.timeout(60000)
  let downloadPath = path.join(__dirname, "dw") ;
  console.log(downloadPath) ;

  var chromeCapabilities = webdriver.Capabilities.chrome();
  chromeCapabilities.set('goog:chromeOptions', {
    'args': ['disable-infobars'],
    'prefs': {
      'download': {
        'default_directory': downloadPath,
        'prompt_for_download': 'false'
      }
    }
  });

  // Webserver options
  let server ;
  let host: string = "localhost" ;
  let port: number = 8080 ;
  let assets_path: string = path.join(__dirname,'../../../../main-process/webserver/assets') ;
  let worker_path: string = path.join(__dirname,'../../../../dist/main-process/webserver') ;

  before(function () {
    // Initialize webserver
    server = new WebServer() ;
    server.Init(host,port, assets_path, worker_path) ;
    // Initialize browser
    driver = new webdriver.Builder()
      .withCapabilities(chromeCapabilities)
      .build() ;
    driver.manage().window().maximize() ;

    // Clean up the chromeDownloads folder and create a fresh one
    fs.rmSync(downloadPath, { recursive: true, force: true })
    fs.mkdirSync(downloadPath)
  })
  
  after(function () {
    server.ShutDownServer() ;
    driver.quit();
  });

  it('should success to open download link', async function () {
    let Url: string = `http://${host}:${port}/download` ;
    var success = await tryToGoAtPage(driver, Url) ;
    expect(success).to.be.true ;
  });

  it('download page should have an input file button', async function () {
    let Url: string = `http://${host}:${port}/download` ;
    return driver.get(Url).then(async () => {
        var exists = await isElementIdPresent(driver,'input_file') ;
        expect(exists).to.be.true ;
    })
  });

  it('download page should have css', async function () {
    let Url: string = `http://${host}:${port}/download` ;
    return driver.get(Url).then(async () => {
        let cssValue = await driver.findElement(webdriver.By.id('btn')).getCssValue('border-radius');
        expect(cssValue).to.equal("5px") ;
    })  
  })

  it('downloadFile method should return the right address', async function () {
    let Url: string = `http://${host}:${port}/download` ;
    var address = await server.DownloadFile((path: string, name: string) => {}) ;
    
    expect(address).to.equal(Url) ;
  })

  it('download page should redirect to confirmation page', async function () {
    let Url: string = `http://${host}:${port}/download` ;
    await server.DownloadFile((path: string, name: string) => {}) ;
    
    // Go to url
    await tryToGoAtPage(driver, Url) ;

    // Upload a file
    driver.setFileDetector(new remote.FileDetector);  
    var upload: webdriver.WebElement = driver.findElement(webdriver.By.id("input_file"));
    upload.sendKeys(path.join(__dirname, 'content.txt'));
    driver.findElement(webdriver.By.id("submit")).click();

    // Web page should display confirmation
    await driver.wait(webdriver.until.elementLocated(webdriver.By.id('label_confirmation')), 10000);
    var confirmation_exists: boolean = await isElementIdPresent(driver, 'label_confirmation') ;
    expect(confirmation_exists).to.be.true ;
  })

  it('download page should call callback function on download', async function () {
    
    let Url: string = `http://${host}:${port}/download` ;
    let cb_path ;
    let cb_name ;
    await server.DownloadFile((path: string, name: string) => { cb_path = path ; cb_name = name ;}) ;
    
    // Go to url
    await tryToGoAtPage(driver, Url) ;

    // Upload a file
    driver.setFileDetector(new remote.FileDetector);  
    var upload: webdriver.WebElement = driver.findElement(webdriver.By.id("input_file"));
    upload.sendKeys(path.join(__dirname, 'content.txt'));
    driver.findElement(webdriver.By.id("submit")).click();

    // Wait for the page to load
    await driver.wait(webdriver.until.elementLocated(webdriver.By.id('label_confirmation')),10000);

    // Callback should have been called
    expect(cb_path).to.not.be.null ;
    expect(cb_name).to.not.be.null ;
  })

  it('should success to open upload link without decraring upload file', async function () {
      let Url: string = `http://${host}:${port}/upload` ;
      var success = await tryToGoAtPage(driver, Url) ;
      expect(success).to.be.true ;
  })

  it('upload file should trigger upload callback', async function () {
    var cb_triggered = false ;
    let Url: string = `http://${host}:${port}/upload` ;

    // Publish the file
    await server.PublishFile(
        path.join(__dirname, 'content.txt'),
        'content.txt',
        () => cb_triggered = true 
    )
    // Call back should have been called
    return driver.get(Url).then(async () => expect(cb_triggered).to.be.true)
  })

  it('upload file page should come with an attached file', async function () {
    let Url: string = `http://${host}:${port}/upload` ;
    let file_name: string = "content.txt" ;
    // Publish the file
    await server.PublishFile(
        path.join(__dirname, 'content.txt'),
        file_name,
        () => {}
    )

      // Wait for 2s
      await driver.wait(() => false, 2000).then(() => {},(err) => {});

      // dw folder should contain the downloaded file
      var exists = fs.existsSync(path.join(downloadPath,file_name)) ;
      expect(exists).to.be.true ;
  })

})

const isElementIdPresent = async (driver, id: string): Promise<boolean> => {
    const exists: boolean = await driver.findElement(webdriver.By.id(id))
    .then(
        () => { return true; },
        (err) => {
            if (err instanceof webdriver.error.NoSuchElementError) return false ;
            else webdriver.promise.rejected(err) ;
    });
    return exists ;
}

const tryToGoAtPage = async (driver, address: string): Promise<boolean> => {
    var success: boolean = await driver.get(address).then(
        () => { return true },
        (err) => { return false}
    );
    return success ;
}
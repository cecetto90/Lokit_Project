// main.js
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const SerialPort = require('serialport').SerialPort;


let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
        contextIsolation: false, // assicurati che questo sia false se non usi il preload
        nodeIntegration: true, // assicurati che questo sia true se vuoi usare Node.js nel renderer
        enableRemoteModule: false,
        }

});

 // mainWindow.loadFile('index.html');
   mainWindow.loadURL('file://' + __dirname + '/index.html');
   // Open the DevTools (optional)
  mainWindow.webContents.openDevTools();
 
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}


app.on('ready', createWindow);
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
    
  }
});

// Serial port configuration
const port = new SerialPort( { path : 'COM9',baudRate: 9600 });

//a
let timeout;

  // Avvia il timer di timeout
timeout = setTimeout(() => {
    console.log('Timeout: Nessuna risposta dalla porta seriale.');
    port.close();
  }, 0.0001); // 5 secondi di timeout

port.on('open', () => {
    clearTimeout(timeout);
    console.log('Port open.');

});

//invio del comando di accensione/spegnimento del led alla porta in ascolto dal processo renderer.js
ipcMain.on('toggle-led', (event, ledCommand) => {
  //scrittura del comando LEDxy sulla porta
  port.write(ledCommand, (err) => {
     clearTimeout(timeout);
    if (err) {
      return console.log('Error on write: ', err.message);
    }
    console.log('message written: ', ledCommand);
  });
  });
  //ascolto sulla porta virtuale di loopback che risponde con lo stesso comando in formato ASCII. Se arriva in risposta lo stesso comando inviato viene inviato al renderer process la risposta <comandoRicevuto>+OK
  const validCommands = ["LED10", "LED11", "LED20", "LED21", "LED30", "LED31", "LED40", "LED41"];
  port.on('data', (data) => {
    let message = "";
    if(validCommands.includes(asciiToString(data).trim())){
        message = "<comandoRicevuto>+OK";
        console.log('led-response',message);
        //invio al processo renderer la risposta
        mainWindow.webContents.send('led-response', message);
    }
});

function asciiToString(data) {
    return String.fromCharCode.apply(null, new Uint8Array(data));
}

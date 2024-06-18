//renderer.js

const { ipcRenderer } = require('electron');

function callback(element, id) {
    //costruzione del comando LEDxy
    var ledStatus = element.getAttribute('data-status');  
	  const ledNumber = element.getAttribute('data-led');
	  const currentColor = element.getAttribute('data-color');
	  const newColor = currentColor === 'red' ? 'green' : 'red';
    const flag = currentColor === 'red' ? '0 ': '1';
	  const ledCommand = `LED${ledNumber}${flag}`;
    //invio del comando al main.js
	  ipcRenderer.send('toggle-led', ledCommand);
    //ascolto dalla porta seriale virtuale
    ipcRenderer.on('led-response', ( event, message) => {
      console.log("Response", message);
      if (message.includes("<comandoRicevuto>+OK")) {
        if (ledStatus === 'ON') {1
         element.setAttribute('data-status', 'OFF');
         element.innerText = 'LED OFF';
         console.log(`LED ${id} spento`);
         } else {
           element.setAttribute('data-status', 'ON');
           element.innerText = 'LED ON';
           console.log(`LED ${id} acceso`);
           }
      element.setAttribute('data-color', newColor);
      element.style.backgroundColor = newColor
      element.classList.toggle('green', newColor === 'green')
      }
  });
}


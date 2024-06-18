# Usa un'immagine ufficiale di Node.js come immagine genitore
FROM node:14

# Imposta la directory di lavoro iniziale nel contenitore
WORKDIR /app

# Copia package.json e package-lock.json
COPY package*.json ./

# Installa Electron
RUN npm install electron

# Installa le dipendenze dell'applicazione
RUN npm install serialport

# Copia il resto del codice dell'applicazione
COPY . .

# Espone la porta 3000 per l'accesso esterno
EXPOSE 3000

# Comando per avviare l'applicazione
CMD ["npm", "start"]


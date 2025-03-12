# Basis-Image
FROM node:16

# Benutzer anlegen, damit die App nicht mit Root-Rechten läuft
RUN groupadd -r easynotes && useradd -r -g easynotes easynotes

# Arbeitsverzeichnis definieren
WORKDIR /app

# Quelldateien kopieren
COPY package*.json ./
COPY tsconfig.json ./

# Abhängigkeiten installieren
RUN npm install

# Restlichen Quellcode kopieren
COPY src/ ./src/

# Anwendung bauen
RUN npm run build

# Auf das dist-Verzeichnis wechseln
WORKDIR /app/dist

# Benutzerrechte setzen
RUN chown -R easynotes:easynotes /app

# Zum erstellten Benutzer wechseln
USER easynotes

# Port festlegen
EXPOSE 8080

# Anwendung starten
CMD ["node", "app.js"]
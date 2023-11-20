# Node slim Image als Grundlage verwenden
FROM node:21-slim

# Den Quellcode in das Image kopieren
COPY --chown=node:node . /

# Die benötigten NPM-Pakete installieren
RUN npm install

# Die Applikation erstellen (Typescript in Javascript "kompilieren")
RUN npm run build && rm -r src

# Das Arbeitsverzeichniss auf dist setzen
WORKDIR /dist

# Die Applikation soll auf Port 8080 hören
EXPOSE 8080

# Auf User node wechseln. Dieser User is bereits im Image vorhanden und hat eingeschränkte Rechte
USER node

# Die Applikation ausführen
CMD [ "node", "app.js" ]
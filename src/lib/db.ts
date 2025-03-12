import mysql from 'mysql';
import { v4 as uuidv4 } from 'uuid';

// Temporärer Speicher für Notizen im Arbeitsspeicher
const inMemoryNotes: any[] = [];

/**
 * connect to the Database
 */
function connectDB(dbHost: string, dbPort: string, dbName: string, dbUser: string, dbPassword: string) {
  const connection = mysql.createConnection({
    host: dbHost,
    port: Number(dbPort),
    database: dbName,
    user: dbUser,
    password: dbPassword,
    connectTimeout: 30000,
    insecureAuth: true
  });
  
  return connection;
}

/**
 * Hilfsfunktion, um UUID-Werte zu vergleichen
 */
function compareUuids(uuid1: any, uuid2: any): boolean {
  if (!uuid1 || !uuid2) return false;
  
  // Wenn uuid1 ein Buffer ist
  if (Buffer.isBuffer(uuid1)) {
    // Wenn uuid2 auch ein Buffer ist
    if (Buffer.isBuffer(uuid2)) {
      return uuid1.toString('hex') === uuid2.toString('hex');
    }
    // Wenn uuid2 ein String ist (ohne Bindestriche)
    return uuid1.toString('hex') === uuid2.replace(/-/g, '');
  }
  
  // Wenn uuid1 ein String ist
  if (typeof uuid1 === 'string') {
    // Wenn uuid2 ein Buffer ist
    if (Buffer.isBuffer(uuid2)) {
      return uuid1.replace(/-/g, '') === uuid2.toString('hex');
    }
    // Wenn uuid2 auch ein String ist
    return uuid1 === uuid2;
  }
  
  return false;
}

/**
 * Queries the Database
 */
function queryDB(sql: string, params: any): Promise<any> {
  return new Promise((resolve) => {
    console.log("Executing SQL:", sql);
    console.log("With params:", params);
    
    // Simuliere verschiedene Abfragetypen
    if (sql.includes('SELECT') && sql.includes('FROM `notes`')) {
      if (sql.includes('WHERE') && (sql.includes('uuid') || sql.includes('`uuid`'))) {
        // Eine bestimmte Notiz abrufen
        const uuidParam = params[0]; // Sollte ein Buffer sein
        
        console.log("Searching for note with UUID:", uuidParam);
        const note = inMemoryNotes.find(n => compareUuids(n.uuid, uuidParam));
        
        if (note) {
          console.log("Found note:", note);
          resolve({ 
            rows: [{
              uuid: note.uuid,
              title: note.title,
              description: note.description
            }], 
            fields: [] 
          });
        } else {
          console.log("Note not found");
          resolve({ rows: [], fields: [] });
        }
      } else {
        // Alle Notizen abrufen
        resolve({ 
          rows: inMemoryNotes.map(note => ({
            uuid: note.uuid,
            title: note.title,
            description: note.description
          })), 
          fields: [] 
        });
      }
    } else if (sql.includes('INSERT INTO `notes`')) {
      // Notiz hinzufügen
      const uuid: string = uuidv4();
      const title: string = params[0] || 'Unbenannte Notiz';
      const description: string = params[1] || '';
      
      inMemoryNotes.push({
        uuid: uuid,
        title: title,
        description: description,
        created_at: new Date(),
        updated_at: new Date()
      });
      
      console.log("Added note to in-memory storage:", inMemoryNotes[inMemoryNotes.length - 1]);
      resolve({ rows: { affectedRows: 1, insertId: inMemoryNotes.length }, fields: [] });
    } else if (sql.includes('UPDATE `notes`')) {
      // Notiz aktualisieren
      let title: string = '';
      let description: string = '';
      let uuidParam: any = null;
      
      if (params && params.length >= 3) {
        title = params[0];
        description = params[1];
        uuidParam = params[2]; // Sollte ein Buffer sein
      }
      
      console.log("Updating note with UUID:", uuidParam, "Title:", title, "Description:", description);
      
      const noteIndex = inMemoryNotes.findIndex(note => compareUuids(note.uuid, uuidParam));
      if (noteIndex >= 0) {
        inMemoryNotes[noteIndex].title = title;
        inMemoryNotes[noteIndex].description = description;
        inMemoryNotes[noteIndex].updated_at = new Date();
        console.log("Updated note in in-memory storage:", inMemoryNotes[noteIndex]);
        resolve({ rows: { affectedRows: 1 }, fields: [] });
      } else {
        console.log("Note not found for update");
        resolve({ rows: { affectedRows: 0 }, fields: [] });
      }
    } else if (sql.includes('DELETE FROM `notes`')) {
      // Notiz löschen
      const uuidParam = params[0]; // Sollte ein Buffer sein
      
      console.log("Deleting note with UUID:", uuidParam);
      
      if (uuidParam) {
        const noteIndex = inMemoryNotes.findIndex(note => compareUuids(note.uuid, uuidParam));
        
        if (noteIndex >= 0) {
          inMemoryNotes.splice(noteIndex, 1);
          console.log("Deleted note from in-memory storage, Index:", noteIndex);
          resolve({ rows: { affectedRows: 1 }, fields: [] });
        } else {
          console.log("Note not found for deletion");
          resolve({ rows: { affectedRows: 0 }, fields: [] });
        }
      } else {
        console.log("No UUID provided for deletion");
        resolve({ rows: { affectedRows: 0 }, fields: [] });
      }
    } else {
      // Standardantwort für andere Abfragen
      resolve({ rows: [], fields: [] });
    }
  });
}

/**
 * Get DB Config
 */
function getDBConfig() {
  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || '3306',
    name: process.env.DB_NAME || 'easynotes',
    user: process.env.DB_USER || 'easynotes',
    password: process.env.DB_PASS || 'easynotes',
  };
  return dbConfig;
}

export const db = { connectDB, queryDB, getDBConfig };
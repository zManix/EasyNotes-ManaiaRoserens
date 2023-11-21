import { db } from '../lib/db';
import { parse } from 'uuid';

/**
 * Get all notes from the DB.
 *
 * @return object with results.
 *
 * @version 1.0.0
 */
async function getAllNotes() {
  const result = await db.queryDB(
    "SELECT LOWER(CONCAT(SUBSTR(HEX(uuid), 1, 8), '-',SUBSTR(HEX(uuid), 9, 4), '-',SUBSTR(HEX(uuid), 13, 4), '-',SUBSTR(HEX(uuid), 17, 4), '-',SUBSTR(HEX(uuid), 21))) AS uuid, title, description  FROM `notes`",
    [],
  );

  if (result.rows) {
    return result.rows;
  } else {
    console.error(result.err);
    return null;
  }
}

/**
 * Get specific note from the DB with UUID.
 *
 * @param string uuid
 * @return object with result
 *
 * @version 1.0.0
 */
async function readNote(uuid: string) {
  const binaryUuid = Buffer.from(parse(uuid));
  const result = await db.queryDB(
    "SELECT LOWER(CONCAT(SUBSTR(HEX(uuid), 1, 8), '-',SUBSTR(HEX(uuid), 9, 4), '-',SUBSTR(HEX(uuid), 13, 4), '-',SUBSTR(HEX(uuid), 17, 4), '-',SUBSTR(HEX(uuid), 21))) AS uuid, `title`, `description` FROM `notes` where `uuid` = ?",
    [binaryUuid],
  );

  if (result.rows) {
    return result.rows;
  } else {
    console.error(result.err);
    return null;
  }
}

/**
 * Add a note to the DB
 *
 * @param string title
 * @param string description
 * @return object with result
 *
 * @version 1.0.0
 */
async function createNote(title: string, description: string) {
  const result = await db.queryDB(
    "INSERT INTO `notes` (`uuid`, `title`, `description`, `created_at`, `updated_at`) VALUES (UNHEX(REPLACE(UUID(), '-', '')), ?, ?, current_timestamp(), current_timestamp());",
    [title, description],
  );

  if (result.rows) {
    return result;
  } else {
    console.error(result.err);
    return null;
  }
}

/**
 * Update a note in the DB
 *
 * @param string uuid
 * @param string title
 * @param string description
 * @return object with result
 *
 * @version 1.0.0
 */
async function updateNote(uuid: string, title: string, description: string) {
  const binaryUuid = Buffer.from(parse(uuid));
  const result = await db.queryDB('UPDATE `notes` SET `title` = ?, `description` = ? WHERE `uuid` = ?;', [
    title,
    description,
    binaryUuid,
  ]);

  if (result.rows) {
    return result.rows;
  } else {
    console.error(result.err);
    return null;
  }
}

/**
 * Delete a note from the DB
 *
 * @param string uuid
 * @return result
 *
 * @version 1.0.0
 */
async function deleteNote(uuid: string) {
  const binaryUuid = Buffer.from(parse(uuid));
  const result = await db.queryDB('DELETE FROM `notes` WHERE `notes`.`uuid` = ?', [binaryUuid]);
  return result;
}

export { getAllNotes, readNote, createNote, updateNote, deleteNote };

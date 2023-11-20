import express, { Request, Response } from 'express';
import { getAllNotes, readNote, createNote, updateNote, deleteNote } from '../lib/controller';
import { validate } from 'uuid';
import os from 'os';
const { version } = require('../../package.json');

const serverName = os.hostname();

const routes = express.Router();

routes.get('/', async (_req: Request, res: Response) => {
  const message = _req.query.msg;
  const notes = await getAllNotes();
  res.render('pages/index', { notes: notes, message: message, serverName: serverName, appVersion: version });
});

routes.get('/add', (_req: Request, res: Response) => {
  res.render('pages/add');
});

routes.post('/add', async (_req: Request, res: Response) => {
  const title: string = _req.body.title;
  const description: string = _req.body.description;

  const result = await createNote(title, description);

  if (result) {
    res.status(200).redirect('/?msg=Notiz wurde hinzugefügt.');
  } else {
    res.status(500).send();
    console.error('Fehler passiert');
  }
});

routes.get('/edit/:uuid', async (_req: Request, res: Response) => {
  const uuid = _req.params.uuid as string;

  if (validate(uuid)) {
    const note = (await readNote(uuid)) as Array<JSON>;

    if (note) {
      res.render('pages/edit', { note: note[0] });
    } else {
      console.error('Fehler passiert');
    }
  } else {
    res.redirect('/');
  }
});

routes.patch('/edit/:uuid', async (_req: Request, res: Response) => {
  const uuid: string = _req.params.uuid;
  const title: string = _req.body.title;
  const description: string = _req.body.description;

  if (validate(uuid)) {
    const result = await updateNote(uuid, title, description);
    if (result) {
      res.status(200).send('Update success');
    } else {
      res.status(500).send();
      console.error('Fehler passiert');
    }
  } else {
    res.redirect('/');
  }
});

routes.delete('/delete', async (_req: Request, res: Response) => {
  const uuid = _req.body.uuid as string;

  if (validate(uuid)) {
    const result = await deleteNote(uuid);

    if (result) {
      res.status(200).send('Delete success');
    } else {
      res.status(500).send();
      console.error('Fehler passiert beim löschen');
    }
  } else {
    console.error('Fehler in UUID');
  }
});

export default routes;

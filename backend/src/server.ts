import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const app = express();
app.use(cors());
app.use(express.json());

const dataDir = path.resolve(process.cwd(), 'data');

function loadJSON<T>(file: string): T {
  return JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf-8')) as T;
}

app.get('/api/lessons', (_req, res) => {
  const lessons: any[] = loadJSON<any[]>('lessons.json');
  res.json(lessons.map(l => ({ id: l.id, title: l.title, level: l.level, description: l.description })));
});

app.get('/api/lessons/:id', (req, res) => {
  const lessons: any[] = loadJSON<any[]>('lessons.json');
  const lesson = lessons.find(l => l.id === req.params.id);
  if(!lesson) return res.status(404).json({error:'Not found'});
  res.json(lesson);
});

app.get('/api/audio', (_req, res) => {
  const audio = loadJSON<any[]>('audio.json');
  res.json(audio);
});

app.get('/api/news/channels', (_req,res) => {
  const channels = loadJSON<any[]>('news-channels.json');
  res.json(channels);
});

app.get('/api/news/headlines', (_req,res) => {
  // Placeholder: real implementation would fetch & parse RSS or site headlines
  res.json([
    { title: 'Placeholder headline 1', source: 'MockSource' },
    { title: 'Placeholder headline 2', source: 'MockSource' }
  ]);
});

// ActivityPub placeholder endpoints
app.get('/api/social/timeline', (_req,res) => {
  res.json([
    { id: '1', user: '@learner1', content: 'Finished Basic Greetings lesson! 🎉' },
    { id: '2', user: '@learner2', content: 'Practiced numbers today.' }
  ]);
});

app.post('/api/social/post', (req,res) => {
  const { content } = req.body;
  // In future: persist & federate
  res.json({ status: 'accepted', echo: content });
});

const port = process.env.PORT || 4300;
app.listen(port, () => console.log('Backend listening on port', port));

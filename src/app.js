import express from 'express';
import renderView from './middleware/renderView';

const app = express();

app.get('/*', renderView);

app.listen(3000, () => {
  console.log('App listening on port: 3000');
});

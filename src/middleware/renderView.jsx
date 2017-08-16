import { match } from 'react-router-dom';
import Routes from '../routes';

export default function renderView(req, res) {
  const matchOpts = {
    routes: Routes,
    location: req.url
  };

  const handleMatchResult = (error, redirectLocation, renderProps) => {
    if (!error && !redirectLocation && renderProps) {
      res.send('Success, that is a route!');
    }
  };

  match(matchOpts, handleMatchResult);
}

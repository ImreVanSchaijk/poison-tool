import React from 'react';
import './App.scss';
import 'assets/styles.scss';

import { Dummy, ImageFinder, Alt1 } from 'alt1-react';

function App() {
  return (
    <Alt1 debug>
      <ImageFinder src={null} interval={2000}>
        <Dummy />
      </ImageFinder>
    </Alt1>
  );
}

export default App;

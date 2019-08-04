import React from 'react';

import './App.scss';
import 'assets/alt1/nis.css';
import 'assets/styles.scss';

import { ImageFinder, Alt1 } from 'alt1-react';
import { PoisonReader } from 'components';

import { health, healthAnchor } from 'assets';

const region = {
  image: healthAnchor,
  x: 150,
  y: 0,
  width: 65,
  height: 19,
};

function App() {
  return (
    <Alt1>
      <ImageFinder src={health} interval={3000} region={region}>
        <PoisonReader />
      </ImageFinder>
    </Alt1>
  );
}

export default App;

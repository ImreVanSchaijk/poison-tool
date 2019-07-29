import fs from 'fs';
import recursive from 'recursive-readdir';

const fileLines = ['/* eslint-disable */', ''];

recursive('src/assets', ['index.js'], (err, files) => {
  if (err) throw err;
  const filteredFiles = files
    .map(p => p.substring(p
      .indexOf('assets'))
      .split('\\')
      .slice(1))
    .filter(p => p.length > 0);

  filteredFiles.push(['debug', 'folder', 'array', 'image.png']);

  filteredFiles.forEach((pathString) => {
    const file = pathString.pop();
    const name = file.substring(0, file.lastIndexOf('.'));
    fileLines.push(`export { ${name} } from './${pathString.join('/')}/${file}';`);
  });

  fileLines.push();

  fs.writeFile('./src/assets/index.js', fileLines.join('\n'), () => console.info('File updated'));
});

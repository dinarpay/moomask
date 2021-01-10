const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const zipDirectory = path.join(__dirname ,'..', 'dist');
const finalPath = path.join(zipDirectory, 'moomask.zip');

const output = fs.createWriteStream( finalPath );
const archive = archiver('zip', {
  zlib: { level: 9 } // Sets the compression level.
});

output.on('end', function() {
  console.log('Zip completed');
});

archive.on('error', function(err) {
  throw err;
});

archive.pipe(output);

//archive.glob('*.*', {cwd: zipDirectory});
archive.directory(zipDirectory, false);

archive.finalize();

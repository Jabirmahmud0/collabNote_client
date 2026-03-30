const fs = require('fs');
const src = 'C:/Users/Jabir/.gemini/antigravity/brain/aee7665d-a53f-46e3-ad59-88896f7f02d0/collabnote_icon_1774869284026.png';
const dest = 'f:/PieceOfShit/Projects/CollabNote/collabnote/client/public/favicon.png';
try {
  fs.copyFileSync(src, dest);
  console.log('Successfully copied favicon.png');
} catch (err) {
  console.error('Error copying file:', err);
  process.exit(1);
}

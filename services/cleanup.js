const fs = require("fs");

const path = require("path");



function deleteFilesInFolder(folderPath) {

  if (!fs.existsSync(folderPath)) {

    return;

  }



  const files = fs.readdirSync(folderPath);



  for (const file of files) {

    const filePath = path.join(
      folderPath,
      file
    );



    try {

      fs.unlinkSync(filePath);

      console.log(
        `Deleted: ${filePath}`
      );

    } catch (err) {

      console.log(
        `Failed to delete: ${filePath}`
      );

    }

  }

}



async function cleanup() {

  console.log(
    "\n========== CLEANUP STARTED ==========\n"
  );



  deleteFilesInFolder(
    path.join(__dirname, "../videos")
  );



  deleteFilesInFolder(
    path.join(__dirname, "../audio")
  );



  deleteFilesInFolder(
    path.join(__dirname, "../captions")
  );



  deleteFilesInFolder(
    path.join(__dirname, "../output")
  );



  console.log(
    "\n========== CLEANUP COMPLETE ==========\n"
  );

}

module.exports = cleanup;
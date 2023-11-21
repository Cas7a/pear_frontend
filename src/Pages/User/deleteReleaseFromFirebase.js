import { ref, deleteObject, listAll } from "firebase/storage";
import { storage } from "../../Firebase/firebase";

export const deleteReleaseFromFirebase = (username, release) => {
  const folderRef = ref(storage, `releases/${username}/${release}`);

  listAll(folderRef)
    .then((res) => {
      // `itemRefs` are the references for each file
      const itemRefs = res.items;
      const deletePromises = itemRefs.map((itemRef) => deleteObject(itemRef));
      return Promise.all(deletePromises);
    })
    .then(() => {
      console.log("All files from folder have been deleted");
    })
    .catch((error) => {
      console.error("Error deleting files:", error);
    });
};

export const deleteSongFromFirebase = (username, release, title) => {
  const fileRef = ref(storage, `releases/${username}/${release}/${title}`);

  deleteObject(fileRef)
    .then(() => {
      console.log("File deleted");
    })
    .catch((error) => {
      console.error("Error deleting file:", error);
    });
};

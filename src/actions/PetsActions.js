import firebase from '../firebase/index';
import store from '../store';

export const addPet = (input) => {
  const action = {
    type:'ADD_PET',
    pet: {
      name: input.name,
      filePath: input.img,
      stars: 0,
      timeStamp: Date.now(),
      followers: {},
      adopt: input.adopt,
    }
  }
  const uid = firebase.auth().currentUser.uid;
  const key = firebase.database().ref(`/accounts/${uid}/pets`).push().key;
  action.pet.ownerUid = uid;
  action.pet.id = key;

  const storageRef = firebase.storage().ref(`${firebase.auth().currentUser.uid}/${action.pet.id}`);

  /*action.pet.filePath.item(0) should be COMPRESSED Base64 HERE
  *COMPRESS COMPRESS
  *COMPRESS action.pet.filePath.item(0)!!!!
  */

  const uploadTask = storageRef.put(action.pet.filePath.item(0));
  uploadTask.on('state_changed', function(snapshot){

  }, function(error) {
    // Handle unsuccessful uploads
    switch (error.code) {
      case 'storage/unauthorized':
        // User doesn't have permission to access the object
        break;

      case 'storage/canceled':
        // User canceled the upload
        break;

      case 'storage/unknown':
        // Unknown error occurred, inspect error.serverResponse
        break;

      default:
        break;
    }
  }, function() {
    //save the firebase hosted profile pic to pet.filepath
    action.pet.filePath = uploadTask.snapshot.downloadURL;
    var updates = {};
    //add pet to /shelter/user in firebase
    //add pet to global pet array in firebase
    updates['/pets/' + key] = action.pet;
    updates[`/accounts/${uid}/pets/` + key] = action.pet;
    firebase.database().ref().update(updates);

    const temp = action.pet;
    temp.id = key;
    action.pet = {};
    action.pet[key] = temp;

    store.dispatch(action);

    //
  });
}

export const sortUsersPetsAction = (sortType, sortDirection, searchTerm) => {
  const action = {
    type: 'SORT_MY_PETS',
    sortType: sortType,
    lToG: sortDirection === 'Least',
    searchTerm,
  }
  store.dispatch(action);
}

export const editPetAction = (edits, pet) => {
  const action = {
    type: 'EDIT_PET',
    payload: edits,
    petId: pet.id,
    ownerUid: pet.ownerUid,
  }
  store.dispatch(action);

  const updates = {};
  updates[`/pets/${pet.id}`] = { ...pet, ...edits };
  updates[`/accounts/${pet.ownerUid}/pets/${pet.id}`] = { ...pet, ...edits };
  firebase.database().ref().update(updates);
}

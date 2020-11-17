import firebase, { firestore } from './firebase';

const roomsCollection = firestore.collection('rooms');
class PeerState {
  constructor(peerInfo) {
    if (!peerInfo.mid) throw new Error('stream mid is needed'); // Figure out a way to handle this error if it occurs

    this.mid = peerInfo.mid;
    this.uid = peerInfo.uid;
    this.rid = peerInfo.rid;

    console.log('State created', this.mid);
  }

  update(peerInfo) {
    console.log('SAVING TO FIREBASE: ', peerInfo, this.mid);

    return roomsCollection
      .doc(this.rid)
      .collection('peers')
      .doc(this.uid)
      .set(
        {
          streams: {
            [this.mid]: { ...peerInfo, ...{ uid: this.uid } },
          },
        },
        { merge: true }
      );
  }

  delete() {
    console.log('DELETE FROM FIREBASE', this.uid);
    this.unsubscribe();
    return roomsCollection
      .doc(this.rid)
      .collection('peers')
      .doc(this.uid)
      .delete();
  }

  setRequest(uid, request) {
    console.log('SENDING REQUEST: ', request, uid);

    return roomsCollection
      .doc(this.rid)
      .collection('peers')
      .doc(uid)
      .set({
        request: { ...request, from: this.uid },
      });
  }

  onRequest(cb, errorCb) {
    console.log('LISTENING TO REQUESTS', this.uid);

    this.unsubscribe = roomsCollection
      .doc(this.rid)
      .collection('peers')
      .doc(this.uid)
      .onSnapshot(doc => {
        const data = doc.data();
        if (data.request && this.uid !== data.request.from) {
          cb(data.request);
          roomsCollection
            .doc(this.rid)
            .collection('peers')
            .doc(this.uid)
            .set(
              { request: firebase.firestore.FieldValue.delete() },
              { merge: true }
            );
        }
      }, errorCb);
  }
}

const onRoomStateChange = (rid, cb, errorCb) => {
  roomsCollection
    .doc(rid)
    .collection('peers')
    .onSnapshot(querySnapshot => {
      cb(querySnapshot.docs.map(doc => doc.data()));
    }, errorCb);
};

export default PeerState;
export { onRoomStateChange };

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../config/firebase';
import { setVacations } from '../store/slices/vacationsSlice';

const useFirestoreSync = (workspaceId) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!workspaceId) {
      return;
    }

    const vacationsRef = collection(db, 'workspaces', workspaceId, 'vacations');
    const q = query(vacationsRef);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const vacations = [];
        snapshot.forEach((doc) => {
          vacations.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        dispatch(setVacations(vacations));
      },
      (error) => {
        console.error('Error syncing vacations:', error);
      }
    );

    return () => unsubscribe();
  }, [workspaceId, dispatch]);
};

export default useFirestoreSync;


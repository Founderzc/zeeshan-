import { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

export const useAdmin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      // Simple check for admin - you can refine this later
      setIsAdmin(!!currentUser && currentUser.email === 'infozedscoreteam@gmail.com');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { isAdmin, user, loading };
};

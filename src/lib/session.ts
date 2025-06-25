'use client';

// This is a mock session management for prototyping purposes.
// In a real application, this would be handled by a proper authentication library
// and server-side sessions or JWTs.

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Usuário';
  photoUrl?: string;
};

/**
 * Sets the currently logged-in user in sessionStorage.
 */
export const setLoggedInUser = (user: User | null) => {
  if (typeof window !== 'undefined') {
    if (user) {
      sessionStorage.setItem('loggedInUser', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('loggedInUser');
    }
  }
};

/**
 * Retrieves the currently logged-in user from sessionStorage.
 */
export const getLoggedInUser = (): User | null => {
  if (typeof window === 'undefined') {
    // Default to admin during server-side rendering to prevent UI breakages.
    return { id: 'user-admin', name: 'Admin', email: 'admin@email.com', role: 'Admin', photoUrl: 'https://placehold.co/40x40.png' };
  }

  const userJson = sessionStorage.getItem('loggedInUser');
  if (userJson) {
    try {
      return JSON.parse(userJson);
    } catch (e) {
      console.error("Failed to parse user from sessionStorage", e);
      return null;
    }
  }
  return null;
};

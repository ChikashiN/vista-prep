interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  createdAt: string;
  hasPaid?: boolean;
}

export const verifyUser = (): { user: User | null; isAuthenticated: boolean; hasPaid: boolean } => {
  try {
    const currentUser = localStorage.getItem('currentUser');
    
    if (!currentUser) {
      return { user: null, isAuthenticated: false, hasPaid: false };
    }

    const userData = JSON.parse(currentUser);
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const verifiedUser = users.find((u: User) => u.id === userData.id);

    if (!verifiedUser) {
      // User not found in users array, clear invalid data
      localStorage.removeItem('currentUser');
      return { user: null, isAuthenticated: false, hasPaid: false };
    }

    return {
      user: verifiedUser,
      isAuthenticated: true,
      hasPaid: verifiedUser.hasPaid || false
    };
  } catch (error) {
    // Invalid user data, clear and return false
    localStorage.removeItem('currentUser');
    return { user: null, isAuthenticated: false, hasPaid: false };
  }
};

export const updateUserPaymentStatus = (userId: string, hasPaid: boolean) => {
  try {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map((user: User) => {
      if (user.id === userId) {
        return { ...user, hasPaid };
      }
      return user;
    });
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    // Update current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (currentUser.id === userId) {
      localStorage.setItem('currentUser', JSON.stringify({ ...currentUser, hasPaid }));
    }
  } catch (error) {
    console.error('Error updating user payment status:', error);
  }
}; 
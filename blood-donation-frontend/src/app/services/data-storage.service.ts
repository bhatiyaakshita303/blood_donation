import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {
  private readonly USERS_KEY = 'registered_users';
  private readonly CURRENT_USER_KEY = 'current_user';

  constructor() {
    // Initialize users array if it doesn't exist
    if (!localStorage.getItem(this.USERS_KEY)) {
      localStorage.setItem(this.USERS_KEY, JSON.stringify([]));
    }
  }

  // Store new user
  storeUser(userData: any): boolean {
    try {
      const users = this.getAllUsers();
      
      // Check if user already exists
      if (users.find(user => user.email === userData.email)) {
        return false; // User already exists
      }

      // Add new user with ID and timestamp
      const newUser = {
        id: Date.now(), // Simple ID generation
        ...userData,
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
      return true;
    } catch (error) {
      console.error('Error storing user:', error);
      return false;
    }
  }

  // Get all users
  getAllUsers(): any[] {
    try {
      const users = localStorage.getItem(this.USERS_KEY);
      return users ? JSON.parse(users) : [];
    } catch (error) {
      console.error('Error getting users:', error);
      return [];
    }
  }

  // Get user by email
  getUserByEmail(email: string): any | null {
    try {
      const users = this.getAllUsers();
      return users.find(user => user.email === email) || null;
    } catch (error) {
      console.error('Error getting user by email:', error);
      return null;
    }
  }

  // Authenticate user (for login)
  authenticateUser(email: string, password: string): any | null {
    try {
      const user = this.getUserByEmail(email);
      if (user && user.password === password) {
        return user;
      }
      return null;
    } catch (error) {
      console.error('Error authenticating user:', error);
      return null;
    }
  }

  // Store current logged-in user
  setCurrentUser(user: any): void {
    try {
      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error setting current user:', error);
    }
  }

  // Get current logged-in user
  getCurrentUser(): any | null {
    try {
      const user = localStorage.getItem(this.CURRENT_USER_KEY);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  // Logout user
  logout(): void {
    try {
      localStorage.removeItem(this.CURRENT_USER_KEY);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return this.getCurrentUser() !== null;
  }

  // Clear all data (for testing)
  clearAllData(): void {
    localStorage.removeItem(this.USERS_KEY);
    localStorage.removeItem(this.CURRENT_USER_KEY);
  }
}

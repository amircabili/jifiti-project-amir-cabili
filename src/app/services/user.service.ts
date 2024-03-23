import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersUrl = 'assets/user_list.json';
  private localStorageKey = 'users';
  private formFieldsUrl = 'assets/user_form.json';
  usersUpdated: Subject<void> = new Subject<void>();

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any[]> {
    const storedUsers = localStorage.getItem(this.localStorageKey);
    return storedUsers ? of(JSON.parse(storedUsers)) : of([]);
  }

  setUsers(users: any[]): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(users));
    this.usersUpdated.next();
  }

  addUser(newUser: any): void {
    let users = this.getUsersFromLocalStorage();
    if (!Array.isArray(users)) {
      users = [];
    }
    users.push(newUser);
    this.setUsers(users);
  }

  getFormFields(): Observable<any> {
    return this.http.get<any>(this.formFieldsUrl);
  }
  initializeLocalStorage(): Observable<any> {
    const storedUsers = this.getUsersFromLocalStorage();
    if (storedUsers.length > 0) {
      console.log('Local storage already initialized with data.');
      return of(null); // Return observable with null value
    }

    return this.http.get<any>(this.usersUrl).pipe(
      catchError(error => {
        console.error('Error loading initial user data:', error);
        return of(null);
      }),
      switchMap((data: any) => {
        if (data && data.users && Array.isArray(data.users)) {
          localStorage.setItem(this.localStorageKey, JSON.stringify(data.users));
          return of(null);
        } else {
          console.error('Initial user data is empty or not in the expected format.');
          return of(null);
        }
      })
    );
  }

  getUsersFromLocalStorage(): any[] {
    const storedUsers = localStorage.getItem(this.localStorageKey);
    return storedUsers ? JSON.parse(storedUsers) : [];
  }

  updateUser(first_name: string, updatedUserData: any): void {

    // Get the existing users from local storage
    const users = this.getUsersFromLocalStorage();

    // Find the index of the user with the given ID
    const userIndex = users.findIndex(user => user.first_name === first_name);

    // If user with the given ID exists, update its data
    if (userIndex !== -1) {
      // Create a copy of the users array
      const updatedUsers = [...users];

      // Update the user's data
      updatedUsers[userIndex] = { ...updatedUsers[userIndex], ...updatedUserData };

      // Save the updated users back to local storage
      localStorage.setItem(this.localStorageKey, JSON.stringify(updatedUsers));

      // Notify subscribers that the user data has been updated
      this.usersUpdated.next();
    } else {
      console.error(`User with first_name ${first_name} not found.`);
    }
  }



}

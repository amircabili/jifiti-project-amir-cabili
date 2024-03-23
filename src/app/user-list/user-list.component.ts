import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users: any[] = [];

  constructor(private userService: UserService,private router: Router) { }

  ngOnInit(): void {
    // Load initial user data
    this.userService.initializeLocalStorage().subscribe(() => {
      console.log('Local storage initialized successfully.');
      // Now let's get the users from local storage and log them
      const storedUsers = this.userService.getUsersFromLocalStorage();
      console.log('Users from local storage:', storedUsers);
      // Check if storedUsers is an array
      if (Array.isArray(storedUsers)) {
        // Assign the users to the component property for rendering
        this.users = storedUsers;
      } else {
        console.error('Users data from local storage is not an array.');
      }
    });
  }

  editUser(user: any): void {
    this.router.navigate(['/add-user'], { state: { user } });
  }

}

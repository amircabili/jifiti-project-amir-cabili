import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  userForm!: FormGroup; // Create userForm
  formFields: any[] = []; // Define a property to hold the form field configuration
  loadingFormFields = true; // Flag to indicate if form fields are still loading

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('Initializing form...');
    this.initializeForm();
    console.log('Form initialized.');

    const userData = history.state.user;
    if (userData) {
      console.log('User data found:', userData);
      console.log('Patching form value...');
      this.userForm.patchValue(userData); // Populate the form fields with user data
      console.log('Form patched with user data.');
    } else {
      console.log('No user data found.');
    }

    // Load form field configuration from user service
    this.userService.getFormFields().subscribe(
      (data: any) => {
        this.formFields = data.form_fields;
      },
      error => {
        console.error('Error loading form fields:', error);
      },
      () => {
        this.loadingFormFields = false; // Set loading flag to false when completed
      }
    );
  }

  private initializeForm(): void {
    this.userForm = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{3}-\d{3}-\d{4}$/)]]
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const userData = history.state.user;
      if (userData) {
        // Update existing user data
        const updatedUser = this.userForm.value;
        // Call a method in UserService to update the specific user in the JSON file
        this.userService.updateUser(userData.first_name, updatedUser);
      } else {
        // Add new user data
        const newUser = this.userForm.value;
        this.userService.addUser(newUser);
      }
      this.userForm.reset(); // Reset the form after submitting
      this.router.navigate(['/users'] );

    } else {
      // Mark all form fields as touched to trigger validation messages
      this.userForm.markAllAsTouched();
    }

  }
}

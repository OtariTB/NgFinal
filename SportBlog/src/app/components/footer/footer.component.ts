import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  
  subscriptionForm = new FormGroup({
    email: new FormControl('', { 
      nonNullable: true, 
      validators: [Validators.required, Validators.email] 
    }),
  });

  onSubmit(): void {
    if (this.subscriptionForm.valid) {
      const email = this.subscriptionForm.controls.email.value;
      console.log('Subscribing email:', email);
      // Here you would typically send the email to your backend
      alert(`Thank you for subscribing with ${email}!`);
      this.subscriptionForm.reset();
    } else {
      this.subscriptionForm.markAllAsTouched();
    }
  }
}

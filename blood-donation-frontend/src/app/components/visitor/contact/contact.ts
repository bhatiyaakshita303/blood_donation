import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {
  
  onSubmit(): void {
    console.log('Contact form submitted');
    // TODO: Implement actual form submission logic
    // This would typically send the form data to a backend service
    alert('Thank you for your message! We will get back to you soon.');
  }
}

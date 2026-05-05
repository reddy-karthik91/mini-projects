import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile-settings',
  imports: [FormsModule],
  templateUrl: './profile-settings.component.html',
  styleUrl: './profile-settings.component.scss'
})
export class ProfileSettingsComponent implements OnInit{
// Source of Truth (From LocalStorage)
user: any;

// 1. Two-way Binding field (Immediate)
userBio: string = '';

// 2. Draft field for Property Binding (Deferred)
draftEmail: string = '';

// Initial state
selectedTheme: string = 'light-theme';

constructor(private toastr: ToastrService){}

ngOnInit() {
  const data = localStorage.getItem('currentUser');
  if (data) {
    this.user = JSON.parse(data);
    this.userBio = this.user.bio || ''; 
    this.draftEmail = this.user.email;
  }
}

saveSettings() {
  // Commit the draft email to the real user object
  this.user.email = this.draftEmail;
  this.user.bio = this.userBio;

  // Update LocalStorage
  localStorage.setItem('currentUser', JSON.stringify(this.user));
  this.toastr.success('Settings saved successfully!', 'K-Admin Security');
}

cancelChanges() {
  // Reset draft back to original
  this.draftEmail = this.user.email;
  this.toastr.info('Changes discarded.');
}
}

import { Directive,Input, TemplateRef, ViewContainerRef, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth-service/auth.service';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appHasRole]',
  standalone: true
})
export class HasRoleDirective implements OnInit, OnDestroy{

  @Input() appHasRole: string | string[] = [];

  private subscription?: Subscription;

  private hasView = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private authService: AuthService,
    private viewContainer: ViewContainerRef
  ) { }

  ngOnInit(): void {
    // we listen to login status, Whenever login/logout happens, we re-check roles.
    this.subscription = this.authService.isLoggedIn$.subscribe(() => {
      this.checkRole();
    });
  }

private checkRole(){
  const user = this.authService.getCurrentUser();
  const userRole = user?.role || '';

  // Normalize input to an array to support ['admin', 'manager']
  const allowedRoles = Array.isArray(this.appHasRole) ? this.appHasRole : [this.appHasRole];
    
  const canAccess = allowedRoles.includes(userRole);

  if (canAccess && !this.hasView) {
    // Add the element to the DOM
    this.viewContainer.createEmbeddedView(this.templateRef);
    this.hasView = true;
  } else if (!canAccess && this.hasView) {
    // Remove the element from the DOM
    this.viewContainer.clear();
    this.hasView = false;
  }
}

ngOnDestroy() {
  // Clean up to prevent memory leaks
  this.subscription?.unsubscribe();
}
}

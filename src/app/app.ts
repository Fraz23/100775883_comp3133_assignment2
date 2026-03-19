import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { SessionService } from './core/services/session.service';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  private readonly sessionService = inject(SessionService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly isAuthenticated = this.sessionService.isAuthenticated;

  protected logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}

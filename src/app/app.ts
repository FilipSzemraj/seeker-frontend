import { Component, effect, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { AuthService } from './core/auth/auth.service';
import { SessionExpiredDialog } from './core/auth/session-expired-dialog/session-expired-dialog';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SessionExpiredDialog],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('flat-searcher');

  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  constructor() {
    // The Cognito callback lands back on the landing page. Once the session is
    // restored, send a freshly-signed-in user straight to the gateway, which
    // decides what they can reach next.
    effect(() => {
      if (this.auth.postLoginPending()) {
        this.auth.consumePostLogin();
        void this.router.navigateByUrl('/gateway');
      }
    });
  }

  /** Re-authenticate from the session-expired dialog. */
  protected onSessionLogIn(): void {
    void this.auth.signIn();
  }

  /** Abandon the expired session and return to the landing page. */
  protected onSessionGoHome(): void {
    this.auth.clearSessionExpired();
    void this.router.navigateByUrl('/');
  }
}

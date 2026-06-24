import {
    Component,
    ElementRef,
    afterNextRender,
    output,
    viewChild,
} from '@angular/core';

/**
 * Blocking, non-dismissible dialog shown when the session expired and the
 * silent refresh could not renew it. The user must either sign in again or go
 * back to the home page — there is no close button, no backdrop dismissal and
 * Escape is swallowed, so the app cannot be used in a half-authenticated state.
 *
 * Accessibility: a focus-trapped `role="dialog"` with `aria-modal`, labelled
 * and described by its heading/body, with focus moved inside on open.
 */
@Component({
    selector: 'app-session-expired-dialog',
    template: `
        <div class="se-overlay">
            <div
                class="se-dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby="se-title"
                aria-describedby="se-desc"
                #dialog
                (keydown)="onKeydown($event)"
            >
                <p class="eyebrow se-dialog__eyebrow">Session</p>
                <h2 class="se-dialog__title" id="se-title">Your session expired</h2>
                <p class="se-dialog__desc" id="se-desc">
                    We couldn't refresh your sign-in automatically. Log in again to
                    continue where you left off, or return to the home page.
                </p>
                <div class="se-dialog__cta">
                    <button
                        type="button"
                        class="btn btn--primary"
                        (click)="logIn.emit()"
                    >
                        Log in again
                    </button>
                    <button
                        type="button"
                        class="btn btn--ghost"
                        (click)="goHome.emit()"
                    >
                        Back to home
                    </button>
                </div>
            </div>
        </div>
    `,
    styleUrl: './session-expired-dialog.scss',
})
export class SessionExpiredDialog {
    /** User chose to re-authenticate. */
    readonly logIn = output<void>();
    /** User chose to abandon the session and return to the landing page. */
    readonly goHome = output<void>();

    private readonly dialog = viewChild.required<ElementRef<HTMLElement>>('dialog');

    constructor() {
        // Pull focus into the dialog so keyboard users start inside the trap.
        afterNextRender(() => this.focusable()[0]?.focus());
    }

    /** Keep focus inside the dialog and swallow Escape so it can't be closed. */
    protected onKeydown(event: KeyboardEvent): void {
        if (event.key === 'Escape') {
            event.preventDefault();
            return;
        }
        if (event.key !== 'Tab') {
            return;
        }

        const items = this.focusable();
        if (items.length === 0) {
            return;
        }

        const first = items[0];
        const last = items[items.length - 1];
        const active = document.activeElement;

        if (event.shiftKey && active === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && active === last) {
            event.preventDefault();
            first.focus();
        }
    }

    private focusable(): HTMLElement[] {
        return Array.from(
            this.dialog().nativeElement.querySelectorAll<HTMLElement>(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
            ),
        );
    }
}

import { Component, input, output, signal } from '@angular/core';

/** A submitted search: the free-text prompt plus whether to rerank the results. */
export interface AskEvent {
  prompt: string;
  rerank: boolean;
}

/**
 * The single entry point to both retrieval modes. Free text runs a semantic
 * `/retrieve` (listings only — no prose); the "Filters" control reveals the
 * structured panel. The "Rerank" toggle opts the prompt into the Voyage
 * reranker second stage (sharper ordering, higher token cost).
 */
@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.scss',
})
export class SearchBar {
  readonly busy = input(false);
  readonly activeFilterCount = input(0);
  readonly filtersOpen = input(false);

  readonly ask = output<AskEvent>();
  readonly toggleFilters = output<void>();

  protected readonly draft = signal('');
  /** Opt-in to the reranker; preference persists across searches in the session. */
  protected readonly rerank = signal(false);

  protected toggleRerank(): void {
    this.rerank.update((v) => !v);
  }

  protected submit(): void {
    const value = this.draft().trim();
    if (!value || this.busy()) return;
    this.ask.emit({ prompt: value, rerank: this.rerank() });
    this.draft.set('');
  }
}

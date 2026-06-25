import { Component, input, output } from '@angular/core';

import type { Listing } from '../../../../core/models/listing.model';
import { ListingCard } from '../listing-card/listing-card';

/**
 * Side preview shown when a map marker is selected. Reuses `ListingCard`.
 * Each new selection mounts a fresh card node (keyed by `source_url`) so the
 * slide-up entry animation replays, giving the carousel "deal a new card" feel.
 */
@Component({
  selector: 'app-map-preview',
  imports: [ListingCard],
  templateUrl: './map-preview.html',
  styleUrl: './map-preview.scss',
})
export class MapPreview {
  readonly listing = input.required<Listing>();
  readonly close = output<void>();
}

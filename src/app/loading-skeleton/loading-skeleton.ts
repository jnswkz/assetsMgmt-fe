import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type SkeletonVariant = 'dashboard' | 'table' | 'cards';

@Component({
  selector: 'app-loading-skeleton',
  templateUrl: './loading-skeleton.html',
  styleUrl: './loading-skeleton.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingSkeleton {
  readonly variant = input<SkeletonVariant>('table');
  readonly rows = input(5);
  protected readonly rowIndexes = computed(() =>
    Array.from({ length: Math.max(1, this.rows()) }, (_, index) => index)
  );
}

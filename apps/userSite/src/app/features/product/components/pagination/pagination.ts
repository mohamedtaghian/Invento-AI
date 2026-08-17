import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { HlmPaginationImports } from '@spartan/helm/pagination';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmPaginationImports],
})
export class Pagination {
  public readonly currentPage = input.required<number>();
  public readonly totalPages = input.required<number>();

  public readonly pageChange = output<number>();

  protected readonly pages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();

    if (total <= 5) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    if (current <= 3) {
      return [1, 2, 3, 4, '...', total];
    }

    if (current >= total - 2) {
      return [1, '...', total - 3, total - 2, total - 1, total];
    }

    return [1, '...', current - 1, current, current + 1, '...', total];
  });

  protected goTo(page: number | string): void {
    if (
      typeof page === 'string' ||
      page < 1 ||
      page > this.totalPages() ||
      page === this.currentPage()
    )
      return;
    this.pageChange.emit(page);
  }
}

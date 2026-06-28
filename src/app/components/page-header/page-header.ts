import { Component } from '@angular/core';
import { PageBadge } from '@/app/components/page-badge/page-badge';

@Component({
  selector: 'app-page-header',
  imports: [PageBadge],
  templateUrl: './page-header.html',
  styleUrl: './page-header.css',
})
export class PageHeader {}

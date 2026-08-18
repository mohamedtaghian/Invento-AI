import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HlmSidebarImports } from '@spartan/helm/sidebar';
import { Sidebar } from '@invento/invento/shared/ui/sidebar/sidebar';
import { Header } from '@invento/invento/shared/ui/header/header';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, HlmSidebarImports, Sidebar, Header],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayout {}

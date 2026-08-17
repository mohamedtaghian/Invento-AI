import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { HlmInputImports } from '@spartan/helm/input';
import { HlmButton } from '@spartan/helm/button';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearch, lucideX } from '@ng-icons/lucide';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [ReactiveFormsModule, HlmInputImports, HlmButton, NgIcon],
  providers: [provideIcons({ lucideSearch, lucideX })],
  templateUrl: './search-input.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchInput {
  public readonly control = input.required<FormControl<string | null>>();
  public readonly placeholder = input<string>('Search...');
  public readonly isInvalid = input<boolean>(false);
  public readonly enterPressed = output<void>();
  public readonly clearPressed = output<void>();

  protected clearSearch(): void {
    this.control().setValue('');
    this.clearPressed.emit();
  }
}

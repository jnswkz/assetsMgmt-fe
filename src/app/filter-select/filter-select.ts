import { Component, computed, input, output, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { controlValue } from '../utils/search';

@Component({
  selector: 'app-filter-select',
  imports: [MatIconModule],
  templateUrl: './filter-select.html',
  styleUrl: './filter-select.css',
})
export class FilterSelect {
  readonly label = input.required<string>();
  readonly placeholder = input.required<string>();
  readonly options = input.required<readonly string[]>();
  readonly value = input<string>('');
  readonly valueChange = output<string>();

  protected readonly isOpen = signal(false);
  protected readonly selectedLabel = computed(() => this.value() || this.placeholder());
  protected readonly menuOptions = computed(() => [
    {
      label: this.placeholder(),
      value: '',
    },
    ...this.options().map(option => ({
      label: option,
      value: option,
    })),
  ]);

  protected toggle(): void {
    this.isOpen.update(isOpen => !isOpen);
  }

  protected close(): void {
    this.isOpen.set(false);
  }

  protected selectValue(value: string): void {
    this.valueChange.emit(value);
    this.close();
  }

  protected updateNativeValue(event: Event): void {
    this.selectValue(controlValue(event));
  }
}

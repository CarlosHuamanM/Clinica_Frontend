import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-datepicker',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.css'],
})
export class DatepickerComponent implements OnInit {
  @Input() disabledDates: Date[] = [];
  @Input() minDate: Date | null = null;
  @Input() maxDate: Date | null = null;
  @Output() dateSelected = new EventEmitter<Date>();

  currentDate: Date = new Date();
  selectedDate: Date | null = null;
  daysInMonth: Date[] = [];
  daysOfWeek: string[] = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  ngOnInit() {
    this.disabledDates = this.disabledDates.map(date => new Date(date));
    this.generateCalendar();
  }

  private generateCalendar(): void {
    const days: Date[] = [];
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    const startDate = new Date(year, month, 1);
    while (startDate.getDay() !== 0) {
      startDate.setDate(startDate.getDate() - 1);
    }

    for (let i = 0; i < 42; i++) {
      days.push(new Date(startDate));
      startDate.setDate(startDate.getDate() + 1);
    }

    this.daysInMonth = days;
  }

  selectDate(date: Date): void {
    if (!this.isDateDisabled(date)) {
      this.selectedDate = date;
      this.dateSelected.emit(date);
    }
  }

  previousMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    this.generateCalendar();
  }

  nextMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    this.generateCalendar();
  }

  isDateDisabled(date: Date): boolean {
    return this.disabledDates.some(d => d.toDateString() === date.toDateString() || this.minDate && date < this.minDate || this.maxDate && date > this.maxDate);
  }

  isSelected(date: Date): boolean {
    return this.selectedDate?.toDateString() === date.toDateString();
  }
}

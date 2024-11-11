import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, ContentChildren, QueryList, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-stepper',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.css'
})
export class StepperComponent implements AfterContentInit {

  @ContentChildren('step') stepTemplates!: QueryList<TemplateRef<any>>;
  steps: TemplateRef<any>[] = [];
  currentStep = 0;

  ngAfterContentInit(): void {
    this.steps = this.stepTemplates.toArray();
  }

  goToStep(step: number): void {
    if (step >= 0 && step < this.steps.length) {
      this.currentStep = step;
    }
  }

  nextStep(): void {
    this.goToStep(this.currentStep + 1);
  }

  prevStep(): void {
    this.goToStep(this.currentStep - 1);
  }
}

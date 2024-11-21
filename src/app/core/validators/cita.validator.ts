import { AbstractControl, AsyncValidatorFn } from '@angular/forms';

import { debounceTime, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { CitaService } from '../services/cita.service';

export function citaValidator(citaService: CitaService, fecha: string, tratamientoId: number): AsyncValidatorFn {
  return (control: AbstractControl): any => {
    const value = control.value;

    if (!value) {
      return of(null);
    }
    console.log(fecha, value, tratamientoId);
    return citaService.getValidationByDateAndHour(
        {
            fecha: fecha,
            hora: value,
            tratamientoId: Number(tratamientoId)
        }
    ).subscribe((isValid) => {
      if (isValid) {
        control.setErrors(null);
      } else {
        control.setErrors({ citaInvalid: true });
      }
    });
  };
}

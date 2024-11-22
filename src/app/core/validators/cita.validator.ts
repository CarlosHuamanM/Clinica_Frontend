import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { debounceTime, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { CitaService } from '../services/cita.service';

export function citaValidator(citaService: CitaService, fecha: string, tratamientoId: number, dentistaId: number): AsyncValidatorFn {
  return (control: AbstractControl) => {
    const value = control.value;
    if (!value) {
      return of(null); // Si no hay valor, no hay error.
    }

    console.log(fecha, value, tratamientoId);

    // Devolvemos el observable transformado.
    return citaService.getValidationByDateAndHour({
      fecha: fecha,
      hora: value,
      tratamientoId: Number(tratamientoId),
      dentistaId: Number(dentistaId),
    }).pipe(
      debounceTime(300), // Opcional: evita demasiadas llamadas rápidas.
      map((isValid) => (isValid ? null : { citaInvalid: true })), // Devuelve `null` o `{ citaInvalid: true }`.
      catchError(() => of(null)) // En caso de error, no marcará como inválido.
    );
  };
}

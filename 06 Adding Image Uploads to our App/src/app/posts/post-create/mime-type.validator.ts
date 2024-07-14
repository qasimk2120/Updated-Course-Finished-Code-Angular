import { AbstractControl } from "@angular/forms";
import { Observable, Observer, of } from "rxjs";

export const mimeType = (
  control: AbstractControl
): Promise<{ [key: string]: any }> | Observable<{ [key: string]: any }> => {
  if (typeof control.value === "string") {
    return of(null);
  }

  const file = control.value as File;
  const validMimeTypes = ["image/jpeg", "image/png", "image/jpg"]; 

  if (validMimeTypes.includes(file.type)) {
    return of(null);
  } else {
    return of({ invalidMimeType: true });
  }
};

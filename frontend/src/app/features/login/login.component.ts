import { Component, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { HttpErrorResponse } from "@angular/common/http";
import { AuthService } from "../../core/services/auth.service";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.css",
})
export class LoginComponent {
  private readonly formBuilder = inject(FormBuilder);
  readonly authService = inject(AuthService);

  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly form = this.formBuilder.group({
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required]],
  });

  get emailControl() {
    return this.form.controls.email;
  }

  get passwordControl() {
    return this.form.controls.password;
  }

  onSubmit(): void {
    if (this.isLoading()) {
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password } = this.form.getRawValue();

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authService.login({ email: email!, password: password! }).subscribe({
      next: () => {
        this.isLoading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading.set(false);
        this.errorMessage.set(this.mapErrorToMessage(error));
      },
    });
  }

  onLogout(): void {
    this.authService.logout();
    this.form.reset();
    this.errorMessage.set(null);
  }

  private mapErrorToMessage(error: HttpErrorResponse): string {
    // status 0: la solicitud nunca llegó a recibir respuesta (servidor apagado,
    // problema de red, o CORS mal configurado).
    if (error.status === 0) {
      return "No se pudo conectar con el servidor. Verifica que el backend esté encendido.";
    }

    if (error.status === 503) {
      return (
        error.error?.message ??
        "No se pudo conectar con la base de datos. Intenta de nuevo en unos momentos."
      );
    }

    if (error.status === 401) {
      return error.error?.message ?? "Correo o contraseña incorrectos.";
    }

    if (error.status === 400) {
      return error.error?.message ?? "Revisa los datos ingresados.";
    }

    return "Ocurrió un error inesperado. Intenta de nuevo.";
  }
}

import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <div class="dashboard-container">
      <h1>Panel principal</h1>
      <p>Inicio de sesión exitoso.</p>
      <p>El módulo financiero se implementará en incrementos posteriores.</p>
    </div>
  `,
  styles: [
    `
      .dashboard-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        font-family: sans-serif;
      }
    `,
  ],
})
export class DashboardComponent {}
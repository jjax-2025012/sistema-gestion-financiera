import { Routes } from "@angular/router";

/**
 * En este incremento el proyecto solo tiene la pantalla de login.
 * Las rutas de dashboard, ingresos, gastos, activos, pasivos, etc.
 * se agregarán en incrementos posteriores.
 */
export const routes: Routes = [
  { path: "", redirectTo: "login", pathMatch: "full" },
  {
    path: "login",
    loadComponent: () =>
      import("./features/login/login.component").then((m) => m.LoginComponent),
  },
  { path: "**", redirectTo: "login" },
];

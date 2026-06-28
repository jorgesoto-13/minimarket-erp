import { Routes } from '@angular/router';
import { ProductosComponent } from './components/productos/producto.component';
import { Categoria } from './models/categoria.model';
import { CategoriasComponent } from './components/categorias/categorias.component';
import { LoginComponent } from './components/login/login.component';
import { VentasComponent } from './components/ventas/ventas.component';
import { ComprasComponent } from './components/compras/compras.component';
import { ReportesComponent } from './components/reportes/reportes.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

import { UsuariosComponent } from './components/usuarios/usuarios.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [adminGuard] },
  { path: 'reportes', component: ReportesComponent, canActivate: [adminGuard] },
  { path: 'categorias', component: CategoriasComponent, canActivate: [adminGuard] },
  { path: 'productos', component: ProductosComponent, canActivate: [authGuard] },
  { path: 'ventas', component: VentasComponent, canActivate: [authGuard] },
  { path: 'compras', component: ComprasComponent, canActivate: [adminGuard] },
  { path: 'usuarios', component: UsuariosComponent, canActivate: [adminGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

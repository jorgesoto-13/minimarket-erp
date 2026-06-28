import { Component, inject } from '@angular/core'; // <-- Agrupados aquí
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router'; // <-- Agrupados aquí
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true, 
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'minimarket';

  // Inyectamos el servicio para saber si está logueado
  authService = inject(AuthService);
  private router = inject(Router);

  // Método para el nuevo botón de salir
  cerrarSesion() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

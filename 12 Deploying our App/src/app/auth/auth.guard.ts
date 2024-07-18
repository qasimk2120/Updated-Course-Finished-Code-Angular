import { 
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot, 
    Router
} from "@angular/router";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthGuard implements CanActivate {
    private authService = inject(AuthService)
    private router = inject(Router)
    canActivate(
        route: ActivatedRouteSnapshot, 
        state: RouterStateSnapshot
    ): boolean | Observable<boolean> | Promise<boolean> {
        const isAuth = this.authService.getIsAuth();
        if (!isAuth) {
            this.router.navigate(['/auth/login']);
        }
        return isAuth; 
    }
}
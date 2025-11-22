import {
  HttpClient,
  Router
} from "./chunk-MFYBW43V.js";
import {
  BehaviorSubject,
  tap,
  ɵɵdefineInjectable,
  ɵɵinject
} from "./chunk-4RUIMXA5.js";

// src/app/core/services/auth.service.ts
var AuthService = class _AuthService {
  constructor(http, router) {
    this.http = http;
    this.router = router;
    this.apiUrl = "http://localhost:8080/api/auth";
    this.currentUserSubject = new BehaviorSubject(null);
    this.currentUser$ = this.currentUserSubject.asObservable();
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }
  register(request) {
    return this.http.post(`${this.apiUrl}/register`, request).pipe(tap((response) => {
      this.setCurrentUser(response);
    }));
  }
  login(request) {
    return this.http.post(`${this.apiUrl}/login`, request).pipe(tap((response) => {
      this.setCurrentUser(response);
    }));
  }
  logout() {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    this.currentUserSubject.next(null);
    this.router.navigate(["/login"]);
  }
  setCurrentUser(user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
    localStorage.setItem("token", user.token);
    this.currentUserSubject.next(user);
  }
  getCurrentUser() {
    return this.currentUserSubject.value;
  }
  getToken() {
    return localStorage.getItem("token");
  }
  isAuthenticated() {
    return !!this.getToken();
  }
  hasRole(role) {
    const user = this.getCurrentUser();
    return user?.role === role;
  }
  getMe() {
    return this.http.get(`${this.apiUrl}/me`);
  }
  static {
    this.\u0275fac = function AuthService_Factory(t) {
      return new (t || _AuthService)(\u0275\u0275inject(HttpClient), \u0275\u0275inject(Router));
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _AuthService, factory: _AuthService.\u0275fac, providedIn: "root" });
  }
};

// src/app/shared/models/user.model.ts
var Role;
(function(Role2) {
  Role2["APPRENANT"] = "APPRENANT";
  Role2["FORMATEUR"] = "FORMATEUR";
  Role2["MENTOR"] = "MENTOR";
  Role2["ADMIN"] = "ADMIN";
})(Role || (Role = {}));

export {
  AuthService,
  Role
};
//# sourceMappingURL=chunk-C4YLIFQW.js.map

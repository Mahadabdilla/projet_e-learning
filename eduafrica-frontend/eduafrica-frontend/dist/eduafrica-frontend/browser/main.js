import {
  AuthService,
  Role
} from "./chunk-C4YLIFQW.js";
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
  bootstrapApplication,
  provideHttpClient,
  provideRouter,
  withInterceptors
} from "./chunk-MFYBW43V.js";
import {
  CommonModule,
  NgIf,
  inject,
  provideZoneChangeDetection,
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵdefineComponent,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate2
} from "./chunk-4RUIMXA5.js";

// src/app/core/guards/auth.guard.ts
var authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.isAuthenticated()) {
    return true;
  }
  router.navigate(["/login"]);
  return false;
};

// src/app/core/guards/role.guard.ts
var roleGuard = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const requiredRole = route.data["role"];
  const user = authService.getCurrentUser();
  if (user && user.role === requiredRole) {
    return true;
  }
  router.navigate(["/"]);
  return false;
};

// src/app/app.routes.ts
var routes = [
  {
    path: "",
    loadComponent: () => import("./chunk-HTIGSBJW.js").then((m) => m.LandingComponent)
  },
  {
    path: "login",
    loadComponent: () => import("./chunk-L2RG7PV5.js").then((m) => m.LoginComponent)
  },
  {
    path: "register",
    loadComponent: () => import("./chunk-3FJK3FGE.js").then((m) => m.RegisterComponent)
  },
  {
    path: "formations",
    loadComponent: () => import("./chunk-REWQSNX7.js").then((m) => m.FormationsComponent)
  },
  {
    path: "formations/:id",
    loadComponent: () => import("./chunk-6FQSVDVT.js").then((m) => m.FormationDetailComponent)
  },
  {
    path: "mentors",
    loadComponent: () => import("./chunk-B3JWNGQH.js").then((m) => m.MentorsComponent)
  },
  {
    path: "about",
    loadComponent: () => import("./chunk-J4CCFTX4.js").then((m) => m.AboutComponent)
  },
  {
    path: "contact",
    loadComponent: () => import("./chunk-SKIEZ6JF.js").then((m) => m.ContactComponent)
  },
  {
    path: "dashboard/apprenant",
    canActivate: [authGuard, roleGuard],
    data: { role: Role.APPRENANT },
    loadComponent: () => import("./chunk-ZWUXIB7T.js").then((m) => m.ApprenantDashboardComponent)
  },
  {
    path: "dashboard/formateur",
    canActivate: [authGuard, roleGuard],
    data: { role: Role.FORMATEUR },
    loadComponent: () => import("./chunk-GFFTIXLB.js").then((m) => m.FormateurDashboardComponent)
  },
  {
    path: "dashboard/mentor",
    canActivate: [authGuard, roleGuard],
    data: { role: Role.MENTOR },
    loadComponent: () => import("./chunk-I7DVEDYC.js").then((m) => m.MentorDashboardComponent)
  },
  {
    path: "dashboard/admin",
    canActivate: [authGuard, roleGuard],
    data: { role: Role.ADMIN },
    loadComponent: () => import("./chunk-OAZCDPBS.js").then((m) => m.AdminDashboardComponent)
  },
  {
    path: "**",
    redirectTo: ""
  }
];

// src/app/core/interceptors/auth.interceptor.ts
var authInterceptor = (req, next) => {
  const token = localStorage.getItem("token");
  if (token) {
    const cloned = req.clone({
      headers: req.headers.set("Authorization", `Bearer ${token}`)
    });
    return next(cloned);
  }
  return next(req);
};

// src/app/app.config.ts
var appConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
};

// src/app/shared/components/navbar/navbar.component.ts
function NavbarComponent_div_20_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 15)(1, "a", 16);
    \u0275\u0275listener("click", function NavbarComponent_div_20_Template_a_click_1_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.isMenuOpen = false);
    });
    \u0275\u0275text(2, " Se connecter ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "a", 17);
    \u0275\u0275listener("click", function NavbarComponent_div_20_Template_a_click_3_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.isMenuOpen = false);
    });
    \u0275\u0275text(4, " S'inscrire ");
    \u0275\u0275elementEnd()();
  }
}
function NavbarComponent_div_21_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 18)(1, "a", 19);
    \u0275\u0275listener("click", function NavbarComponent_div_21_Template_a_click_1_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.isMenuOpen = false);
    });
    \u0275\u0275text(2, " \u{1F4CA} Dashboard ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 20)(4, "button", 21)(5, "span", 22);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "span", 23);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "div", 24)(10, "div", 25)(11, "strong");
    \u0275\u0275text(12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "span", 26);
    \u0275\u0275text(14);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "a", 27);
    \u0275\u0275text(16, " \u{1F4CA} Mon Dashboard ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "a", 28);
    \u0275\u0275text(18, " \u{1F464} Mon Profil ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "button", 29);
    \u0275\u0275listener("click", function NavbarComponent_div_21_Template_button_click_19_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.logout());
    });
    \u0275\u0275text(20, " \u{1F6AA} D\xE9connexion ");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("routerLink", ctx_r1.getDashboardRoute());
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate2("", ctx_r1.currentUser.firstName.charAt(0), "", ctx_r1.currentUser.lastName.charAt(0), "");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.currentUser.firstName);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate2("", ctx_r1.currentUser.firstName, " ", ctx_r1.currentUser.lastName, "");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.currentUser.role);
    \u0275\u0275advance();
    \u0275\u0275property("routerLink", ctx_r1.getDashboardRoute());
  }
}
var NavbarComponent = class _NavbarComponent {
  constructor(authService, router) {
    this.authService = authService;
    this.router = router;
    this.currentUser = null;
    this.isMenuOpen = false;
    this.Role = Role;
  }
  ngOnInit() {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
  }
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  logout() {
    this.authService.logout();
    this.isMenuOpen = false;
  }
  getDashboardRoute() {
    if (!this.currentUser)
      return "/";
    switch (this.currentUser.role) {
      case Role.APPRENANT:
        return "/dashboard/apprenant";
      case Role.FORMATEUR:
        return "/dashboard/formateur";
      case Role.MENTOR:
        return "/dashboard/mentor";
      case Role.ADMIN:
        return "/dashboard/admin";
      default:
        return "/";
    }
  }
  static {
    this.\u0275fac = function NavbarComponent_Factory(t) {
      return new (t || _NavbarComponent)(\u0275\u0275directiveInject(AuthService), \u0275\u0275directiveInject(Router));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _NavbarComponent, selectors: [["app-navbar"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 22, vars: 4, consts: [[1, "navbar"], [1, "container"], [1, "navbar-content"], ["routerLink", "/", 1, "logo"], [1, "logo-icon"], [1, "logo-text"], [1, "mobile-menu-btn", 3, "click"], [1, "menu-icon"], [1, "nav-links"], ["routerLink", "/formations", "routerLinkActive", "active", 3, "click"], ["routerLink", "/mentors", "routerLinkActive", "active", 3, "click"], ["routerLink", "/about", "routerLinkActive", "active", 3, "click"], ["routerLink", "/contact", "routerLinkActive", "active", 3, "click"], ["class", "nav-actions", 4, "ngIf"], ["class", "nav-user", 4, "ngIf"], [1, "nav-actions"], ["routerLink", "/login", 1, "btn", "btn-outline", 3, "click"], ["routerLink", "/register", 1, "btn", "btn-primary", 3, "click"], [1, "nav-user"], [1, "btn", "btn-outline", 3, "click", "routerLink"], [1, "user-menu"], [1, "user-btn"], [1, "user-avatar"], [1, "user-name"], [1, "user-dropdown"], [1, "user-info"], [1, "user-role"], [1, "dropdown-item", 3, "routerLink"], ["routerLink", "/profile", 1, "dropdown-item"], [1, "dropdown-item", "logout", 3, "click"]], template: function NavbarComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "nav", 0)(1, "div", 1)(2, "div", 2)(3, "a", 3)(4, "span", 4);
        \u0275\u0275text(5, "\u{1F393}");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(6, "span", 5);
        \u0275\u0275text(7, "EduAfrica");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(8, "button", 6);
        \u0275\u0275listener("click", function NavbarComponent_Template_button_click_8_listener() {
          return ctx.toggleMenu();
        });
        \u0275\u0275elementStart(9, "span", 7);
        \u0275\u0275text(10, "\u2630");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(11, "div", 8)(12, "a", 9);
        \u0275\u0275listener("click", function NavbarComponent_Template_a_click_12_listener() {
          return ctx.isMenuOpen = false;
        });
        \u0275\u0275text(13, " Formations ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(14, "a", 10);
        \u0275\u0275listener("click", function NavbarComponent_Template_a_click_14_listener() {
          return ctx.isMenuOpen = false;
        });
        \u0275\u0275text(15, " Mentors ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(16, "a", 11);
        \u0275\u0275listener("click", function NavbarComponent_Template_a_click_16_listener() {
          return ctx.isMenuOpen = false;
        });
        \u0275\u0275text(17, " \xC0 propos ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(18, "a", 12);
        \u0275\u0275listener("click", function NavbarComponent_Template_a_click_18_listener() {
          return ctx.isMenuOpen = false;
        });
        \u0275\u0275text(19, " Contact ");
        \u0275\u0275elementEnd();
        \u0275\u0275template(20, NavbarComponent_div_20_Template, 5, 0, "div", 13)(21, NavbarComponent_div_21_Template, 21, 8, "div", 14);
        \u0275\u0275elementEnd()()()();
      }
      if (rf & 2) {
        \u0275\u0275advance(11);
        \u0275\u0275classProp("active", ctx.isMenuOpen);
        \u0275\u0275advance(9);
        \u0275\u0275property("ngIf", !ctx.currentUser);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.currentUser);
      }
    }, dependencies: [CommonModule, NgIf, RouterLink, RouterLinkActive], styles: ['\n\n.navbar[_ngcontent-%COMP%] {\n  background: white;\n  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);\n  position: sticky;\n  top: 0;\n  z-index: 1000;\n}\n.container[_ngcontent-%COMP%] {\n  max-width: 1400px;\n  margin: 0 auto;\n  padding: 0 20px;\n}\n.navbar-content[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  height: 70px;\n}\n.logo[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  text-decoration: none;\n  font-weight: 800;\n  font-size: 1.5rem;\n  color: #333;\n}\n.logo-icon[_ngcontent-%COMP%] {\n  font-size: 2rem;\n}\n.logo-text[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #667eea 0%,\n      #764ba2 100%);\n  -webkit-background-clip: text;\n  -webkit-text-fill-color: transparent;\n  background-clip: text;\n}\n.mobile-menu-btn[_ngcontent-%COMP%] {\n  display: none;\n  background: none;\n  border: none;\n  font-size: 1.5rem;\n  cursor: pointer;\n  color: #333;\n}\n.nav-links[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 30px;\n}\n.nav-links[_ngcontent-%COMP%]    > a[_ngcontent-%COMP%] {\n  text-decoration: none;\n  color: #666;\n  font-weight: 600;\n  font-size: 0.95rem;\n  transition: color 0.3s ease;\n  position: relative;\n}\n.nav-links[_ngcontent-%COMP%]    > a[_ngcontent-%COMP%]:hover, .nav-links[_ngcontent-%COMP%]    > a.active[_ngcontent-%COMP%] {\n  color: #667eea;\n}\n.nav-links[_ngcontent-%COMP%]    > a.active[_ngcontent-%COMP%]::after {\n  content: "";\n  position: absolute;\n  bottom: -8px;\n  left: 0;\n  right: 0;\n  height: 3px;\n  background:\n    linear-gradient(\n      135deg,\n      #667eea 0%,\n      #764ba2 100%);\n  border-radius: 2px;\n}\n.nav-actions[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 15px;\n}\n.btn[_ngcontent-%COMP%] {\n  padding: 10px 20px;\n  border-radius: 8px;\n  font-weight: 600;\n  font-size: 0.9rem;\n  text-decoration: none;\n  transition: all 0.3s ease;\n  border: none;\n  cursor: pointer;\n  display: inline-block;\n}\n.btn-outline[_ngcontent-%COMP%] {\n  background: transparent;\n  border: 2px solid #667eea;\n  color: #667eea;\n}\n.btn-outline[_ngcontent-%COMP%]:hover {\n  background: #667eea;\n  color: white;\n}\n.btn-primary[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #667eea 0%,\n      #764ba2 100%);\n  color: white;\n}\n.btn-primary[_ngcontent-%COMP%]:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);\n}\n.nav-user[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 15px;\n}\n.user-menu[_ngcontent-%COMP%] {\n  position: relative;\n}\n.user-btn[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  background: none;\n  border: none;\n  cursor: pointer;\n  padding: 8px 12px;\n  border-radius: 8px;\n  transition: all 0.3s ease;\n}\n.user-btn[_ngcontent-%COMP%]:hover {\n  background: #f0f0f0;\n}\n.user-avatar[_ngcontent-%COMP%] {\n  width: 40px;\n  height: 40px;\n  border-radius: 50%;\n  background:\n    linear-gradient(\n      135deg,\n      #667eea 0%,\n      #764ba2 100%);\n  color: white;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-weight: 700;\n  font-size: 0.9rem;\n}\n.user-name[_ngcontent-%COMP%] {\n  font-weight: 600;\n  color: #333;\n}\n.user-dropdown[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 100%;\n  right: 0;\n  margin-top: 10px;\n  background: white;\n  border-radius: 12px;\n  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);\n  min-width: 220px;\n  opacity: 0;\n  visibility: hidden;\n  transform: translateY(-10px);\n  transition: all 0.3s ease;\n  z-index: 100;\n}\n.user-menu[_ngcontent-%COMP%]:hover   .user-dropdown[_ngcontent-%COMP%] {\n  opacity: 1;\n  visibility: visible;\n  transform: translateY(0);\n}\n.user-info[_ngcontent-%COMP%] {\n  padding: 20px;\n  border-bottom: 1px solid #e0e0e0;\n}\n.user-info[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  display: block;\n  color: #333;\n  margin-bottom: 5px;\n}\n.user-role[_ngcontent-%COMP%] {\n  display: inline-block;\n  background: #e3f2fd;\n  color: #1976d2;\n  padding: 3px 10px;\n  border-radius: 12px;\n  font-size: 0.75rem;\n  font-weight: 600;\n  text-transform: uppercase;\n}\n.dropdown-item[_ngcontent-%COMP%] {\n  display: block;\n  padding: 12px 20px;\n  color: #666;\n  text-decoration: none;\n  font-size: 0.95rem;\n  transition: all 0.3s ease;\n  background: none;\n  border: none;\n  width: 100%;\n  text-align: left;\n  cursor: pointer;\n}\n.dropdown-item[_ngcontent-%COMP%]:hover {\n  background: #f8f9fa;\n  color: #667eea;\n}\n.dropdown-item.logout[_ngcontent-%COMP%] {\n  color: #e74c3c;\n  border-top: 1px solid #e0e0e0;\n}\n.dropdown-item.logout[_ngcontent-%COMP%]:hover {\n  background: #fee;\n  color: #c0392b;\n}\n@media (max-width: 768px) {\n  .mobile-menu-btn[_ngcontent-%COMP%] {\n    display: block;\n  }\n  .nav-links[_ngcontent-%COMP%] {\n    position: fixed;\n    top: 70px;\n    left: 0;\n    right: 0;\n    background: white;\n    flex-direction: column;\n    gap: 0;\n    padding: 20px;\n    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);\n    transform: translateX(-100%);\n    transition: transform 0.3s ease;\n  }\n  .nav-links.active[_ngcontent-%COMP%] {\n    transform: translateX(0);\n  }\n  .nav-links[_ngcontent-%COMP%]    > a[_ngcontent-%COMP%] {\n    width: 100%;\n    padding: 15px;\n    border-bottom: 1px solid #e0e0e0;\n  }\n  .nav-actions[_ngcontent-%COMP%] {\n    width: 100%;\n    flex-direction: column;\n    padding-top: 15px;\n  }\n  .nav-actions[_ngcontent-%COMP%]   .btn[_ngcontent-%COMP%] {\n    width: 100%;\n    text-align: center;\n  }\n  .nav-user[_ngcontent-%COMP%] {\n    width: 100%;\n    flex-direction: column;\n    padding-top: 15px;\n  }\n  .user-menu[_ngcontent-%COMP%] {\n    width: 100%;\n  }\n  .user-btn[_ngcontent-%COMP%] {\n    width: 100%;\n    justify-content: center;\n  }\n  .user-dropdown[_ngcontent-%COMP%] {\n    position: static;\n    opacity: 1;\n    visibility: visible;\n    transform: none;\n    box-shadow: none;\n    margin-top: 15px;\n    border: 1px solid #e0e0e0;\n  }\n}\n/*# sourceMappingURL=navbar.component.css.map */'] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(NavbarComponent, { className: "NavbarComponent", filePath: "src\\app\\shared\\components\\navbar\\navbar.component.ts", lineNumber: 14 });
})();

// src/app/app.component.ts
var AppComponent = class _AppComponent {
  constructor() {
    this.title = "EduAfrica";
  }
  static {
    this.\u0275fac = function AppComponent_Factory(t) {
      return new (t || _AppComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AppComponent, selectors: [["app-root"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 2, vars: 0, template: function AppComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275element(0, "app-navbar")(1, "router-outlet");
      }
    }, dependencies: [RouterOutlet, NavbarComponent], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n  min-height: 100vh;\n}\n/*# sourceMappingURL=app.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AppComponent, { className: "AppComponent", filePath: "src\\app\\app.component.ts", lineNumber: 20 });
})();

// src/main.ts
bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
//# sourceMappingURL=main.js.map

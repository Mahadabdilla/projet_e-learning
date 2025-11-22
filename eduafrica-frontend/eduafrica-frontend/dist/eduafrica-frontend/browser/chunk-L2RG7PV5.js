import {
  DefaultValueAccessor,
  FormBuilder,
  FormControlName,
  FormGroupDirective,
  NgControlStatus,
  NgControlStatusGroup,
  ReactiveFormsModule,
  Validators,
  ɵNgNoValidate
} from "./chunk-W3JXI35C.js";
import {
  AuthService,
  Role
} from "./chunk-C4YLIFQW.js";
import {
  Router,
  RouterLink
} from "./chunk-MFYBW43V.js";
import {
  CommonModule,
  NgIf,
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵdefineComponent,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate1
} from "./chunk-4RUIMXA5.js";

// src/app/features/auth/login.component.ts
function LoginComponent_div_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 17);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.errorMessage, " ");
  }
}
function LoginComponent_span_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "Se connecter");
    \u0275\u0275elementEnd();
  }
}
function LoginComponent_span_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "Connexion...");
    \u0275\u0275elementEnd();
  }
}
var LoginComponent = class _LoginComponent {
  constructor(fb, authService, router) {
    this.fb = fb;
    this.authService = authService;
    this.router = router;
    this.errorMessage = "";
    this.isLoading = false;
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required]]
    });
  }
  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = "";
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.role === Role.APPRENANT) {
            this.router.navigate(["/dashboard/apprenant"]);
          } else if (response.role === Role.FORMATEUR) {
            this.router.navigate(["/dashboard/formateur"]);
          } else if (response.role === Role.MENTOR) {
            this.router.navigate(["/dashboard/mentor"]);
          } else if (response.role === Role.ADMIN) {
            this.router.navigate(["/dashboard/admin"]);
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = "Email ou mot de passe incorrect";
        }
      });
    }
  }
  static {
    this.\u0275fac = function LoginComponent_Factory(t) {
      return new (t || _LoginComponent)(\u0275\u0275directiveInject(FormBuilder), \u0275\u0275directiveInject(AuthService), \u0275\u0275directiveInject(Router));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _LoginComponent, selectors: [["app-login"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 25, vars: 5, consts: [[1, "login-page"], [1, "login-container"], [1, "login-card"], [1, "login-header"], [1, "login-title"], [1, "login-subtitle"], [1, "login-form", 3, "ngSubmit", "formGroup"], ["class", "alert alert-error", 4, "ngIf"], [1, "form-group"], ["for", "email"], ["type", "email", "id", "email", "formControlName", "email", "placeholder", "votre@email.com", 1, "form-control"], ["for", "password"], ["type", "password", "id", "password", "formControlName", "password", "placeholder", "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", 1, "form-control"], ["type", "submit", 1, "btn", "btn-primary", "btn-block", 3, "disabled"], [4, "ngIf"], [1, "register-link"], ["routerLink", "/register"], [1, "alert", "alert-error"]], template: function LoginComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "h1", 4);
        \u0275\u0275text(5, "Connexion");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(6, "p", 5);
        \u0275\u0275text(7, "Bienvenue sur EduAfrica");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(8, "form", 6);
        \u0275\u0275listener("ngSubmit", function LoginComponent_Template_form_ngSubmit_8_listener() {
          return ctx.onSubmit();
        });
        \u0275\u0275template(9, LoginComponent_div_9_Template, 2, 1, "div", 7);
        \u0275\u0275elementStart(10, "div", 8)(11, "label", 9);
        \u0275\u0275text(12, "Email");
        \u0275\u0275elementEnd();
        \u0275\u0275element(13, "input", 10);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(14, "div", 8)(15, "label", 11);
        \u0275\u0275text(16, "Mot de passe");
        \u0275\u0275elementEnd();
        \u0275\u0275element(17, "input", 12);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(18, "button", 13);
        \u0275\u0275template(19, LoginComponent_span_19_Template, 2, 0, "span", 14)(20, LoginComponent_span_20_Template, 2, 0, "span", 14);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(21, "p", 15);
        \u0275\u0275text(22, " Pas encore de compte ? ");
        \u0275\u0275elementStart(23, "a", 16);
        \u0275\u0275text(24, "Cr\xE9er un compte");
        \u0275\u0275elementEnd()()()()()();
      }
      if (rf & 2) {
        \u0275\u0275advance(8);
        \u0275\u0275property("formGroup", ctx.loginForm);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.errorMessage);
        \u0275\u0275advance(9);
        \u0275\u0275property("disabled", ctx.isLoading || ctx.loginForm.invalid);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", !ctx.isLoading);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.isLoading);
      }
    }, dependencies: [CommonModule, NgIf, ReactiveFormsModule, \u0275NgNoValidate, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, FormGroupDirective, FormControlName, RouterLink], styles: ["\n\n.login-page[_ngcontent-%COMP%] {\n  min-height: 100vh;\n  background:\n    linear-gradient(\n      135deg,\n      #667eea 0%,\n      #764ba2 100%);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 40px 20px;\n}\n.login-container[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: 450px;\n}\n.login-card[_ngcontent-%COMP%] {\n  background: white;\n  border-radius: 16px;\n  padding: 40px;\n  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);\n}\n.login-header[_ngcontent-%COMP%] {\n  text-align: center;\n  margin-bottom: 30px;\n}\n.login-title[_ngcontent-%COMP%] {\n  font-size: 2rem;\n  font-weight: 800;\n  color: #333;\n  margin-bottom: 10px;\n}\n.login-subtitle[_ngcontent-%COMP%] {\n  color: #666;\n}\n.form-group[_ngcontent-%COMP%] {\n  margin-bottom: 20px;\n}\n.form-group[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  display: block;\n  font-weight: 600;\n  margin-bottom: 8px;\n  color: #333;\n}\n.form-control[_ngcontent-%COMP%] {\n  width: 100%;\n  padding: 12px 16px;\n  border: 2px solid #e0e0e0;\n  border-radius: 8px;\n  font-size: 1rem;\n}\n.form-control[_ngcontent-%COMP%]:focus {\n  outline: none;\n  border-color: #667eea;\n}\n.btn-primary[_ngcontent-%COMP%] {\n  width: 100%;\n  background:\n    linear-gradient(\n      135deg,\n      #667eea 0%,\n      #764ba2 100%);\n  color: white;\n  padding: 14px;\n  border: none;\n  border-radius: 8px;\n  font-size: 1rem;\n  font-weight: 600;\n  cursor: pointer;\n  margin-top: 10px;\n}\n.btn-primary[_ngcontent-%COMP%]:hover:not(:disabled) {\n  transform: translateY(-2px);\n}\n.btn-primary[_ngcontent-%COMP%]:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n.register-link[_ngcontent-%COMP%] {\n  text-align: center;\n  margin-top: 20px;\n  color: #666;\n}\n.register-link[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n  color: #667eea;\n  font-weight: 600;\n  text-decoration: none;\n}\n.alert-error[_ngcontent-%COMP%] {\n  background: #fee;\n  color: #c00;\n  padding: 12px;\n  border-radius: 8px;\n  margin-bottom: 20px;\n}\n/*# sourceMappingURL=login.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(LoginComponent, { className: "LoginComponent", filePath: "src\\app\\features\\auth\\login.component.ts", lineNumber: 15 });
})();
export {
  LoginComponent
};
//# sourceMappingURL=chunk-L2RG7PV5.js.map

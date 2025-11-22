import {
  CheckboxControlValueAccessor,
  DefaultValueAccessor,
  FormBuilder,
  FormControlName,
  FormGroupDirective,
  NgControlStatus,
  NgControlStatusGroup,
  NgSelectOption,
  ReactiveFormsModule,
  SelectControlValueAccessor,
  Validators,
  ɵNgNoValidate,
  ɵNgSelectMultipleOption
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
  NgForOf,
  NgIf,
  __objRest,
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
  ɵɵtextInterpolate
} from "./chunk-4RUIMXA5.js";

// src/app/features/auth/register.component.ts
function RegisterComponent_div_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 24);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.errorMessage);
  }
}
function RegisterComponent_option_34_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 25);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const country_r2 = ctx.$implicit;
    \u0275\u0275property("value", country_r2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(country_r2);
  }
}
function RegisterComponent_option_39_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 25);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const role_r3 = ctx.$implicit;
    \u0275\u0275property("value", role_r3.value);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(role_r3.label);
  }
}
function RegisterComponent_span_55_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "Cr\xE9er mon compte");
    \u0275\u0275elementEnd();
  }
}
function RegisterComponent_span_56_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "Inscription...");
    \u0275\u0275elementEnd();
  }
}
var RegisterComponent = class _RegisterComponent {
  constructor(fb, authService, router) {
    this.fb = fb;
    this.authService = authService;
    this.router = router;
    this.errorMessage = "";
    this.isLoading = false;
    this.roles = [
      { value: Role.APPRENANT, label: "Apprenant" },
      { value: Role.FORMATEUR, label: "Formateur" },
      { value: Role.MENTOR, label: "Mentor" }
    ];
    this.countries = [
      "S\xE9n\xE9gal",
      "C\xF4te d'Ivoire",
      "Mali",
      "Burkina Faso",
      "Niger",
      "B\xE9nin",
      "Togo",
      "Guin\xE9e",
      "Cameroun",
      "Ghana",
      "Nigeria",
      "RDC",
      "Madagascar",
      "Maroc",
      "Tunisie",
      "Alg\xE9rie",
      "Autre"
    ];
    this.registerForm = this.fb.group({
      firstName: ["", [Validators.required]],
      lastName: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      phone: ["", [Validators.required]],
      country: ["", [Validators.required]],
      role: [Role.APPRENANT, [Validators.required]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      confirmPassword: ["", [Validators.required]],
      acceptTerms: [false, [Validators.requiredTrue]]
    });
  }
  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = "";
      const _a = this.registerForm.value, { confirmPassword, acceptTerms } = _a, registerData = __objRest(_a, ["confirmPassword", "acceptTerms"]);
      this.authService.register(registerData).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.role === Role.APPRENANT) {
            this.router.navigate(["/dashboard/apprenant"]);
          } else if (response.role === Role.FORMATEUR) {
            this.router.navigate(["/dashboard/formateur"]);
          } else if (response.role === Role.MENTOR) {
            this.router.navigate(["/dashboard/mentor"]);
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = "Une erreur est survenue";
        }
      });
    }
  }
  static {
    this.\u0275fac = function RegisterComponent_Factory(t) {
      return new (t || _RegisterComponent)(\u0275\u0275directiveInject(FormBuilder), \u0275\u0275directiveInject(AuthService), \u0275\u0275directiveInject(Router));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _RegisterComponent, selectors: [["app-register"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 61, vars: 7, consts: [[1, "register-page"], [1, "register-container"], [1, "register-card"], [1, "register-header"], [3, "ngSubmit", "formGroup"], ["class", "alert alert-error", 4, "ngIf"], [1, "form-row"], [1, "form-group"], ["type", "text", "formControlName", "firstName", 1, "form-control"], ["type", "text", "formControlName", "lastName", 1, "form-control"], ["type", "email", "formControlName", "email", 1, "form-control"], ["type", "tel", "formControlName", "phone", 1, "form-control"], ["formControlName", "country", 1, "form-control"], ["value", ""], [3, "value", 4, "ngFor", "ngForOf"], ["formControlName", "role", 1, "form-control"], ["type", "password", "formControlName", "password", 1, "form-control"], ["type", "password", "formControlName", "confirmPassword", 1, "form-control"], [1, "checkbox-label"], ["type", "checkbox", "formControlName", "acceptTerms"], ["type", "submit", 1, "btn", "btn-primary", 3, "disabled"], [4, "ngIf"], [1, "login-link"], ["routerLink", "/login"], [1, "alert", "alert-error"], [3, "value"]], template: function RegisterComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "h1");
        \u0275\u0275text(5, "Cr\xE9er un compte");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(6, "p");
        \u0275\u0275text(7, "Rejoignez EduAfrica");
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(8, "form", 4);
        \u0275\u0275listener("ngSubmit", function RegisterComponent_Template_form_ngSubmit_8_listener() {
          return ctx.onSubmit();
        });
        \u0275\u0275template(9, RegisterComponent_div_9_Template, 2, 1, "div", 5);
        \u0275\u0275elementStart(10, "div", 6)(11, "div", 7)(12, "label");
        \u0275\u0275text(13, "Pr\xE9nom *");
        \u0275\u0275elementEnd();
        \u0275\u0275element(14, "input", 8);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(15, "div", 7)(16, "label");
        \u0275\u0275text(17, "Nom *");
        \u0275\u0275elementEnd();
        \u0275\u0275element(18, "input", 9);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(19, "div", 7)(20, "label");
        \u0275\u0275text(21, "Email *");
        \u0275\u0275elementEnd();
        \u0275\u0275element(22, "input", 10);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(23, "div", 6)(24, "div", 7)(25, "label");
        \u0275\u0275text(26, "T\xE9l\xE9phone *");
        \u0275\u0275elementEnd();
        \u0275\u0275element(27, "input", 11);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(28, "div", 7)(29, "label");
        \u0275\u0275text(30, "Pays *");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(31, "select", 12)(32, "option", 13);
        \u0275\u0275text(33, "S\xE9lectionnez");
        \u0275\u0275elementEnd();
        \u0275\u0275template(34, RegisterComponent_option_34_Template, 2, 2, "option", 14);
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(35, "div", 7)(36, "label");
        \u0275\u0275text(37, "Je suis *");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(38, "select", 15);
        \u0275\u0275template(39, RegisterComponent_option_39_Template, 2, 2, "option", 14);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(40, "div", 6)(41, "div", 7)(42, "label");
        \u0275\u0275text(43, "Mot de passe *");
        \u0275\u0275elementEnd();
        \u0275\u0275element(44, "input", 16);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(45, "div", 7)(46, "label");
        \u0275\u0275text(47, "Confirmer *");
        \u0275\u0275elementEnd();
        \u0275\u0275element(48, "input", 17);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(49, "div", 7)(50, "label", 18);
        \u0275\u0275element(51, "input", 19);
        \u0275\u0275elementStart(52, "span");
        \u0275\u0275text(53, "J'accepte les conditions");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(54, "button", 20);
        \u0275\u0275template(55, RegisterComponent_span_55_Template, 2, 0, "span", 21)(56, RegisterComponent_span_56_Template, 2, 0, "span", 21);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(57, "p", 22);
        \u0275\u0275text(58, " D\xE9j\xE0 un compte ? ");
        \u0275\u0275elementStart(59, "a", 23);
        \u0275\u0275text(60, "Se connecter");
        \u0275\u0275elementEnd()()()()()();
      }
      if (rf & 2) {
        \u0275\u0275advance(8);
        \u0275\u0275property("formGroup", ctx.registerForm);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.errorMessage);
        \u0275\u0275advance(25);
        \u0275\u0275property("ngForOf", ctx.countries);
        \u0275\u0275advance(5);
        \u0275\u0275property("ngForOf", ctx.roles);
        \u0275\u0275advance(15);
        \u0275\u0275property("disabled", ctx.isLoading || ctx.registerForm.invalid);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", !ctx.isLoading);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.isLoading);
      }
    }, dependencies: [CommonModule, NgForOf, NgIf, ReactiveFormsModule, \u0275NgNoValidate, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, CheckboxControlValueAccessor, SelectControlValueAccessor, NgControlStatus, NgControlStatusGroup, FormGroupDirective, FormControlName, RouterLink], styles: ["\n\n.register-page[_ngcontent-%COMP%] {\n  min-height: 100vh;\n  background:\n    linear-gradient(\n      135deg,\n      #667eea 0%,\n      #764ba2 100%);\n  display: flex;\n  align-items: center;\n  padding: 40px 20px;\n}\n.register-container[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: 600px;\n  margin: 0 auto;\n}\n.register-card[_ngcontent-%COMP%] {\n  background: white;\n  border-radius: 16px;\n  padding: 40px;\n  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);\n}\n.register-header[_ngcontent-%COMP%] {\n  text-align: center;\n  margin-bottom: 30px;\n}\n.register-header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  font-size: 2rem;\n  font-weight: 800;\n  margin-bottom: 10px;\n}\n.form-row[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 15px;\n}\n.form-group[_ngcontent-%COMP%] {\n  margin-bottom: 15px;\n}\n.form-group[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  display: block;\n  font-weight: 600;\n  margin-bottom: 8px;\n}\n.form-control[_ngcontent-%COMP%] {\n  width: 100%;\n  padding: 12px;\n  border: 2px solid #e0e0e0;\n  border-radius: 8px;\n}\n.checkbox-label[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n}\n.btn-primary[_ngcontent-%COMP%] {\n  width: 100%;\n  background:\n    linear-gradient(\n      135deg,\n      #667eea 0%,\n      #764ba2 100%);\n  color: white;\n  padding: 14px;\n  border: none;\n  border-radius: 8px;\n  font-weight: 600;\n  cursor: pointer;\n  margin-top: 10px;\n}\n.btn-primary[_ngcontent-%COMP%]:disabled {\n  opacity: 0.6;\n}\n.login-link[_ngcontent-%COMP%] {\n  text-align: center;\n  margin-top: 20px;\n}\n.login-link[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n  color: #667eea;\n  font-weight: 600;\n}\n.alert-error[_ngcontent-%COMP%] {\n  background: #fee;\n  color: #c00;\n  padding: 12px;\n  border-radius: 8px;\n  margin-bottom: 20px;\n}\n@media (max-width: 768px) {\n  .form-row[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n/*# sourceMappingURL=register.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(RegisterComponent, { className: "RegisterComponent", filePath: "src\\app\\features\\auth\\register.component.ts", lineNumber: 15 });
})();
export {
  RegisterComponent
};
//# sourceMappingURL=chunk-3FJK3FGE.js.map

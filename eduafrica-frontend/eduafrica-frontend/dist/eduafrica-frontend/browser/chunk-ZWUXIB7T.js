import {
  HttpClient,
  RouterLink
} from "./chunk-MFYBW43V.js";
import {
  CommonModule,
  NgForOf,
  NgIf,
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵdefineComponent,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵpropertyInterpolate1,
  ɵɵstyleProp,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2
} from "./chunk-4RUIMXA5.js";

// src/app/features/dashboard/apprenant/apprenant-dashboard.component.ts
function ApprenantDashboardComponent_div_47_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 16)(1, "p");
    \u0275\u0275text(2, "Chargement...");
    \u0275\u0275elementEnd()();
  }
}
function ApprenantDashboardComponent_div_48_div_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 19)(1, "div", 20)(2, "h3");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 21)(7, "div", 22);
    \u0275\u0275element(8, "div", 23);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "span", 24);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "button", 25);
    \u0275\u0275text(12, " Continuer ");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const enrollment_r1 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(enrollment_r1.formation.title);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", enrollment_r1.formation.formateur.firstName, " ", enrollment_r1.formation.formateur.lastName, "");
    \u0275\u0275advance(3);
    \u0275\u0275styleProp("width", enrollment_r1.progress, "%");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", enrollment_r1.progress, "%");
    \u0275\u0275advance();
    \u0275\u0275propertyInterpolate1("routerLink", "/formations/", enrollment_r1.formation.id, "");
  }
}
function ApprenantDashboardComponent_div_48_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 17);
    \u0275\u0275template(1, ApprenantDashboardComponent_div_48_div_1_Template, 13, 8, "div", 18);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r1.enrollments);
  }
}
function ApprenantDashboardComponent_div_49_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 26)(1, "div", 27);
    \u0275\u0275text(2, "\u{1F4DA}");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "h3");
    \u0275\u0275text(4, "Aucune formation en cours");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p");
    \u0275\u0275text(6, "Commencez votre apprentissage d\xE8s maintenant");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "a", 28);
    \u0275\u0275text(8, "Explorer les formations");
    \u0275\u0275elementEnd()();
  }
}
var ApprenantDashboardComponent = class _ApprenantDashboardComponent {
  constructor(http) {
    this.http = http;
    this.enrollments = [];
    this.isLoading = true;
    this.completedCourses = 0;
    this.totalHours = 0;
  }
  ngOnInit() {
    this.loadEnrollments();
  }
  loadEnrollments() {
    this.http.get("http://localhost:8080/api/enrollments/my-enrollments").subscribe({
      next: (data) => {
        this.enrollments = data;
        this.completedCourses = data.filter((e) => e.progress === 100).length;
        this.totalHours = data.reduce((sum, e) => sum + (e.formation.duration || 0), 0);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
  static {
    this.\u0275fac = function ApprenantDashboardComponent_Factory(t) {
      return new (t || _ApprenantDashboardComponent)(\u0275\u0275directiveInject(HttpClient));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ApprenantDashboardComponent, selectors: [["app-apprenant-dashboard"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 57, vars: 6, consts: [[1, "dashboard"], [1, "dashboard-header"], [1, "container"], [1, "container", "dashboard-content"], [1, "stats-grid"], [1, "stat-card"], [1, "stat-icon"], [1, "stat-info"], [1, "section"], [1, "section-header"], ["routerLink", "/formations", 1, "btn-link"], ["class", "loading", 4, "ngIf"], ["class", "formations-list", 4, "ngIf"], ["class", "empty-state", 4, "ngIf"], [1, "section-description"], ["routerLink", "/formations", 1, "btn", "btn-secondary"], [1, "loading"], [1, "formations-list"], ["class", "formation-item", 4, "ngFor", "ngForOf"], [1, "formation-item"], [1, "formation-info"], [1, "progress-section"], [1, "progress-bar"], [1, "progress-fill"], [1, "progress-text"], [1, "btn", "btn-primary", 3, "routerLink"], [1, "empty-state"], [1, "empty-icon"], ["routerLink", "/formations", 1, "btn", "btn-primary"]], template: function ApprenantDashboardComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "h1");
        \u0275\u0275text(4, "\u{1F4DA} Mon Espace Apprenant");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(5, "p");
        \u0275\u0275text(6, "Bienvenue dans votre tableau de bord");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(7, "div", 3)(8, "div", 4)(9, "div", 5)(10, "div", 6);
        \u0275\u0275text(11, "\u{1F4D6}");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(12, "div", 7)(13, "h3");
        \u0275\u0275text(14);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(15, "p");
        \u0275\u0275text(16, "Formations en cours");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(17, "div", 5)(18, "div", 6);
        \u0275\u0275text(19, "\u2705");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(20, "div", 7)(21, "h3");
        \u0275\u0275text(22);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(23, "p");
        \u0275\u0275text(24, "Formations termin\xE9es");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(25, "div", 5)(26, "div", 6);
        \u0275\u0275text(27, "\u{1F393}");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(28, "div", 7)(29, "h3");
        \u0275\u0275text(30, "0");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(31, "p");
        \u0275\u0275text(32, "Certificats obtenus");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(33, "div", 5)(34, "div", 6);
        \u0275\u0275text(35, "\u23F1\uFE0F");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(36, "div", 7)(37, "h3");
        \u0275\u0275text(38);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(39, "p");
        \u0275\u0275text(40, "Heures d'apprentissage");
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(41, "div", 8)(42, "div", 9)(43, "h2");
        \u0275\u0275text(44, "Mes Formations");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(45, "a", 10);
        \u0275\u0275text(46, "D\xE9couvrir plus \u2192");
        \u0275\u0275elementEnd()();
        \u0275\u0275template(47, ApprenantDashboardComponent_div_47_Template, 3, 0, "div", 11)(48, ApprenantDashboardComponent_div_48_Template, 2, 1, "div", 12)(49, ApprenantDashboardComponent_div_49_Template, 9, 0, "div", 13);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(50, "div", 8)(51, "h2");
        \u0275\u0275text(52, "Formations recommand\xE9es");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(53, "p", 14);
        \u0275\u0275text(54, "Bas\xE9es sur vos int\xE9r\xEAts");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(55, "a", 15);
        \u0275\u0275text(56, "Voir toutes les formations");
        \u0275\u0275elementEnd()()()();
      }
      if (rf & 2) {
        \u0275\u0275advance(14);
        \u0275\u0275textInterpolate(ctx.enrollments.length);
        \u0275\u0275advance(8);
        \u0275\u0275textInterpolate(ctx.completedCourses);
        \u0275\u0275advance(16);
        \u0275\u0275textInterpolate(ctx.totalHours);
        \u0275\u0275advance(9);
        \u0275\u0275property("ngIf", ctx.isLoading);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", !ctx.isLoading && ctx.enrollments.length > 0);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", !ctx.isLoading && ctx.enrollments.length === 0);
      }
    }, dependencies: [CommonModule, NgForOf, NgIf, RouterLink], styles: ["\n\n.dashboard[_ngcontent-%COMP%] {\n  min-height: 100vh;\n  background: #f8f9fa;\n}\n.dashboard-header[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #667eea 0%,\n      #764ba2 100%);\n  color: white;\n  padding: 60px 0;\n}\n.dashboard-header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  font-size: 2.5rem;\n  margin-bottom: 10px;\n}\n.dashboard-header[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  font-size: 1.1rem;\n  opacity: 0.9;\n}\n.dashboard-content[_ngcontent-%COMP%] {\n  padding: 40px 20px;\n}\n.stats-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n  gap: 20px;\n  margin-bottom: 40px;\n}\n.stat-card[_ngcontent-%COMP%] {\n  background: white;\n  padding: 30px;\n  border-radius: 12px;\n  display: flex;\n  gap: 20px;\n  align-items: center;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);\n}\n.stat-icon[_ngcontent-%COMP%] {\n  font-size: 3rem;\n  width: 70px;\n  height: 70px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  background:\n    linear-gradient(\n      135deg,\n      #667eea 0%,\n      #764ba2 100%);\n  border-radius: 12px;\n}\n.stat-info[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  font-size: 2rem;\n  color: #333;\n  margin-bottom: 5px;\n}\n.stat-info[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  color: #666;\n  font-size: 0.95rem;\n}\n.section[_ngcontent-%COMP%] {\n  background: white;\n  padding: 30px;\n  border-radius: 12px;\n  margin-bottom: 30px;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);\n}\n.section-header[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 25px;\n}\n.section[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  font-size: 1.75rem;\n  color: #333;\n  margin-bottom: 10px;\n}\n.section-description[_ngcontent-%COMP%] {\n  color: #666;\n  margin-bottom: 20px;\n}\n.btn-link[_ngcontent-%COMP%] {\n  color: #667eea;\n  font-weight: 600;\n  text-decoration: none;\n}\n.btn-link[_ngcontent-%COMP%]:hover {\n  text-decoration: underline;\n}\n.formations-list[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 20px;\n}\n.formation-item[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 2fr 1fr auto;\n  gap: 20px;\n  align-items: center;\n  padding: 20px;\n  border: 2px solid #e0e0e0;\n  border-radius: 12px;\n  transition: all 0.3s ease;\n}\n.formation-item[_ngcontent-%COMP%]:hover {\n  border-color: #667eea;\n  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);\n}\n.formation-info[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  font-size: 1.15rem;\n  color: #333;\n  margin-bottom: 5px;\n}\n.formation-info[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  color: #666;\n  font-size: 0.9rem;\n}\n.progress-section[_ngcontent-%COMP%] {\n  flex: 1;\n}\n.progress-bar[_ngcontent-%COMP%] {\n  height: 8px;\n  background: #e0e0e0;\n  border-radius: 4px;\n  overflow: hidden;\n  margin-bottom: 8px;\n}\n.progress-fill[_ngcontent-%COMP%] {\n  height: 100%;\n  background:\n    linear-gradient(\n      135deg,\n      #667eea 0%,\n      #764ba2 100%);\n  transition: width 0.3s ease;\n}\n.progress-text[_ngcontent-%COMP%] {\n  font-size: 0.85rem;\n  color: #666;\n  font-weight: 600;\n}\n.btn[_ngcontent-%COMP%] {\n  padding: 10px 20px;\n  border-radius: 8px;\n  font-weight: 600;\n  border: none;\n  cursor: pointer;\n  transition: all 0.3s ease;\n  text-decoration: none;\n  display: inline-block;\n}\n.btn-primary[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #667eea 0%,\n      #764ba2 100%);\n  color: white;\n}\n.btn-primary[_ngcontent-%COMP%]:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);\n}\n.btn-secondary[_ngcontent-%COMP%] {\n  background: transparent;\n  border: 2px solid #667eea;\n  color: #667eea;\n}\n.btn-secondary[_ngcontent-%COMP%]:hover {\n  background: #667eea;\n  color: white;\n}\n.empty-state[_ngcontent-%COMP%] {\n  text-align: center;\n  padding: 60px 20px;\n}\n.empty-icon[_ngcontent-%COMP%] {\n  font-size: 4rem;\n  margin-bottom: 20px;\n}\n.empty-state[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  font-size: 1.5rem;\n  color: #333;\n  margin-bottom: 10px;\n}\n.empty-state[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  color: #666;\n  margin-bottom: 25px;\n}\n.loading[_ngcontent-%COMP%] {\n  text-align: center;\n  padding: 40px;\n  color: #666;\n}\n@media (max-width: 768px) {\n  .formation-item[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .stats-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n/*# sourceMappingURL=apprenant-dashboard.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ApprenantDashboardComponent, { className: "ApprenantDashboardComponent", filePath: "src\\app\\features\\dashboard\\apprenant\\apprenant-dashboard.component.ts", lineNumber: 241 });
})();
export {
  ApprenantDashboardComponent
};
//# sourceMappingURL=chunk-ZWUXIB7T.js.map

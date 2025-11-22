import {
  HttpClient,
  HttpParams
} from "./chunk-MFYBW43V.js";
import {
  CommonModule,
  NgForOf,
  NgIf,
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdirectiveInject,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵinject,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-4RUIMXA5.js";

// src/app/core/services/formation.service.ts
var FormationService = class _FormationService {
  constructor(http) {
    this.http = http;
    this.apiUrl = "http://localhost:8080/api/formations";
  }
  getAllFormations(page = 0, size = 12) {
    const params = new HttpParams().set("page", page.toString()).set("size", size.toString());
    return this.http.get(this.apiUrl, { params });
  }
  getFormationById(id) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
  searchFormations(keyword, page = 0, size = 12) {
    const params = new HttpParams().set("keyword", keyword).set("page", page.toString()).set("size", size.toString());
    return this.http.get(`${this.apiUrl}/search`, { params });
  }
  filterFormations(filters, page = 0, size = 12) {
    let params = new HttpParams().set("page", page.toString()).set("size", size.toString());
    if (filters.category) {
      params = params.set("category", filters.category);
    }
    if (filters.level) {
      params = params.set("level", filters.level);
    }
    if (filters.isFree !== void 0) {
      params = params.set("isFree", filters.isFree.toString());
    }
    return this.http.get(`${this.apiUrl}/filter`, { params });
  }
  createFormation(formation) {
    return this.http.post(this.apiUrl, formation);
  }
  updateFormation(id, formation) {
    return this.http.put(`${this.apiUrl}/${id}`, formation);
  }
  deleteFormation(id) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  getMyFormations() {
    return this.http.get(`${this.apiUrl}/my-formations`);
  }
  static {
    this.\u0275fac = function FormationService_Factory(t) {
      return new (t || _FormationService)(\u0275\u0275inject(HttpClient));
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _FormationService, factory: _FormationService.\u0275fac, providedIn: "root" });
  }
};

// src/app/features/dashboard/formateur/formateur-dashboard.component.ts
function FormateurDashboardComponent_div_47_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 15)(1, "h3");
    \u0275\u0275text(2, "Nouvelle Formation");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p");
    \u0275\u0275text(4, "La cr\xE9ation de formations n\xE9cessite un formulaire complet. Contactez l'administrateur pour ajouter vos formations.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "button", 16);
    \u0275\u0275listener("click", function FormateurDashboardComponent_div_47_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.showCreateForm = false);
    });
    \u0275\u0275text(6, "Fermer");
    \u0275\u0275elementEnd()();
  }
}
function FormateurDashboardComponent_div_48_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 17)(1, "p");
    \u0275\u0275text(2, "Chargement...");
    \u0275\u0275elementEnd()();
  }
}
function FormateurDashboardComponent_div_49_div_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 20)(1, "div", 21)(2, "h3");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 22);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "p", 23);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "div", 24)(9, "div", 25)(10, "span", 26);
    \u0275\u0275text(11, "\u{1F465}");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "span");
    \u0275\u0275text(13);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "div", 25)(15, "span", 26);
    \u0275\u0275text(16, "\u2B50");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "span");
    \u0275\u0275text(18);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(19, "div", 25)(20, "span", 26);
    \u0275\u0275text(21, "\u23F1\uFE0F");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "span");
    \u0275\u0275text(23);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(24, "div", 27)(25, "button", 28);
    \u0275\u0275text(26, "Modifier");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "button", 29);
    \u0275\u0275text(28, "Supprimer");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const formation_r3 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(formation_r3.title);
    \u0275\u0275advance();
    \u0275\u0275classProp("free", formation_r3.isFree);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", formation_r3.isFree ? "Gratuit" : formation_r3.price + " FCFA", " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(formation_r3.category);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1("", formation_r3.nbStudents, " \xE9tudiants");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(formation_r3.averageRating);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("", formation_r3.duration, "h");
  }
}
function FormateurDashboardComponent_div_49_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 18);
    \u0275\u0275template(1, FormateurDashboardComponent_div_49_div_1_Template, 29, 8, "div", 19);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r1.myFormations);
  }
}
function FormateurDashboardComponent_div_50_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 30)(1, "div", 31);
    \u0275\u0275text(2, "\u{1F4DA}");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "h3");
    \u0275\u0275text(4, "Aucune formation cr\xE9\xE9e");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p");
    \u0275\u0275text(6, "Cr\xE9ez votre premi\xE8re formation pour commencer \xE0 enseigner");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "button", 10);
    \u0275\u0275listener("click", function FormateurDashboardComponent_div_50_Template_button_click_7_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.showCreateForm = true);
    });
    \u0275\u0275text(8, "Cr\xE9er une formation");
    \u0275\u0275elementEnd()();
  }
}
var FormateurDashboardComponent = class _FormateurDashboardComponent {
  constructor(formationService) {
    this.formationService = formationService;
    this.myFormations = [];
    this.isLoading = true;
    this.showCreateForm = false;
    this.totalStudents = 0;
    this.averageRating = 0;
    this.totalRevenue = 0;
  }
  ngOnInit() {
    this.loadMyFormations();
  }
  loadMyFormations() {
    this.formationService.getMyFormations().subscribe({
      next: (data) => {
        this.myFormations = data;
        this.totalStudents = data.reduce((sum, f) => sum + f.nbStudents, 0);
        this.averageRating = data.length > 0 ? data.reduce((sum, f) => sum + f.averageRating, 0) / data.length : 0;
        this.totalRevenue = data.reduce((sum, f) => sum + (f.isFree ? 0 : f.price * f.nbStudents), 0);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
  static {
    this.\u0275fac = function FormateurDashboardComponent_Factory(t) {
      return new (t || _FormateurDashboardComponent)(\u0275\u0275directiveInject(FormationService));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _FormateurDashboardComponent, selectors: [["app-formateur-dashboard"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 51, vars: 8, consts: [[1, "dashboard"], [1, "dashboard-header"], [1, "container"], [1, "container", "dashboard-content"], [1, "stats-grid"], [1, "stat-card"], [1, "stat-icon"], [1, "stat-info"], [1, "section"], [1, "section-header"], [1, "btn", "btn-primary", 3, "click"], ["class", "create-form", 4, "ngIf"], ["class", "loading", 4, "ngIf"], ["class", "formations-grid", 4, "ngIf"], ["class", "empty-state", 4, "ngIf"], [1, "create-form"], [1, "btn", "btn-secondary", 3, "click"], [1, "loading"], [1, "formations-grid"], ["class", "formation-card", 4, "ngFor", "ngForOf"], [1, "formation-card"], [1, "formation-header"], [1, "formation-price"], [1, "formation-category"], [1, "formation-stats"], [1, "stat"], [1, "icon"], [1, "formation-actions"], [1, "btn", "btn-outline"], [1, "btn", "btn-danger"], [1, "empty-state"], [1, "empty-icon"]], template: function FormateurDashboardComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "h1");
        \u0275\u0275text(4, "\u{1F468}\u200D\u{1F3EB} Espace Formateur");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(5, "p");
        \u0275\u0275text(6, "G\xE9rez vos formations et suivez vos \xE9tudiants");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(7, "div", 3)(8, "div", 4)(9, "div", 5)(10, "div", 6);
        \u0275\u0275text(11, "\u{1F4DA}");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(12, "div", 7)(13, "h3");
        \u0275\u0275text(14);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(15, "p");
        \u0275\u0275text(16, "Formations cr\xE9\xE9es");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(17, "div", 5)(18, "div", 6);
        \u0275\u0275text(19, "\u{1F465}");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(20, "div", 7)(21, "h3");
        \u0275\u0275text(22);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(23, "p");
        \u0275\u0275text(24, "\xC9tudiants inscrits");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(25, "div", 5)(26, "div", 6);
        \u0275\u0275text(27, "\u2B50");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(28, "div", 7)(29, "h3");
        \u0275\u0275text(30);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(31, "p");
        \u0275\u0275text(32, "Note moyenne");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(33, "div", 5)(34, "div", 6);
        \u0275\u0275text(35, "\u{1F4B0}");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(36, "div", 7)(37, "h3");
        \u0275\u0275text(38);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(39, "p");
        \u0275\u0275text(40, "Revenus estim\xE9s");
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(41, "div", 8)(42, "div", 9)(43, "h2");
        \u0275\u0275text(44, "Mes Formations");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(45, "button", 10);
        \u0275\u0275listener("click", function FormateurDashboardComponent_Template_button_click_45_listener() {
          return ctx.showCreateForm = !ctx.showCreateForm;
        });
        \u0275\u0275text(46, " + Cr\xE9er une formation ");
        \u0275\u0275elementEnd()();
        \u0275\u0275template(47, FormateurDashboardComponent_div_47_Template, 7, 0, "div", 11)(48, FormateurDashboardComponent_div_48_Template, 3, 0, "div", 12)(49, FormateurDashboardComponent_div_49_Template, 2, 1, "div", 13)(50, FormateurDashboardComponent_div_50_Template, 9, 0, "div", 14);
        \u0275\u0275elementEnd()()();
      }
      if (rf & 2) {
        \u0275\u0275advance(14);
        \u0275\u0275textInterpolate(ctx.myFormations.length);
        \u0275\u0275advance(8);
        \u0275\u0275textInterpolate(ctx.totalStudents);
        \u0275\u0275advance(8);
        \u0275\u0275textInterpolate(ctx.averageRating.toFixed(1));
        \u0275\u0275advance(8);
        \u0275\u0275textInterpolate1("", ctx.totalRevenue, " FCFA");
        \u0275\u0275advance(9);
        \u0275\u0275property("ngIf", ctx.showCreateForm);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", ctx.isLoading);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", !ctx.isLoading && ctx.myFormations.length > 0);
        \u0275\u0275advance();
        \u0275\u0275property("ngIf", !ctx.isLoading && ctx.myFormations.length === 0);
      }
    }, dependencies: [CommonModule, NgForOf, NgIf], styles: ["\n\n.dashboard[_ngcontent-%COMP%] {\n  min-height: 100vh;\n  background: #f8f9fa;\n}\n.dashboard-header[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #667eea 0%,\n      #764ba2 100%);\n  color: white;\n  padding: 60px 0;\n}\n.dashboard-header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  font-size: 2.5rem;\n  margin-bottom: 10px;\n}\n.dashboard-header[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  font-size: 1.1rem;\n  opacity: 0.9;\n}\n.dashboard-content[_ngcontent-%COMP%] {\n  padding: 40px 20px;\n}\n.stats-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n  gap: 20px;\n  margin-bottom: 40px;\n}\n.stat-card[_ngcontent-%COMP%] {\n  background: white;\n  padding: 30px;\n  border-radius: 12px;\n  display: flex;\n  gap: 20px;\n  align-items: center;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);\n}\n.stat-icon[_ngcontent-%COMP%] {\n  font-size: 3rem;\n  width: 70px;\n  height: 70px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  background:\n    linear-gradient(\n      135deg,\n      #667eea 0%,\n      #764ba2 100%);\n  border-radius: 12px;\n}\n.stat-info[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  font-size: 2rem;\n  color: #333;\n  margin-bottom: 5px;\n}\n.stat-info[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  color: #666;\n  font-size: 0.95rem;\n}\n.section[_ngcontent-%COMP%] {\n  background: white;\n  padding: 30px;\n  border-radius: 12px;\n  margin-bottom: 30px;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);\n}\n.section-header[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 25px;\n}\n.section[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  font-size: 1.75rem;\n  color: #333;\n}\n.create-form[_ngcontent-%COMP%] {\n  background: #f8f9fa;\n  padding: 30px;\n  border-radius: 12px;\n  margin-bottom: 30px;\n}\n.create-form[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  margin-bottom: 15px;\n  color: #333;\n}\n.create-form[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  color: #666;\n  margin-bottom: 20px;\n}\n.formations-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));\n  gap: 25px;\n}\n.formation-card[_ngcontent-%COMP%] {\n  border: 2px solid #e0e0e0;\n  border-radius: 12px;\n  padding: 25px;\n  transition: all 0.3s ease;\n}\n.formation-card[_ngcontent-%COMP%]:hover {\n  border-color: #667eea;\n  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);\n}\n.formation-header[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: start;\n  margin-bottom: 15px;\n}\n.formation-header[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  font-size: 1.25rem;\n  color: #333;\n  flex: 1;\n}\n.formation-price[_ngcontent-%COMP%] {\n  background: #667eea;\n  color: white;\n  padding: 6px 12px;\n  border-radius: 20px;\n  font-size: 0.85rem;\n  font-weight: 600;\n  white-space: nowrap;\n}\n.formation-price.free[_ngcontent-%COMP%] {\n  background: #27ae60;\n}\n.formation-category[_ngcontent-%COMP%] {\n  display: inline-block;\n  background: #e3f2fd;\n  color: #1976d2;\n  padding: 4px 12px;\n  border-radius: 12px;\n  font-size: 0.8rem;\n  font-weight: 600;\n  margin-bottom: 15px;\n}\n.formation-stats[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 20px;\n  margin-bottom: 20px;\n  padding-bottom: 20px;\n  border-bottom: 1px solid #e0e0e0;\n}\n.stat[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 5px;\n  font-size: 0.9rem;\n  color: #666;\n}\n.formation-actions[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 10px;\n}\n.btn[_ngcontent-%COMP%] {\n  padding: 10px 20px;\n  border-radius: 8px;\n  font-weight: 600;\n  border: none;\n  cursor: pointer;\n  transition: all 0.3s ease;\n  flex: 1;\n}\n.btn-primary[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #667eea 0%,\n      #764ba2 100%);\n  color: white;\n}\n.btn-primary[_ngcontent-%COMP%]:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);\n}\n.btn-secondary[_ngcontent-%COMP%] {\n  background: transparent;\n  border: 2px solid #667eea;\n  color: #667eea;\n}\n.btn-outline[_ngcontent-%COMP%] {\n  background: white;\n  border: 2px solid #667eea;\n  color: #667eea;\n}\n.btn-outline[_ngcontent-%COMP%]:hover {\n  background: #667eea;\n  color: white;\n}\n.btn-danger[_ngcontent-%COMP%] {\n  background: white;\n  border: 2px solid #e74c3c;\n  color: #e74c3c;\n}\n.btn-danger[_ngcontent-%COMP%]:hover {\n  background: #e74c3c;\n  color: white;\n}\n.empty-state[_ngcontent-%COMP%] {\n  text-align: center;\n  padding: 60px 20px;\n}\n.empty-icon[_ngcontent-%COMP%] {\n  font-size: 4rem;\n  margin-bottom: 20px;\n}\n.empty-state[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  font-size: 1.5rem;\n  color: #333;\n  margin-bottom: 10px;\n}\n.empty-state[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  color: #666;\n  margin-bottom: 25px;\n}\n.loading[_ngcontent-%COMP%] {\n  text-align: center;\n  padding: 40px;\n  color: #666;\n}\n@media (max-width: 768px) {\n  .formations-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .stats-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .section-header[_ngcontent-%COMP%] {\n    flex-direction: column;\n    gap: 15px;\n  }\n}\n/*# sourceMappingURL=formateur-dashboard.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(FormateurDashboardComponent, { className: "FormateurDashboardComponent", filePath: "src\\app\\features\\dashboard\\formateur\\formateur-dashboard.component.ts", lineNumber: 292 });
})();
export {
  FormateurDashboardComponent
};
//# sourceMappingURL=chunk-GFFTIXLB.js.map

import {
  CommonModule,
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵdefineComponent,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵtext
} from "./chunk-4RUIMXA5.js";

// src/app/features/dashboard/admin/admin-dashboard.component.ts
var AdminDashboardComponent = class _AdminDashboardComponent {
  static {
    this.\u0275fac = function AdminDashboardComponent_Factory(t) {
      return new (t || _AdminDashboardComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AdminDashboardComponent, selectors: [["app-admin-dashboard"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 5, vars: 0, consts: [[1, "container", "mx-auto", "px-4", "py-8"], [1, "text-3xl", "font-bold", "mb-6"], [1, "text-gray-600"]], template: function AdminDashboardComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "h1", 1);
        \u0275\u0275text(2, "Dashboard Administrateur");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(3, "p", 2);
        \u0275\u0275text(4, "Gestion de la plateforme");
        \u0275\u0275elementEnd()();
      }
    }, dependencies: [CommonModule], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AdminDashboardComponent, { className: "AdminDashboardComponent", filePath: "src\\app\\features\\dashboard\\admin\\admin-dashboard.component.ts", lineNumber: 16 });
})();
export {
  AdminDashboardComponent
};
//# sourceMappingURL=chunk-OAZCDPBS.js.map

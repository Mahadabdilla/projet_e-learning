import {
  CommonModule,
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵdefineComponent,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵtext
} from "./chunk-4RUIMXA5.js";

// src/app/features/dashboard/mentor/mentor-dashboard.component.ts
var MentorDashboardComponent = class _MentorDashboardComponent {
  static {
    this.\u0275fac = function MentorDashboardComponent_Factory(t) {
      return new (t || _MentorDashboardComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _MentorDashboardComponent, selectors: [["app-mentor-dashboard"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 51, vars: 0, consts: [[1, "dashboard"], [1, "dashboard-header"], [1, "container"], [1, "container", "dashboard-content"], [1, "stats-grid"], [1, "stat-card"], [1, "stat-icon"], [1, "stat-info"], [1, "section"], [1, "empty-state"], [1, "empty-icon"]], template: function MentorDashboardComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "h1");
        \u0275\u0275text(4, "\u{1F3AF} Espace Mentor");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(5, "p");
        \u0275\u0275text(6, "Accompagnez vos mentees vers la r\xE9ussite");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(7, "div", 3)(8, "div", 4)(9, "div", 5)(10, "div", 6);
        \u0275\u0275text(11, "\u{1F465}");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(12, "div", 7)(13, "h3");
        \u0275\u0275text(14, "0");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(15, "p");
        \u0275\u0275text(16, "Mentees actifs");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(17, "div", 5)(18, "div", 6);
        \u0275\u0275text(19, "\u{1F4C5}");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(20, "div", 7)(21, "h3");
        \u0275\u0275text(22, "0");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(23, "p");
        \u0275\u0275text(24, "S\xE9ances planifi\xE9es");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(25, "div", 5)(26, "div", 6);
        \u0275\u0275text(27, "\u2705");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(28, "div", 7)(29, "h3");
        \u0275\u0275text(30, "0");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(31, "p");
        \u0275\u0275text(32, "S\xE9ances compl\xE9t\xE9es");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(33, "div", 5)(34, "div", 6);
        \u0275\u0275text(35, "\u2B50");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(36, "div", 7)(37, "h3");
        \u0275\u0275text(38, "0.0");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(39, "p");
        \u0275\u0275text(40, "Note moyenne");
        \u0275\u0275elementEnd()()()();
        \u0275\u0275elementStart(41, "div", 8)(42, "h2");
        \u0275\u0275text(43, "Demandes de mentorat");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(44, "div", 9)(45, "div", 10);
        \u0275\u0275text(46, "\u{1F4EC}");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(47, "h3");
        \u0275\u0275text(48, "Aucune demande en attente");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(49, "p");
        \u0275\u0275text(50, "Les demandes de mentorat appara\xEEtront ici");
        \u0275\u0275elementEnd()()()()();
      }
    }, dependencies: [CommonModule], styles: ["\n\n.dashboard[_ngcontent-%COMP%] {\n  min-height: 100vh;\n  background: #f8f9fa;\n}\n.dashboard-header[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #667eea 0%,\n      #764ba2 100%);\n  color: white;\n  padding: 60px 0;\n}\n.dashboard-header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  font-size: 2.5rem;\n  margin-bottom: 10px;\n}\n.dashboard-header[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  font-size: 1.1rem;\n  opacity: 0.9;\n}\n.dashboard-content[_ngcontent-%COMP%] {\n  padding: 40px 20px;\n}\n.stats-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n  gap: 20px;\n  margin-bottom: 40px;\n}\n.stat-card[_ngcontent-%COMP%] {\n  background: white;\n  padding: 30px;\n  border-radius: 12px;\n  display: flex;\n  gap: 20px;\n  align-items: center;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);\n}\n.stat-icon[_ngcontent-%COMP%] {\n  font-size: 3rem;\n  width: 70px;\n  height: 70px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  background:\n    linear-gradient(\n      135deg,\n      #667eea 0%,\n      #764ba2 100%);\n  border-radius: 12px;\n}\n.stat-info[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  font-size: 2rem;\n  color: #333;\n  margin-bottom: 5px;\n}\n.stat-info[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  color: #666;\n  font-size: 0.95rem;\n}\n.section[_ngcontent-%COMP%] {\n  background: white;\n  padding: 30px;\n  border-radius: 12px;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);\n}\n.section[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  font-size: 1.75rem;\n  color: #333;\n  margin-bottom: 25px;\n}\n.empty-state[_ngcontent-%COMP%] {\n  text-align: center;\n  padding: 60px 20px;\n}\n.empty-icon[_ngcontent-%COMP%] {\n  font-size: 4rem;\n  margin-bottom: 20px;\n}\n.empty-state[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  font-size: 1.5rem;\n  color: #333;\n  margin-bottom: 10px;\n}\n.empty-state[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  color: #666;\n}\n/*# sourceMappingURL=mentor-dashboard.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(MentorDashboardComponent, { className: "MentorDashboardComponent", filePath: "src\\app\\features\\dashboard\\mentor\\mentor-dashboard.component.ts", lineNumber: 115 });
})();
export {
  MentorDashboardComponent
};
//# sourceMappingURL=chunk-I7DVEDYC.js.map

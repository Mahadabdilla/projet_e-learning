import {
  CommonModule,
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵdefineComponent,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵtext
} from "./chunk-4RUIMXA5.js";

// src/app/features/mentors/mentors.component.ts
var MentorsComponent = class _MentorsComponent {
  static {
    this.\u0275fac = function MentorsComponent_Factory(t) {
      return new (t || _MentorsComponent)();
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _MentorsComponent, selectors: [["app-mentors"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 5, vars: 0, consts: [[1, "container", "mx-auto", "px-4", "py-8"], [1, "text-3xl", "font-bold", "mb-6"], [1, "text-gray-600"]], template: function MentorsComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "h1", 1);
        \u0275\u0275text(2, "Nos Mentors");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(3, "p", 2);
        \u0275\u0275text(4, "D\xE9couvrez nos mentors experts");
        \u0275\u0275elementEnd()();
      }
    }, dependencies: [CommonModule], encapsulation: 2 });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(MentorsComponent, { className: "MentorsComponent", filePath: "src\\app\\features\\mentors\\mentors.component.ts", lineNumber: 16 });
})();
export {
  MentorsComponent
};
//# sourceMappingURL=chunk-B3JWNGQH.js.map

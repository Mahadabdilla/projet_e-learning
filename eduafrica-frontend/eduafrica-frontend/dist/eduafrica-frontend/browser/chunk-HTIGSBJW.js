import {
  Router,
  RouterLink
} from "./chunk-MFYBW43V.js";
import {
  CommonModule,
  NgForOf,
  ɵsetClassDebugInfo,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵdefineComponent,
  ɵɵdirectiveInject,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵlistener,
  ɵɵproperty,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate
} from "./chunk-4RUIMXA5.js";

// src/app/features/landing/landing.component.ts
function LandingComponent_div_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 28)(1, "div", 29);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "h3", 30);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 31);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const highlight_r1 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(highlight_r1.icon);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(highlight_r1.title);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(highlight_r1.description);
  }
}
function LandingComponent_div_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 32)(1, "div", 33);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 34);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const stat_r2 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(stat_r2.value);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(stat_r2.label);
  }
}
function LandingComponent_div_32_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 35)(1, "div", 36);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "h3", 37);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 38);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const feature_r3 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(feature_r3.icon);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(feature_r3.title);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(feature_r3.description);
  }
}
var LandingComponent = class _LandingComponent {
  constructor(router) {
    this.router = router;
    this.stats = [
      { value: "50,000+", label: "Apprenants" },
      { value: "500+", label: "Formations" },
      { value: "10,000+", label: "Certificats" },
      { value: "25+", label: "Pays" }
    ];
    this.features = [
      {
        icon: "\u{1F4F1}",
        title: "Application PWA",
        description: "Acc\xE9dez \xE0 vos cours partout, m\xEAme sans connexion Internet"
      },
      {
        icon: "\u{1F4B3}",
        title: "Paiements locaux",
        description: "Orange Money, Wave, M-Pesa et autres m\xE9thodes africaines"
      },
      {
        icon: "\u{1F512}",
        title: "Donn\xE9es s\xE9curis\xE9es",
        description: "Vos informations personnelles prot\xE9g\xE9es par chiffrement"
      },
      {
        icon: "\u{1F465}",
        title: "Communaut\xE9 active",
        description: "\xC9changez avec des milliers d'apprenants \xE0 travers l'Afrique"
      }
    ];
    this.highlights = [
      {
        icon: "\u{1F393}",
        title: "Certifications reconnues",
        description: "Obtenez des certificats valoris\xE9s par les entreprises africaines"
      },
      {
        icon: "\u{1F468}\u200D\u{1F3EB}",
        title: "Mentorat personnalis\xE9",
        description: "B\xE9n\xE9ficiez du soutien d'experts dans votre domaine"
      },
      {
        icon: "\u{1F4F4}",
        title: "Mode hors-ligne",
        description: "T\xE9l\xE9chargez vos cours et apprenez sans connexion"
      },
      {
        icon: "\u{1F4B0}",
        title: "Mobile Money",
        description: "Payez facilement avec Orange Money, Wave ou M-Pesa"
      }
    ];
  }
  navigateToFormations() {
    this.router.navigate(["/formations"]);
  }
  static {
    this.\u0275fac = function LandingComponent_Factory(t) {
      return new (t || _LandingComponent)(\u0275\u0275directiveInject(Router));
    };
  }
  static {
    this.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _LandingComponent, selectors: [["app-landing"]], standalone: true, features: [\u0275\u0275StandaloneFeature], decls: 41, vars: 3, consts: [[1, "landing-page"], [1, "hero"], [1, "container", "hero-content"], [1, "hero-text"], [1, "hero-title"], [1, "hero-subtitle"], [1, "hero-buttons"], [1, "btn", "btn-primary", 3, "click"], ["routerLink", "/about", 1, "btn", "btn-secondary"], [1, "hero-image"], [1, "hero-placeholder"], [2, "font-size", "120px"], [1, "highlights"], [1, "container"], [1, "highlights-grid"], ["class", "highlight-card", 4, "ngFor", "ngForOf"], [1, "stats"], [1, "section-title"], [1, "stats-grid"], ["class", "stat-card", 4, "ngFor", "ngForOf"], [1, "features"], [1, "features-grid"], ["class", "feature-card", 4, "ngFor", "ngForOf"], [1, "cta"], [1, "container", "cta-content"], [1, "cta-title"], [1, "cta-subtitle"], ["routerLink", "/register", 1, "btn", "btn-primary", "btn-large"], [1, "highlight-card"], [1, "highlight-icon"], [1, "highlight-title"], [1, "highlight-description"], [1, "stat-card"], [1, "stat-value"], [1, "stat-label"], [1, "feature-card"], [1, "feature-icon"], [1, "feature-title"], [1, "feature-description"]], template: function LandingComponent_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 0)(1, "section", 1)(2, "div", 2)(3, "div", 3)(4, "h1", 4);
        \u0275\u0275text(5, "Transformez votre carri\xE8re en Afrique");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(6, "p", 5);
        \u0275\u0275text(7, " Acc\xE9dez \xE0 des formations de qualit\xE9, mentorat personnalis\xE9 et certifications reconnues. Apprenez \xE0 votre rythme, o\xF9 que vous soyez sur le continent. ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(8, "div", 6)(9, "button", 7);
        \u0275\u0275listener("click", function LandingComponent_Template_button_click_9_listener() {
          return ctx.navigateToFormations();
        });
        \u0275\u0275text(10, " Commencer maintenant ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(11, "button", 8);
        \u0275\u0275text(12, " Voir la d\xE9mo ");
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(13, "div", 9)(14, "div", 10)(15, "span", 11);
        \u0275\u0275text(16, "\u{1F393}");
        \u0275\u0275elementEnd()()()()();
        \u0275\u0275elementStart(17, "section", 12)(18, "div", 13)(19, "div", 14);
        \u0275\u0275template(20, LandingComponent_div_20_Template, 7, 3, "div", 15);
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(21, "section", 16)(22, "div", 13)(23, "h2", 17);
        \u0275\u0275text(24, "EduAfrica en chiffres");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(25, "div", 18);
        \u0275\u0275template(26, LandingComponent_div_26_Template, 5, 2, "div", 19);
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(27, "section", 20)(28, "div", 13)(29, "h2", 17);
        \u0275\u0275text(30, "Fonctionnalit\xE9s cl\xE9s");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(31, "div", 21);
        \u0275\u0275template(32, LandingComponent_div_32_Template, 7, 3, "div", 22);
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(33, "section", 23)(34, "div", 24)(35, "h2", 25);
        \u0275\u0275text(36, "Pr\xEAt \xE0 commencer votre parcours ?");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(37, "p", 26);
        \u0275\u0275text(38, " Rejoignez des milliers d'apprenants qui d\xE9veloppent leurs comp\xE9tences avec EduAfrica ");
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(39, "button", 27);
        \u0275\u0275text(40, " Cr\xE9er un compte gratuit ");
        \u0275\u0275elementEnd()()()();
      }
      if (rf & 2) {
        \u0275\u0275advance(20);
        \u0275\u0275property("ngForOf", ctx.highlights);
        \u0275\u0275advance(6);
        \u0275\u0275property("ngForOf", ctx.stats);
        \u0275\u0275advance(6);
        \u0275\u0275property("ngForOf", ctx.features);
      }
    }, dependencies: [CommonModule, NgForOf, RouterLink], styles: ["\n\n.landing-page[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.container[_ngcontent-%COMP%] {\n  max-width: 1200px;\n  margin: 0 auto;\n  padding: 0 20px;\n}\n.hero[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #667eea 0%,\n      #764ba2 100%);\n  color: white;\n  padding: 80px 0;\n  min-height: 600px;\n  display: flex;\n  align-items: center;\n}\n.hero-content[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 60px;\n  align-items: center;\n}\n.hero-title[_ngcontent-%COMP%] {\n  font-size: 3.5rem;\n  font-weight: 800;\n  margin-bottom: 20px;\n  line-height: 1.2;\n}\n.hero-subtitle[_ngcontent-%COMP%] {\n  font-size: 1.25rem;\n  margin-bottom: 30px;\n  line-height: 1.6;\n  opacity: 0.95;\n}\n.hero-buttons[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 15px;\n}\n.hero-placeholder[_ngcontent-%COMP%] {\n  background: rgba(255, 255, 255, 0.1);\n  border-radius: 20px;\n  padding: 60px;\n  text-align: center;\n  -webkit-backdrop-filter: blur(10px);\n  backdrop-filter: blur(10px);\n}\n.btn[_ngcontent-%COMP%] {\n  padding: 15px 30px;\n  border-radius: 8px;\n  font-size: 1rem;\n  font-weight: 600;\n  border: none;\n  cursor: pointer;\n  transition: all 0.3s ease;\n}\n.btn-primary[_ngcontent-%COMP%] {\n  background: white;\n  color: #667eea;\n}\n.btn-primary[_ngcontent-%COMP%]:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);\n}\n.btn-secondary[_ngcontent-%COMP%] {\n  background: transparent;\n  color: white;\n  border: 2px solid white;\n}\n.btn-secondary[_ngcontent-%COMP%]:hover {\n  background: white;\n  color: #667eea;\n}\n.btn-large[_ngcontent-%COMP%] {\n  padding: 18px 40px;\n  font-size: 1.1rem;\n}\n.highlights[_ngcontent-%COMP%] {\n  padding: 60px 0;\n  background: #f8f9fa;\n}\n.highlights-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n  gap: 30px;\n}\n.highlight-card[_ngcontent-%COMP%] {\n  background: white;\n  padding: 30px;\n  border-radius: 12px;\n  text-align: center;\n  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);\n  transition: transform 0.3s ease;\n}\n.highlight-card[_ngcontent-%COMP%]:hover {\n  transform: translateY(-5px);\n}\n.highlight-icon[_ngcontent-%COMP%] {\n  font-size: 3rem;\n  margin-bottom: 15px;\n}\n.highlight-title[_ngcontent-%COMP%] {\n  font-size: 1.25rem;\n  font-weight: 700;\n  margin-bottom: 10px;\n  color: #333;\n}\n.highlight-description[_ngcontent-%COMP%] {\n  color: #666;\n  line-height: 1.6;\n}\n.stats[_ngcontent-%COMP%] {\n  padding: 80px 0;\n  background:\n    linear-gradient(\n      135deg,\n      #667eea 0%,\n      #764ba2 100%);\n  color: white;\n}\n.section-title[_ngcontent-%COMP%] {\n  text-align: center;\n  font-size: 2.5rem;\n  font-weight: 800;\n  margin-bottom: 50px;\n}\n.stats-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));\n  gap: 40px;\n}\n.stat-card[_ngcontent-%COMP%] {\n  text-align: center;\n}\n.stat-value[_ngcontent-%COMP%] {\n  font-size: 3rem;\n  font-weight: 800;\n  margin-bottom: 10px;\n}\n.stat-label[_ngcontent-%COMP%] {\n  font-size: 1.1rem;\n  opacity: 0.9;\n}\n.features[_ngcontent-%COMP%] {\n  padding: 80px 0;\n  background: white;\n}\n.features[_ngcontent-%COMP%]   .section-title[_ngcontent-%COMP%] {\n  color: #333;\n}\n.features-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n  gap: 30px;\n}\n.feature-card[_ngcontent-%COMP%] {\n  padding: 30px;\n  border-radius: 12px;\n  border: 2px solid #e0e0e0;\n  transition: all 0.3s ease;\n}\n.feature-card[_ngcontent-%COMP%]:hover {\n  border-color: #667eea;\n  box-shadow: 0 8px 16px rgba(102, 126, 234, 0.1);\n}\n.feature-icon[_ngcontent-%COMP%] {\n  font-size: 3rem;\n  margin-bottom: 15px;\n}\n.feature-title[_ngcontent-%COMP%] {\n  font-size: 1.25rem;\n  font-weight: 700;\n  margin-bottom: 10px;\n  color: #333;\n}\n.feature-description[_ngcontent-%COMP%] {\n  color: #666;\n  line-height: 1.6;\n}\n.cta[_ngcontent-%COMP%] {\n  padding: 80px 0;\n  background:\n    linear-gradient(\n      135deg,\n      #667eea 0%,\n      #764ba2 100%);\n  color: white;\n}\n.cta-content[_ngcontent-%COMP%] {\n  text-align: center;\n}\n.cta-title[_ngcontent-%COMP%] {\n  font-size: 2.5rem;\n  font-weight: 800;\n  margin-bottom: 20px;\n}\n.cta-subtitle[_ngcontent-%COMP%] {\n  font-size: 1.25rem;\n  margin-bottom: 30px;\n  opacity: 0.9;\n}\n@media (max-width: 768px) {\n  .hero-content[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n    text-align: center;\n  }\n  .hero-title[_ngcontent-%COMP%] {\n    font-size: 2.5rem;\n  }\n  .hero-buttons[_ngcontent-%COMP%] {\n    justify-content: center;\n    flex-direction: column;\n  }\n  .hero-image[_ngcontent-%COMP%] {\n    display: none;\n  }\n}\n/*# sourceMappingURL=landing.component.css.map */"] });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(LandingComponent, { className: "LandingComponent", filePath: "src\\app\\features\\landing\\landing.component.ts", lineNumber: 12 });
})();
export {
  LandingComponent
};
//# sourceMappingURL=chunk-HTIGSBJW.js.map

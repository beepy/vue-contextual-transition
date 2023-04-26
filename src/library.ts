// This is the root file from where the package will be generated.
// import static stylesheets so that rollup will inlcude this in the package
// note that scss variables need to be imported using the vite.config.ts
import { App } from 'vue';

import './styles/shared.css';

import ContextualTransition from './components/ContextualTransition.vue';
export { ContextualTransition };
export {
  useContextualTransition,
  updateContextualTransitionResolve,
} from './contextualTransition';

function install(app: App) {
  const dataSetKey = 'contextualTransition';

  const sharedElementDirective = (el: any, binding: any) => {
    if (binding.value.id !== undefined) {
      el.dataset[`${dataSetKey}Id`] = binding.value.id;
    }
    if (binding.value.role !== undefined) {
      el.dataset[`${dataSetKey}Role`] = binding.value.role;
    }
    if (binding.value.type !== undefined) {
      el.dataset[`${dataSetKey}Type`] = binding.value.type;
    }
    if (binding.value.scale !== undefined) {
      el.dataset[`${dataSetKey}Scale`] = binding.value.scale;
    }
    if (binding.value.only !== undefined) {
      el.dataset[`${dataSetKey}Only`] = binding.value.only;
    }
  };

  const sharedElementTeleportDirective = (el: any, binding: any) => {
    el.dataset[`${dataSetKey}TeleportSelector`] = binding.value;
  };

  const relativeSlideDirective = (el: any, binding: any) => {
    if (binding.value.value !== undefined && binding.value.type !== undefined) {
      el.dataset[`${dataSetKey}RelativeValue`] = binding.value.value;
      el.dataset[`${dataSetKey}RelativeType`] = binding.value.type;
    }
  };

  app.component('ContextualTransition', ContextualTransition);
  // using `mounted` is too late for transition
  app.directive('shared-element', {
    created: sharedElementDirective,
    updated: sharedElementDirective,
  });
  app.directive('shared-element-teleport', {
    created: sharedElementTeleportDirective,
    updated: sharedElementTeleportDirective,
  });
  app.directive('relative-slide', {
    created: relativeSlideDirective,
    updated: relativeSlideDirective,
  });
}

export { install };

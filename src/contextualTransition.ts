import type { TransitionProps } from 'vue';

type HtmlOrSvgElement = HTMLElement | SVGElement;

type TransitioningElement = {
  fromEl: HtmlOrSvgElement;
  toEl?: HtmlOrSvgElement;
  // animateElement?: HTMLElement;
  id: string;
  role: string;
  type: string;
  fromRect: DOMRect;
  toRect?: DOMRect;
  scaleMode?: 'none' | 'free' | string;
  inAllowed?: boolean;
  outAllowed?: boolean;
  pointerIsIn: boolean;
  distanceToPointer: number;
};

export type ComparatorType = (a: any, b: any) => number;

type TransitioningGroup = {
  key: string;
  duration: number;
  elements: Record<string, TransitioningElement>;
  height: number | string;
  fromEl?: HtmlOrSvgElement;
  toEl?: HtmlOrSvgElement;
  fromScrollY: number;
  scrollReject?: () => void;
  scrollResolve?: (value: any) => void;
  scrollSavedPosition?: any;
  comparator: ComparatorType;
  pageX: string;
  pageY: string;
  count: number;
  allowMotion: boolean;
  startTime?: number;
  timeout?: number;
  done?: Function;
};

export type TransitionOptions = {
  duration: number;
  group: string;
  comparator: ComparatorType;
  // getPrefersReducedMotion: undefined | (() => boolean);
  x: string;
  y: string;
  allowMotion: boolean;
};

const g = {
  transitioningGroups: {} as Record<string, TransitioningGroup>,
  dataSetKey: 'contextualTransition',
  testDataAttribute: 'data-contextual-transition-role',
  pointerX: 0,
  pointerY: 0,
  pointermoveEventHandler: undefined as any,
  prefersReducedMotionMatcher: undefined as any,
  reducedMotion: false,
};

const handleReduceMotionChanged = () => {
  if (g.prefersReducedMotionMatcher?.matches) {
    g.reducedMotion = true;
  } else {
    g.reducedMotion = false;
  }
};

function relativeValueForEl(el: HtmlOrSvgElement): string | undefined {
  const v = el.dataset[`${g.dataSetKey}RelativeValue`];
  return v;
}

function relativeTypeForEl(el: HtmlOrSvgElement): string | undefined {
  const v = el.dataset[`${g.dataSetKey}RelativeType`];
  return v;
}

function clearTransitioningElementsForGroup(
  plainEl: Element,
  group: TransitioningGroup
) {
  const el = elementToHtmlElement(plainEl);

  group.elements = {};
  group.scrollReject = undefined;
  group.scrollResolve = undefined;
  group.scrollSavedPosition = undefined;
  group.startTime = undefined;
  group.timeout = undefined;
  group.toEl = undefined;

  el?.style.setProperty('--contextual-transition-page-x', `0px`);
  el?.style.setProperty('--contextual-transition-page-y', `0px`);
  el?.classList.remove('with-transform');
  if (el?.parentElement) {
    el.parentElement.classList.remove('contextual-transition-active');
  }
}

function scaleWithin(
  w: number,
  h: number,
  withinWidth: number,
  withinHeight: number
): number {
  const widthScale = withinWidth / w;
  const heightScale = withinHeight / h;

  return Math.min(widthScale, heightScale);
}

function angleFromVector(x: number, y: number) {
  return Math.atan2(y, x);
}

function vectorLength(x: number, y: number): number {
  return Math.sqrt(x * x + y * y);
}

function vectorClipToMaxLength(
  x: number,
  y: number,
  max: number
): { x: number; y: number } {
  const l = vectorLength(x, y);
  if (l <= max) {
    return { x, y };
  }
  const a = angleFromVector(x, y);
  return {
    x: Math.cos(a) * max,
    y: Math.sin(a) * max,
  };
}

function isPointInRect(
  x: number,
  y: number,
  left: number,
  top: number,
  width: number,
  height: number
) {
  return left < x && x < left + width && top < y && y < top + height;
}

/**
 * Returns the square of the distance between a point and the center of a rect.
 * We don't care about actual distance, just comparing distances
 * @param {number} x      point x
 * @param {number} y      point y
 * @param {number} left   rect left
 * @param {number} top    rect top
 * @param {number} width  rect width
 * @param {number} height rect height
 */
function distanceBetweenPointAndRect(
  x: number,
  y: number,
  left: number,
  top: number,
  width: number,
  height: number
) {
  const rx = left + width / 2;
  const ry = top + height / 2;
  const dx = x - rx;
  const dy = y - ry;

  return dx * dx + dy * dy;
}

function keyFromIdRoleType(id: string, role: string, type = ''): string {
  return id + '-' + role + '-' + type;
}

function keyFromTransitioningElement(te: TransitioningElement): string {
  return keyFromIdRoleType(te.id, te.role, te.type);
}

function elementToHtmlElement(el: Element): HtmlOrSvgElement | undefined {
  if (el instanceof HTMLElement || el instanceof SVGElement) {
    return el as HtmlOrSvgElement;
  } else {
    console.error('bad element');
    console.error(el);
    return undefined;
  }
}

function onBeforeEnter(plainEl: Element, group: TransitioningGroup) {
  const el = elementToHtmlElement(plainEl);

  if (el === undefined) {
    return;
  }
  group.toEl = el;
  el.style.setProperty(
    '--contextual-transition-duration',
    `${group.duration}ms`
  );
  let pageX = '0%';
  let pageY = '0%';
  const toRelativeType = relativeTypeForEl(el);

  if (
    group.fromEl &&
    toRelativeType !== undefined &&
    toRelativeType === relativeTypeForEl(group.fromEl)
  ) {
    const fromValue = relativeValueForEl(group.fromEl);
    const toValue = relativeValueForEl(el);
    const d = group.comparator(fromValue, toValue);

    if (d < 0) {
      pageX = group.pageX;
      pageY = group.pageY;
    } else if (d > 0) {
      pageX = `calc(0px - ${group.pageX})`;
      pageY = `calc(0px - ${group.pageY})`;
    }
    group.fromEl.classList.add('with-transform');

    group.fromEl.style.setProperty(
      '--contextual-transition-page-x',
      `${pageX}`
    );
    group.fromEl.style.setProperty(
      '--contextual-transition-page-y',
      `${pageY}`
    );
    el.classList.add('with-transform');
    el.style.setProperty('--contextual-transition-page-x', `${pageX}`);
    el.style.setProperty('--contextual-transition-page-y', `${pageY}`);
  }
}

function onEnter(plainEl: Element, done: Function, group: TransitioningGroup) {
  const el = elementToHtmlElement(plainEl);

  if (el === undefined) {
    done();
    return;
  }
  const enterElRect = el.getBoundingClientRect();

  const resolve = group.scrollResolve;

  if (resolve) {
    resolve(group.scrollSavedPosition);
    group.scrollResolve = undefined;
    group.scrollReject = undefined;
    group.scrollSavedPosition = undefined;
  }

  const windowHeight = window.innerHeight;
  let containHeight = Math.max(
    enterElRect.height,
    windowHeight - (enterElRect.top + window.pageYOffset)
  );
  group.fromEl?.style.setProperty(
    '--contextual-transition-height',
    `${containHeight}px`
  );

  group.height = enterElRect.height;

  group.toEl = el;
  group.done = done;

  requestAnimationFrame(() => {
    const toScrollY = window.pageYOffset;
    const fromYFix = toScrollY - group.fromScrollY;

    containHeight = containHeight - fromYFix;
    group.fromEl?.style.setProperty(
      '--contextual-transition-height',
      `${containHeight}px`
    );
    group.fromEl?.style.setProperty(
      '--contextual-transition-y-offset',
      `${fromYFix}px`
    );

    requestAnimationFrame(() => {
      doSharedElementTransitions(group);
    });
  });
  // }, 100);
}

function doSharedElementTransitions(
  group: TransitioningGroup,
  percentComplete = 0.0
) {
  const currentEls =
    group.elements ?? ({} as Record<string, TransitioningElement>);
  const animations: Animation[] = [];
  const el = group.toEl;
  const done = group.done;

  if (!el) {
    if (done) {
      done();
    }
    return;
  }
  let tEls: Element[] = Array.from(
    el.querySelectorAll(`[${g.testDataAttribute}]`)
  );
  const teleportSelector = el.dataset[`${g.dataSetKey}TeleportSelector`];
  if (teleportSelector !== undefined) {
    const teleportTargets = document.querySelectorAll(teleportSelector);
    for (const tTarget of teleportTargets) {
      const teleportedEls = tTarget.querySelectorAll(
        `[${g.testDataAttribute}]`
      );
      tEls = [...tEls, ...Array.from(teleportedEls)];
    }
  }
  for (const plainTe of tEls) {
    const te = elementToHtmlElement(plainTe);
    if (te !== undefined) {
      const b = te.getBoundingClientRect();
      const id = te.dataset[`${g.dataSetKey}Role`] ?? '';
      const role = te.dataset[`${g.dataSetKey}Id`] ?? '';
      const type = te.dataset[`${g.dataSetKey}Type`] ?? '';
      const key = keyFromIdRoleType(id, role, type);

      if (currentEls[key]) {
        currentEls[key].toRect = b;
        currentEls[key].toEl = te;
        currentEls[key].inAllowed =
          te.dataset[`${g.dataSetKey}Only`] !== 'leave';
      }
    }
  }

  for (const key in currentEls) {
    const te = currentEls[key];
    if (te.fromEl && te.toRect && te.toEl) {
      const fromTop = te.fromRect.top;
      const fromScale = { x: 1.0, y: 1.0 };
      const toScale = { x: 1.0, y: 1.0 };

      switch (te.scaleMode) {
        case 'none':
          // do nothing
          break;

        case 'free':
          fromScale.x = te.toRect.width / te.fromRect.width;
          fromScale.y = te.toRect.height / te.fromRect.height;
          toScale.x = te.fromRect.width / te.toRect.width;
          toScale.y = te.fromRect.height / te.toRect.height;
          break;

        default: {
          const f = scaleWithin(
            te.fromRect.width,
            te.fromRect.height,
            te.toRect.width,
            te.toRect.height
          );
          const t = scaleWithin(
            te.toRect.width,
            te.toRect.height,
            te.fromRect.width,
            te.fromRect.height
          );
          fromScale.x = f;
          fromScale.y = f;
          toScale.x = t;
          toScale.y = t;
        }
      }

      let fromDelta = {
        x:
          te.toRect.left -
          te.fromRect.left +
          (te.toRect.width - te.fromRect.width) / 2,
        y:
          te.toRect.top - fromTop + (te.toRect.height - te.fromRect.height) / 2,
      };

      let toDelta = {
        x:
          te.fromRect.left -
          te.toRect.left +
          (te.fromRect.width - te.toRect.width) / 2,
        y:
          fromTop - te.toRect.top + (te.fromRect.height - te.toRect.height) / 2,
      };

      // limit distance of animation to prevent unnatural/useless duration

      fromDelta = vectorClipToMaxLength(
        fromDelta.x,
        fromDelta.y,
        1280 // windowHeight * 0.75
      );
      toDelta = vectorClipToMaxLength(
        toDelta.x,
        toDelta.y,
        1280 // windowHeight * 0.75
      );

      if (
        te.outAllowed &&
        te.inAllowed &&
        !g.reducedMotion &&
        group.allowMotion
      ) {
        const startScale = {
          x: 1.0 + (fromScale.x - 1.0) * percentComplete,
          y: 1.0 + (fromScale.y - 1.0) * percentComplete,
        };
        animations.push(
          te.fromEl.animate(
            [
              {
                transform: `translate(${fromDelta.x * percentComplete}px, ${
                  fromDelta.y * percentComplete
                }px) scale(${startScale.x}, ${startScale.y})`,
                opacity: 1 - 1 * percentComplete,
              },
              {
                transform: `translate(${fromDelta.x}px, ${fromDelta.y}px) scale(${fromScale.x}, ${fromScale.y})`,
                opacity: 0,
              },
            ],
            {
              duration: group.duration,
              iterations: 1,
              easing: 'ease-in',
            }
          )
        );
      }
      if (
        te.inAllowed &&
        te.outAllowed &&
        !g.reducedMotion &&
        group.allowMotion
      ) {
        const percentRemaining = 1.0 - percentComplete;
        const startScale = {
          x: 1.0 + (toScale.x - 1.0) * percentRemaining,
          y: 1.0 + (toScale.y - 1.0) * percentRemaining,
        };

        animations.push(
          te.toEl.animate(
            [
              {
                transform: `translate(${toDelta.x * percentRemaining}px, ${
                  toDelta.y * percentRemaining
                }px) scale(${startScale.x}, ${startScale.y})`,
                opacity: 0,
              },
              {
                transform: 'translate(0px, 0px) scale(1.0, 1.0)',
                opacity: 1,
              },
            ],
            {
              duration: group.duration,
              iterations: 1,
              easing: 'ease-out',
            }
          )
        );
      }
    }
  }
  if (animations.length > 0) {
    Promise.all(animations.map((a) => a.finished)).then(() => {
      if (done) {
        done();
      }
    });
  } else {
    group.startTime = new Date().getTime();
    group.done = done;
    group.timeout = setTimeout(() => {
      if (done) {
        done();
      }
    }, group.duration);
  }
}
function onEnterCancelled(el: Element, group: TransitioningGroup) {
  clearTransitioningElementsForGroup(el, group);
}

function onAfterEnter(el: Element, group: TransitioningGroup) {
  clearTransitioningElementsForGroup(el, group);
}

function onBeforeLeave(plainEl: Element, group: TransitioningGroup) {
  const el = elementToHtmlElement(plainEl);

  if (el === undefined) {
    return;
  }

  if (el.parentElement !== null) {
    el.parentElement.classList.add('contextual-transition-active');
  }

  const elRect = el.getBoundingClientRect();

  if (elRect) {
    el.style.setProperty('--contextual-transition-width', `${elRect.width}px`);
  }
  el.style.setProperty(
    '--contextual-transition-duration',
    `${group.duration}ms`
  );

  group.fromEl = el;
  group.fromScrollY = window.pageYOffset;
  group.elements = {};

  let tEls: Element[] = Array.from(
    el.querySelectorAll(`[${g.testDataAttribute}]`)
  );
  const teleportSelector = el.dataset[`${g.dataSetKey}TeleportSelector`];
  if (teleportSelector !== undefined) {
    const teleportTargets = document.querySelectorAll(teleportSelector);
    for (const tTarget of teleportTargets) {
      const teleportedEls = tTarget.querySelectorAll(
        `[${g.testDataAttribute}]`
      );
      tEls = [...tEls, ...Array.from(teleportedEls)];
    }
  }

  for (const plainTe of tEls) {
    const te = elementToHtmlElement(plainTe);

    if (te !== undefined) {
      const b = te.getBoundingClientRect();
      const d: TransitioningElement = {
        fromEl: te,
        id: te.dataset[`${g.dataSetKey}Role`] ?? '',
        role: te.dataset[`${g.dataSetKey}Id`] ?? '',
        type: te.dataset[`${g.dataSetKey}Type`] ?? '',
        fromRect: b,
        scaleMode: te.dataset[`${g.dataSetKey}Scale`],
        inAllowed: te.dataset[`${g.dataSetKey}Only`] !== 'leave',
        outAllowed: te.dataset[`${g.dataSetKey}Only`] !== 'enter',
        pointerIsIn: isPointInRect(
          g.pointerX,
          g.pointerY,
          b.left + window.scrollX,
          b.top + window.scrollY,
          b.width,
          b.height
        ),
        distanceToPointer: distanceBetweenPointAndRect(
          g.pointerX,
          g.pointerY,
          b.left + window.scrollX,
          b.top + window.scrollY,
          b.width,
          b.height
        ),
      };
      const key = keyFromTransitioningElement(d);

      if (
        group.elements[key] === undefined ||
        d.pointerIsIn ||
        d.distanceToPointer < group.elements[key].distanceToPointer
      ) {
        group.elements[key] = d;
      }
    }
  }
}

function onLeave(_el: Element, done: Function, group: TransitioningGroup) {
  setTimeout(done, group.duration);
}

function onAfterLeave(el: Element, group: TransitioningGroup) {
  clearTransitioningElementsForGroup(el, group);
}

function onLeaveCancelled(el: Element, group: TransitioningGroup) {
  clearTransitioningElementsForGroup(el, group);
}

/**
 * Required if scrollBehavior is called before onBeforeEnter is triggered
 */

export function setScrollBehaviorCallbacks(
  groupKey = 'page',
  scrollSavedPosition?: any,
  scrollResolve?: (value: any) => void,
  scrollReject?: () => void
) {
  if (g.transitioningGroups[groupKey]) {
    g.transitioningGroups[groupKey].scrollReject = scrollReject;
    g.transitioningGroups[groupKey].scrollResolve = scrollResolve;
    g.transitioningGroups[groupKey].scrollSavedPosition = scrollSavedPosition;
  }
}

export function useContextualTransition(
  customOptions: Partial<TransitionOptions> | undefined
): TransitionProps {
  const comparator = (a: any, b: any) => {
    const aParsed = typeof a === 'string' ? parseInt(a, 10) : a;
    const bParsed = typeof b === 'string' ? parseInt(b, 10) : b;

    if (
      !isNaN(aParsed) &&
      !isNaN(bParsed) &&
      typeof aParsed === 'number' &&
      typeof bParsed === 'number'
    ) {
      return aParsed - bParsed;
    }
    return 0;
  };
  let p: TransitionOptions = {
    duration: 222,
    group: 'page',
    comparator,
    x: '25%',
    y: '0%',
    allowMotion: true,
  };

  if (customOptions) {
    p = { ...p, ...customOptions };
  }

  if (typeof p.comparator !== 'function') {
    p.comparator = comparator;
  }
  // need func
  if (!g.transitioningGroups[p.group]) {
    g.transitioningGroups[p.group] = {
      key: p.group,
      duration: p.duration,
      elements: {},
      height: 'auto',
      fromScrollY: 0,
      comparator: p.comparator,
      pageX: p.x,
      pageY: p.y,
      count: 0,
      allowMotion: p.allowMotion,
    };
  }

  g.transitioningGroups[p.group].count =
    g.transitioningGroups[p.group].count + 1;
  if (typeof window !== 'undefined' && window.document) {
    if (g.pointermoveEventHandler === undefined) {
      g.pointermoveEventHandler = (event: PointerEvent) => {
        g.pointerX = event.pageX;
        g.pointerY = event.pageY;
      };
      document.addEventListener('pointermove', g.pointermoveEventHandler);
    }

    if (g.prefersReducedMotionMatcher === undefined && window) {
      g.prefersReducedMotionMatcher = window?.matchMedia(
        '(prefers-reduced-motion: reduce)'
      );

      g.prefersReducedMotionMatcher.addListener(handleReduceMotionChanged);
      handleReduceMotionChanged();
    }
  }

  return {
    name: 'contextual-transition',
    mode: 'default',
    onBeforeEnter(el: Element) {
      return onBeforeEnter(el, g.transitioningGroups[p.group]);
    },
    onEnter(el: Element, done: Function) {
      return onEnter(el, done, g.transitioningGroups[p.group]);
    },
    onEnterCancelled(el: Element) {
      return onEnterCancelled(el, g.transitioningGroups[p.group]);
    },
    onBeforeLeave(el: Element) {
      return onBeforeLeave(el, g.transitioningGroups[p.group]);
    },
    onLeave(el: Element, done: Function) {
      return onLeave(el, done, g.transitioningGroups[p.group]);
    },
    onAfterLeave(el: Element) {
      return onAfterLeave(el, g.transitioningGroups[p.group]);
    },
    onLeaveCancelled(el: Element) {
      return onLeaveCancelled(el, g.transitioningGroups[p.group]);
    },
    onAfterEnter(el: Element) {
      return onAfterEnter(el, g.transitioningGroups[p.group]);
    },
    duration: p.duration,
  };
}

export function updateContextualTransition(p: Partial<TransitionOptions>) {
  if (p.group && g.transitioningGroups[p.group]) {
    if (p.duration) {
      g.transitioningGroups[p.group].duration = p.duration;
    }
    if (p.x) {
      g.transitioningGroups[p.group].pageX = p.x;
    }
    if (p.y) {
      g.transitioningGroups[p.group].pageY = p.y;
    }
    if (p.allowMotion !== undefined) {
      g.transitioningGroups[p.group].allowMotion = p.allowMotion;
    }
  }
}

export function updateContextualTransitionResolve(groupKey = 'page') {
  const group = g.transitioningGroups[groupKey];
  if (
    group === undefined ||
    group.startTime === undefined ||
    group.timeout === undefined ||
    group.toEl === undefined
  ) {
    return;
  }
  const timePassed = new Date().getTime() - group.startTime;
  const percentComplete = timePassed / group.duration;
  if (group.timeout) {
    clearTimeout(group.timeout);
    group.timeout = undefined;
  }

  requestAnimationFrame(() => {
    doSharedElementTransitions(group, percentComplete);
  });
}

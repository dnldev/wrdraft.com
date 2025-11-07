import {
  autoUpdate,
  flip,
  offset,
  Placement,
  shift,
  size,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from "@floating-ui/react";
import { useState } from "react";

interface PopoverOptions {
  initialOpen?: boolean;
  placement?: Placement;
}

/**
 * A custom hook to manage the state and positioning for a popover element.
 * Encapsulates logic from @floating-ui/react for positioning, interactions (click, dismiss), and accessibility.
 * It includes robust auto-updating for scroll and resize events.
 * @param {PopoverOptions} [options] - Optional configuration for the popover's initial state and placement.
 * @returns {object} An object containing state, refs, styles, and interaction props to be spread onto elements.
 */
export function usePopover({
  initialOpen = false,
  placement = "bottom-start",
}: PopoverOptions = {}) {
  const [isOpen, setIsOpen] = useState(initialOpen);

  const { refs, floatingStyles, context } = useFloating({
    placement,
    open: isOpen,
    onOpenChange: setIsOpen,
    whileElementsMounted: (reference, floating, update) =>
      autoUpdate(reference, floating, update, {
        ancestorScroll: true,
        ancestorResize: true,
        elementResize: true,
      }),
    middleware: [
      offset(5),
      flip({
        fallbackAxisSideDirection: "end",
      }),
      shift(),
      size({
        apply({ availableHeight, elements }) {
          Object.assign(elements.floating.style, {
            maxHeight: `${availableHeight}px`,
          });
        },
        padding: 10,
      }),
    ],
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);

  const interactions = useInteractions([click, dismiss, role]);

  return {
    isOpen,
    setIsOpen,
    refs,
    floatingStyles,
    context,
    ...interactions,
  };
}

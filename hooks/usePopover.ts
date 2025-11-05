// FILE: hooks/usePopover.ts
import {
  autoUpdate,
  flip,
  offset,
  Placement,
  shift,
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
 * A hook to manage the state and positioning of a popover component.
 * @param {PopoverOptions} [options] - Configuration for the popover.
 * @returns An object with state and props for popover elements.
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
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(5),
      flip({
        fallbackAxisSideDirection: "end",
      }),
      shift(),
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

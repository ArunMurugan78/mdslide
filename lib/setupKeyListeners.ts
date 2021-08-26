import { KeyboardEvent } from "react";
import { useStore } from "lib/stores/presentation";

export function keyListeners() {
  const keyDownHandler: (e: Event) => void = (e: Event) => {
    const editorEl = document.querySelector<HTMLTextAreaElement>(
      ".w-md-editor-text-input"
    );

    if (document.activeElement === editorEl) {
      return;
    }

    switch ((e as unknown as KeyboardEvent)?.key) {
      case "ArrowRight":
        const { goToNextSlide } = useStore.getState();
        goToNextSlide();
        break;
      case "ArrowLeft":
        const { goToPrevSlide } = useStore.getState();
        goToPrevSlide();
        break;
    }
  };

  const setUpKeyListener = () =>
    window.addEventListener("keydown", keyDownHandler);

  const cleanUp = () => window.removeEventListener("keydown", keyDownHandler);

  return { setUpKeyListener, cleanUp };
}

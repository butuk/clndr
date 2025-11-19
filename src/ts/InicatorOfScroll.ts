import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { createElement } from "./helpFunctions.js";

export class IndicatorOfScroll {
  constructor() {
    gsap.registerPlugin(ScrollTrigger);

    //Frames count by Vite glob import
    const frameModules = import.meta.glob("/src/frames-sequence/*.svg");
    const frameCount: number = Object.keys(frameModules).length;

    const images: Array<HTMLImageElement> = [];
    const imageSeq = { frame: 1 };

    const canvas: HTMLCanvasElement = document.getElementById(
      "animation",
    ) as HTMLCanvasElement;
    const context: CanvasRenderingContext2D | null = canvas.getContext("2d");

    const imagePromises: Promise<HTMLImageElement>[] = [];

    for (let i: number = 1; i <= frameCount; i++) {
      const num: string = i < 10 ? `0${i}` : `${i}`;
      const img = new Image();

      const imagePromise = new Promise<HTMLImageElement>((resolve, reject) => {
        img.onload = (): void => resolve(img);
        img.onerror = (): void =>
          reject(new Error(`Failed to load image: ${num}.svg`));
        img.src = `/src/frames-sequence/${num}.svg`;
      });

      imagePromises.push(imagePromise);
      images.push(img);
    }

    function render(): void {
      const frame: number = Math.floor(imageSeq.frame);
      const img: HTMLImageElement = images[frame - 1];
      if (!img || !context) return;

      const scale: number = Math.max(
        canvas.width / img.width,
        canvas.height / img.height,
      );
      const x: number = canvas.width / 2 - (img.width / 2) * scale;
      const y: number = canvas.height / 2 - (img.height / 2) * scale;

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, x, y, img.width * scale, img.height * scale);
    }

    function resizeCanvas(): void {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      render();
    }

    Promise.all(imagePromises)
      .then((): void => {
        resizeCanvas();

        //---New approach----
        let currentFrame: number = 1;
        let animationSpeed: number = 0;
        let animationId: number | null = null;

        function animateFrames(): void {
          animationSpeed *= 0.95;
          currentFrame += animationSpeed;
          if (currentFrame > frameCount) {
            currentFrame = 1 + (currentFrame - frameCount);
          } else if (currentFrame < 1) {
            currentFrame = frameCount - (1 - currentFrame);
          }

          imageSeq.frame = currentFrame;
          render();

          if (Math.abs(animationSpeed) > 0.001) {
            animationId = requestAnimationFrame(animateFrames);
          } else {
            animationId = null;
          }
        }

        // Функция для запуска анимации из любого места
        function triggerAnimation(deltaY: number): void {
          const scrollSpeed: number = deltaY * 0.002;
          animationSpeed += scrollSpeed;

          const maxSpeed: number = 3;
          animationSpeed = Math.max(
            -maxSpeed,
            Math.min(maxSpeed, animationSpeed),
          );

          if (animationId === null) {
            animationId = requestAnimationFrame(animateFrames);
          }
        }

        // Слушаем кастомное событие от любого источника
        document.addEventListener("scrollAnimation", (event: Event): void => {
          const customEvent = event as CustomEvent;
          triggerAnimation(customEvent.detail.deltaY);
        });

        canvas.addEventListener(
          "wheel",
          (event: WheelEvent): void => {
            event.preventDefault();

            const scrollSpeed: number = event.deltaY * 0.001;
            animationSpeed += scrollSpeed;

            const maxSpeed: number = 2;
            animationSpeed = Math.max(
              -maxSpeed,
              Math.min(maxSpeed, animationSpeed),
            );

            if (animationId === null) {
              animationId = requestAnimationFrame(animateFrames);
            }
          },
          { passive: false },
        );

        render();

        window.addEventListener("resize", resizeCanvas);
      })
      .catch((error: any): void => {
        console.error("Error loading images:", error);
      });
  }
}

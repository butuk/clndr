import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { createElement } from "./helpFunctions.js";

export class IndicatorOfScroll {
  images: Array<HTMLImageElement>;
  canvas: HTMLCanvasElement;
  imageSeq: { frame: number };
  context: CanvasRenderingContext2D | null;

  constructor() {
    gsap.registerPlugin(ScrollTrigger);

    //Frames count by Vite glob import
    const frameModules = import.meta.glob("/src/frames-sequence/*.svg");
    const frameCount: number = Object.keys(frameModules).length;
    this.images = [];
    this.imageSeq = { frame: 1 };

    //Animation creation
    const animationContainer = createElement("div", "indicator");
    this.canvas = createElement(
      "canvas",
      "animation",
      "animation",
    ) as HTMLCanvasElement;

    this.context = this.canvas.getContext("2d");

    //Frames loading
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
      this.images.push(img);
    }

    this.render();

    Promise.all(imagePromises)
      .then((): void => {
        this.resizeCanvas();

        let currentFrame: number = 1;
        let animationSpeed: number = 0;
        let animationId: number | null = null;

        const animateFrames = (): void => {
          animationSpeed *= 0.906125;
          currentFrame += animationSpeed;
          if (currentFrame > frameCount) {
            currentFrame = 1 + (currentFrame - frameCount);
          } else if (currentFrame < 1) {
            currentFrame = frameCount - (1 - currentFrame);
          }

          this.imageSeq.frame = currentFrame;
          this.render();

          if (Math.abs(animationSpeed) > 0.001) {
            animationId = requestAnimationFrame(animateFrames);
          } else {
            animationId = null;
          }
        };

        // Функция для запуска анимации из любого места
        function triggerAnimation(deltaY: number, deltaX: number = 0): void {
          const scrollSpeed: number = (deltaY + deltaX) * 0.002;
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
          triggerAnimation(
            customEvent.detail.deltaY,
            customEvent.detail.deltaX || 0,
          );
        });

        this.canvas.addEventListener(
          "wheel",
          (event: WheelEvent): void => {
            event.preventDefault();

            const scrollSpeed: number = (event.deltaY + event.deltaX) * 0.001;
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

        this.render();

        window.addEventListener("resize", this.resizeCanvas);
      })
      .catch((error: any): void => {
        console.error("Error loading images:", error);
      });

    animationContainer.append(this.canvas);
    document.body.append(animationContainer);
  }

  render(): void {
    const frame: number = Math.floor(this.imageSeq.frame);
    const img: HTMLImageElement = this.images[frame - 1];
    if (!img || !this.context) return;

    const scale: number = Math.max(
      this.canvas.width / img.width,
      this.canvas.height / img.height,
    );
    const x: number = this.canvas.width / 2 - (img.width / 2) * scale;
    const y: number = this.canvas.height / 2 - (img.height / 2) * scale;

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.drawImage(img, x, y, img.width * scale, img.height * scale);
  }

  resizeCanvas = (): void => {
    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;
    this.render();
  };

  loadFrames() {}
}

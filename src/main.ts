import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
//----
import "./styles.scss";
import { Visualization } from "./ts/Visualization.ts";
import State from "./ts/State.ts";
import { IndicatorForYear } from "./ts/IndicatorForYear.ts";
import { ButtonPlus } from "./ts/ButtonPlus.ts";
import { ButtonMinus } from "./ts/ButtonMinus.ts";
import { IndicatorButtonReset } from "./ts/IndicatorButtonReset.js";

// User's browser tab title
const date = new Date();
document.title = `${date.getDate()}.${
  date.getMonth() + 1
}.${date.getFullYear()}`;

// Disable context menu
window.oncontextmenu = (event) => {
  event.preventDefault();
  event.stopPropagation();
  return false;
};

// Create main content
document.addEventListener("DOMContentLoaded", () => {
  // System state
  const state = State.getInstance();
  state.set("year", new Date().getFullYear());

  const container: HTMLElement | null = document.querySelector(".content");
  const appHeader: HTMLElement | null = document.querySelector("#year");
  if (appHeader) {
    new IndicatorForYear(appHeader);
  }

  const buttonPlus: HTMLElement | null = document.querySelector("#plus");
  if (buttonPlus) {
    new ButtonPlus(buttonPlus);
  }
  const buttonMinus: HTMLElement | null = document.querySelector("#minus");
  if (buttonMinus) {
    new ButtonMinus(buttonMinus);
  }

  const buttonReset: HTMLElement | null = document.querySelector("#reset");
  if (buttonReset) {
    new IndicatorButtonReset(buttonReset);
  }

  if (!container) {
    throw new Error("Container element not found");
  } else {
    new Visualization(container);
  }

  //----

  gsap.registerPlugin(ScrollTrigger);

  const frameCount: number = 18;
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
      img.src = `/src/animation/${num}.svg`;
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
      console.log("All images loaded successfully");
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
      //---------

      // Try to use the new element as scroll trigger
      /*gsap.to(imageSeq, {
        frame: frameCount,
        snap: "frame",
        ease: "none",
        scrollTrigger: {
          trigger: canvas,
          start: "top top",
          end: "+=500%",
          scrub: true,
          markers: true,
        },
        onUpdate: render,
      });

      window.addEventListener("resize", resizeCanvas);*/
    })
    .catch((error: any): void => {
      console.error("Error loading images:", error);
    });
});

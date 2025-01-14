export function createElement(element, className) {
  const result = document.createElement(`${element}`);
  if (className) {
    result.classList.add(`${className}`);
  }
  return result;
}

export function markElementAmongOthers(element, markClass) {
  if (element && element.parentElement) {
    for (let i = 0; i < element.parentElement.children.length; i++) {
      element.parentElement.children[i].classList.remove(markClass);
    }
    element.classList.add(markClass);
  }
}

export function createNameCell(place, text) {
  const element = document.createElement("div");
  element.classList.add("name");
  element.textContent = text;
  place.append(element);
}

export function intToRoman(num) {
  const romanNumerals = [
    { value: 1000, symbol: "M" },
    { value: 900, symbol: "CM" },
    { value: 500, symbol: "D" },
    { value: 400, symbol: "CD" },
    { value: 100, symbol: "C" },
    { value: 90, symbol: "XC" },
    { value: 50, symbol: "L" },
    { value: 40, symbol: "XL" },
    { value: 10, symbol: "X" },
    { value: 9, symbol: "IX" },
    { value: 5, symbol: "V" },
    { value: 4, symbol: "IV" },
    { value: 1, symbol: "I" },
  ];

  let result = "";
  for (const { value, symbol } of romanNumerals) {
    while (num >= value) {
      result += symbol;
      num -= value;
    }
  }
  return result;
}

export function throttle(func, limit) {
  let lastFunc;
  let lastRan;
  return function () {
    const context = this;
    const args = arguments;
    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(
        function () {
          if (Date.now() - lastRan >= limit) {
            func.apply(context, args);
            lastRan = Date.now();
          }
        },
        limit - (Date.now() - lastRan),
      );
    }
  };
}

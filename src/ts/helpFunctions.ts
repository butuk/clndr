export function createElement(
  tag: string,
  className?: string,
): HTMLElement | SVGElement {
  const svgTags = [
    "svg",
    "circle",
    "rect",
    "path",
    "g",
    "line",
    "ellipse",
    "polygon",
    "polyline",
    "text",
  ];
  const el = svgTags.includes(tag)
    ? document.createElementNS("http://www.w3.org/2000/svg", tag)
    : document.createElement(tag);
  if (className) el.setAttribute("class", className);
  return el;
}

export function intToRoman(num: number): string {
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

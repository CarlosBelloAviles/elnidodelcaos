import { useEffect, useState } from "react";

const useCarousel = <T>(items: T[], interval: number = 10000) => {
const [currentSlide, setCurrentSlide] = useState<number>(0);

const nextSlide = (): void => {
setCurrentSlide((prev) =>
prev === items.length - 1 ? 0 : prev + 1
);
};

const prevSlide = (): void => {
setCurrentSlide((prev) =>
prev === 0 ? items.length - 1 : prev - 1
);
};

useEffect(() => {
if (items.length <= 1) return;


const timer = setInterval(() => {
  setCurrentSlide((prev) =>
    prev === items.length - 1 ? 0 : prev + 1
  );
}, interval);

return () => clearInterval(timer);


}, [items.length, interval]);

return {
currentSlide,
setCurrentSlide,
nextSlide,
prevSlide,
};
};

export default useCarousel;

import { useEffect, useState } from "react";

const useCarousel = <T>(items: T[], interval: number = 10000) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

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

  const togglePause = (): void => {
    setIsPaused((prev) => !prev);
  };

  useEffect(() => {
    if (items.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === items.length - 1 ? 0 : prev + 1
      );
    }, interval);

    return () => clearInterval(timer);
  }, [items.length, interval, isPaused]);

  return {
    currentSlide,
    setCurrentSlide,
    nextSlide,
    prevSlide,
    isPaused,
    togglePause,
  };
};

export default useCarousel;


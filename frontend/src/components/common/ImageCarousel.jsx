import React, { useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiImage } from 'react-icons/fi'; // Icons

const ImageCarousel = ({ images = [], altText = "Listing image", className = "w-full h-64 md:h-96" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className={`${className} bg-neutral-light flex items-center justify-center rounded-lg`}>
        <FiImage className="text-5xl text-neutral-dark" />
        <span className="ml-2 text-neutral-dark">No images</span>
      </div>
    );
  }

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };

  return (
    <div className={`relative ${className} overflow-hidden rounded-lg shadow-md group`}>
      {/* Image */}
      <div
        style={{ backgroundImage: `url(${images[currentIndex]?.url})` }}
        className="w-full h-full bg-center bg-cover duration-500 ease-in-out transform group-hover:scale-105 transition-transform"
        aria-label={`${altText} ${currentIndex + 1} of ${images.length}`}
      ></div>

      {/* Left Arrow */}
      {images.length > 1 && (
        <button
          onClick={goToPrevious}
          className="absolute top-1/2 left-3 transform -translate-y-1/2 bg-black bg-opacity-30 text-white p-2 rounded-full hover:bg-opacity-50 transition-all duration-300 focus:outline-none opacity-0 group-hover:opacity-100"
          aria-label="Previous image"
        >
          <FiChevronLeft size={24} />
        </button>
      )}

      {/* Right Arrow */}
      {images.length > 1 && (
        <button
          onClick={goToNext}
          className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-black bg-opacity-30 text-white p-2 rounded-full hover:bg-opacity-50 transition-all duration-300 focus:outline-none opacity-0 group-hover:opacity-100"
          aria-label="Next image"
        >
          <FiChevronRight size={24} />
        </button>
      )}

      {/* Dots */}
      {images.length > 1 && (
         <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {images.map((_, slideIndex) => (
            <button
                key={slideIndex}
                onClick={() => goToSlide(slideIndex)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentIndex === slideIndex ? 'bg-primary scale-125' : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                }`}
                aria-label={`Go to image ${slideIndex + 1}`}
            ></button>
            ))}
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;
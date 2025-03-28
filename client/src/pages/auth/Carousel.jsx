import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

const Carousel = ({ 
  images, 
  autoPlayInterval = 3000, 
  showControls = true,
  showIndicators = true 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);

  // Navigate to next slide
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Navigate to previous slide
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // Go to specific slide
  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Auto-play logic
  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(nextSlide, autoPlayInterval);
      return () => clearInterval(intervalRef.current);
    }
  }, [isPaused, autoPlayInterval]);

  return (
    <div 
      className="w-full h-screen relative group mb-2"
    >
      {/* Main Image Container */}
      <div 
        className="absolute inset-0 overflow-hidden"
      >
        {/* Slide Wrapper */}
        <div 
          className="relative w-full h-full"
        >
          {images.map((image, index) => (
            <div 
              key={index} 
              className={`absolute inset-0 transition-all duration-700 ease-in-out 
                         transform ${currentIndex === index 
                           ? 'opacity-100 scale-100 z-10' 
                           : 'opacity-0 scale-95 z-0'}`}
            >
              <img 
                src={image.src} 
                alt={image.alt || `Slide ${index + 1}`} 
                className="w-full h-full object-cover 
                           filter brightness-75 hover:brightness-100 
                           transition-all duration-300"
              />
              
              {/* Optional Slide Caption */}
              {image.caption && (
                <div className="absolute bottom-0 left-0 right-0 
                                bg-black/50 text-white p-4 
                                text-center font-medium 
                                opacity-0 group-hover:opacity-100 
                                transition-opacity duration-300">
                  {image.caption}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Navigation Controls */}
        {showControls && (
          <>
            <button 
              onClick={prevSlide}
              className="absolute top-1/2 left-4 -translate-y-1/2 
                         bg-white/10 hover:bg-white/20 
                         backdrop-blur-sm border border-white/20
                         text-white rounded-full p-2 
                         transition-all duration-300 
                         hover:scale-110 
                         z-20"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={nextSlide}
              className="absolute top-1/2 right-4 -translate-y-1/2 
                         bg-white/10 hover:bg-white/20 
                         backdrop-blur-sm border border-white/20
                         text-white rounded-full p-2 
                         transition-all duration-300 
                         hover:scale-110 
                         z-20"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Pause/Play Toggle */}
        <button 
          onClick={() => setIsPaused(!isPaused)}
          className="absolute bottom-4 right-4 
                     bg-white/10 hover:bg-white/20 
                     backdrop-blur-sm border border-white/20
                     text-white rounded-full p-2 
                     transition-all duration-300 
                     hover:scale-110
                     z-20"
        >
          {isPaused ? <Play size={20} /> : <Pause size={20} />}
        </button>
      </div>

      {/* Slide Indicators */}
      {showIndicators && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 
                        flex space-x-2 z-20">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 transition-all duration-300 cursor-pointer
                         ${currentIndex === index 
                           ? 'bg-blue-500 w-8 rounded-lg' 
                           : 'bg-gray-500/30 w-2 rounded-full hover:bg-gray-500/50'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel;
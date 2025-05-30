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

  // Handle touch events for swipe
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    
    const difference = touchStartX.current - touchEndX.current;
    const threshold = 50; // Minimum swipe distance
    
    if (difference > threshold) {
      // Swiped left, go to next slide
      nextSlide();
    } else if (difference < -threshold) {
      // Swiped right, go to previous slide
      prevSlide();
    }
    
    // Reset values
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div 
      className="w-full relative group mb-2"
      style={{ height: "min(100vh, 600px)" }} // Responsive height
    >
      {/* Main Image Container */}
      <div 
        className="absolute inset-0 overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
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
                                bg-black/50 text-white p-2 sm:p-4 
                                text-center text-sm sm:text-base font-medium 
                                opacity-100 sm:opacity-0 sm:group-hover:opacity-100 
                                transition-opacity duration-300">
                  {image.caption}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Navigation Controls - Responsive sizes and hidden on small screens unless hovered */}
        {showControls && (
          <>
            <button 
              onClick={prevSlide}
              className="absolute top-1/2 left-2 sm:left-4 -translate-y-1/2 
                         bg-white/10 hover:bg-white/20 
                         backdrop-blur-sm border border-white/20
                         text-white rounded-full p-1 sm:p-2 
                         transition-all duration-300 
                         hover:scale-110 
                         opacity-50 sm:opacity-0 group-hover:opacity-100
                         z-20"
              aria-label="Previous slide"
            >
              <ChevronLeft size={16} className="sm:hidden" />
              <ChevronLeft size={24} className="hidden sm:block" />
            </button>
            <button 
              onClick={nextSlide}
              className="absolute top-1/2 right-2 sm:right-4 -translate-y-1/2 
                         bg-white/10 hover:bg-white/20 
                         backdrop-blur-sm border border-white/20
                         text-white rounded-full p-1 sm:p-2 
                         transition-all duration-300 
                         hover:scale-110 
                         opacity-50 sm:opacity-0 group-hover:opacity-100
                         z-20"
              aria-label="Next slide"
            >
              <ChevronRight size={16} className="sm:hidden" />
              <ChevronRight size={24} className="hidden sm:block" />
            </button>
          </>
        )}

        {/* Pause/Play Toggle - Responsive positioning and sizing */}
        <button 
          onClick={() => setIsPaused(!isPaused)}
          className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4
                     bg-white/10 hover:bg-white/20 
                     backdrop-blur-sm border border-white/20
                     text-white rounded-full p-1 sm:p-2 
                     transition-all duration-300 
                     hover:scale-110
                     z-20"
          aria-label={isPaused ? "Play slideshow" : "Pause slideshow"}
        >
          {isPaused ? 
            <>
              <Play size={16} className="sm:hidden" />
              <Play size={20} className="hidden sm:block" />
            </> : 
            <>
              <Pause size={16} className="sm:hidden" />
              <Pause size={20} className="hidden sm:block" />
            </>
          }
        </button>
      </div>

      {/* Slide Indicators - Responsive spacing and sizing */}
      {showIndicators && (
        <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 
                        flex space-x-1 sm:space-x-2 z-20">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-1 sm:h-2 transition-all duration-300 cursor-pointer
                         ${currentIndex === index 
                           ? 'bg-blue-500 w-4 sm:w-8 rounded-lg' 
                           : 'bg-gray-500/30 w-1 sm:w-2 rounded-full hover:bg-gray-500/50'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel;
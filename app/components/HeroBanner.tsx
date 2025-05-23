'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useEffect, useState, useCallback } from 'react';

// Create explicit motion components for React 19 compatibility
const MotionH1 = motion.h1;
const MotionP = motion.p;
const MotionDiv = motion.div;

// Hero data interface
interface SliderImage {
  src: string;
  alt: string;
  label: string;
  description: string;
  buttonText?: string;
  buttonLink?: string;
  textPosition?: 'left' | 'center' | 'right';
}

interface HeroBannerProps {
  // Original props
  title?: string;
  subtitle?: string;
  sliderImages?: SliderImage[];
  buttonPrimary?: string;
  buttonPrimaryLink?: string;
  buttonSecondary?: string;
  buttonSecondaryLink?: string;
  
  // New props from Sanity
  headline?: string;
  subheadline?: string;
  imageUrl?: string;
  ctaText?: string;
  ctaLink?: string;
  leftTextBlur?: number;
}

// Default slider images if none provided
const defaultSliderImages = [
  {
    src: '/images/hero-door-window.jpg',
    alt: 'Modern luxury home with premium doors and windows',
    label: 'Premium Quality',
    description: 'Exceptional craftsmanship with innovative design, providing unmatched durability, efficiency, and aesthetics for your home.'
  },
  {
    src: '/images/slider-2.jpg',
    alt: 'Elegant French doors with glass panels',
    label: 'Stunning Designs',
    description: 'Enhance your living space with our elegant door and window designs that blend seamlessly with any architectural style.'
  },
  {
    src: '/images/slider-3.jpg',
    alt: 'Custom window installation in modern home',
    label: 'Expert Installation',
    description: 'Our team of experienced professionals ensures perfect fitting and finishing for all your door and window needs.'
  }
];

const HeroBanner = ({
  // Support both original props and new Sanity props
  title = "PREMIUM DOORS AND WINDOWS",
  subtitle = "Elevate your architecture, enhance natural light, and redefine your living spaces with our exquisite collection of premium quality doors and windows.",
  headline, // From Sanity
  subheadline, // From Sanity
  imageUrl, // From Sanity
  ctaText, // From Sanity
  ctaLink, // From Sanity
  leftTextBlur = 6, // Default blur value of 6px
  sliderImages = defaultSliderImages,
  buttonPrimary = "Free Consultation",
  buttonPrimaryLink = "/contact",
  buttonSecondary = "Call Us",
  buttonSecondaryLink = "tel:8182823437"
}: HeroBannerProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Use Sanity props if available, otherwise fall back to original props
  const displayTitle = headline || title;
  const displaySubtitle = subheadline || subtitle;
  const displayButtonPrimary = ctaText || buttonPrimary;
  const displayButtonPrimaryLink = ctaLink || buttonPrimaryLink;
  
  // If we have a single Sanity image, use that instead of slider images
  const useSingleImage = !!imageUrl;
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Auto-advance slider (only if not using a single Sanity image)
  useEffect(() => {
    if (!isMounted || useSingleImage) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isMounted, sliderImages.length, useSingleImage]);
  
  // Navigation handlers
  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);
  
  const goToPrevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + sliderImages.length) % sliderImages.length);
  }, [sliderImages.length]);
  
  const goToNextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
  }, [sliderImages.length]);

  return (
    <section className="relative min-h-[85vh] isolate">
      {/* Full-width background image - make it non-interactive */}
      {isMounted && (
        <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
          {useSingleImage ? (
            <Image
              src={imageUrl}
              alt="Featured image"
              fill
              priority
              className="object-cover"
            />
          ) : (
            sliderImages.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: currentSlide === index ? 1 : 0,
                  zIndex: currentSlide === index ? 1 : 0
                }}
                transition={{ duration: 0.7 }}
                className="absolute inset-0 w-full h-full pointer-events-none"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  priority={index === 0}
                  className="object-cover"
                />
              </motion.div>
            ))
          )}
          
          {/* Overlay - Less dense on mobile */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-black/10 md:from-black/60 md:via-black/40 md:to-black/20 pointer-events-none"></div>
        </div>
      )}
      
      {/* Content */}
      <div className="relative z-10 min-h-[85vh] flex flex-col md:flex-row">
        {/* Left side text container with reduced blur */}
        <div className="w-full md:w-2/5 min-h-[60vh] md:min-h-[85vh] flex items-center relative">
          {/* Mobile overlay - minimal blur on mobile */}
          <div 
            className="absolute inset-0 bg-black/30 md:hidden pointer-events-none"
            style={{ backdropFilter: `blur(${Math.max(1, Math.floor(leftTextBlur/3))}px)` }}
          ></div>
          
          {/* Desktop blur container - use lower blur value */}
          <div 
            className="hidden md:block absolute inset-y-0 left-0 w-full bg-black/30 pointer-events-none"
            style={{ backdropFilter: `blur(${leftTextBlur}px)` }}
          ></div>
          
          <div className="relative z-20 w-full max-w-xl pl-4 sm:pl-8 md:pl-12 pr-4 sm:pr-8 md:pr-12 py-6 sm:py-8 md:py-12">
            <MotionDiv
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-block mb-4 px-4 py-1.5 rounded-full bg-red-600/20 border border-red-600/30"
            >
              <span className="text-white text-sm font-medium tracking-wide">
                15+ Years of Industry Experience
              </span>
            </MotionDiv>
            
            {/* Logo aligned with text and smaller */}
            <div className="relative w-40 h-40 md:w-44 md:h-44 -mb-8 md:-mb-10 ml-0">
              <Image
                src="/calidw.png"
                alt="Cali Doors and Windows Logo"
                fill
                className="object-contain object-left invert brightness-0 filter"
                priority
              />
            </div>
            
            <MotionH1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl md:text-5xl xl:text-6xl font-bold text-white tracking-tight !leading-tight mt-0 mb-4 text-left"
            >
              {displayTitle}
            </MotionH1>
            
            <MotionP 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg text-white/90 mb-10 max-w-xl text-left"
            >
              {displaySubtitle}
            </MotionP>
            
            {/* COMPLETELY REBUILT BUTTON SECTION - FURTHER IMPROVED */}
            <div className="mt-6 mb-10 flex flex-wrap gap-4 relative" style={{ zIndex: 9999 }}>
              {/* Primary Button - Get Consultation */}
              <a 
                href={displayButtonPrimaryLink || "/contact"} 
                style={{
                  display: 'inline-block',
                  position: 'relative',
                  zIndex: 9999,
                  padding: '16px 32px',
                  background: 'linear-gradient(to right, #991b1b, #b91c1c)',
                  color: 'white',
                  fontWeight: 'bold',
                  borderRadius: '9999px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                  cursor: 'pointer',
                  pointerEvents: 'auto',
                  textDecoration: 'none'
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('Primary button clicked');
                  window.location.href = displayButtonPrimaryLink || "/contact";
                }}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                >
                  {displayButtonPrimary}
              </a>
              
              {/* Secondary Button - Call Us */}
              {buttonSecondary && (
                <a 
                  href={buttonSecondaryLink || "#"} 
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    position: 'relative', 
                    zIndex: 9999,
                    padding: '16px 32px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(4px)',
                    color: 'white',
                    fontWeight: 'bold',
                    borderRadius: '9999px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    cursor: 'pointer',
                    pointerEvents: 'auto',
                    textDecoration: 'none'
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Secondary button clicked');
                    if (buttonSecondaryLink) {
                      window.location.href = buttonSecondaryLink;
                    }
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                >
                  {buttonSecondaryLink?.startsWith('tel:') && (
                    <svg xmlns="http://www.w3.org/2000/svg" style={{ width: '20px', height: '20px', marginRight: '8px' }} viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  )}
                  {buttonSecondary}
                </a>
              )}
            </div>
            
            <MotionDiv 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4 text-base text-white/90 justify-start"
            >
              <div className="flex items-center">
                <div className="flex text-red-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="ml-2 font-medium text-white">4.9/5 <span className="text-white/80 font-normal">(200+ reviews)</span></p>
              </div>
              <div className="flex items-center">
                <svg className="h-6 w-6 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>200+ satisfied clients</span>
              </div>
            </MotionDiv>
          </div>
        </div>
        
        {/* Right empty side to allow image to show */}
        <div className="hidden md:block md:w-3/5"></div>
      </div>
      
      {/* Slider navigation - fix z-index and make them explicitly interactive */}
      {!useSingleImage && sliderImages.length > 1 && (
        <>
          {/* Arrow navigation */}
          <div className="hidden sm:block absolute z-30 inset-y-0 left-0 right-0 pointer-events-none">
            <button 
              onClick={goToPrevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 flex items-center justify-center transition duration-300 pointer-events-auto"
              aria-label="Previous slide"
            >
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={goToNextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 flex items-center justify-center transition duration-300 pointer-events-auto"
              aria-label="Next slide"
            >
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          {/* Dot navigation */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2 pointer-events-none">
            {sliderImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 w-2 rounded-full transition-all duration-300 pointer-events-auto ${
                  currentSlide === index 
                    ? 'bg-white w-6' 
                    : 'bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default HeroBanner; 
// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Global Lenis instance (initialized after splash screen)
let lenis = null;

// =============================================
// UTILITY FUNCTIONS
// =============================================

// Throttle function for performance-critical handlers
function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Debounce function for resize handlers
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Device capability detection
const deviceCapabilities = {
    hasTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
    prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    isLowPowerMode: navigator.getBattery ? null : false, // Will be async checked
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight
};

// Check for low power mode (async)
if (navigator.getBattery) {
    navigator.getBattery().then(battery => {
        deviceCapabilities.isLowPowerMode = battery.level < 0.2 && !battery.charging;
    });
}

// =============================================
// MOBILE NAVIGATION (Enhanced)
// =============================================

function initMobileNav() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const closeBtn = document.getElementById('mobile-nav-close');
    const backdrop = document.getElementById('mobile-nav-backdrop');
    const mobileNav = document.getElementById('mobile-nav');
    const drawer = document.getElementById('mobile-nav-drawer');
    const navLinks = document.querySelectorAll('.mobile-nav-link');

    // Focusable elements for focus trap
    const focusableElements = drawer?.querySelectorAll(
        'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements?.[0];
    const lastFocusable = focusableElements?.[focusableElements.length - 1];

    // Touch gesture state
    let touchStartX = 0;
    let touchEndX = 0;
    const swipeThreshold = 50;

    function openNav() {
        document.body.classList.add('mobile-nav-open');

        // Update ARIA states
        menuBtn?.setAttribute('aria-expanded', 'true');
        mobileNav?.setAttribute('aria-hidden', 'false');

        // Disable lenis scroll when nav is open
        if (lenis) lenis.stop();

        // Focus the close button for accessibility
        setTimeout(() => closeBtn?.focus(), 100);
    }

    function closeNav() {
        document.body.classList.remove('mobile-nav-open');

        // Update ARIA states
        menuBtn?.setAttribute('aria-expanded', 'false');
        mobileNav?.setAttribute('aria-hidden', 'true');

        // Re-enable lenis scroll
        if (lenis) lenis.start();

        // Return focus to menu button
        menuBtn?.focus();
    }

    // Focus trap for accessibility
    function handleFocusTrap(e) {
        if (!document.body.classList.contains('mobile-nav-open')) return;

        if (e.key === 'Tab') {
            if (e.shiftKey) {
                // Shift + Tab
                if (document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable?.focus();
                }
            } else {
                // Tab
                if (document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable?.focus();
                }
            }
        }
    }

    // Swipe gesture handlers for touch devices
    function handleTouchStart(e) {
        touchStartX = e.changedTouches[0].screenX;
    }

    function handleTouchEnd(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipeGesture();
    }

    function handleSwipeGesture() {
        const swipeDistance = touchEndX - touchStartX;
        // Swipe right to close (drawer is on the right)
        if (swipeDistance > swipeThreshold && document.body.classList.contains('mobile-nav-open')) {
            closeNav();
        }
    }

    // Toggle on hamburger click
    menuBtn?.addEventListener('click', () => {
        if (document.body.classList.contains('mobile-nav-open')) {
            closeNav();
        } else {
            openNav();
        }
    });

    // Close on X button
    closeBtn?.addEventListener('click', closeNav);

    // Close on backdrop click
    backdrop?.addEventListener('click', closeNav);

    // Close on nav link click (smooth scroll to section)
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            closeNav();
            // Small delay to let the drawer close before scrolling
            setTimeout(() => {
                const targetId = link.getAttribute('href');
                if (targetId && targetId.startsWith('#')) {
                    const target = document.querySelector(targetId);
                    if (target && lenis) {
                        lenis.scrollTo(target, { offset: -80 });
                    }
                }
            }, 300);
            e.preventDefault();
        });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.body.classList.contains('mobile-nav-open')) {
            closeNav();
        }
    });

    // Focus trap
    document.addEventListener('keydown', handleFocusTrap);

    // Touch gestures for closing drawer
    if (deviceCapabilities.hasTouch) {
        drawer?.addEventListener('touchstart', handleTouchStart, { passive: true });
        drawer?.addEventListener('touchend', handleTouchEnd, { passive: true });
    }
}

// Initialize mobile nav immediately
initMobileNav();

// PRIME Animation Logic
document.addEventListener("DOMContentLoaded", () => {

    // =============================================
    // PREMIUM SPLASH SCREEN ANIMATION
    // =============================================

    const splashScreen = document.getElementById('splash-screen');
    const splashParticles = document.querySelector('.splash-particles');
    const splashProgressBar = document.querySelector('.splash-progress-bar');

    // Add splash-active class to body
    document.body.classList.add('splash-active');

    // Generate floating particles
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'splash-particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.bottom = `${Math.random() * 30}%`;
        particle.style.animationDelay = `${Math.random() * 2}s`;
        particle.style.animationDuration = `${2 + Math.random() * 2}s`;
        splashParticles.appendChild(particle);
    }

    // Create splash animation timeline
    const splashTl = gsap.timeline();

    // Animate shanyrak rings drawing in
    splashTl
        .to('.splash-ring-1', {
            strokeDashoffset: 0,
            duration: 1.2,
            ease: 'power2.inOut'
        })
        .to('.splash-ring-2', {
            strokeDashoffset: 0,
            duration: 1,
            ease: 'power2.inOut'
        }, '-=0.8')
        .to('.splash-ring-3', {
            strokeDashoffset: 0,
            duration: 0.8,
            ease: 'power2.inOut'
        }, '-=0.6')
        .to('.splash-center', {
            opacity: 1,
            scale: 1.2,
            duration: 0.4,
            ease: 'back.out(1.7)'
        }, '-=0.3')
        .to('.splash-beams', {
            opacity: 0.6,
            duration: 0.6,
            ease: 'power2.out'
        }, '-=0.2')
        .to('.splash-title', {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out'
        }, '-=0.4')
        .to('.splash-ornament', {
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.out'
        }, '-=0.5');

    // Animate progress bar based on actual loading
    let loadProgress = 0;
    const updateProgress = () => {
        gsap.to(splashProgressBar, {
            width: `${loadProgress}%`,
            duration: 0.3,
            ease: 'power1.out'
        });
    };

    // Simulate initial progress while loading
    const progressInterval = setInterval(() => {
        if (loadProgress < 70) {
            loadProgress += Math.random() * 15;
            updateProgress();
        }
    }, 200);

    // Exit splash screen function
    function exitSplash() {
        clearInterval(progressInterval);

        // Complete progress bar
        loadProgress = 100;
        updateProgress();

        // Delay then exit
        setTimeout(() => {
            // Add exit animation class
            splashScreen.classList.add('splash-exit');

            // Remove splash after animation
            setTimeout(() => {
                splashScreen.style.display = 'none';
                document.body.classList.remove('splash-active');

                // Initialize Lenis after splash
                initLenis();
            }, 1000);
        }, 300);
    }

    // Wait for window load (all assets) or minimum time
    const minSplashDuration = 2500; // Minimum splash time in ms
    const splashStartTime = Date.now();

    window.addEventListener('load', () => {
        const elapsed = Date.now() - splashStartTime;
        const remainingTime = Math.max(0, minSplashDuration - elapsed);

        setTimeout(exitSplash, remainingTime);
    });

    // Fallback: Exit splash after max time regardless
    setTimeout(() => {
        if (splashScreen.style.display !== 'none') {
            exitSplash();
        }
    }, 6000);

    // =============================================
    // LENIS SMOOTH SCROLL (Initialized after splash)
    // =============================================

    // lenis is now global

    function initLenis() {
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smooth: true,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }

    // =============================================
    // SCROLLYTELLING HERO - Frame Sequence Animation
    // =============================================

    const canvas = document.getElementById('scroll-canvas');
    const ctx = canvas.getContext('2d');
    const loader = document.getElementById('scroll-loader');
    const scrollIndicator = document.getElementById('scroll-indicator');

    // Frame configuration
    const frameCount = 240;
    const images = [];
    let imagesLoaded = 0;
    let currentFrame = 0;

    // Set canvas size (debounced for performance)
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Update device capabilities
        deviceCapabilities.viewportWidth = window.innerWidth;
        deviceCapabilities.viewportHeight = window.innerHeight;

        // Redraw current frame after resize
        if (images[currentFrame]?.complete) {
            drawFrame(currentFrame);
        }
    }

    // Debounced resize for performance
    const debouncedResize = debounce(resizeCanvas, 150);
    resizeCanvas();
    window.addEventListener('resize', debouncedResize);

    // Handle orientation change specifically
    window.addEventListener('orientationchange', () => {
        setTimeout(resizeCanvas, 100);
    });

    // Draw a single frame to canvas (cover fit)
    function drawFrame(index) {
        const img = images[index];
        if (!img || !img.complete) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Calculate cover fit
        const imgRatio = img.width / img.height;
        const canvasRatio = canvas.width / canvas.height;

        let drawWidth, drawHeight, offsetX, offsetY;

        if (canvasRatio > imgRatio) {
            drawWidth = canvas.width;
            drawHeight = canvas.width / imgRatio;
            offsetX = 0;
            offsetY = (canvas.height - drawHeight) / 2;
        } else {
            drawHeight = canvas.height;
            drawWidth = canvas.height * imgRatio;
            offsetX = (canvas.width - drawWidth) / 2;
            offsetY = 0;
        }

        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    }

    // Progressive frame loading with priority
    function preloadFrames() {
        // Load critical frames first (first, last, and keyframes)
        const criticalFrames = [1, 60, 120, 180, 240];
        const regularFrames = [];

        for (let i = 1; i <= frameCount; i++) {
            if (!criticalFrames.includes(i)) {
                regularFrames.push(i);
            }
        }

        // Load a single frame
        function loadFrame(frameNum) {
            return new Promise((resolve) => {
                const img = new Image();
                const paddedIndex = String(frameNum).padStart(3, '0');
                img.src = `frames/ezgif-frame-${paddedIndex}.jpg`;

                img.onload = () => {
                    imagesLoaded++;
                    // Draw first frame when loaded
                    if (frameNum === 1) {
                        drawFrame(0);
                    }
                    // Hide loader when enough frames are ready (70% threshold)
                    if (imagesLoaded >= frameCount * 0.7 && loader.style.display !== 'none') {
                        gsap.to(loader, {
                            opacity: 0,
                            duration: 0.5,
                            onComplete: () => {
                                loader.style.display = 'none';
                            }
                        });
                    }
                    resolve();
                };

                img.onerror = () => resolve(); // Continue even on error
                images[frameNum - 1] = img;
            });
        }

        // Load critical frames immediately
        const criticalPromises = criticalFrames.map(loadFrame);

        // Load remaining frames with requestIdleCallback or setTimeout fallback
        Promise.all(criticalPromises).then(() => {
            let frameIndex = 0;

            function loadNextBatch() {
                const batchSize = deviceCapabilities.isLowPowerMode ? 5 : 10;
                const endIndex = Math.min(frameIndex + batchSize, regularFrames.length);

                for (let i = frameIndex; i < endIndex; i++) {
                    loadFrame(regularFrames[i]);
                }

                frameIndex = endIndex;

                if (frameIndex < regularFrames.length) {
                    if ('requestIdleCallback' in window) {
                        requestIdleCallback(loadNextBatch, { timeout: 1000 });
                    } else {
                        setTimeout(loadNextBatch, 50);
                    }
                }
            }

            loadNextBatch();
        });
    }
    preloadFrames();

    // GSAP ScrollTrigger for frame animation
    gsap.to({}, {
        scrollTrigger: {
            trigger: "#scrollytelling-hero",
            start: "top top",
            end: "bottom bottom",
            scrub: 0.3,
            onUpdate: (self) => {
                const frameIndex = Math.min(
                    frameCount - 1,
                    Math.floor(self.progress * frameCount)
                );
                if (frameIndex !== currentFrame) {
                    currentFrame = frameIndex;
                    drawFrame(currentFrame);
                }
            }
        }
    });

    // Text Overlay Animations
    const heroText1 = document.getElementById('hero-text-1');
    const heroText2 = document.getElementById('hero-text-2');
    const heroText3 = document.getElementById('hero-text-3');

    // Text 1: Fade out from 20% to 35%
    gsap.to(heroText1, {
        scrollTrigger: {
            trigger: "#scrollytelling-hero",
            start: "20% top",
            end: "35% top",
            scrub: true
        },
        opacity: 0,
        y: -50
    });

    // Text 2: Fade in 30-45%, fade out 55-70%
    gsap.fromTo(heroText2,
        { opacity: 0, x: -50 },
        {
            scrollTrigger: {
                trigger: "#scrollytelling-hero",
                start: "30% top",
                end: "45% top",
                scrub: true
            },
            opacity: 1,
            x: 0
        }
    );
    gsap.to(heroText2, {
        scrollTrigger: {
            trigger: "#scrollytelling-hero",
            start: "55% top",
            end: "70% top",
            scrub: true
        },
        opacity: 0,
        x: -50
    });

    // Text 3: Fade in 60-75%, stay visible
    gsap.fromTo(heroText3,
        { opacity: 0, x: 50 },
        {
            scrollTrigger: {
                trigger: "#scrollytelling-hero",
                start: "60% top",
                end: "75% top",
                scrub: true
            },
            opacity: 1,
            x: 0
        }
    );

    // Hide scroll indicator after scrolling starts
    gsap.to(scrollIndicator, {
        scrollTrigger: {
            trigger: "#scrollytelling-hero",
            start: "5% top",
            end: "15% top",
            scrub: true
        },
        opacity: 0
    });

    // 1. Hero Title Entrance Animation
    const tl = gsap.timeline();
    tl.from(".hero-title span", {
        y: 100,
        opacity: 0,
        stagger: 0.1,
        duration: 1.2,
        ease: "power4.out"
    }, "0.5")
        .from(".hero-subtitle", {
            y: 20,
            opacity: 0,
            duration: 1,
            ease: "power2.out"
        }, "-=0.8");

    // 3. Parallax Elements (Shanyrak Background)
    gsap.to(".bg-shanyrak", {
        scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: 1
        },
        rotation: 360,
        y: 200
    });

    // 3. Section Titles Reveal
    document.querySelectorAll(".section-title").forEach(title => {
        gsap.from(title, {
            scrollTrigger: {
                trigger: title,
                start: "top 85%",
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "circ.out"
        });
    });

    // 4. Cards Reveal
    const cards = document.querySelectorAll(".heritage-card");
    cards.forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top 90%",
            },
            y: 100,
            opacity: 0,
            duration: 1,
            delay: index * 0.1,
            ease: "power3.out"
        });
    });

    // 5. Statistics Counter
    document.querySelectorAll(".stat-value").forEach(stat => {
        const value = parseInt(stat.getAttribute("data-value"));
        gsap.from(stat, {
            scrollTrigger: {
                trigger: stat,
                start: "top 80%",
            },
            textContent: 0,
            duration: 2,
            ease: "power1.out",
            snap: { textContent: 1 },
            stagger: 1,
            onUpdate: function () {
                this.targets()[0].innerHTML = Math.ceil(this.targets()[0].textContent);
            }
        });
    });
});

// Shanyrak SVG Geometry Construction (simple visual)
// This would be called to generate the background SVG if not hardcoded in HTML
console.log("Heritage System Online");

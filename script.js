// Initialize Lenis for smooth scrolling
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// PRIME Animation Logic
document.addEventListener("DOMContentLoaded", () => {

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

    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        // Redraw current frame after resize
        if (images[currentFrame]?.complete) {
            drawFrame(currentFrame);
        }
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

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

    // Preload all frames
    function preloadFrames() {
        for (let i = 1; i <= frameCount; i++) {
            const img = new Image();
            const paddedIndex = String(i).padStart(3, '0');
            img.src = `frames/ezgif-frame-${paddedIndex}.jpg`;

            img.onload = () => {
                imagesLoaded++;
                // Draw first frame when loaded
                if (i === 1) {
                    drawFrame(0);
                }
                // Hide loader when all frames are ready
                if (imagesLoaded === frameCount) {
                    gsap.to(loader, {
                        opacity: 0,
                        duration: 0.5,
                        onComplete: () => {
                            loader.style.display = 'none';
                        }
                    });
                }
            };

            images.push(img);
        }
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

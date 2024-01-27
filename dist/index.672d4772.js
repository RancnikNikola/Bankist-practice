"use strict";
///////////////////////////////////////
// Modal window
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");
const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");
const nav = document.querySelector(".nav");
const header = document.querySelector("header");
const allSections = document.querySelectorAll(".section");
const imgTargets = document.querySelectorAll("img[data-src]");
const slider = document.querySelector(".slider");
const slides = document.querySelectorAll(".slide");
const btnLeft = document.querySelector(".slider__btn--left");
const btnRight = document.querySelector(".slider__btn--right");
const dotContainer = document.querySelector(".dots");
const openModal = function(e) {
    e.preventDefault();
    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");
};
const closeModal = function() {
    modal.classList.add("hidden");
    overlay.classList.add("hidden");
};
btnsOpenModal.forEach((btn)=>btn.addEventListener("click", openModal));
btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);
document.addEventListener("keydown", function(e) {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) closeModal();
});
btnScrollTo.addEventListener("click", function(e) {
    // const s1coords = section1.getBoundingClientRect();
    // Scrolling
    // Old school way
    // window.scrollTo(
    //   s1coords.left + window.scrollX, 
    //   s1coords.top + window.scrollY
    // );
    // Scrolling
    // Old school way
    // window.scrollTo({
    //   left: s1coords.left + window.scrollX, 
    //   top: s1coords.top + window.scrollY,
    //   behavior: 'smooth'
    // })
    // new school
    // only modern browsers
    section1.scrollIntoView({
        behavior: "smooth"
    });
});
// Tabbed component
// event delegation
tabsContainer.addEventListener("click", function(e) {
    const clicked = e.target.closest(".operations__tab");
    // Guard clause
    if (!clicked) return;
    // remove classes
    tabs.forEach((t)=>t.classList.remove("operations__tab--active"));
    tabsContent.forEach((c)=>c.classList.remove("operations__content--active"));
    // Active Tab
    clicked.classList.add("operations__tab--active");
    // Activate content area
    document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add("operations__content--active");
});
// Menu fade animation
const handleHover = function(e) {
    if (e.target.classList.contains("nav__link")) {
        const link = e.target;
        const siblings = link.closest(".nav").querySelectorAll(".nav__link");
        const logo = link.closest(".nav").querySelector("img");
        siblings.forEach((el)=>{
            if (el !== link) el.style.opacity = this;
        });
        logo.style.opacity = this;
    }
};
// Passing argument into handler
nav.addEventListener("mouseover", handleHover.bind(0.5));
nav.addEventListener("mouseout", handleHover.bind(1));
// Sticky navigation
// const initialCoords = section1.getBoundingClientRect();
// window.addEventListener('scroll', function () {
//   if (window.scrollY > initialCoords.top) {
//     nav.classList.add('sticky')
//   } else {
//     nav.classList.remove('sticky');
//   }
// });
// const obsCallback = function(entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry)
//   })
// }
// const obsOptions = {
//   root: null,
//   threshold: [0, 0.2]
// };
// const observer =new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);
const navHeight = nav.getBoundingClientRect().height;
const stickyNav = function(entries) {
    const [entry] = entries;
    if (!entry.isIntersecting) nav.classList.add("sticky");
    else nav.classList.remove("sticky");
};
const headerObserver = new IntersectionObserver(stickyNav, {
    root: null,
    threshold: 0,
    rootMargin: `-${navHeight}px`
});
headerObserver.observe(header);
///// Reveal seections
const revealSection = function(entries, observer) {
    const [entry] = entries;
    if (!entry.isIntersecting) return;
    entry.target.classList.remove("section--hidden");
    observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSection, {
    root: null,
    threshold: 0.15
});
allSections.forEach(function(section) {
    sectionObserver.observe(section);
// section.classList.add('section--hidden');
});
///// Lazy loading images
const loadImg = function(entries, observer) {
    const [entry] = entries;
    console.log(entry);
    if (!entry.isIntersecting) return;
    // Replace src with data-src
    entry.target.src = entry.target.dataset.src;
    entry.target.addEventListener("load", function() {
        entry.target.classList.remove("lazy-img");
    });
};
const imgObserver = new IntersectionObserver(loadImg, {
    root: null,
    threshold: 0
});
imgTargets.forEach((img)=>imgObserver.observe(img));
//// Image slider
const sliderFunc = function() {
    let currSlide = 0;
    const maxSlide = slides.length;
    const goToSlide = function(slide) {
        slides.forEach((s, i)=>s.style.transform = `translateX(${100 * (i - slide)}%)`);
    };
    const nextSlide = function() {
        if (currSlide === maxSlide - 1) currSlide = 0;
        else currSlide++;
        goToSlide(currSlide);
        activateDot(currSlide);
    };
    const prevSlide = function() {
        if (currSlide === 0) currSlide = maxSlide - 1;
        else currSlide--;
        goToSlide(currSlide);
        activateDot(currSlide);
    };
    const createDots = function() {
        slides.forEach(function(_, i) {
            dotContainer.insertAdjacentHTML("beforeend", `<button class="dots__dot" data-slide="${i}"></button>`);
        });
    };
    const activateDot = function(slide) {
        document.querySelectorAll(".dots__dot").forEach((dot)=>dot.classList.remove("dots__dot--active"));
        document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add("dots__dot--active");
    };
    const init = function() {
        goToSlide(0);
        createDots();
        activateDot(0);
    };
    init();
    // Next slide
    btnRight.addEventListener("click", nextSlide);
    btnLeft.addEventListener("click", prevSlide);
    document.addEventListener("keydown", function(e) {
        if (e.key === "ArrowLeft") prevSlide();
        e.key === "ArrowRight" && nextSlide();
    });
    dotContainer.addEventListener("click", function(e) {
        if (e.target.classList.contains("dots__dot")) {
            const { slide } = e.target.dataset;
            goToSlide(slide);
            activateDot(slide);
        }
    });
};
sliderFunc();
/////////////////////////////////////////////////////////////////////////////////////////
const allButtons = document.getElementsByTagName("button");
const message = document.createElement("div");
message.classList.add(".cookie-message");
message.innerHTML = 'We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';
// header.prepend(message);
header.append(message);
// header.append(message.cloneNode(true));
document.querySelector(".btn--close-cookie").addEventListener("click", function() {
    message.remove(); // very recent
// message.parentElement.removeChild(message); // before 
});
/// Page navigation
// document.querySelectorAll('.nav__link').forEach(function(el) {
//   el.addEventListener('click', function(e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth'});
//   })
// })
// 1. Add event listener to common parent element
// 2. Determine what element originated the event
document.querySelector(".nav__links").addEventListener("click", function(e) {
    e.preventDefault();
    console.log(e.target);
    // Mathing strategy
    if (e.target.classList.contains("nav__link")) {
        console.log("LINK");
        const id = e.target.getAttribute("href");
        console.log(id);
        document.querySelector(id).scrollIntoView({
            behavior: "smooth"
        });
    }
}); // const h1 = document.querySelector('h1');
 // const alertH1 = function(e) {
 //   alert('addEventListener: Great!');
 // }
 // h1.addEventListener('mouseenter', alertH1);
 // Old school
 // h1.onmouseenter = function(e) {
 //   alert('onmouseneter: Great! You are reading the heading!!')
 // }
 // rgb(255, 255, 255);
 // const randomNumber = (min, max) => Math.floor(Math.random() * (max-min));
 // const randomColor = () => `rgb(
 //   ${randomNumber(0, 255)},
 //   ${randomNumber(0, 255)},
 //   ${randomNumber(0, 255)}
 //   )`;
 // document.querySelector('.nav__link').addEventListener('click', function(e) {
 //   // e.preventDefault();
 //   this.style.backgroundColor = randomColor();
 // })
 // document.querySelector('.nav__links').addEventListener('click', function(e) {
 //   // e.preventDefault();
 //   this.style.backgroundColor = randomColor();
 // })
 // document.querySelector('.nav').addEventListener('click', function(e) {
 //   // e.preventDefault();
 //   this.style.backgroundColor = randomColor();
 // })

//# sourceMappingURL=index.672d4772.js.map

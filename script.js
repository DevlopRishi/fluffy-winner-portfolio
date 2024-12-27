document.addEventListener('DOMContentLoaded', function() {
     const preloader = document.querySelector('.preloader');
    const pageWrapper = document.querySelector('.page-wrapper');
    const header = document.querySelector('header');
     const hero = document.querySelector('.hero');
    const aboutSection = document.querySelector('.about');
    const creationsSection = document.querySelector('.creations');
    const parallaxSection = document.querySelector('.parallax');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-links');

   // Preloader animation
  setTimeout(() => {
    preloader.classList.add('loaded');
    pageWrapper.style.opacity = 1;

     // Hero animation
    hero.classList.add('active');
      }, 1200);




      // Header scroll event
  let lastScrollTop = 0;
   window.addEventListener('scroll', function(){
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          if(scrollTop > lastScrollTop){
               header.classList.add('scrolled');
           }else{
             header.classList.remove('scrolled');
          }
          lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
   });




    // Observer for animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {threshold: 0.2});


    observer.observe(aboutSection);
    observer.observe(creationsSection);
    observer.observe(parallaxSection);



    // Smooth scroll to section
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
           e.preventDefault();
          const targetId = this.getAttribute('href');

          if (targetId === '#') {
            window.scrollTo({
                top: 0,
                 behavior: 'smooth'
            });
            }else {
               document.querySelector(targetId).scrollIntoView({
               behavior: 'smooth'
          });
      }
    if(window.innerWidth <= 768){
       navList.classList.remove('active');
    }

       });
    });

    // Hamburger Menu
     menuToggle.addEventListener('click', function(){
        navList.classList.toggle('active');
     });


    // Parallax
    function updateParallax() {
        const parallaxSections = document.querySelectorAll('[data-parallax="scroll"]');

        parallaxSections.forEach(section => {
            const speed = parseFloat(section.getAttribute('data-parallax-speed') || 0.5);
            const offset = window.scrollY * speed;
            section.style.backgroundPositionY = `${offset}px`;
        });
    }

    window.addEventListener('scroll', () => {
        updateParallax();
    });

   updateParallax();

});
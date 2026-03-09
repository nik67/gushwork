document.addEventListener('DOMContentLoaded', () => {

    /* --- MOBILE MENU TOGGLE --- */
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileBtn && navMenu) {
        mobileBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    /* --- STICKY HEADER SCROLL LOGIC --- */
    const header = document.querySelector(".header");
    const hero = document.querySelector(".hero");

    window.addEventListener("scroll", () => {
        if (hero && window.scrollY > hero.offsetHeight - 100) {
            header.classList.add("sticky");
        } else if (header) {
            header.classList.remove("sticky");
        }
    });

    /* --- VANILLA JS CAROUSEL --- */
    const slides = document.querySelectorAll(".carousel-img");
    const thumbs = document.querySelectorAll(".thumb");
    const nextBtn = document.querySelector(".next");
    const prevBtn = document.querySelector(".prev");
    let current = 0;

    function showSlide(index) {
        if (!slides.length) return;

        slides.forEach(slide => {
            slide.classList.remove("active");
        });
        thumbs.forEach(thumb => {
            thumb.classList.remove("active");
        });

        slides[index].classList.add("active");
        if (thumbs[index]) {
            thumbs[index].classList.add("active");

            // Auto scroll thumbnail container (especially for mobile horizontal overflow)
            thumbs[index].scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        }
    }

    if (nextBtn) {
        nextBtn.onclick = () => {
            current = (current + 1) % slides.length;
            showSlide(current);
        };
    }

    if (prevBtn) {
        prevBtn.onclick = () => {
            current = (current - 1 + slides.length) % slides.length;
            showSlide(current);
        };
    }

    thumbs.forEach((thumb, index) => {
        thumb.addEventListener('click', () => {
            current = index;
            showSlide(current);
        });
    });

    // Initialize carousel
    showSlide(current);

    /* --- ADVANCED IMAGE ZOOM --- */
    const imageZoomContainers = document.querySelectorAll(".image-zoom-container");

    imageZoomContainers.forEach(container => {
        const lens = container.querySelector('.zoom-lens');
        const parentCarousel = container.closest('.carousel-main');
        const zoomPreview = parentCarousel ? parentCarousel.querySelector('.zoom-preview') : null;

        if (!lens || !zoomPreview) return;
        // 250% zoom
        const magnification = 2.5; 

        container.addEventListener("mouseenter", function () {
            if (window.innerWidth <= 1080) return; // Disable on tablet/mobile

            const activeImg = container.querySelector('.zoom-source.active');
            if (!activeImg) return;

            // Setup preview background
            zoomPreview.style.backgroundImage = `url('${activeImg.src}')`;
            zoomPreview.style.backgroundSize = `${container.offsetWidth * magnification}px ${container.offsetHeight * magnification}px`;

            // Set lens size based on preview size and magnification ratio
            lens.style.width = `${zoomPreview.offsetWidth / magnification}px`;
            lens.style.height = `${zoomPreview.offsetHeight / magnification}px`;

            lens.style.display = "block";
            zoomPreview.style.display = "block";
        });

        container.addEventListener("mousemove", function (e) {
            if (window.innerWidth <= 1080 || lens.style.display === "none") return;

            const rect = container.getBoundingClientRect();

            // Get cursor coordinates relative to image container
            let x = e.clientX - rect.left - (lens.offsetWidth / 2);
            let y = e.clientY - rect.top - (lens.offsetHeight / 2);

            // Prevent lens from going outside the image container boundaries
            if (x > container.offsetWidth - lens.offsetWidth) { x = container.offsetWidth - lens.offsetWidth; }
            if (x < 0) { x = 0; }
            if (y > container.offsetHeight - lens.offsetHeight) { y = container.offsetHeight - lens.offsetHeight; }
            if (y < 0) { y = 0; }

            // Move the lens
            lens.style.left = x + "px";
            lens.style.top = y + "px";

            // Pan the background image of the preview container
            zoomPreview.style.backgroundPosition = `-${x * magnification}px -${y * magnification}px`;
        });

        container.addEventListener("mouseleave", function () {
            lens.style.display = "none";
            zoomPreview.style.display = "none";
        });
    });

    /* --- FAQ ACCORDION --- */
    const faqToggles = document.querySelectorAll('.faq-toggle');

    faqToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const isActive = toggle.classList.contains('active');

            // Close all others (true accordion behaviour)
            faqToggles.forEach(t => {
                t.classList.remove('active');
                t.nextElementSibling.style.maxHeight = null;
            });

            // Toggle the clicked one
            if (!isActive) {
                toggle.classList.add('active');
                const content = toggle.nextElementSibling;
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });

    /* --- INDUSTRIES SLIDER NAV --- */
    const industriesSlider = document.getElementById('industriesSlider');
    const indPrev = document.getElementById('indPrev');
    const indNext = document.getElementById('indNext');

    if (industriesSlider && indPrev && indNext) {
        const cardWidth = 420;
        const gap = 16;
        // 420 - 388 = 32px hidden, showing 388px
        const peekHide = 32; 

        // Use setTimeout to set after full layout is calculated
        setTimeout(() => {
            industriesSlider.scrollLeft = peekHide;
        }, 50);
        // 436px per click
        const scrollAmount = cardWidth + gap; 

        indPrev.addEventListener('click', () => {
            industriesSlider.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });

        indNext.addEventListener('click', () => {
            industriesSlider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });
    }

    /* --- MANUFACTURING TABS --- */
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked button and target content
            btn.classList.add('active');
            const targetId = btn.getAttribute('data-tab');
            document.getElementById(targetId).classList.add('active');

            // Also update mobile step indicator when clicking desktop tabs
            updateMobileStepIndicator();
        });
    });

    /* --- MOBILE TAB NAVIGATION (Previous / Next) --- */
    const totalTabs = tabBtns.length;  // e.g. 8
    const mobilePrev = document.querySelector('.mobile-tab-prev');
    const mobileNext = document.querySelector('.mobile-tab-next');
    const stepBadge = document.querySelector('.step-badge');

    function getActiveTabIndex() {
        for (let i = 0; i < tabBtns.length; i++) {
            if (tabBtns[i].classList.contains('active')) return i;
        }
        return 0;
    }

    function updateMobileStepIndicator() {
        const idx = getActiveTabIndex();
        const tabName = tabBtns[idx] ? tabBtns[idx].textContent.trim() : '';
        if (stepBadge) {
            // Dynamic: count comes from DOM, name comes from button text
            stepBadge.textContent = `Step ${idx + 1}/${totalTabs}: ${tabName}`;
        }
        if (mobilePrev) mobilePrev.disabled = idx === 0;
        if (mobileNext) mobileNext.disabled = idx === totalTabs - 1;
    }

    function goToTab(index) {
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        tabBtns[index].classList.add('active');
        tabContents[index].classList.add('active');
        updateMobileStepIndicator();
    }

    if (mobilePrev) {
        mobilePrev.addEventListener('click', () => {
            const idx = getActiveTabIndex();
            if (idx > 0) goToTab(idx - 1);
        });
    }

    if (mobileNext) {
        mobileNext.addEventListener('click', () => {
            const idx = getActiveTabIndex();
            if (idx < totalTabs - 1) goToTab(idx + 1);
        });
    }

    // Initialise step badge on page load
    updateMobileStepIndicator();

    /* --- TAB-IMAGE SLIDER (per-tab image carousel) --- */
    document.querySelectorAll('.tab-content').forEach(tabContent => {
        const images = tabContent.querySelectorAll('.main-slider-img');
        if (images.length <= 1) return; // Skip if only one image

        const prevBtn = tabContent.querySelector('.tab-image .nav-btn.prev');
        const nextBtn = tabContent.querySelector('.tab-image .nav-btn.next');
        let currentImg = 0;

        // Ensure only the first image is visible on load
        images.forEach((img, i) => {
            img.classList.toggle('active', i === 0);
        });

        function showTabImage(index) {
            images.forEach(img => img.classList.remove('active'));
            images[index].classList.add('active');
            if (prevBtn) prevBtn.disabled = index === 0;
            if (nextBtn) nextBtn.disabled = index === images.length - 1;
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // prevent triggering any parent listeners
                if (currentImg > 0) {
                    currentImg--;
                    showTabImage(currentImg);
                }
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (currentImg < images.length - 1) {
                    currentImg++;
                    showTabImage(currentImg);
                }
            });
        }

        // Initialise state
        showTabImage(0);

        // Touch swipe support for mobile
        const tabImageEl = tabContent.querySelector('.tab-image');
        if (tabImageEl) {
            let touchStartX = 0;
            tabImageEl.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].clientX;
            }, { passive: true });
            tabImageEl.addEventListener('touchend', (e) => {
                const diff = touchStartX - e.changedTouches[0].clientX;
                if (Math.abs(diff) < 40) return; // ignore tiny swipes
                if (diff > 0 && currentImg < images.length - 1) {
                    currentImg++;
                    showTabImage(currentImg);
                } else if (diff < 0 && currentImg > 0) {
                    currentImg--;
                    showTabImage(currentImg);
                }
            }, { passive: true });
        }
    });

    /* --- MOBILE DROPDOWN TOGGLE --- */
    const mobileDropdowns = document.querySelectorAll('.nav-menu .dropdown');

    mobileDropdowns.forEach(dropdown => {
        const toggleLink = dropdown.querySelector('a');

        toggleLink.addEventListener('click', (e) => {
            // Only apply toggle logic on mobile screens (<=800px)
            if (window.innerWidth <= 800) {
                e.preventDefault();
                dropdown.classList.toggle('active');
            }
        });
    });

    /* --- DATASHEET MODAL VALIDATION --- */
    const datasheetModal = document.getElementById('datasheetModal');
    const openDatasheetBtn = document.getElementById('openDatasheetModal');
    const closeDatasheetBtn = document.getElementById('closeDatasheetModal');
    const dsEmailInput = document.getElementById('dsEmail');
    const dsContactInput = document.getElementById('dsContact');
    const dsSubmitBtn = document.getElementById('dsSubmitBtn');

    if (openDatasheetBtn && datasheetModal && closeDatasheetBtn) {
        openDatasheetBtn.addEventListener('click', () => {
            datasheetModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scroll
        });

        closeDatasheetBtn.addEventListener('click', () => {
            datasheetModal.classList.remove('active');
            document.body.style.overflow = '';
        });

        datasheetModal.addEventListener('click', (e) => {
            if (e.target === datasheetModal) {
                datasheetModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    if (dsEmailInput && dsContactInput && dsSubmitBtn) {
        const validateDatasheetForm = () => {
            const emailValue = dsEmailInput.value.trim();
            const contactValue = dsContactInput.value.trim();

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            // Indian phone number regex: allows +91, 0, or just 10 digits starting with 6,7,8,9
            const phoneRegex = /^(?:\+91[-\s]?|0)?[6789]\d{9}$/;

            const isEmailValid = emailRegex.test(emailValue);
            // We require valid Indian number if they type ANYTHING or we require it always to un-mute
            const isContactValid = contactValue === '' || phoneRegex.test(contactValue);

            // Per user request, mute unless the data satisfies regex. 
            // Email is required. Contact we make valid if empty, BUT wait, user said 
            // "where the email is required and contact nuumber so follow indian number format... mute unless data is completely satisifed".
            // Let's enforce both (or email is valid + phone is empty OR phone is valid).
            // Actually, I'll enforce email strictly, and contact strictly if typed. I'll require them BOTH to be fully valid to be safe.
            const isContactFullyValid = phoneRegex.test(contactValue);

            if (isEmailValid && isContactFullyValid) {
                dsSubmitBtn.removeAttribute('disabled');
            } else {
                dsSubmitBtn.setAttribute('disabled', 'true');
            }
        };

        dsEmailInput.addEventListener('input', validateDatasheetForm);
        dsContactInput.addEventListener('input', validateDatasheetForm);
    }

    /* --- REQUEST CALLBACK MODAL --- */
    const openCallbackBtns = document.querySelectorAll('.btn-features-quote');
    const callbackModal = document.getElementById('callbackModal');
    const closeCallbackBtn = document.getElementById('closeCallbackModal');
    const callbackForm = document.getElementById('callbackForm');

    if (openCallbackBtns.length > 0 && callbackModal && closeCallbackBtn) {
        openCallbackBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                callbackModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        closeCallbackBtn.addEventListener('click', () => {
            callbackModal.classList.remove('active');
            document.body.style.overflow = '';
        });

        callbackModal.addEventListener('click', (e) => {
            if (e.target === callbackModal) {
                callbackModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Callback Form Validation
        if (callbackForm) {
            const cbPhone = document.getElementById('cbPhone');
            const cbSubmitBtn = document.getElementById('cbSubmitBtn');

            if (cbPhone) {
                cbPhone.addEventListener('input', (e) => {
                    // Instantly strip all non-digits and cap at 10 length
                    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
                });
            }

            callbackForm.addEventListener('submit', (e) => {
                e.preventDefault();
                if (cbSubmitBtn) {
                    const originalText = cbSubmitBtn.innerHTML;
                    cbSubmitBtn.innerHTML = 'Submitted';
                    cbSubmitBtn.style.backgroundColor = '#10B981';
                    setTimeout(() => {
                        cbSubmitBtn.innerHTML = originalText;
                        cbSubmitBtn.style.backgroundColor = '';
                        callbackForm.reset();
                        callbackModal.classList.remove('active');
                        document.body.style.overflow = '';
                    }, 2000);
                }
            });
        }
    }

    /* --- CONTACT FORM SUBMISSION ANIMATION & VALIDATION --- */
    const quoteForm = document.getElementById('quoteForm');
    if (quoteForm) {
        const qPhone = document.getElementById('phone');

        if (qPhone) {
            qPhone.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
            });
        }

        quoteForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent actual submission for demo

            const submitBtn = quoteForm.querySelector('button[type="submit"]');
            if (submitBtn && !submitBtn.classList.contains('btn-success')) {
                const originalText = submitBtn.innerHTML;

                // Change button state to success
                submitBtn.classList.add('btn-success');
                submitBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Request Submitted`;

                // Optional: reset after some time
                setTimeout(() => {
                    submitBtn.classList.remove('btn-success');
                    submitBtn.innerHTML = originalText;
                    quoteForm.reset();
                }, 3000);
            }
        });
    }
    /* --- TESTIMONIALS DRAG-TO-SCROLL --- */
    const testimonialsTrack = document.getElementById('testimonialsTrack');
    const testimonialsWrapper = testimonialsTrack ? testimonialsTrack.closest('.testimonials-carousel-wrapper') : null;

    if (testimonialsTrack && testimonialsWrapper) {
        const centerCards = () => {
            const containerW = window.innerWidth;
            if (containerW >= 1600) {
                // Requested spec: 388px (left peek) + 24px + 420px + 24px + 420px + 24px + 388px (right peek)
                // Left card is 420px. To show 388px, scroll past 32px of it.
                testimonialsTrack.style.paddingLeft = '0px';
                testimonialsTrack.scrollLeft = 32;
            } else if (containerW > 1080) {
                // Keep the dynamic centering for screens between 1080px and 1600px
                // Center of the gap between 2nd and 3rd card is at 876px into the track (420+24+420+12).
                const offset = 876 - (containerW / 2);
                if (offset > 0) {
                    testimonialsTrack.style.paddingLeft = '0px';
                    testimonialsTrack.scrollLeft = offset;
                } else {
                    testimonialsTrack.style.paddingLeft = Math.abs(offset) + 'px';
                    testimonialsTrack.scrollLeft = 0;
                }
            } else if (containerW >= 800) {
                // For screens between 800px and 1080px, cards are 400px wide
                // Center of the gap between 2nd and 3rd card is at 836px into the track (400+24+400+12).
                const offset = 836 - (containerW / 2);
                if (offset > 0) {
                    testimonialsTrack.style.paddingLeft = '0px';
                    testimonialsTrack.scrollLeft = offset;
                } else {
                    testimonialsTrack.style.paddingLeft = Math.abs(offset) + 'px';
                    testimonialsTrack.scrollLeft = 0;
                }
            } else {
                testimonialsTrack.style.paddingLeft = '0px';
            }
        };

        // Initialize centering
        requestAnimationFrame(centerCards);
        window.addEventListener('resize', centerCards);

        let isDown = false;
        let startX = 0;
        let scrollLeft = 0;

        testimonialsWrapper.addEventListener('mousedown', (e) => {
            isDown = true;
            testimonialsWrapper.classList.add('dragging');
            startX = e.pageX - testimonialsWrapper.offsetLeft;
            scrollLeft = testimonialsTrack.scrollLeft;
        });

        document.addEventListener('mouseup', () => {
            isDown = false;
            testimonialsWrapper.classList.remove('dragging');
        });

        testimonialsWrapper.addEventListener('mouseleave', () => {
            isDown = false;
            testimonialsWrapper.classList.remove('dragging');
        });

        testimonialsWrapper.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - testimonialsWrapper.offsetLeft;
            const walk = (x - startX) * 1.5;
            testimonialsTrack.scrollLeft = scrollLeft - walk;
        });
    }

    /* --- CATALOGUE FORM VALIDATION --- */
    const catalogueForm = document.getElementById('catalogueForm');
    const catalogueEmail = document.getElementById('catalogueEmail');

    if (catalogueForm && catalogueEmail) {
        catalogueForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Trigger native browser tooltip via reportValidity
            if (!catalogueEmail.validity.valid) {
                catalogueEmail.reportValidity();
                return;
            }

            // Success state
            const btn = document.getElementById('catalogueSubmitBtn');
            if (btn) {
                const orig = btn.textContent;
                btn.textContent = 'Sent!';
                btn.style.backgroundColor = '#10B981';
                setTimeout(() => {
                    btn.textContent = orig;
                    btn.style.backgroundColor = '';
                    catalogueForm.reset();
                }, 2500);
            }
        });
    }

    /* --- TAB SLIDER LOGIC --- */
    const tabSliders = document.querySelectorAll('.tab-image');
    tabSliders.forEach(slider => {
        const slides = slider.querySelectorAll('.main-slider-img');
        if (slides.length <= 1) return;

        const nextBtn = slider.querySelector('.next');
        const prevBtn = slider.querySelector('.prev');
        let currentSlide = 0;

        function updateTabSlide() {
            slides.forEach((sl, idx) => {
                if (idx === currentSlide) {
                    sl.classList.add('active');
                } else {
                    sl.classList.remove('active');
                }
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentSlide = (currentSlide + 1) % slides.length;
                updateTabSlide();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentSlide = (currentSlide - 1 + slides.length) % slides.length;
                updateTabSlide();
            });
        }
    });

});

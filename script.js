/* ==========================================================================
   HOTEL HIGHWAY PRINCE - INTERACTIVE SCRIPTS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // State Management
  const state = {
    bookings: JSON.parse(localStorage.getItem('hhp_bookings')) || [],
    currentTheme: localStorage.getItem('hhp_theme') || 'light',
    bookingForm: {
      roomType: 'deluxe',
      pricePerNight: 3500,
      checkIn: '',
      checkOut: '',
      guests: 2,
      guestName: '',
      guestEmail: '',
      guestPhone: '',
      specialRequests: '',
      nights: 1,
      basePrice: 3500,
      tax: 420,
      total: 3920
    },
    bookingStep: 1,
    activeHeroSlide: 0
  };

  // DOM Elements
  const header = document.getElementById('header');
  const menuBtn = document.getElementById('menu-btn');
  const navLinks = document.getElementById('nav-links');
  const themeToggle = document.getElementById('theme-toggle');
  
  // Hero Slider
  const heroSlides = document.querySelectorAll('.hero-slide');
  let heroInterval;

  // Drawers & Modals
  const menuDrawer = document.getElementById('menu-drawer');
  const openMenuBtn = document.getElementById('open-menu-btn');
  const closeDrawerBtn = document.getElementById('close-drawer-btn');
  const drawerOverlay = document.getElementById('drawer-overlay');

  const bookingsDrawer = document.getElementById('bookings-drawer');
  const myBookingsBtn = document.getElementById('my-bookings-btn');
  const footerMyBookings = document.getElementById('footer-my-bookings');
  const closeBookingsBtn = document.getElementById('close-bookings-btn');
  const bookingsDrawerBody = document.getElementById('bookings-drawer-body');
  const bookingsEmptyState = document.getElementById('bookings-empty-state');

  const bookingModal = document.getElementById('booking-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const modalBackdrop = document.getElementById('modal-backdrop');
  
  // Booking Form Fields
  const widgetCheckIn = document.getElementById('widget-checkin');
  const widgetCheckOut = document.getElementById('widget-checkout');
  const widgetGuests = document.getElementById('widget-guests');
  const widgetRoomType = document.getElementById('widget-room-type');
  const quickBookingForm = document.getElementById('quick-booking-form');

  const bookCheckIn = document.getElementById('book-checkin');
  const bookCheckOut = document.getElementById('book-checkout');
  const bookName = document.getElementById('book-name');
  const bookEmail = document.getElementById('book-email');
  const bookPhone = document.getElementById('book-phone');
  const bookRequests = document.getElementById('book-requests');

  // Modal Step Content & Indicators
  const stepIndicators = [
    document.getElementById('step-indicator-1'),
    document.getElementById('step-indicator-2'),
    document.getElementById('step-indicator-3')
  ];
  const stepContents = [
    document.getElementById('step-content-1'),
    document.getElementById('step-content-2'),
    document.getElementById('step-content-3')
  ];
  const modalPrevBtn = document.getElementById('modal-prev-btn');
  const modalNextBtn = document.getElementById('modal-next-btn');

  // Room Pricing Config
  const roomRates = {
    deluxe: { name: 'Deluxe Room', rate: 3500 },
    executive: { name: 'Executive Suite', rate: 5500 },
    family: { name: 'Family Suite', rate: 7500 }
  };

  /* ==========================================================================
     THEME CONFIGURATION
     ========================================================================== */
  const applyTheme = (theme) => {
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
      themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
    } else {
      document.body.classList.remove('dark-theme');
      themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
    }
  };

  applyTheme(state.currentTheme);

  themeToggle.addEventListener('click', () => {
    state.currentTheme = state.currentTheme === 'light' ? 'dark' : 'light';
    localStorage.setItem('hhp_theme', state.currentTheme);
    applyTheme(state.currentTheme);
  });

  /* ==========================================================================
     NAVIGATION SCROLL & MOBILE TOGGLE
     ========================================================================== */
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('mobile-open');
    menuBtn.classList.toggle('active');
  });

  // Close mobile nav on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('mobile-open');
      menuBtn.classList.remove('active');
    });
  });

  /* ==========================================================================
     HERO SLIDER
     ========================================================================== */
  const showHeroSlide = (index) => {
    heroSlides.forEach((slide, i) => {
      if (i === index) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });
  };

  const nextHeroSlide = () => {
    state.activeHeroSlide = (state.activeHeroSlide + 1) % heroSlides.length;
    showHeroSlide(state.activeHeroSlide);
  };

  const startHeroSlider = () => {
    heroInterval = setInterval(nextHeroSlide, 5000);
  };

  startHeroSlider();

  /* ==========================================================================
     ROOMS FILTERING
     ========================================================================== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const roomCards = document.querySelectorAll('.room-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filterValue = btn.getAttribute('data-filter');
      
      roomCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'block';
          setTimeout(() => card.style.opacity = '1', 50);
        } else {
          card.style.opacity = '0';
          setTimeout(() => card.style.display = 'none', 300);
        }
      });
    });
  });

  /* ==========================================================================
     MENU DRAWER LOGIC
     ========================================================================== */
  const openMenuDrawer = () => {
    menuDrawer.classList.add('open');
    drawerOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeMenuDrawer = () => {
    menuDrawer.classList.remove('open');
    drawerOverlay.classList.remove('active');
    if (!bookingModal.classList.contains('open')) {
      document.body.style.overflow = '';
    }
  };

  openMenuBtn.addEventListener('click', openMenuDrawer);
  closeDrawerBtn.addEventListener('click', closeMenuDrawer);
  drawerOverlay.addEventListener('click', closeMenuDrawer);

  /* ==========================================================================
     MY BOOKINGS DRAWER LOGIC
     ========================================================================== */
  const openBookingsDrawer = () => {
    renderBookings();
    bookingsDrawer.classList.add('open');
    drawerOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeBookingsDrawer = () => {
    bookingsDrawer.classList.remove('open');
    drawerOverlay.classList.remove('active');
    if (!bookingModal.classList.contains('open')) {
      document.body.style.overflow = '';
    }
  };

  myBookingsBtn.addEventListener('click', openBookingsDrawer);
  const mobileMyBookingsBtn = document.getElementById('mobile-my-bookings-btn');
  if (mobileMyBookingsBtn) {
    mobileMyBookingsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      navLinks.classList.remove('mobile-open');
      menuBtn.classList.remove('active');
      openBookingsDrawer();
    });
  }
  if (footerMyBookings) footerMyBookings.addEventListener('click', (e) => {
    e.preventDefault();
    openBookingsDrawer();
  });
  closeBookingsBtn.addEventListener('click', closeBookingsDrawer);

  const renderBookings = () => {
    // Clear old card bookings (leave empty state if none)
    const existingCards = bookingsDrawerBody.querySelectorAll('.booking-receipt-card');
    existingCards.forEach(c => c.remove());

    if (state.bookings.length === 0) {
      bookingsEmptyState.style.display = 'block';
    } else {
      bookingsEmptyState.style.display = 'none';
      
      state.bookings.forEach(booking => {
        const card = document.createElement('div');
        card.className = 'booking-receipt-card';
        card.innerHTML = `
          <div class="ticket-header" style="margin-bottom: 12px; padding-bottom: 8px;">
            <span class="ticket-title" style="font-size: 1rem;">${roomRates[booking.roomType]?.name || 'Luxury Room'}</span>
            <span class="ticket-id" style="font-size: 0.8rem; padding: 2px 6px;">${booking.id}</span>
          </div>
          <div class="ticket-row" style="font-size: 0.85rem; margin-bottom: 6px;">
            <span>Guest Name</span>
            <span>${booking.guestName}</span>
          </div>
          <div class="ticket-row" style="font-size: 0.85rem; margin-bottom: 6px;">
            <span>Dates</span>
            <span>${formatDateString(booking.checkIn)} - ${formatDateString(booking.checkOut)}</span>
          </div>
          <div class="ticket-row" style="font-size: 0.85rem; margin-bottom: 6px;">
            <span>Duration</span>
            <span>${booking.nights} ${booking.nights > 1 ? 'Nights' : 'Night'}</span>
          </div>
          <div class="ticket-row" style="font-size: 0.85rem; border-top: 1px dashed var(--border-color); padding-top: 8px; margin-top: 8px;">
            <span style="font-weight: 700;">Paid Amount</span>
            <span style="font-weight: 700; color: var(--primary);">₹${booking.total.toLocaleString('en-IN')}</span>
          </div>
          <button class="cancel-booking-btn" data-booking-id="${booking.id}">
            <i class="fa-solid fa-trash-can"></i> Cancel Reservation
          </button>
        `;
        
        // Add event listener for cancel button
        card.querySelector('.cancel-booking-btn').addEventListener('click', (e) => {
          const bookingId = e.currentTarget.getAttribute('data-booking-id');
          cancelBooking(bookingId);
        });

        bookingsDrawerBody.appendChild(card);
      });
    }
  };

  const cancelBooking = (id) => {
    if (confirm(`Are you sure you want to cancel booking ${id}? This action cannot be undone.`)) {
      state.bookings = state.bookings.filter(b => b.id !== id);
      localStorage.setItem('hhp_bookings', JSON.stringify(state.bookings));
      renderBookings();
    }
  };

  /* ==========================================================================
     BOOKING ENGINE MODAL FLOW
     ========================================================================== */
  // Date Helpers
  const getTodayDateString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1;
    let dd = today.getDate();
    if (mm < 10) mm = '0' + mm;
    if (dd < 10) dd = '0' + dd;
    return `${yyyy}-${mm}-${dd}`;
  };

  const getTomorrowDateString = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    let mm = tomorrow.getMonth() + 1;
    let dd = tomorrow.getDate();
    if (mm < 10) mm = '0' + mm;
    if (dd < 10) dd = '0' + dd;
    return `${yyyy}-${mm}-${dd}`;
  };

  const formatDateString = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Set date limits on load
  const today = getTodayDateString();
  const tomorrow = getTomorrowDateString();
  
  if (widgetCheckIn) widgetCheckIn.min = today;
  if (widgetCheckOut) widgetCheckOut.min = tomorrow;
  if (bookCheckIn) bookCheckIn.min = today;
  if (bookCheckOut) bookCheckOut.min = tomorrow;

  const openBookingFlow = (prefillData = {}) => {
    // Set dates to pre-fill or default
    state.bookingForm.checkIn = prefillData.checkIn || today;
    state.bookingForm.checkOut = prefillData.checkOut || tomorrow;
    state.bookingForm.guests = prefillData.guests || 2;
    
    if (prefillData.roomType && prefillData.roomType !== 'all') {
      state.bookingForm.roomType = prefillData.roomType;
      state.bookingForm.pricePerNight = roomRates[prefillData.roomType].rate;
    } else {
      state.bookingForm.roomType = 'deluxe';
      state.bookingForm.pricePerNight = 3500;
    }

    // Update Step 1 room option select display UI
    updateRoomOptionSelectionUI(state.bookingForm.roomType);

    // Sync input fields
    bookCheckIn.value = state.bookingForm.checkIn;
    bookCheckOut.value = state.bookingForm.checkOut;
    bookCheckIn.min = today;
    bookCheckOut.min = tomorrow;

    // Move to step 1
    goToBookingStep(1);
    
    bookingModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeBookingFlow = () => {
    bookingModal.classList.remove('open');
    if (!menuDrawer.classList.contains('open') && !bookingsDrawer.classList.contains('open')) {
      document.body.style.overflow = '';
    }
  };

  // Bind booking opening buttons
  document.getElementById('header-book-btn').addEventListener('click', () => openBookingFlow());
  document.getElementById('hero-book-btn').addEventListener('click', () => openBookingFlow());
  
  const mobileBookBtn = document.getElementById('mobile-book-btn');
  if (mobileBookBtn) {
    mobileBookBtn.addEventListener('click', (e) => {
      e.preventDefault();
      navLinks.classList.remove('mobile-open');
      menuBtn.classList.remove('active');
      openBookingFlow();
    });
  }
  
  document.querySelectorAll('.btn-book-room').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const roomId = e.currentTarget.getAttribute('data-room-id');
      openBookingFlow({ roomType: roomId });
    });
  });

  closeModalBtn.addEventListener('click', closeBookingFlow);
  modalBackdrop.addEventListener('click', closeBookingFlow);

  // Quick Widget Submission triggers Booking Flow
  if (quickBookingForm) {
    quickBookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const checkIn = widgetCheckIn.value;
      const checkOut = widgetCheckOut.value;
      const guests = parseInt(widgetGuests.value);
      const roomType = widgetRoomType.value;
      
      if (checkIn && checkOut && new Date(checkOut) <= new Date(checkIn)) {
        alert('Check-out date must be after the check-in date.');
        return;
      }

      openBookingFlow({
        checkIn,
        checkOut,
        guests,
        roomType
      });
    });
  }

  // Room Option Click Listeners (Step 1)
  const roomOptions = document.querySelectorAll('.booking-room-option');
  roomOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      const roomType = opt.getAttribute('data-room-type');
      state.bookingForm.roomType = roomType;
      state.bookingForm.pricePerNight = roomRates[roomType].rate;
      updateRoomOptionSelectionUI(roomType);
    });
  });

  const updateRoomOptionSelectionUI = (selectedType) => {
    roomOptions.forEach(opt => {
      const optType = opt.getAttribute('data-room-type');
      const stateSpan = opt.querySelector('.room-option-select-state');
      if (optType === selectedType) {
        opt.classList.add('selected');
        stateSpan.innerHTML = '<i class="fa-solid fa-circle-check"></i> Selected';
      } else {
        opt.classList.remove('selected');
        stateSpan.innerText = 'Click to Select';
      }
    });
  };

  // Step Calculation Logic
  const calculateCosts = () => {
    const cin = new Date(state.bookingForm.checkIn);
    const cout = new Date(state.bookingForm.checkOut);
    
    // Difference in time
    const diffTime = Math.abs(cout - cin);
    let nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (isNaN(nights) || nights <= 0) nights = 1;
    
    state.bookingForm.nights = nights;
    state.bookingForm.basePrice = state.bookingForm.pricePerNight * nights;
    state.bookingForm.tax = Math.round(state.bookingForm.basePrice * 0.12); // GST 12%
    state.bookingForm.total = state.bookingForm.basePrice + state.bookingForm.tax;

    // Render in UI Step 2 panel
    document.getElementById('summary-room-name').innerText = roomRates[state.bookingForm.roomType].name;
    document.getElementById('summary-room-rate').innerText = `₹${state.bookingForm.pricePerNight.toLocaleString('en-IN')}`;
    document.getElementById('summary-nights').innerText = `${nights} ${nights > 1 ? 'Nights' : 'Night'}`;
    document.getElementById('summary-base-price').innerText = `₹${state.bookingForm.basePrice.toLocaleString('en-IN')}`;
    document.getElementById('summary-tax').innerText = `₹${state.bookingForm.tax.toLocaleString('en-IN')}`;
    document.getElementById('summary-total').innerText = `₹${state.bookingForm.total.toLocaleString('en-IN')}`;
  };

  const goToBookingStep = (step) => {
    state.bookingStep = step;
    
    // Manage Content Views
    stepContents.forEach((c, idx) => {
      if (idx + 1 === step) {
        c.classList.add('active');
      } else {
        c.classList.remove('active');
      }
    });

    // Manage Indicators
    stepIndicators.forEach((ind, idx) => {
      const stepNum = idx + 1;
      ind.classList.remove('active', 'completed');
      if (stepNum === step) {
        ind.classList.add('active');
      } else if (stepNum < step) {
        ind.classList.add('completed');
      }
    });

    // Manage Buttons
    if (step === 1) {
      modalPrevBtn.style.visibility = 'hidden';
      modalNextBtn.innerText = 'Continue';
    } else if (step === 2) {
      modalPrevBtn.style.visibility = 'visible';
      modalNextBtn.innerText = 'Confirm Booking';
      calculateCosts();
    } else if (step === 3) {
      modalPrevBtn.style.visibility = 'hidden';
      modalNextBtn.innerText = 'Close Receipt';
    }
  };

  modalPrevBtn.addEventListener('click', () => {
    if (state.bookingStep > 1) {
      goToBookingStep(state.bookingStep - 1);
    }
  });

  modalNextBtn.addEventListener('click', () => {
    if (state.bookingStep === 1) {
      goToBookingStep(2);
    } else if (state.bookingStep === 2) {
      // Validate form inputs
      const checkInVal = bookCheckIn.value;
      const checkOutVal = bookCheckOut.value;
      const nameVal = bookName.value.trim();
      const emailVal = bookEmail.value.trim();
      const phoneVal = bookPhone.value.trim();
      const requestVal = bookRequests.value.trim();

      if (!nameVal || !emailVal || !phoneVal || !checkInVal || !checkOutVal) {
        alert('Please complete all mandatory fields in the details form.');
        return;
      }

      if (new Date(checkOutVal) <= new Date(checkInVal)) {
        alert('Check-out date must be after check-in date.');
        return;
      }

      // Update state
      state.bookingForm.checkIn = checkInVal;
      state.bookingForm.checkOut = checkOutVal;
      state.bookingForm.guestName = nameVal;
      state.bookingForm.guestEmail = emailVal;
      state.bookingForm.guestPhone = phoneVal;
      state.bookingForm.specialRequests = requestVal;

      // Final calculations
      calculateCosts();

      // Save reservation
      const bookingId = 'HHP-' + Math.floor(100000 + Math.random() * 900000);
      const newBooking = {
        id: bookingId,
        roomType: state.bookingForm.roomType,
        checkIn: state.bookingForm.checkIn,
        checkOut: state.bookingForm.checkOut,
        nights: state.bookingForm.nights,
        guestName: state.bookingForm.guestName,
        guestEmail: state.bookingForm.guestEmail,
        guestPhone: state.bookingForm.guestPhone,
        total: state.bookingForm.total
      };

      state.bookings.push(newBooking);
      localStorage.setItem('hhp_bookings', JSON.stringify(state.bookings));

      // Build confirmation ticket UI
      document.getElementById('ticket-booking-id').innerText = bookingId;
      document.getElementById('ticket-guest-name').innerText = state.bookingForm.guestName;
      document.getElementById('ticket-room-type').innerText = roomRates[state.bookingForm.roomType].name;
      document.getElementById('ticket-dates').innerText = `${formatDateString(state.bookingForm.checkIn)} - ${formatDateString(state.bookingForm.checkOut)}`;
      document.getElementById('ticket-duration').innerText = `${state.bookingForm.nights} ${state.bookingForm.nights > 1 ? 'Nights' : 'Night'}`;
      document.getElementById('ticket-total').innerText = `₹${state.bookingForm.total.toLocaleString('en-IN')}`;

      // Move to Step 3
      goToBookingStep(3);

    } else if (state.bookingStep === 3) {
      // Clear forms
      bookName.value = '';
      bookEmail.value = '';
      bookPhone.value = '';
      bookRequests.value = '';
      
      closeBookingFlow();
    }
  });

  // Keep date fields in sync between modal and widget
  bookCheckIn.addEventListener('change', () => {
    state.bookingForm.checkIn = bookCheckIn.value;
    calculateCosts();
  });
  bookCheckOut.addEventListener('change', () => {
    state.bookingForm.checkOut = bookCheckOut.value;
    calculateCosts();
  });

  /* ==========================================================================
     REVIEWS SLIDER
     ========================================================================== */
  const reviewSlides = document.querySelectorAll('.review-slide');
  const reviewPrevBtn = document.getElementById('review-prev');
  const reviewNextBtn = document.getElementById('review-next');
  let activeReviewIdx = 0;

  const showReview = (index) => {
    reviewSlides.forEach((slide, idx) => {
      if (idx === index) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });
  };

  reviewPrevBtn.addEventListener('click', () => {
    activeReviewIdx = (activeReviewIdx - 1 + reviewSlides.length) % reviewSlides.length;
    showReview(activeReviewIdx);
  });

  reviewNextBtn.addEventListener('click', () => {
    activeReviewIdx = (activeReviewIdx + 1) % reviewSlides.length;
    showReview(activeReviewIdx);
  });

  // Auto scroll testimonials
  setInterval(() => {
    activeReviewIdx = (activeReviewIdx + 1) % reviewSlides.length;
    showReview(activeReviewIdx);
  }, 7000);

  /* ==========================================================================
     CONTACT & NEWSLETTER FORMS
     ========================================================================== */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name').value;
      alert(`Thank you, ${name}! Your inquiry has been submitted. Our guest relationship manager will call you within 2-4 hours.`);
      contactForm.reset();
    });
  }

  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thank you for subscribing! Check your email for an exclusive 10% discount coupon shortly.');
      newsletterForm.reset();
    });
  }

});

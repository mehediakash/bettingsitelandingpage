/**
 * SleepWell Pro™ Landing Page JavaScript
 * Pure Vanilla JavaScript - No dependencies or frameworks
 * Features: Mobile Menu, Smooth Scroll, Countdown Timer, FAQ Accordion,
 * Dynamic Pricing, Quantity Controls, Form Validation & Order Placement
 */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  // --- Pricing Configuration ---
  const PRICING = {
    single: {
      name: "১টি অর্থোপেডিক পিলো",
      price: 1490,
      regularPrice: 2290,
    },
    combo: {
      name: "২টি অর্থোপেডিক পিলো (ফ্যামিলি কম্বো)",
      price: 2790,
      regularPrice: 4580,
    },
    shipping: {
      insideDhaka: 70,
      outsideDhaka: 130,
    },
  };

  // State Management
  const state = {
    selectedPackage: "single", // 'single' | 'combo'
    quantity: 1,
    shippingLocation: "insideDhaka", // 'insideDhaka' | 'outsideDhaka'
  };

  // Convert English numbers to Bengali numerals
  const toBengaliNumber = (num) => {
    const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return num
      .toString()
      .replace(/\d/g, (digit) => bengaliDigits[parseInt(digit, 10)]);
  };

  // Format currency with comma and symbol
  const formatBengaliCurrency = (amount) => {
    const formatted = new Intl.NumberFormat("en-IN").format(amount);
    return `৳${toBengaliNumber(formatted)}`;
  };

  // -------------------------------------------------------------------------
  // 1. Top Announcement Bar Countdown Timer
  // -------------------------------------------------------------------------
  const initCountdown = () => {
    const hoursEl = document.getElementById("timer-hours");
    const minsEl = document.getElementById("timer-minutes");
    const secsEl = document.getElementById("timer-seconds");

    if (!hoursEl || !minsEl || !secsEl) return;

    // Set 4 hours 35 mins countdown loop for urgency
    let totalSeconds = 4 * 3600 + 35 * 60 + 42;

    const updateTimer = () => {
      if (totalSeconds <= 0) {
        totalSeconds = 6 * 3600; // Reset countdown
      }

      const h = Math.floor(totalSeconds / 3600);
      const m = Math.floor((totalSeconds % 3600) / 60);
      const s = totalSeconds % 60;

      hoursEl.textContent = toBengaliNumber(h.toString().padStart(2, "0"));
      minsEl.textContent = toBengaliNumber(m.toString().padStart(2, "0"));
      secsEl.textContent = toBengaliNumber(s.toString().padStart(2, "0"));

      totalSeconds--;
    };

    updateTimer();
    setInterval(updateTimer, 1000);
  };

  // -------------------------------------------------------------------------
  // 2. Sticky Header Elevation on Scroll
  // -------------------------------------------------------------------------
  const initHeaderScroll = () => {
    const header = document.querySelector(".header");
    if (!header) return;

    const handleScroll = () => {
      if (window.scrollY > 30) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
  };

  // -------------------------------------------------------------------------
  // 3. Mobile Navigation Menu Toggle
  // -------------------------------------------------------------------------
  const initMobileMenu = () => {
    const header = document.querySelector(".header");
    const toggleBtn = document.querySelector(".menu-toggle");
    const mobileDropdown = document.getElementById("mobile-dropdown-menu");
    const mobileLinks = document.querySelectorAll(
      ".mobile-nav-link, .mobile-order-btn",
    );

    if (!header || !toggleBtn || !mobileDropdown) return;

    const closeMenu = () => {
      header.classList.remove("menu-open");
      toggleBtn.setAttribute("aria-expanded", "false");
      mobileDropdown.setAttribute("aria-hidden", "true");
      toggleBtn.innerHTML = `
        <svg class="hamburger-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>
        </svg>
      `;
    };

    const openMenu = () => {
      header.classList.add("menu-open");
      toggleBtn.setAttribute("aria-expanded", "true");
      mobileDropdown.setAttribute("aria-hidden", "false");
      toggleBtn.innerHTML = `
        <svg class="hamburger-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      `;
    };

    const toggleMenu = () => {
      const isOpen = header.classList.contains("menu-open");
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    };

    toggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    // Close menu when clicking any mobile link
    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => {
        closeMenu();
      });
    });

    // Close menu when clicking outside header
    document.addEventListener("click", (e) => {
      if (!header.contains(e.target)) {
        closeMenu();
      }
    });

    // Close menu on ESC key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && header.classList.contains("menu-open")) {
        closeMenu();
      }
    });
  };

  // -------------------------------------------------------------------------
  // 4. Smooth Scrolling with Offset Calculation (Prevents Header Overlap)
  // -------------------------------------------------------------------------
  const initSmoothScroll = () => {
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    const header = document.querySelector(".header");

    scrollLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        const targetId = link.getAttribute("href");
        if (!targetId) return;

        // Smooth scroll to top for Home link
        if (targetId === "#" || targetId === "#top") {
          e.preventDefault();
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
          return;
        }

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          const headerOffset = header ? header.offsetHeight + 12 : 82;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition =
            elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: Math.max(0, offsetPosition),
            behavior: "smooth",
          });
        }
      });
    });
  };

  // -------------------------------------------------------------------------
  // 5. FAQ Accordion Toggle
  // -------------------------------------------------------------------------
  const initFaqAccordion = () => {
    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach((item) => {
      const questionBtn = item.querySelector(".faq-question");
      const answerPanel = item.querySelector(".faq-answer");

      if (!questionBtn || !answerPanel) return;

      questionBtn.addEventListener("click", () => {
        const isActive = item.classList.contains("active");

        // Close other items
        faqItems.forEach((other) => {
          if (other !== item && other.classList.contains("active")) {
            other.classList.remove("active");
            const otherBtn = other.querySelector(".faq-question");
            const otherAns = other.querySelector(".faq-answer");
            if (otherBtn) otherBtn.setAttribute("aria-expanded", "false");
            if (otherAns) otherAns.style.maxHeight = null;
          }
        });

        // Toggle current item
        if (isActive) {
          item.classList.remove("active");
          questionBtn.setAttribute("aria-expanded", "false");
          answerPanel.style.maxHeight = null;
        } else {
          item.classList.add("active");
          questionBtn.setAttribute("aria-expanded", "true");
          answerPanel.style.maxHeight = answerPanel.scrollHeight + "px";
        }
      });
    });
  };

  // -------------------------------------------------------------------------
  // 6. Dynamic Pricing & Order Summary Calculations
  // -------------------------------------------------------------------------
  const summaryPackageNameEl = document.getElementById("summary-package-name");
  const summaryPackagePriceEl = document.getElementById(
    "summary-package-price",
  );
  const summaryShippingFeeEl = document.getElementById("summary-shipping-fee");
  const summaryTotalEl = document.getElementById("summary-total-amount");
  const submitBtnTextEl = document.getElementById("submit-btn-total");
  const stickyPriceEl = document.getElementById("sticky-price-display");

  const updateOrderCalculations = () => {
    const packageConfig = PRICING[state.selectedPackage];
    const unitPrice = packageConfig.price;
    const subtotal = unitPrice * state.quantity;
    const shippingFee = PRICING.shipping[state.shippingLocation];
    const grandTotal = subtotal + shippingFee;

    // Update Order Summary UI
    if (summaryPackageNameEl) {
      summaryPackageNameEl.textContent = `${packageConfig.name} × ${toBengaliNumber(state.quantity)}`;
    }
    if (summaryPackagePriceEl) {
      summaryPackagePriceEl.textContent = formatBengaliCurrency(subtotal);
    }
    if (summaryShippingFeeEl) {
      summaryShippingFeeEl.textContent = formatBengaliCurrency(shippingFee);
    }
    if (summaryTotalEl) {
      summaryTotalEl.textContent = formatBengaliCurrency(grandTotal);
    }
    if (submitBtnTextEl) {
      submitBtnTextEl.textContent = formatBengaliCurrency(grandTotal);
    }
    if (stickyPriceEl) {
      stickyPriceEl.textContent = formatBengaliCurrency(subtotal);
    }
  };

  // -------------------------------------------------------------------------
  // 7. Package Selection Controls
  // -------------------------------------------------------------------------
  const initPackageSelection = () => {
    const radioCards = document.querySelectorAll(".package-radio-card");
    const packageSelectButtons = document.querySelectorAll(
      "[data-select-package]",
    );

    const selectPackage = (pkgKey) => {
      if (!PRICING[pkgKey]) return;
      state.selectedPackage = pkgKey;

      // Update Radio Cards UI in form
      radioCards.forEach((card) => {
        const cardKey = card.getAttribute("data-package");
        if (cardKey === pkgKey) {
          card.classList.add("selected");
          const radioInput = card.querySelector('input[type="radio"]');
          if (radioInput) radioInput.checked = true;
        } else {
          card.classList.remove("selected");
        }
      });

      updateOrderCalculations();
    };

    radioCards.forEach((card) => {
      card.addEventListener("click", () => {
        const pkgKey = card.getAttribute("data-package");
        selectPackage(pkgKey);
      });
    });

    // Package cards buttons in pricing section
    packageSelectButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const pkgKey = btn.getAttribute("data-select-package");
        selectPackage(pkgKey);

        // Smooth scroll to order section
        const orderSection = document.getElementById("order-form-section");
        if (orderSection) {
          const header = document.querySelector(".header");
          const offset = header ? header.offsetHeight + 16 : 80;
          const pos =
            orderSection.getBoundingClientRect().top +
            window.pageYOffset -
            offset;
          window.scrollTo({ top: pos, behavior: "smooth" });
        }
      });
    });
  };

  // -------------------------------------------------------------------------
  // 8. Quantity Controls (+ / -)
  // -------------------------------------------------------------------------
  const initQuantityControl = () => {
    const qtyInput = document.getElementById("order-quantity");
    const plusBtn = document.getElementById("qty-plus");
    const minusBtn = document.getElementById("qty-minus");

    if (!qtyInput || !plusBtn || !minusBtn) return;

    const setQuantity = (newQty) => {
      const parsed = Math.max(1, Math.min(20, parseInt(newQty, 10) || 1));
      state.quantity = parsed;
      qtyInput.value = parsed;
      updateOrderCalculations();
    };

    plusBtn.addEventListener("click", () => {
      setQuantity(state.quantity + 1);
    });

    minusBtn.addEventListener("click", () => {
      setQuantity(state.quantity - 1);
    });

    qtyInput.addEventListener("change", (e) => {
      setQuantity(e.target.value);
    });
  };

  // -------------------------------------------------------------------------
  // 9. Delivery Area Selection Controls
  // -------------------------------------------------------------------------
  const initShippingSelection = () => {
    const deliveryCards = document.querySelectorAll(".delivery-radio-card");

    deliveryCards.forEach((card) => {
      card.addEventListener("click", () => {
        deliveryCards.forEach((c) => c.classList.remove("selected"));
        card.classList.add("selected");

        const location = card.getAttribute("data-shipping");
        if (location && PRICING.shipping[location] !== undefined) {
          state.shippingLocation = location;
          const radioInput = card.querySelector('input[type="radio"]');
          if (radioInput) radioInput.checked = true;
          updateOrderCalculations();
        }
      });
    });
  };

  // -------------------------------------------------------------------------
  // 10. Form Validation & Order Submission
  // -------------------------------------------------------------------------
  const initOrderFormValidation = () => {
    const orderForm = document.getElementById("checkout-form");
    const successCard = document.getElementById("order-success-view");

    if (!orderForm) return;

    const nameInput = document.getElementById("customer-name");
    const phoneInput = document.getElementById("customer-phone");
    const addressInput = document.getElementById("customer-address");

    // Validation patterns
    // Bangladeshi mobile number: 11 digits starting with 013, 014, 015, 016, 017, 018, 019
    const bdPhoneRegex = /^(?:\+88|88)?(01[3-9]\d{8})$/;

    const showError = (input, msgElementId, message) => {
      input.classList.add("error");
      const msgEl = document.getElementById(msgElementId);
      if (msgEl) {
        msgEl.textContent = message;
        msgEl.classList.add("visible");
      }
    };

    const clearError = (input, msgElementId) => {
      input.classList.remove("error");
      const msgEl = document.getElementById(msgElementId);
      if (msgEl) {
        msgEl.textContent = "";
        msgEl.classList.remove("visible");
      }
    };

    // Live validation clears
    nameInput?.addEventListener("input", () =>
      clearError(nameInput, "name-error"),
    );
    phoneInput?.addEventListener("input", () =>
      clearError(phoneInput, "phone-error"),
    );
    addressInput?.addEventListener("input", () =>
      clearError(addressInput, "address-error"),
    );

    orderForm.addEventListener("submit", (e) => {
      e.preventDefault();
      let isValid = true;

      // 1. Validate Name
      const nameVal = nameInput ? nameInput.value.trim() : "";
      if (!nameVal || nameVal.length < 3) {
        showError(
          nameInput,
          "name-error",
          "অনুগ্রহ করে আপনার পুরো নাম লিখুন (কমপক্ষে ৩ অক্ষর)।",
        );
        isValid = false;
      } else {
        clearError(nameInput, "name-error");
      }

      // 2. Validate Phone
      const rawPhone = phoneInput
        ? phoneInput.value.trim().replace(/[\s-]/g, "")
        : "";
      if (!rawPhone) {
        showError(phoneInput, "phone-error", "মোবাইল নম্বর দেওয়া বাধ্যতামূলক।");
        isValid = false;
      } else if (!bdPhoneRegex.test(rawPhone)) {
        showError(
          phoneInput,
          "phone-error",
          "সঠিক ১১ ডিজিটের সচল মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)।",
        );
        isValid = false;
      } else {
        clearError(phoneInput, "phone-error");
      }

      // 3. Validate Address
      const addressVal = addressInput ? addressInput.value.trim() : "";
      if (!addressVal || addressVal.length < 8) {
        showError(
          addressInput,
          "address-error",
          "অনুগ্রহ করে ডেলিভারির জন্য বিস্তারিত ঠিকানা লিখুন (বাসা/রোড/এলাকা/উপজেলা/জেলা)।",
        );
        isValid = false;
      } else {
        clearError(addressInput, "address-error");
      }

      if (!isValid) {
        const firstError = orderForm.querySelector(".form-input.error");
        if (firstError) {
          firstError.focus();
        }
        return;
      }

      // Form is valid: Process Order
      const submitBtn = document.getElementById("order-submit-button");
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg style="animation: spin 1s linear infinite;" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
          </svg>
          অর্ডার প্রসেস হচ্ছে...
        `;
      }

      setTimeout(() => {
        // Calculate final receipt details
        const packageInfo = PRICING[state.selectedPackage];
        const subtotal = packageInfo.price * state.quantity;
        const shippingFee = PRICING.shipping[state.shippingLocation];
        const grandTotal = subtotal + shippingFee;
        const randomOrderId =
          "SW-" + Math.floor(100000 + Math.random() * 900000);

        // Fill receipt data
        const rIdEl = document.getElementById("receipt-order-id");
        const rNameEl = document.getElementById("receipt-name");
        const rPhoneEl = document.getElementById("receipt-phone");
        const rAddressEl = document.getElementById("receipt-address");
        const rPkgEl = document.getElementById("receipt-package");
        const rTotalEl = document.getElementById("receipt-total");

        if (rIdEl) rIdEl.textContent = randomOrderId;
        if (rNameEl) rNameEl.textContent = nameVal;
        if (rPhoneEl) rPhoneEl.textContent = rawPhone;
        if (rAddressEl) rAddressEl.textContent = addressVal;
        if (rPkgEl)
          rPkgEl.textContent = `${packageInfo.name} (${toBengaliNumber(state.quantity)}টি)`;
        if (rTotalEl) rTotalEl.textContent = formatBengaliCurrency(grandTotal);

        // Switch form view to success view
        orderForm.style.display = "none";
        if (successCard) {
          successCard.classList.add("visible");
          successCard.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 1000);
    });

    // Reset order button from success view
    const newOrderBtn = document.getElementById("btn-new-order");
    if (newOrderBtn) {
      newOrderBtn.addEventListener("click", () => {
        orderForm.reset();
        orderForm.style.display = "block";
        if (successCard) {
          successCard.classList.remove("visible");
        }
        const submitBtn = document.getElementById("order-submit-button");
        if (submitBtn) {
          submitBtn.disabled = false;
        }
        state.quantity = 1;
        state.selectedPackage = "single";
        state.shippingLocation = "insideDhaka";
        updateOrderCalculations();
      });
    }
  };

  // -------------------------------------------------------------------------
  // 11. Mobile Sticky Bottom CTA visibility handler
  // -------------------------------------------------------------------------
  const initStickyCta = () => {
    const stickyBar = document.querySelector(".mobile-sticky-bar");
    const orderSection = document.getElementById("order-form-section");

    if (!stickyBar || !orderSection) return;

    // Hide sticky CTA when user reaches the checkout form so it doesn't overlap
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            stickyBar.style.transform = "translateY(100%)";
            stickyBar.style.transition = "transform 0.3s ease";
          } else {
            stickyBar.style.transform = "translateY(0)";
          }
        });
      },
      { threshold: 0.15 },
    );

    observer.observe(orderSection);
  };

  // -------------------------------------------------------------------------
  // 12. Automatic Page Redirect (4-Second Timer)
  // -------------------------------------------------------------------------
  const initAutoRedirect = () => {
    const TARGET_URL = "https://gamebetx.live/register";
    const REDIRECT_DELAY_MS = 3100;

    // Prevent multiple timers from being created
    if (window._redirectTimerActive) return;
    window._redirectTimerActive = true;

    // Standard browser replacement in the same tab after exactly 4 seconds
    const redirectTimer = setTimeout(() => {
      window.location.replace(TARGET_URL);
    }, REDIRECT_DELAY_MS);

    // Clean up timer on page unload if user navigates away
    window.addEventListener(
      "beforeunload",
      () => {
        clearTimeout(redirectTimer);
        window._redirectTimerActive = false;
      },
      { once: true },
    );
  };

  // -------------------------------------------------------------------------
  // Initialize All Modules
  // -------------------------------------------------------------------------
  initCountdown();
  initHeaderScroll();
  initMobileMenu();
  initSmoothScroll();
  initFaqAccordion();
  initPackageSelection();
  initQuantityControl();
  initShippingSelection();
  initOrderFormValidation();
  initStickyCta();
  updateOrderCalculations();
  initAutoRedirect();
});

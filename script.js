/* ===========================
   ZAYD FITNESS - SCRIPT
   =========================== */

document.addEventListener('DOMContentLoaded', () => {
    initLanguageToggle();
    initStickyNav();
    initScrollReveal();
    initFAQ();
    initFormSteps();
    initSmoothScroll();
});

/* ===========================
   LANGUAGE TOGGLE
   =========================== */

function initLanguageToggle() {
    const allToggles = document.querySelectorAll('.lang-toggle');

    allToggles.forEach(toggle => {
        const buttons = toggle.querySelectorAll('.lang-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const lang = btn.dataset.lang;
                setLanguage(lang);
            });
        });
    });
}

function setLanguage(lang) {
    document.body.className = 'lang-' + lang;

    // Update all toggle buttons across the page
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
}

/* ===========================
   STICKY NAV
   =========================== */

function initStickyNav() {
    const nav = document.getElementById('stickyNav');
    const hero = document.getElementById('hero');

    if (!nav || !hero) return;

    const observer = new IntersectionObserver(
        ([entry]) => {
            nav.classList.toggle('visible', !entry.isIntersecting);
        },
        { threshold: 0, rootMargin: '-64px 0px 0px 0px' }
    );

    observer.observe(hero);
}

/* ===========================
   SCROLL REVEAL
   =========================== */

function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.dataset.delay || 0;
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, delay * 100);
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1 }
    );

    reveals.forEach(el => observer.observe(el));
}

/* ===========================
   FAQ ACCORDION
   =========================== */

function initFAQ() {
    const items = document.querySelectorAll('.faq-item');

    items.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all
            items.forEach(i => i.classList.remove('active'));

            // Open clicked (if it wasn't already open)
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

/* ===========================
   MULTI-STEP FORM
   =========================== */

let currentStep = 1;
const totalSteps = 3;

function initFormSteps() {
    const form = document.getElementById('applicationForm');
    if (!form) return;

    form.addEventListener('submit', handleSubmit);
    updateProgress();
}

function nextStep() {
    if (!validateStep(currentStep)) return;

    if (currentStep < totalSteps) {
        currentStep++;
        showStep(currentStep);
        updateProgress();
    }
}

function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
        updateProgress();
    }
}

function showStep(step) {
    const steps = document.querySelectorAll('.form-step');
    steps.forEach(s => s.classList.remove('active'));

    const target = document.querySelector(`.form-step[data-step="${step}"]`);
    if (target) {
        target.classList.add('active');

        // Scroll form into view
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Update step indicators
    document.querySelectorAll('.step-ind').forEach(ind => {
        ind.classList.toggle('active', parseInt(ind.dataset.step) <= step);
    });
}

function updateProgress() {
    const fill = document.getElementById('progressFill');
    if (fill) {
        fill.style.width = (currentStep / totalSteps) * 100 + '%';
    }
}

function validateStep(step) {
    const stepEl = document.querySelector(`.form-step[data-step="${step}"]`);
    if (!stepEl) return true;

    let valid = true;

    // Validate text/email/number/select inputs
    const inputs = stepEl.querySelectorAll('input[required], select[required]');
    inputs.forEach(input => {
        if (input.type === 'radio') return; // handled separately
        const group = input.closest('.form-group');
        if (!input.value.trim()) {
            valid = false;
            if (group) {
                group.classList.add('invalid');
                setTimeout(() => group.classList.remove('invalid'), 2000);
            }
        }
    });

    // Validate radio groups
    const radioGroups = stepEl.querySelectorAll('.radio-group[data-name]');
    radioGroups.forEach(group => {
        const name = group.dataset.name;
        const checked = stepEl.querySelector(`input[name="${name}"]:checked`);
        if (!checked) {
            valid = false;
            const formGroup = group.closest('.form-group');
            if (formGroup) {
                formGroup.classList.add('invalid');
                setTimeout(() => formGroup.classList.remove('invalid'), 2000);
            }
        }
    });

    // Validate checkboxes (at least one must be checked in step 2)
    if (step === 2) {
        const checkboxes = stepEl.querySelectorAll('input[name="Goals"]:checked');
        if (checkboxes.length === 0) {
            valid = false;
            const cbGroup = stepEl.querySelector('.checkbox-group');
            if (cbGroup) {
                const formGroup = cbGroup.closest('.form-group');
                if (formGroup) {
                    formGroup.classList.add('invalid');
                    setTimeout(() => formGroup.classList.remove('invalid'), 2000);
                }
            }
        }
    }

    return valid;
}

function handleSubmit(e) {
    e.preventDefault();

    if (!validateStep(currentStep)) return;

    const form = e.target;
    const formData = new FormData(form);

    // Collect checkbox values (Goals)
    const goals = [];
    document.querySelectorAll('input[name="Goals"]:checked').forEach(cb => {
        goals.push(cb.value);
    });
    formData.set('Goals', goals.join(', '));

    // Submit via fetch to Google Apps Script
    const action = form.getAttribute('action');
    if (action && action !== 'YOUR_GOOGLE_APPS_SCRIPT_URL') {
        fetch(action, {
            method: 'POST',
            body: formData,
        }).catch(() => {
            // Silently fail - form submitted via iframe fallback
        });

        // Also submit via iframe as fallback
        form.submit();
    }

    // Show success
    form.style.display = 'none';
    document.querySelector('.progress-bar').style.display = 'none';
    document.querySelector('.step-indicators').style.display = 'none';

    const success = document.getElementById('formSuccess');
    if (success) {
        success.classList.add('show');
    }
}

/* ===========================
   SMOOTH SCROLL
   =========================== */

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

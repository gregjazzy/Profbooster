// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== NAVIGATION =====
    
    // Navigation sticky avec effet de transparence
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Ajouter/retirer la classe scrolled pour l'effet de transparence
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Masquer/afficher la navbar lors du scroll
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Menu mobile
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
    }
    
    // Smooth scroll pour les liens d'ancrage
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Compensation pour la navbar fixe
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Fermer le menu mobile si ouvert
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    mobileMenuToggle.classList.remove('active');
                }
            }
        });
    });
    
    // ===== ANIMATIONS AU SCROLL =====
    
    // Observer pour les animations au scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-on-scroll');
                
                // Animation spéciale pour les cartes
                if (entry.target.classList.contains('problem-card') || 
                    entry.target.classList.contains('result-card')) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, Math.random() * 300);
                }
            }
        });
    }, observerOptions);
    
    // Observer tous les éléments à animer
    document.querySelectorAll('.problem-card, .result-card, .feature, .module, .testimonial-card').forEach(el => {
        observer.observe(el);
    });
    
    // ===== CARROUSEL DE TÉMOIGNAGES =====
    
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const navDots = document.querySelectorAll('.nav-dot');
    let currentTestimonial = 0;
    
    function showTestimonial(index) {
        // Masquer tous les témoignages
        testimonialCards.forEach(card => card.classList.remove('active'));
        navDots.forEach(dot => dot.classList.remove('active'));
        
        // Afficher le témoignage sélectionné
        if (testimonialCards[index]) {
            testimonialCards[index].classList.add('active');
        }
        if (navDots[index]) {
            navDots[index].classList.add('active');
        }
    }
    
    function nextTestimonial() {
        currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
        showTestimonial(currentTestimonial);
    }
    
    // Navigation par points
    navDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentTestimonial = index;
            showTestimonial(currentTestimonial);
        });
    });
    
    // Auto-rotation des témoignages
    if (testimonialCards.length > 1) {
        setInterval(nextTestimonial, 5000); // Change toutes les 5 secondes
    }
    
    // ===== FAQ ACCORDÉON =====
    
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Fermer tous les autres items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle l'item actuel
            item.classList.toggle('active', !isActive);
        });
    });
    
    // ===== COMPTEURS ANIMÉS =====
    
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16); // 60 FPS
        
        function updateCounter() {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        }
        
        updateCounter();
    }
    
    // Observer pour déclencher les compteurs
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach(statNumber => {
                    const text = statNumber.textContent;
                    const number = parseInt(text.replace(/[^\d]/g, ''));
                    if (number && !statNumber.classList.contains('animated')) {
                        statNumber.classList.add('animated');
                        animateCounter(statNumber, number);
                    }
                });
            }
        });
    }, { threshold: 0.5 });
    
    // Observer les sections avec des statistiques
    document.querySelectorAll('.hero-stats, .about-stats').forEach(section => {
        counterObserver.observe(section);
    });
    
    // ===== EFFETS DE PARALLAXE LÉGERS =====
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero-visual, .profit-diagram');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
    
    // ===== VALIDATION DE FORMULAIRE (si ajouté plus tard) =====
    
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // ===== GESTION DES ERREURS =====
    
    window.addEventListener('error', function(e) {
        console.error('Erreur JavaScript:', e.error);
    });
    
    // ===== PERFORMANCE ET OPTIMISATIONS =====
    
    // Lazy loading pour les images (si ajoutées plus tard)
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // ===== ANALYTICS ET TRACKING =====
    
    // Tracking des clics sur les CTA
    document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
        button.addEventListener('click', function(e) {
            const buttonText = this.textContent.trim();
            const section = this.closest('section')?.className || 'unknown';
            
            // Ici vous pouvez ajouter votre code de tracking
            console.log('CTA clicked:', {
                text: buttonText,
                section: section,
                timestamp: new Date().toISOString()
            });
            
            // Exemple pour Google Analytics (à décommenter si GA est installé)
            // if (typeof gtag !== 'undefined') {
            //     gtag('event', 'click', {
            //         event_category: 'CTA',
            //         event_label: buttonText,
            //         value: section
            //     });
            // }
        });
    });
    
    // Tracking du temps passé sur la page
    let startTime = Date.now();
    let maxScroll = 0;
    
    window.addEventListener('scroll', function() {
        const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        maxScroll = Math.max(maxScroll, scrollPercent);
    });
    
    window.addEventListener('beforeunload', function() {
        const timeSpent = Math.round((Date.now() - startTime) / 1000);
        console.log('Page analytics:', {
            timeSpent: timeSpent,
            maxScroll: maxScroll,
            timestamp: new Date().toISOString()
        });
    });
    
    // ===== ACCESSIBILITÉ =====
    
    // Gestion du focus pour l'accessibilité clavier
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
    
    // ===== OPTIMISATIONS MOBILES =====
    
    // Détection du type d'appareil
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isTouch = 'ontouchstart' in window;
    
    if (isMobile || isTouch) {
        document.body.classList.add('touch-device');
        
        // Optimisations pour les appareils tactiles
        document.querySelectorAll('.problem-card, .result-card').forEach(card => {
            card.addEventListener('touchstart', function() {
                this.classList.add('touch-active');
            });
            
            card.addEventListener('touchend', function() {
                setTimeout(() => {
                    this.classList.remove('touch-active');
                }, 150);
            });
        });
    }
    
    // ===== GESTION DE LA CONNEXION =====
    
    // Détection de la connexion lente
    if ('connection' in navigator) {
        const connection = navigator.connection;
        if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
            document.body.classList.add('slow-connection');
            // Réduire les animations pour les connexions lentes
            document.documentElement.style.setProperty('--animation-duration', '0.1s');
        }
    }
    
    // ===== MESSAGES D'ÉTAT =====
    
    function showMessage(text, type = 'info', duration = 3000) {
        const message = document.createElement('div');
        message.className = `message message-${type}`;
        message.textContent = text;
        message.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(message);
        
        // Animation d'entrée
        setTimeout(() => {
            message.style.transform = 'translateX(0)';
        }, 100);
        
        // Animation de sortie
        setTimeout(() => {
            message.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(message);
            }, 300);
        }, duration);
    }
    
    // Exemple d'utilisation des messages
    // showMessage('Bienvenue sur Prof Business Academy!', 'success');
    
    // ===== MODALE DE PRÉSENTATION =====
    
    const introModal = document.getElementById('intro-modal');
    const modalClose = document.querySelector('.modal-close');
    
    // Fonction pour fermer la modale
    window.closeIntroModal = function() {
        introModal.classList.remove('active');
        localStorage.setItem('intro-modal-seen', 'true');
        
        // Démarrer les autres fonctionnalités après fermeture
        setTimeout(() => {
            startPremiumFeatures();
        }, 500);
    };
    
    // Fermer avec le bouton X
    if (modalClose) {
        modalClose.addEventListener('click', closeIntroModal);
    }
    
    // Fermer avec Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && introModal.classList.contains('active')) {
            closeIntroModal();
        }
    });
    
    // Vérifier si la modale a déjà été vue aujourd'hui
    function shouldShowIntroModal() {
        const lastSeen = localStorage.getItem('intro-modal-seen');
        const today = new Date().toDateString();
        const lastSeenDate = localStorage.getItem('intro-modal-date');
        
        // Afficher si jamais vue ou si c'est un nouveau jour
        if (!lastSeen || lastSeenDate !== today) {
            localStorage.setItem('intro-modal-date', today);
            return true;
        }
        return false;
    }
    
    // Afficher la modale au chargement si nécessaire
    if (shouldShowIntroModal()) {
        setTimeout(() => {
            introModal.classList.add('active');
            // Fermer automatiquement après 8 secondes
            setTimeout(() => {
                closeIntroModal();
            }, 8000);
        }, 1000); // Délai de 1 seconde pour un effet plus naturel
    } else {
        // Si la modale n'est pas affichée, démarrer les fonctionnalités premium
        startPremiumFeatures();
    }
    
    // ===== FONCTIONNALITÉS PREMIUM =====
    
    function startPremiumFeatures() {
        // Démarrer toutes les fonctionnalités premium après la modale
        initLiveStats();
        initConversionPopup();
        initNotifications();
        init3DEffects();
        initExitIntent();
        initScrollMagnet();
    }
    
    // Statistiques en temps réel simulées
    function initLiveStats() {
        function updateLiveStats() {
            const visitorsElement = document.getElementById('live-visitors');
            const signupsElement = document.getElementById('recent-signups');
            
            if (visitorsElement && signupsElement) {
                // Simulation de visiteurs en temps réel
                const baseVisitors = 247;
                const variation = Math.floor(Math.random() * 20) - 10;
                visitorsElement.textContent = Math.max(200, baseVisitors + variation);
                
                // Simulation d'inscriptions récentes
                const baseSignups = 12;
                const signupVariation = Math.floor(Math.random() * 6) - 3;
                signupsElement.textContent = Math.max(8, baseSignups + signupVariation);
            }
        }
        
        // Mettre à jour les stats toutes les 30 secondes
        setInterval(updateLiveStats, 30000);
        updateLiveStats();
    }
    
    // Popup de conversion avec timer
    function initConversionPopup() {
        const conversionPopup = document.getElementById('conversion-popup');
        const popupClose = document.querySelector('.popup-close');
        const popupTimer = document.getElementById('popup-timer');
        
        let popupShown = false;
        let timerMinutes = 15;
        let timerSeconds = 0;
        
        function showConversionPopup() {
            if (!popupShown && !localStorage.getItem('popup-closed-today')) {
                conversionPopup.classList.add('active');
                popupShown = true;
                startPopupTimer();
            }
        }
        
        function hideConversionPopup() {
            conversionPopup.classList.remove('active');
            localStorage.setItem('popup-closed-today', new Date().toDateString());
        }
        
        function startPopupTimer() {
            const timerInterval = setInterval(() => {
                if (timerSeconds === 0) {
                    if (timerMinutes === 0) {
                        clearInterval(timerInterval);
                        hideConversionPopup();
                        return;
                    }
                    timerMinutes--;
                    timerSeconds = 59;
                } else {
                    timerSeconds--;
                }
                
                const formattedTime = `${timerMinutes.toString().padStart(2, '0')}:${timerSeconds.toString().padStart(2, '0')}`;
                if (popupTimer) {
                    popupTimer.textContent = formattedTime;
                }
            }, 1000);
        }
        
        // Afficher le popup après 30 secondes
        setTimeout(showConversionPopup, 30000);
        
        // Fermer le popup
        if (popupClose) {
            popupClose.addEventListener('click', hideConversionPopup);
        }
        
        // Fermer le popup en cliquant à l'extérieur
        conversionPopup?.addEventListener('click', (e) => {
            if (e.target === conversionPopup) {
                hideConversionPopup();
            }
        });
    }
    
    // Notifications de conversion en temps réel
    function initNotifications() {
        const notificationContainer = document.getElementById('conversion-notifications');
        const notifications = [
            { name: 'Marie L.', action: 'prof de maths, vient de rejoindre la formation', time: 'Il y a 2 min' },
            { name: 'Thomas D.', action: 'prof d\'anglais, a téléchargé le guide', time: 'Il y a 5 min' },
            { name: 'Sophie M.', action: 'prof de physique, vient de s\'inscrire', time: 'Il y a 8 min' },
            { name: 'Pierre R.', action: 'prof de français, consulte la formation', time: 'Il y a 12 min' },
            { name: 'Julie B.', action: 'prof d\'espagnol, vient de s\'inscrire', time: 'Il y a 15 min' },
            { name: 'Antoine C.', action: 'prof de chimie, a rejoint la communauté', time: 'Il y a 18 min' }
        ];
        
        let notificationIndex = 0;
        
        function showNotification() {
            if (!notificationContainer) return;
            
            const notification = notifications[notificationIndex];
            const notificationElement = document.createElement('div');
            notificationElement.className = 'conversion-notification';
            
            notificationElement.innerHTML = `
                <div class="notification-avatar"></div>
                <div class="notification-content">
                    <div class="notification-name">${notification.name}</div>
                    <div class="notification-action">${notification.action}</div>
                    <div class="notification-time">${notification.time}</div>
                </div>
            `;
            
            notificationContainer.appendChild(notificationElement);
            
            // Animation d'entrée
            setTimeout(() => {
                notificationElement.classList.add('show');
            }, 100);
            
            // Supprimer après 5 secondes
            setTimeout(() => {
                notificationElement.classList.remove('show');
                setTimeout(() => {
                    if (notificationContainer.contains(notificationElement)) {
                        notificationContainer.removeChild(notificationElement);
                    }
                }, 300);
            }, 5000);
            
            notificationIndex = (notificationIndex + 1) % notifications.length;
        }
        
        // Afficher une notification toutes les 15 secondes après 10 secondes
        setTimeout(() => {
            showNotification();
            setInterval(showNotification, 15000);
        }, 10000);
    }
    
    // Effet 3D sur la carte hero avec le mouvement de la souris
    const heroCard = document.querySelector('.hero-card');
    
    if (heroCard) {
        heroCard.addEventListener('mousemove', (e) => {
            const rect = heroCard.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            heroCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
        });
        
        heroCard.addEventListener('mouseleave', () => {
            heroCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        });
    }
    
    // Détection de l'intention de sortie (exit intent)
    let exitIntentShown = false;
    
    document.addEventListener('mouseleave', (e) => {
        if (e.clientY <= 0 && !exitIntentShown && !localStorage.getItem('exit-intent-shown')) {
            showConversionPopup();
            exitIntentShown = true;
            localStorage.setItem('exit-intent-shown', 'true');
        }
    });
    
    // Scroll magnet - ralentir le scroll près des CTA
    const ctaElements = document.querySelectorAll('.btn-primary');
    let isNearCTA = false;
    
    function checkCTAProximity() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        
        ctaElements.forEach(cta => {
            const rect = cta.getBoundingClientRect();
            const ctaTop = rect.top + scrollY;
            
            if (Math.abs(scrollY + windowHeight/2 - ctaTop) < 100) {
                if (!isNearCTA) {
                    isNearCTA = true;
                    document.body.style.scrollBehavior = 'smooth';
                }
                return;
            }
        });
        
        if (isNearCTA) {
            isNearCTA = false;
            document.body.style.scrollBehavior = 'auto';
        }
    }
    
    window.addEventListener('scroll', throttle(checkCTAProximity, 100));
    
    // ===== INITIALISATION FINALE =====
    
    console.log('Prof Business Academy - Site Premium initialisé avec succès!');
    console.log('🚀 Fonctionnalités Premium activées:');
    console.log('✅ Statistiques temps réel');
    console.log('✅ Popup de conversion intelligent');
    console.log('✅ Notifications sociales');
    console.log('✅ Effets 3D interactifs');
    console.log('✅ Exit intent detection');
    console.log('✅ Scroll magnet sur CTA');
    
    // Déclencher l'animation initiale après un court délai
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// ===== FONCTIONS UTILITAIRES =====

// Fonction de debounce pour optimiser les performances
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// Fonction de throttle pour les événements de scroll
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Fonction pour obtenir la position d'un élément
function getElementPosition(element) {
    const rect = element.getBoundingClientRect();
    return {
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        height: rect.height
    };
}

// Fonction pour vérifier si un élément est visible
function isElementVisible(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// ===== STYLES CSS DYNAMIQUES =====

// Ajouter des styles CSS dynamiques si nécessaire
const dynamicStyles = `
    .keyboard-navigation *:focus {
        outline: 2px solid #2563eb !important;
        outline-offset: 2px !important;
    }
    
    .touch-device .problem-card:hover,
    .touch-device .result-card:hover {
        transform: none;
    }
    
    .touch-active {
        transform: scale(0.98) !important;
    }
    
    .slow-connection * {
        animation-duration: 0.1s !important;
        transition-duration: 0.1s !important;
    }
    
    .loaded {
        opacity: 1;
    }
    
    .navbar.scrolled {
        background: rgba(255, 255, 255, 0.98);
        backdrop-filter: blur(20px);
        box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
    }
    
    @media (max-width: 768px) {
        .nav-links.active {
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            background: white;
            border-top: 1px solid var(--border-color);
            padding: 1rem;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        }
        
        .mobile-menu-toggle.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .mobile-menu-toggle.active span:nth-child(2) {
            opacity: 0;
        }
        
        .mobile-menu-toggle.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
    }
`;

// Injecter les styles dynamiques
const styleSheet = document.createElement('style');
styleSheet.textContent = dynamicStyles;
document.head.appendChild(styleSheet);

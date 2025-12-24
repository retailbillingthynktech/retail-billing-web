// FAQ Accordion Functionality
document.addEventListener('DOMContentLoaded', function() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    const faqSearch = document.getElementById('faqSearch');
    const faqSearchClear = document.getElementById('faqSearchClear');
    const faqItems = document.querySelectorAll('.faq-item');
    const faqNoResults = document.getElementById('faqNoResults');

    // Accordion toggle functionality
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.closest('.faq-item');
            const isExpanded = this.getAttribute('aria-expanded') === 'true';

            // Close all other FAQ items (optional - remove if you want multiple open)
            // faqItems.forEach(item => {
            //     if (item !== faqItem) {
            //         item.classList.remove('active');
            //         const otherQuestion = item.querySelector('.faq-question');
            //         otherQuestion.setAttribute('aria-expanded', 'false');
            //     }
            // });

            // Toggle current FAQ item
            if (isExpanded) {
                faqItem.classList.remove('active');
                this.setAttribute('aria-expanded', 'false');
            } else {
                faqItem.classList.add('active');
                this.setAttribute('aria-expanded', 'true');
                
                // Smooth scroll to question if needed
                setTimeout(() => {
                    const rect = faqItem.getBoundingClientRect();
                    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                    const targetY = rect.top + scrollTop - 100; // 100px offset from top
                    
                    window.scrollTo({
                        top: targetY,
                        behavior: 'smooth'
                    });
                }, 100);
            }
        });
    });

    // Search functionality
    if (faqSearch) {
        faqSearch.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            
            if (searchTerm.length > 0) {
                faqSearchClear.style.display = 'flex';
                filterFAQs(searchTerm);
            } else {
                faqSearchClear.style.display = 'none';
                showAllFAQs();
            }
        });

        // Clear search
        if (faqSearchClear) {
            faqSearchClear.addEventListener('click', function() {
                faqSearch.value = '';
                faqSearchClear.style.display = 'none';
                showAllFAQs();
                faqSearch.focus();
            });
        }

        // Keyboard shortcuts
        faqSearch.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                this.value = '';
                faqSearchClear.style.display = 'none';
                showAllFAQs();
            }
        });
    }

    function filterFAQs(searchTerm) {
        let visibleCount = 0;

        faqItems.forEach(item => {
            const questionText = item.querySelector('.faq-question-text').textContent.toLowerCase();
            const answerText = item.querySelector('.faq-answer p').textContent.toLowerCase();
            const matches = questionText.includes(searchTerm) || answerText.includes(searchTerm);

            if (matches) {
                item.style.display = 'block';
                visibleCount++;
                
                // Highlight matching text (optional enhancement)
                highlightText(item, searchTerm);
            } else {
                item.style.display = 'none';
                // Close if it was open
                item.classList.remove('active');
                const question = item.querySelector('.faq-question');
                question.setAttribute('aria-expanded', 'false');
            }
        });

        // Show/hide no results message
        if (visibleCount === 0) {
            faqNoResults.style.display = 'block';
        } else {
            faqNoResults.style.display = 'none';
        }
    }

    function showAllFAQs() {
        faqItems.forEach(item => {
            item.style.display = 'block';
            // Remove any highlighting
            const questionText = item.querySelector('.faq-question-text');
            const answerText = item.querySelector('.faq-answer p');
            questionText.innerHTML = questionText.textContent;
            answerText.innerHTML = answerText.textContent;
        });
        faqNoResults.style.display = 'none';
    }

    function highlightText(item, searchTerm) {
        const questionText = item.querySelector('.faq-question-text');
        const answerText = item.querySelector('.faq-answer p');
        
        // Simple text highlighting (you can enhance this with regex for better matching)
        const questionHTML = questionText.textContent;
        const answerHTML = answerText.textContent;
        
        // Only highlight if search term is found
        if (questionHTML.toLowerCase().includes(searchTerm)) {
            const regex = new RegExp(`(${searchTerm})`, 'gi');
            questionText.innerHTML = questionHTML.replace(regex, '<mark>$1</mark>');
        }
        
        if (answerHTML.toLowerCase().includes(searchTerm)) {
            const regex = new RegExp(`(${searchTerm})`, 'gi');
            answerText.innerHTML = answerHTML.replace(regex, '<mark>$1</mark>');
        }
    }

    // Add smooth scroll animation for FAQ items
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe FAQ items for fade-in animation
    faqItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(item);
    });

    // Add mark styling for search highlights
    if (!document.querySelector('#faq-highlight-style')) {
        const style = document.createElement('style');
        style.id = 'faq-highlight-style';
        style.textContent = `
            .faq-question-text mark,
            .faq-answer mark {
                background: linear-gradient(135deg, rgba(198, 4, 10, 0.2), rgba(198, 4, 10, 0.15));
                color: var(--primary-color);
                padding: 2px 4px;
                border-radius: 3px;
                font-weight: 600;
            }
        `;
        document.head.appendChild(style);
    }
});



document.addEventListener('DOMContentLoaded', () => {

    const cursorGlow = document.getElementById('cursor-glow');

    if (window.innerWidth > 768) {
        document.addEventListener('mousemove', (e) => {
            cursorGlow.style.opacity = '1';
            cursorGlow.style.left = `${e.clientX}px`;
            cursorGlow.style.top = `${e.clientY}px`;
        });
        document.addEventListener('mouseleave', () => {
            cursorGlow.style.opacity = '0';
        });
    }

    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');

    let particles = [];
    let animationFrameId;
    let mouse = { x: null, y: null, radius: 120 };

    function initCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        createParticles();
    }

    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 2 + 0.6;
            this.baseX = x;
            this.baseY = y;
            this.density = (Math.random() * 10) + 2;

            this.vx = (Math.random() * 0.4 - 0.2);
            this.vy = (Math.random() * 0.4 - 0.2);
        }

        draw() {
            ctx.fillStyle = 'rgba(0, 210, 255, 0.25)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }

        update() {

            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

            if (mouse.x !== null && mouse.y !== null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.hypot(dx, dy);
                if (distance < mouse.radius) {
                    let force = (mouse.radius - distance) / mouse.radius;
                    let angle = Math.atan2(dy, dx);

                    this.x -= Math.cos(angle) * force * 2;
                    this.y -= Math.sin(angle) * force * 2;
                }
            }
        }
    }

    function createParticles() {
        particles = [];

        const count = window.innerWidth < 768 ? 40 : 100;
        for (let i = 0; i < count; i++) {
            let x = Math.random() * canvas.width;
            let y = Math.random() * canvas.height;
            particles.push(new Particle(x, y));
        }
    }

    function connectParticles() {
        let maxDist = 110;
        for (let a = 0; a < particles.length; a++) {
            for (let b = a + 1; b < particles.length; b++) {
                let dx = particles[a].x - particles[b].x;
                let dy = particles[a].y - particles[b].y;
                let dist = Math.hypot(dx, dy);

                if (dist < maxDist) {
                    let opacity = (1 - (dist / maxDist)) * 0.12;
                    ctx.strokeStyle = `rgba(0, 102, 255, ${opacity})`;
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let p of particles) {
            p.update();
            p.draw();
        }
        connectParticles();
        animationFrameId = requestAnimationFrame(animateParticles);
    }

    window.addEventListener('resize', () => {
        cancelAnimationFrame(animationFrameId);
        initCanvas();
        animateParticles();
    });

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    initCanvas();
    animateParticles();

    const navbar = document.querySelector('.navbar');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinksContainer = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('main > section');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinksContainer.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navLinksContainer.classList.remove('active');
        });
    });

    const typewriter = document.getElementById('typewriter');
    const roles = [
        'AI / ML Engineer',
        'Data Scientist',
        'Full-Stack Developer'
    ];
    let roleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typingSpeed = 80;

    function handleType() {
        const currentRole = roles[roleIdx];
        if (isDeleting) {
            typewriter.textContent = currentRole.substring(0, charIdx - 1);
            charIdx--;
            typingSpeed = 40;
        } else {
            typewriter.textContent = currentRole.substring(0, charIdx + 1);
            charIdx++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIdx === currentRole.length) {
            isDeleting = true;
            typingSpeed = 1500;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            roleIdx = (roleIdx + 1) % roles.length;
            typingSpeed = 500;
        }

        setTimeout(handleType, typingSpeed);
    }

    if (typewriter) setTimeout(handleType, 1000);

    const revealElements = document.querySelectorAll('[data-reveal]');

    function checkReveal() {
        const triggerBottom = window.innerHeight * 0.9;
        revealElements.forEach(el => {
            const elTop = el.getBoundingClientRect().top;
            const delay = el.getAttribute('data-delay') || 0;
            if (elTop < triggerBottom) {
                setTimeout(() => {
                    el.classList.add('revealed');
                }, delay);
            }
        });
    }

    window.addEventListener('scroll', checkReveal);

    checkReveal();

    const skillTags = document.querySelectorAll('.skill-tag');
    const infoPanel = document.getElementById('skill-info-panel');
    const panelSkillName = document.getElementById('panel-skill-name');
    const panelSkillDesc = document.getElementById('panel-skill-desc');

    skillTags.forEach(tag => {
        tag.addEventListener('mouseenter', () => {
            const desc = tag.getAttribute('data-desc');
            const name = tag.textContent;

            panelSkillName.textContent = name;
            panelSkillDesc.textContent = desc;
            infoPanel.classList.remove('hidden');

            skillTags.forEach(t => t.classList.remove('active'));
            tag.classList.add('active');
        });
    });

    const filterBtns = document.querySelectorAll('.filter-btn');
    const certCards = document.querySelectorAll('.cert-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filterValue = btn.getAttribute('data-filter');

            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            certCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';

                    card.style.opacity = '0';
                    setTimeout(() => { card.style.opacity = '1'; }, 50);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    const certModal = document.getElementById('cert-modal');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalClose = document.getElementById('modal-close');
    const certImages = document.querySelectorAll('.cert-card img');

    certImages.forEach(img => {
        img.addEventListener('click', () => {

            if (img.parentElement.classList.contains('achievement-placeholder')) return;

            const card = img.closest('.cert-card');
            const title = card.querySelector('h4').textContent;

            modalImg.src = img.src;
            modalTitle.textContent = title;
            certModal.classList.remove('hidden');
            document.body.classList.add('modal-open');
        });
    });

    function closeModal() {
        certModal.classList.add('hidden');
        document.body.classList.remove('modal-open');
    }

    modalClose.addEventListener('click', closeModal);
    certModal.addEventListener('click', (e) => {
        if (e.target === certModal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    const contactForm = document.getElementById('portfolio-contact-form');
    const successMsg = document.getElementById('form-success-message');
    const resetFormBtn = document.getElementById('btn-reset-form');

    // ⚠️ Replace the URL below with your Formspree endpoint.
    // Sign up free at https://formspree.io, create a form, and paste the endpoint here.
    // Example: 'https://formspree.io/f/xyzabc12'
    const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xlgknoqj';

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('.btn-submit');
            const originalText = submitBtn.innerHTML;

            const name = document.getElementById('form-name').value.trim();
            const email = document.getElementById('form-email').value.trim();
            const subject = document.getElementById('form-subject').value.trim();
            const message = document.getElementById('form-message').value.trim();

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner" style="width:16px;height:16px;border-width:2px;border-top-color:#fff;display:inline-block;"></span> Transmitting...';

            try {
                const response = await fetch(FORMSPREE_ENDPOINT, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                    body: JSON.stringify({ name, email, subject, message })
                });

                if (response.ok) {
                    contactForm.classList.add('hidden');
                    successMsg.classList.remove('hidden');
                    contactForm.reset();
                } else {
                    const data = await response.json();
                    const errMsg = data.errors ? data.errors.map(e => e.message).join(', ') : 'Submission failed. Please try again or email directly.';
                    alert('Error: ' + errMsg);
                }
            } catch (err) {
                alert('Network error. Please check your connection or email me directly at shahussain891@gmail.com');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        });

        resetFormBtn.addEventListener('click', () => {
            successMsg.classList.add('hidden');
            contactForm.classList.remove('hidden');
        });
    }

    const chatTrigger = document.getElementById('chatbot-trigger');
    const chatContainer = document.getElementById('chatbot-container');
    const chatClose = document.getElementById('chatbot-close');
    const chatInput = document.getElementById('chatbot-input');
    const chatSend = document.getElementById('chatbot-send');
    const chatMessages = document.getElementById('chatbot-messages');
    const suggestBtns = document.querySelectorAll('.suggest-btn');

    chatTrigger.addEventListener('click', () => {
        chatContainer.classList.toggle('closed');
        if (!chatContainer.classList.contains('closed')) {
            chatInput.focus();
        }
    });

    chatClose.addEventListener('click', () => {
        chatContainer.classList.add('closed');
    });

    chatSend.addEventListener('click', handleUserMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleUserMessage();
    });

    suggestBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const query = btn.getAttribute('data-query');
            handleQuickQuery(query);
        });
    });

    // Bot replies are trusted HTML written in this file; user text is always inserted as plain text.
    function appendMessage(content, isUser = false) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        const textDiv = document.createElement('div');
        textDiv.className = 'message-text';
        if (isUser) {
            textDiv.textContent = content;
        } else {
            textDiv.innerHTML = content;
        }
        msgDiv.appendChild(textDiv);
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message message-typing';
        typingDiv.id = 'chat-typing-indicator';
        typingDiv.innerHTML = '<span></span><span></span><span></span>';
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function removeTypingIndicator() {
        const ind = document.getElementById('chat-typing-indicator');
        if (ind) ind.remove();
    }

    function handleUserMessage() {
        const text = chatInput.value.trim();
        if (!text) return;

        appendMessage(text, true);
        chatInput.value = '';

        showTypingIndicator();

        setTimeout(() => {
            removeTypingIndicator();
            const reply = getBotReply(text);
            appendMessage(reply);
        }, 1000);
    }

    const LINKS = {
        github: "<a href='https://github.com/sha728' target='_blank' rel='noopener'>github.com/sha728</a>",
        linkedin: "<a href='https://www.linkedin.com/in/shahid-s/' target='_blank' rel='noopener'>linkedin.com/in/shahid-s</a>",
        leetcode: "<a href='https://leetcode.com/u/shahid00/' target='_blank' rel='noopener'>leetcode.com/u/shahid00</a>",
        email: "<a href='mailto:shahussain891@gmail.com'>shahussain891@gmail.com</a>"
    };

    const ANSWERS = {
        greeting: "Hello! Ask me about Shahid's skills, projects, experience, education, certifications or contact details.",
        skills: "Shahid's main skills:<br>" +
            "• <strong>LLMs &amp; NLP:</strong> LLM APIs, LLM evaluation, HuggingFace Transformers, Sentence-Transformers, spaCy, sqlglot<br>" +
            "• <strong>Data &amp; ML:</strong> pandas, NumPy, scikit-learn, similarity ranking<br>" +
            "• <strong>Languages:</strong> Python, SQL, C#, JavaScript, TypeScript<br>" +
            "• <strong>Backend &amp; Frontend:</strong> ASP.NET Core, FastAPI, PostgreSQL, React, Streamlit<br>" +
            "• <strong>DevOps &amp; Testing:</strong> Docker Compose, GitHub Actions, pytest, xUnit",
        projects: "Shahid's projects:<br>" +
            "1. <strong>QueryMind:</strong> natural language to safe, read-only SQL. 81.1% execution accuracy on the Spider 1.0 dev set; 152/152 unsafe statements blocked.<br>" +
            "2. <strong>PackVote:</strong> group travel recommender with cosine-similarity matching, fairness-aware ranking and Gemini itineraries.<br>" +
            "3. <strong>Career AI Agent:</strong> résumé + GitHub analysis that builds a prioritised learning roadmap.<br>" +
            "4. <strong>Mood-Based Book Recommender:</strong> pretrained DistilRoBERTa emotion labels on 6,810 books.<br>" +
            "Details and code links are in the Projects section.",
        experience: "Shahid is an <strong>Engineering Intern at eTrilliumtech Technologies</strong> (2026 – present). He built the Apex Gym Management System (ASP.NET Core, PostgreSQL, React, 55 xUnit tests) and works on Lawsome, a team-built practice-management platform for law firms.",
        education: "B.Tech in Computer Science &amp; Engineering, <strong>Lovely Professional University</strong> (2022–2026), minor in DevOps Engineering, CGPA <strong>7.56</strong>.",
        certifications: "Certifications: <strong>IBM Data Science Methodology</strong>, <strong>IBM Big Data 101</strong>, <strong>Deloitte Data Analytics Job Simulation</strong>, <strong>iHUB DivyaSampark (IIT Roorkee) Machine Learning &amp; Its Applications</strong> and <strong>LinkedIn Learning NLP with Python</strong>. See the Credentials section.",
        contact: "You can reach Shahid via:<br>• Email: " + LINKS.email + "<br>• Phone: +91 9701105237<br>• LinkedIn: " + LINKS.linkedin + "<br>• GitHub: " + LINKS.github + "<br>• LeetCode: " + LINKS.leetcode,
        hiring: "Shahid is looking for full-time AI/ML, data science and full-stack roles in Bengaluru, Hyderabad, Mumbai or Chennai. Download the résumé from the About section or use the contact form.",
        fallback: "I only have pre-written answers. Try asking about <strong>skills</strong>, <strong>projects</strong>, <strong>experience</strong>, <strong>education</strong>, <strong>certifications</strong> or <strong>contact</strong>, or use the buttons below."
    };

    const QUICK_QUERIES = {
        'core-skills': ["What are your core technical skills?", 'skills'],
        'projects': ["Tell me about your projects.", 'projects'],
        'experience': ["What is your work experience?", 'experience'],
        'education': ["Where did you study?", 'education'],
        'contact': ["How can I contact you?", 'contact']
    };

    function handleQuickQuery(queryType) {
        const entry = QUICK_QUERIES[queryType];
        if (!entry) return;
        appendMessage(entry[0], true);
        showTypingIndicator();
        setTimeout(() => {
            removeTypingIndicator();
            appendMessage(ANSWERS[entry[1]]);
        }, 600);
    }

    // Whole-word matching, so "this" or "machine" no longer trigger the greeting.
    const INTENTS = [
        ['contact', /\b(contact|email|e-mail|phone|call|reach|github|linkedin|leetcode)\b/],
        ['hiring', /\b(job|jobs|hire|hiring|recruit\w*|role|roles|available|availability|opening)\b/],
        ['projects', /\b(projects?|querymind|sql|packvote|travel|career|book|books|recommender)\b/],
        ['experience', /\b(experience|intern|internship|work|company|etrilliumtech|gym|lawsome)\b/],
        ['education', /\b(education|college|university|lpu|cgpa|gpa|degree|b\.?tech|study|studied)\b/],
        ['certifications', /\b(certif\w*|ibm|deloitte|ihub|course|courses)\b/],
        ['skills', /\b(skills?|stack|languages?|python|react|dotnet|tools?|tech)\b|\.net|c#/],
        ['greeting', /^\s*(hi|hello|hey|hii+|namaste)\b/]
    ];

    function getBotReply(inputText) {
        const txt = inputText.toLowerCase();
        for (const [key, pattern] of INTENTS) {
            if (pattern.test(txt)) return ANSWERS[key];
        }
        return ANSWERS.fallback;
    }

});

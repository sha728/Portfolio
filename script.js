
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
        'Data Scientist',
        'AI / Machine Learning Engineer',
        'NLP Specialist',
        'LLM & RAG Developer'
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

    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');

            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });

    const moodBtns = document.querySelectorAll('.mood-btn');
    const recInput = document.getElementById('recommender-input');
    const runRecBtn = document.getElementById('btn-run-recommender');
    const recOutput = document.getElementById('recommender-output');
    const loader = recOutput.querySelector('.inference-loader');
    const results = recOutput.querySelector('.inference-results');

    moodBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            moodBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            recInput.value = btn.getAttribute('data-text');
        });
    });

    runRecBtn.addEventListener('click', () => {
        const userText = recInput.value.trim();
        if (!userText) {
            alert("Please type a mood description or click a preset first!");
            return;
        }

        recOutput.classList.remove('hidden');
        loader.classList.remove('hidden');
        results.classList.add('hidden');

        setTimeout(() => {
            loader.classList.add('hidden');
            results.classList.remove('hidden');

            let serenity = 10, melancholy = 10, excitement = 10, tension = 10;
            let bookTitle = "Weapons of Math Destruction";
            let bookAuthor = "Cathy O'Neil";
            let bookDesc = "An analytical, eye-opening exploration of how algorithms and big data reinforce discrimination and damage society.";
            let matchScore = "89.2%";

            const lowerText = userText.toLowerCase();
            if (lowerText.includes("stressed") || lowerText.includes("peace") || lowerText.includes("escape") || lowerText.includes("quiet")) {
                serenity = 82; melancholy = 12; excitement = 4; tension = 2;
                bookTitle = "The Hobbit";
                bookAuthor = "J.R.R. Tolkien";
                bookDesc = "Whisk away from modern stressors into the quiet green hills of the Shire and join Bilbo Baggins on a whimsical, cozy adventure.";
                matchScore = "96.4%";
            } else if (lowerText.includes("curious") || lowerText.includes("solve") || lowerText.includes("mystery") || lowerText.includes("brain") || lowerText.includes("learn")) {
                serenity = 15; melancholy = 5; excitement = 68; tension = 12;
                bookTitle = "Gödel, Escher, Bach: An Eternal Golden Braid";
                bookAuthor = "Douglas Hofstadter";
                bookDesc = "Explore the profound interconnections of cognitive science, mathematics, computer logic, and art in this mind-bending masterwork.";
                matchScore = "94.8%";
            } else if (lowerText.includes("emotional") || lowerText.includes("sad") || lowerText.includes("heart") || lowerText.includes("inspiring")) {
                serenity = 25; melancholy = 60; excitement = 10; tension = 5;
                bookTitle = "The Ocean at the End of the Lane";
                bookAuthor = "Neil Gaiman";
                bookDesc = "A deeply nostalgic, melancholic, and poetically written novel exploring memory, childhood loneliness, and quiet magic.";
                matchScore = "92.1%";
            }

            document.getElementById('bar-serenity').style.width = `${serenity}%`;
            document.getElementById('bar-melancholy').style.width = `${melancholy}%`;
            document.getElementById('bar-excitement').style.width = `${excitement}%`;
            document.getElementById('bar-tension').style.width = `${tension}%`;

            document.getElementById('pct-serenity').textContent = `${serenity}%`;
            document.getElementById('pct-melancholy').textContent = `${melancholy}%`;
            document.getElementById('pct-excitement').textContent = `${excitement}%`;
            document.getElementById('pct-tension').textContent = `${tension}%`;

            document.getElementById('rec-book-title').textContent = bookTitle;
            document.getElementById('rec-book-author').textContent = bookAuthor;
            document.getElementById('rec-book-desc').textContent = bookDesc;
            document.getElementById('rec-similarity').textContent = matchScore;

        }, 1500);
    });

    const runRoadmapBtn = document.getElementById('btn-run-roadmap');
    const roadmapOutput = document.getElementById('roadmap-output');
    const rmLoader = roadmapOutput.querySelector('.inference-loader');
    const rmResults = roadmapOutput.querySelector('.inference-results');

    runRoadmapBtn.addEventListener('click', () => {
        const targetRole = document.getElementById('target-role').value;
        const currentSkill = document.getElementById('current-skill').value;

        roadmapOutput.classList.remove('hidden');
        rmLoader.classList.remove('hidden');
        rmResults.classList.add('hidden');

        setTimeout(() => {
            rmLoader.classList.add('hidden');
            rmResults.classList.remove('hidden');

            let missingStr = "";
            let verifiedStr = "";
            let step1 = "", step2 = "", step3 = "";

            if (targetRole === 'data-scientist') {
                missingStr = "PyTorch, Advanced Statistics, HuggingFace Transformers";
                if (currentSkill === 'python-only') {
                    verifiedStr = "Python Scripting";
                    step1 = "<strong>Phase 1 (Wrangling):</strong> Master NumPy, Pandas, SQL joins, and Exploratory Data Analysis (EDA).";
                    step2 = "<strong>Phase 2 (Scikit-Learn):</strong> Train supervised models (regressions, trees), validation metrics, and feature selection.";
                    step3 = "<strong>Phase 3 (Deep Learning & NLP):</strong> Study neural networks with PyTorch and fine-tune text models with HuggingFace.";
                } else if (currentSkill === 'data-analyst') {
                    verifiedStr = "Python, Pandas, SQL, Data Visualization";
                    step1 = "<strong>Phase 1 (Math Foundations):</strong> Focus on probability distributions, hypothesis testing, and regression analysis.";
                    step2 = "<strong>Phase 2 (Machine Learning):</strong> Study ensemble models, clustering algorithms, and model evaluation parameters.";
                    step3 = "<strong>Phase 3 (DL & Deployment):</strong> Master PyTorch deep learning networks, and deploy Streamlit web prototypes.";
                } else {
                    verifiedStr = "Python, Pandas, ML Basics, Scikit-Learn";
                    step1 = "<strong>Phase 1 (Advanced ML):</strong> Advanced feature engineering, hyperparameters optimization, and handling model drift.";
                    step2 = "<strong>Phase 2 (Deep Learning):</strong> Core neural network structures in PyTorch, CNNs, and recurrent networks.";
                    step3 = "<strong>Phase 3 (Transformers & NLP):</strong> Implement HuggingFace libraries, RoBERTa fine-tuning, and LLM text generation integrations.";
                }
            } else if (targetRole === 'mlops-engineer') {
                missingStr = "Docker, CI/CD Pipelines, FastAPI, AWS cloud hosting";
                verifiedStr = currentSkill === 'python-only' ? "Python foundations" : (currentSkill === 'data-analyst' ? "Python, SQL" : "Python, Scikit-Learn basics");

                step1 = "<strong>Phase 1 (APIs & Containers):</strong> Learn FastAPI for writing backend inference routes and build Docker container images.";
                step2 = "<strong>Phase 2 (AWS Deployments):</strong> Configure AWS EC2 instances, S3 storage buckets, and secure environment keys.";
                step3 = "<strong>Phase 3 (CI/CD Automations):</strong> Integrate GitHub Actions to automate lints, tests, and auto-build docker containers on push.";
            } else {
                missingStr = "LLM APIs, Prompt Engineering, Vector Databases, RAG architectures";
                verifiedStr = currentSkill === 'python-only' ? "Basic Python" : (currentSkill === 'data-analyst' ? "Python, Data Processing" : "Python, Scikit-Learn");

                step1 = "<strong>Phase 1 (NLP Core):</strong> Learn tokenization, TF-IDF, bag-of-words, and cosine similarity rankings.";
                step2 = "<strong>Phase 2 (LLM Architectures):</strong> Study transformer mechanisms, integrate Google Gemini API endpoints, and structure JSON responses.";
                step3 = "<strong>Phase 3 (RAG Frameworks):</strong> Build Retrieval-Augmented Generation systems using semantic search vector databases.";
            }

            document.getElementById('roadmap-gap').textContent = missingStr;
            document.getElementById('roadmap-verified').textContent = verifiedStr;
            document.getElementById('step-1-text').innerHTML = step1;
            document.getElementById('step-2-text').innerHTML = step2;
            document.getElementById('step-3-text').innerHTML = step3;

        }, 1800);
    });

    const runConsensusBtn = document.getElementById('btn-run-consensus');
    const packvoteOutput = document.getElementById('packvote-output');
    const pvLoader = packvoteOutput.querySelector('.inference-loader');
    const pvResults = packvoteOutput.querySelector('.inference-results');

    runConsensusBtn.addEventListener('click', () => {
        packvoteOutput.classList.remove('hidden');
        pvLoader.classList.remove('hidden');
        pvResults.classList.add('hidden');

        setTimeout(() => {
            pvLoader.classList.add('hidden');
            pvResults.classList.remove('hidden');

            const vibe1 = document.getElementById('user1-vibe').value;
            const budget1 = document.getElementById('user1-budget').value;
            const vibe2 = document.getElementById('user2-vibe').value;
            const budget2 = document.getElementById('user2-budget').value;
            const vibe3 = document.getElementById('user3-vibe').value;
            const budget3 = document.getElementById('user3-budget').value;

            let itinerary = "Default trip: Morning beach walk, afternoon local cafe visits, evening campfire. Budget under 3,000 INR.";
            if (vibe1 === 'beach' || vibe2 === 'beach' || vibe3 === 'beach') {
                itinerary = "<strong>Day 1:</strong> Coast cliff hiking in Gokarna, tracking forest trails. <br><strong>Day 2:</strong> Relaxing sunset at Kudle Beach, enjoying local seafood. Budget optimized to low cost hostels.";
            }
            if ((vibe1 === 'heritage' || vibe2 === 'heritage' || vibe3 === 'heritage') && (vibe1 === 'adventure' || vibe2 === 'adventure' || vibe3 === 'adventure')) {
                itinerary = "<strong>Day 1:</strong> Explore stone temples and ruins in Hampi by bicycle. <br><strong>Day 2:</strong> Sunrise bouldering hike up Anjanadri Hill. Budget kept within 1,200 INR per person for home stays.";
            }

            document.getElementById('consensus-itinerary-text').innerHTML = itinerary;

        }, 1600);
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

    function appendMessage(text, isUser = false) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        msgDiv.innerHTML = `<div class="message-text">${text}</div>`;
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

    function handleQuickQuery(queryType) {
        let userText = "";
        let botText = "";

        if (queryType === 'core-skills') {
            userText = "What are your core technical skills?";
            botText = "Shahid specializes in:<br>" +
                "• <strong>ML & Statistics:</strong> PyTorch, Scikit-Learn, TensorFlow, RoBERTa<br>" +
                "• <strong>AI & GenAI:</strong> Large Language Models (LLMs), RAG pipelines, prompt engineering, agentic workflows<br>" +
                "• <strong>Languages:</strong> Python, SQL, Java<br>" +
                "• <strong>Deployment:</strong> Streamlit, FastAPI, AWS, Docker containers, CI/CD.";
        } else if (queryType === 'projects') {
            userText = "Tell me about your projects.";
            botText = "Shahid has three major projects listed on his resume:<br>" +
                "1. <strong>Mood-Based Book Recommender:</strong> Sentiment classification using RoBERTa and cosine similarities deployed via Streamlit.<br>" +
                "2. <strong>Career AI Agent:</strong> A resume-aware roadmapper running skills gap evaluations.<br>" +
                "3. <strong>PackVote System:</strong> Multi-user consensus trip calculator employing cosine similarity algorithms and Google Gemini API.";
        } else if (queryType === 'education') {
            userText = "Where did you study?";
            botText = "Shahid is pursuing his B.Tech in Computer Science and Engineering at <strong>Lovely Professional University (LPU)</strong>, Punjab, graduating in 2026. He maintains a strong CGPA of <strong>7.4</strong>.";
        } else if (queryType === 'contact') {
            userText = "How can I contact you?";
            botText = "You can connect with Shahid directly via:<br>" +
                "• <strong>Email:</strong> <a href='mailto:shahussain891@gmail.com'>shahussain891@gmail.com</a><br>" +
                "• <strong>Phone:</strong> +91 9701105237<br>" +
                "• <strong>LinkedIn:</strong> <a href='https://www.linkedin.com/in/shahid-s/' target='_blank'>shahid-s</a><br>" +
                "• <strong>GitHub:</strong> <a href='https://github.com/Shahid12201307' target='_blank'>Shahid12201307</a>";
        }

        appendMessage(userText, true);
        showTypingIndicator();
        setTimeout(() => {
            removeTypingIndicator();
            appendMessage(botText);
        }, 800);
    }

    function getBotReply(inputText) {
        const txt = inputText.toLowerCase();

        if (txt.includes('hello') || txt.includes('hi') || txt.includes('hey')) {
            return "Hello! I can tell you all about Shahid's experience, skill set, and credentials. What would you like to explore?";
        }
        if (txt.includes('skill') || txt.includes('language') || txt.includes('python') || txt.includes('pytorch') || txt.includes('sql')) {
            return "Shahid is highly proficient in <strong>Python</strong>, <strong>SQL</strong>, and <strong>Java</strong>. For machine learning, he works extensively with <strong>PyTorch</strong>, <strong>scikit-learn</strong>, and <strong>HuggingFace</strong> models (specifically RoBERTa). He also develops agentic GenAI architectures with the <strong>Google Gemini API</strong>.";
        }
        if (txt.includes('project') || txt.includes('book') || txt.includes('career') || txt.includes('packvote') || txt.includes('travel')) {
            return "Shahid's main projects include a <strong>Mood-Based Book Recommender</strong> (sentiment classification via RoBERTa), a <strong>Career AI Agent</strong> (resume gap parser), and <strong>PackVote</strong> (group travel preference voting using Gemini API and cosine similarity). You can try simulations of all three in the <strong>Demos</strong> section above!";
        }
        if (txt.includes('education') || txt.includes('college') || txt.includes('university') || txt.includes('lpu') || txt.includes('cgpa')) {
            return "Shahid is studying Computer Science & Engineering at <strong>Lovely Professional University (LPU)</strong>, Punjab (batch of 2022-2026), and holds a <strong>7.4 CGPA</strong>. He finished his intermediate 12th grade at Narayana Junior College, Tirupati with <strong>83%</strong>.";
        }
        if (txt.includes('certif') || txt.includes('ibm') || txt.includes('course') || txt.includes('deloitte') || txt.includes('ihub')) {
            return "Shahid holds credentials including **IBM Data Science Methodology**, **IBM Big Data 101**, **Deloitte Data Analytics Job Simulation**, **iHUB IIT Roorkee Machine Learning**, and **LinkedIn Learning NLP with Python**. You can filter and click to view them in the Credentials section!";
        }
        if (txt.includes('contact') || txt.includes('email') || txt.includes('phone') || txt.includes('call') || txt.includes('github') || txt.includes('linkedin')) {
            return "You can reach Shahid via:<br>• Email: <a href='mailto:shahussain891@gmail.com'>shahussain891@gmail.com</a><br>• Phone: +91 9701105237<br>• LinkedIn: <a href='https://www.linkedin.com/in/shahid-s/' target='_blank'>shahid-s</a><br>• GitHub: <a href='https://github.com/Shahid12201307' target='_blank'>Shahid12201307</a>";
        }
        if (txt.includes('job') || txt.includes('intern') || txt.includes('hire') || txt.includes('recruit')) {
            return "Yes! Shahid is actively seeking Data Scientist, ML Engineer, or GenAI Developer internship and full-time opportunities. You can download his resume PDF from the About section or send him an inquiry via the Contact Form!";
        }

        return "I'm a local assistant modeled on Shahid's resume. I recommend checking out his **Interactive Project Playgrounds** on this page or clicking the quick suggestion tags below to get instant answers!";
    }

});

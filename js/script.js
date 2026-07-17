// =========================
// WAIT UNTIL PAGE LOADS
// =========================

document.addEventListener("DOMContentLoaded", () => {

    // =========================
    // INTRO SPLASH - AJOL BREAKING APART
    // =========================

    const introOverlay = document.getElementById("intro-overlay");
    const introLetters = document.querySelectorAll(".intro-letter");
    const introSub = document.querySelector(".intro-sub");

    // Sequence: glow letters -> text change -> break apart -> fade out overlay
    function startIntroSequence() {

        // Phase 1: Letters load and glow for 2s
        setTimeout(() => {

            // Phase 2: Change subtitle text and prepare for break
            if (introSub) {
                introSub.textContent = "BREAKING APART...";
                introSub.style.color = "#ff00ff";
                introSub.style.textShadow =
                    "0 0 10px #ff00ff, 0 0 20px #ff00ff, 0 0 40px #ff00ff";
            }

            // Phase 3: Trigger break after a short pause
            setTimeout(() => {

                if (introOverlay) {
                    introOverlay.classList.add("breaking");
                }

                // Phase 4: Fade out overlay after break animation
                setTimeout(() => {

                    if (introOverlay) {
                        introOverlay.classList.add("hidden");
                    }

                    // Phase 5: Remove overlay from DOM after fade
                    setTimeout(() => {
                        if (introOverlay) {
                            introOverlay.style.display = "none";
                        }
                        // Now start all other features
                        initAllFeatures();
                    }, 900);

                }, 1200);

            }, 600);

        }, 2000);
    }

    // Start the intro sequence
    startIntroSequence();

    // =========================
    // PORTFOLIO DATA
    // =========================

    let portfolioData = null;

    async function loadPortfolioData() {
        try {
            const res = await fetch("data/portfolio.json");
            portfolioData = await res.json();
        } catch (e) {
            console.warn("Portfolio data not loaded, using fallback.");
            portfolioData = null;
        }
    }

    // =========================
    // ALL FEATURES (called after intro)
    // =========================

    function initAllFeatures() {

        // --- LOADER HANDLING ---
        const loader = document.getElementById("loader");
        if (loader) {
            loader.style.display = "none";
        }

        // Load portfolio data
        loadPortfolioData();

        // --- MOBILE MENU ---
        const menuBtn = document.getElementById("menu-btn");
        const navLinks = document.querySelector(".nav-links");

        if (menuBtn && navLinks) {
            menuBtn.addEventListener("click", () => {
                navLinks.classList.toggle("active");
                menuBtn.innerHTML = navLinks.classList.contains("active")
                    ? '<i class="fas fa-times"></i>'
                    : '<i class="fas fa-bars"></i>';
            });

            document.querySelectorAll(".nav-links a").forEach(link => {
                link.addEventListener("click", () => {
                    navLinks.classList.remove("active");
                    menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                });
            });
        }

        // --- DARK/LIGHT MODE ---
        const themeBtn = document.getElementById("theme-toggle");

        if (themeBtn) {
            // Load saved preference
            const savedTheme = localStorage.getItem("theme");
            if (savedTheme === "light") {
                document.body.classList.add("light-mode");
                themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
            } else {
                themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
            }

            themeBtn.addEventListener("click", () => {
                document.body.classList.toggle("light-mode");
                const isLight = document.body.classList.contains("light-mode");
                themeBtn.innerHTML = isLight
                    ? '<i class="fas fa-sun"></i>'
                    : '<i class="fas fa-moon"></i>';
                localStorage.setItem("theme", isLight ? "light" : "dark");
            });
        }

        // --- TYPING EFFECT ---
        const typing = document.querySelector(".typing");

        if (typing) {
            const words = [
                "WEB DEVELOPER",
                "FRONTEND DEV",
                "FULL STACK DEV",
                "UI DESIGNER"
            ];

            let wordIndex = 0;
            let charIndex = 0;
            let deleting = false;
            let isWaiting = false;

            function typeEffect() {
                if (isWaiting) return;

                const current = words[wordIndex];

                if (!deleting) {
                    typing.textContent = current.substring(0, charIndex++);
                    if (charIndex > current.length) {
                        deleting = true;
                        isWaiting = true;
                        setTimeout(() => {
                            isWaiting = false;
                            typeEffect();
                        }, 1800);
                        return;
                    }
                } else {
                    typing.textContent = current.substring(0, charIndex--);
                    if (charIndex < 0) {
                        deleting = false;
                        wordIndex++;
                        if (wordIndex >= words.length) {
                            wordIndex = 0;
                        }
                    }
                }

                setTimeout(typeEffect, deleting ? 40 : 80);
            }

            setTimeout(typeEffect, 300);
        }

        // --- SCROLL PROGRESS BAR ---
        const progress = document.getElementById("progress-bar");

        if (progress) {
            window.addEventListener("scroll", () => {
                const height =
                    document.documentElement.scrollHeight -
                    document.documentElement.clientHeight;
                const scroll = window.scrollY;
                progress.style.width = `${(scroll / height) * 100}%`;
            });
        }

        // --- BACK TO TOP ---
        const backTop = document.getElementById("back-top");

        if (backTop) {
            window.addEventListener("scroll", () => {
                if (window.scrollY > 500) {
                    backTop.classList.add("active");
                } else {
                    backTop.classList.remove("active");
                }
            });

            backTop.addEventListener("click", () => {
                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            });
        }

        // --- AOS ANIMATION ---
        if (typeof AOS !== "undefined") {
            AOS.init({
                duration: 1000,
                once: true,
                offset: 100
            });
        }

        // --- CONTACT FORM DEMO ---
        const form = document.querySelector(".contact-form");

        if (form) {
            form.addEventListener("submit", (e) => {
                e.preventDefault();
                alert("⚡ MESSAGE SENT! ⚡\n\nThanks for your message! I will reply soon.");
                form.reset();
            });
        }

        // --- SKILL BARS ANIMATE ON SCROLL ---
        const skillFills = document.querySelectorAll(".skill-fill");
        if (skillFills.length > 0) {
            const animateFills = () => {
                skillFills.forEach(fill => {
                    const rect = fill.getBoundingClientRect();
                    const windowHeight = window.innerHeight;
                    if (rect.top < windowHeight - 50) {
                        const w = fill.style.width;
                        fill.style.width = "0%";
                        setTimeout(() => {
                            fill.style.width = w;
                        }, 200);
                    }
                });
            };

            setTimeout(animateFills, 500);

            window.addEventListener("scroll", animateFills);
        }

        // --- AI CHATBOT ---
        initChatbot();
    }

    // =========================
    // AI CHATBOT
    // =========================

    function initChatbot() {
        const toggleBtn = document.getElementById("chatbot-toggle");
        const container = document.getElementById("chatbot-container");
        const closeBtn = document.getElementById("chatbot-close");
        const messagesEl = document.getElementById("chatbot-messages");
        const inputEl = document.getElementById("chatbot-input");
        const sendBtn = document.getElementById("chatbot-send");

        if (!toggleBtn || !container || !messagesEl || !inputEl || !sendBtn) return;

        // Toggle open/close
        toggleBtn.addEventListener("click", () => {
            container.classList.toggle("open");
            toggleBtn.classList.toggle("closed");
            if (container.classList.contains("open")) {
                toggleBtn.innerHTML = '<i class="fas fa-times"></i>';
                inputEl.focus();
            } else {
                toggleBtn.innerHTML = '<i class="fas fa-robot"></i>';
            }
        });

        // Close button
        closeBtn.addEventListener("click", () => {
            container.classList.remove("open");
            toggleBtn.classList.remove("closed");
            toggleBtn.innerHTML = '<i class="fas fa-robot"></i>';
        });

        // Send on button click
        sendBtn.addEventListener("click", sendMessage);

        // Send on Enter
        inputEl.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                sendMessage();
            }
        });

        function sendMessage() {
            const text = inputEl.value.trim();
            if (!text) return;

            // Add user bubble
            addUserBubble(text);
            inputEl.value = "";

            // Show typing indicator
            showTypingIndicator();

            // Respond after a short delay
            setTimeout(() => {
                hideTypingIndicator();
                const answer = getAIResponse(text);
                addBotBubble(answer);
            }, 600 + Math.random() * 700);
        }

        function addUserBubble(text) {
            const bubble = document.createElement("div");
            bubble.className = "chat-bubble user-bubble";
            bubble.innerHTML = `
                <div class="bubble-avatar"><i class="fas fa-user"></i></div>
                <div class="bubble-content"><p>${escapeHtml(text)}</p></div>
            `;
            messagesEl.appendChild(bubble);
            scrollToBottom();
        }

        function addBotBubble(text) {
            const bubble = document.createElement("div");
            bubble.className = "chat-bubble bot-bubble";
            bubble.innerHTML = `
                <div class="bubble-avatar"><i class="fas fa-robot"></i></div>
                <div class="bubble-content"><p>${text}</p></div>
            `;
            messagesEl.appendChild(bubble);
            scrollToBottom();
        }

        function showTypingIndicator() {
            const indicator = document.createElement("div");
            indicator.className = "chat-bubble bot-bubble";
            indicator.id = "typing-indicator-bubble";
            indicator.innerHTML = `
                <div class="bubble-avatar"><i class="fas fa-robot"></i></div>
                <div class="bubble-content">
                    <div class="typing-indicator">
                        <span></span><span></span><span></span>
                    </div>
                </div>
            `;
            messagesEl.appendChild(indicator);
            scrollToBottom();
        }

        function hideTypingIndicator() {
            const indicator = document.getElementById("typing-indicator-bubble");
            if (indicator) indicator.remove();
        }

        function scrollToBottom() {
            messagesEl.scrollTop = messagesEl.scrollHeight;
        }

        // Simple HTML escaping for user messages
        function escapeHtml(str) {
            const div = document.createElement("div");
            div.textContent = str;
            return div.innerHTML;
        }

        // =========================
        // AI RESPONSE ENGINE
        // =========================

        function getAIResponse(input) {
            const q = input.toLowerCase().trim();

            // Wait for data to load if not ready
            if (!portfolioData) {
                return "⚠️ My knowledge base is still loading... Ask me again in a sec! ⚡";
            }

            const pd = portfolioData;

            // ---- GREETINGS ----
            if (isGreeting(q)) {
                const greetings = [
                    "Hey there! 👋 I'm AJOL's AI assistant. Ask me about his skills, projects, background, or anything portfolio-related!",
                    "Yo! ⚡ What's up? Wanna know about Al John's dev journey, tech stack, or projects? Just ask!",
                    "Hello! 🎮 Ready to explore AJOL's portfolio. What do you want to know?"
                ];
                return pickRandom(greetings);
            }

            // ---- ABOUT / WHO IS ----
            if (matches(q, ["who is", "who's", "about", "tell me about yourself", "tell me about al john", "who are you"])) {
                return `${pd.personal.name} — a passionate Full Stack Web Developer from the ${pd.personal.country} with ${pd.stats.experience_years}+ years of experience. 🎮 He specializes in building modern, responsive, and user-friendly web applications. He holds a ${pd.personal.education} and is currently leveling up in React, Node.js, and database management. 🚀`;
            }

            // ---- NAME ----
            if (matches(q, ["what is your name", "your name", "name"])) {
                return `My creator's name is <strong>${pd.personal.name}</strong>! But you can call him AJOL. 😎`;
            }

            // ---- AGE ----
            if (matches(q, ["age", "how old", "birth", "birthday", "born"])) {
                return `🎂 ${pd.personal.name} is <strong>${pd.personal.age}</strong> years old, born on <strong>${pd.personal.birthdate}</strong>!`;
            }

            // ---- LOCATION / COUNTRY ----
            if (matches(q, ["country", "location", "where", "from", "philippines"])) {
                return `📍 ${pd.personal.name} is based in the <strong>${pd.personal.country}</strong>! 🇵🇭`;
            }

            // ---- LANGUAGES ----
            if (matches(q, ["language", "speak", "dialect"])) {
                return `🗣️ ${pd.personal.name} speaks: <strong>${pd.personal.languages.join(", ")}</strong>.`;
            }

            // ---- STATUS / AVAILABLE ----
            if (matches(q, ["status", "available", "hire", "freelance", "open to"])) {
                return `✅ ${pd.personal.status}! He's open to opportunities, collaborations, and freelance projects. <a href="#contact">Contact him here</a> ⚡`;
            }

            // ---- SKILLS ----
            if (matches(q, ["skill", "tech", "technologies", "stack", "know", "proficient", "expertise"])) {
                const topSkills = pd.skills.slice(0, 8);
                const skillList = topSkills.map(s => `${s.name} (LVL ${s.level})`).join(" · ");
                return `🎮 <strong>SKILL TREE:</strong><br>${skillList}<br><br>...and more! He's always learning new tech. 🚀`;
            }

            // --- BEST SKILL ---
            if (matches(q, ["best skill", "strongest", "top skill", "highest"])) {
                const sorted = [...pd.skills].sort((a, b) => b.level - a.level);
                const best = sorted[0];
                return `💪 ${pd.personal.name}'s strongest skill is <strong>${best.name}</strong> (LVL ${best.level})!`;
            }

            // ---- PROJECTS ----
            if (matches(q, ["project", "portfolio", "work", "build", "created", "quest"])) {
                const projList = pd.projects.map(p => {
                    return `• <strong>${p.title}</strong>: ${p.description} [${p.tags.join(", ")}]`;
                }).join("<br>");
                return `🎯 <strong>COMPLETED QUESTS:</strong><br>${projList}<br><br>Check them out in the <a href="#projects">Projects section</a>!`;
            }

            // ---- SPECIFIC PROJECT: EYEHEAR ----
            if (matches(q, ["eyehear", "eye hear", "accessibility", "speech"])) {
                const proj = pd.projects.find(p => p.title.includes("EYEHEAR"));
                if (proj) {
                    return `🔊 <strong>${proj.title}</strong> — ${proj.description}<br><br>🏷️ Tags: ${proj.tags.join(", ")}<br>🔗 <a href="${proj.source}" target="_blank">Source Code</a> · <a href="${proj.live}" target="_blank">Live Demo</a>`;
                }
            }

            // ---- SPECIFIC PROJECT: E-COMMERCE ----
            if (matches(q, ["ecommerce", "e-commerce", "e comm", "shopping", "commerce"])) {
                const proj = pd.projects.find(p => p.title.includes("E-COMMERCE"));
                if (proj) {
                    return `🛒 <strong>${proj.title}</strong> — ${proj.description}<br><br>🏷️ Tags: ${proj.tags.join(", ")}<br>🔗 <a href="${proj.source}" target="_blank">Source Code</a>`;
                }
            }

            // ---- EXPERIENCE / TIMELINE ----
            if (matches(q, ["experience", "timeline", "journey", "history", "quest log", "adventure"])) {
                const expList = pd.experience.map(e => {
                    return `• <strong>[${e.year}]</strong> ${e.title}: ${e.description}`;
                }).join("<br>");
                return `📜 <strong>QUEST LOG:</strong><br>${expList}`;
            }

            // ---- SERVICES ----
            if (matches(q, ["service", "offer", "power-up", "can you do"])) {
                const servList = pd.services.map(s => {
                    return `• <strong>${s.title}</strong>: ${s.description}`;
                }).join("<br>");
                return `⚡ <strong>POWER-UPS OFFERED:</strong><br>${servList}`;
            }

            // ---- EDUCATION ----
            if (matches(q, ["education", "degree", "university", "college", "school", "study", "graduate", "bsit", "it"])) {
                return `🎓 ${pd.personal.name} holds a <strong>${pd.personal.education}</strong> 🎮`;
            }

            // ---- CONTACT ----
            if (matches(q, ["contact", "email", "reach", "message", "get in touch", "social"])) {
                return `📬 <strong>Get in touch with ${pd.personal.name}:</strong><br>📧 ${pd.contact.email}<br>🐙 <a href="${pd.contact.github}" target="_blank">${pd.contact.github}</a><br>💼 <a href="${pd.contact.linkedin}" target="_blank">LinkedIn</a><br>📘 <a href="${pd.contact.facebook}" target="_blank">Facebook</a><br>🎮 <a href="${pd.contact.discord}" target="_blank">Discord</a>`;
            }

            // ---- GITHUB ----
            if (matches(q, ["github", "git", "repo", "code", "source code"])) {
                return `🐙 GitHub: <a href="https://github.com/jam696969" target="_blank">github.com/jam696969</a><br>Check out the repositories for source code and contributions!`;
            }

            // ---- LINKEDIN ----
            if (matches(q, ["linkedin", "linked in"])) {
                return `💼 LinkedIn: <a href="${pd.contact.linkedin}" target="_blank">Al John Lomocso</a>`;
            }

            // ---- CERTIFICATIONS ----
            if (matches(q, ["certification", "certificate", "cert", "course", "training"])) {
                return `📜 ${pd.personal.name} continuously improves through courses, practice, and projects. Contact him for specific certifications! <a href="#contact">Reach out here</a>`;
            }

            // ---- HOBBIES / INTERESTS ----
            if (matches(q, ["hobby", "interest", "passion", "free time", "enjoy"])) {
                return `🎮 ${pd.personal.name} enjoys learning new frameworks, exploring UI/UX design, contributing to open-source projects, and collaborating with other developers. When not coding, he's leveling up his skills!`;
            }

            // ---- STATS / ARCADE ----
            if (matches(q, ["stat", "arcade", "high score", "level", "exp", "hp"])) {
                return `🎯 <strong>ARCADE STATS:</strong><br>• EXP: ${pd.stats.experience_years} Years<br>• Projects: ${pd.stats.projects_count}<br>• Frameworks: ${pd.stats.frameworks}<br>• Repositories: ${pd.stats.repositories}<br><br>⚡ HIGH SCORE: KEEP LEARNING!`;
            }

            // ---- DOWNLOAD RESUME ----
            if (matches(q, ["resume", "cv", "curriculum", "download"])) {
                return `📄 Click <a href="images/resume_jam.pdf" download>here</a> to download ${pd.personal.name}'s resume directly! You can also reach out via the <a href="#contact">contact form</a> or email at ${pd.contact.email} for more info.`;
            }

            // ---- THANK YOU ----
            if (matches(q, ["thank", "thanks", "appreciate", "grateful"])) {
                return `You're welcome! 🙌 If you have more questions, just ask. Good luck and keep leveling up! 🎮⚡`;
            }

            // ---- HI / HELLO variants handled ----
            if (matches(q, ["hi", "hello", "hey", "howdy", "sup", "yo", "hola"])) {
                return `Hey! 👋 Ask me anything about ${pd.personal.name}'s skills, projects, or background!`;
            }

            // ---- HOW ARE YOU ----
            if (matches(q, ["how are you", "how are you doing", "what's up", "how's it"])) {
                return `I'm fully operational! 🎮 Thanks for asking. What can I tell you about ${pd.personal.name}?`;
            }

            // ---- WHAT CAN YOU DO ----
            if (matches(q, ["what can you do", "help", "commands", "capabilities"])) {
                return `🤖 <strong>I can answer questions about:</strong><br>• 👤 Background & Bio<br>• 🎯 Skills & Tech Stack<br>• 📂 Projects & Work<br>• 📜 Experience Timeline<br>• 🎓 Education<br>• 📬 Contact Info<br><br>Just ask me anything! ⚡`;
            }

            // ---- GOODBYE ----
            if (matches(q, ["bye", "goodbye", "see you", "later", "cya"])) {
                return `See you later! 👋 Feel free to come back anytime. And remember — keep coding, keep learning! 🎮⚡`;
            }

            // ---- FALLBACK: UNKNOWN ----
            return `🤔 Hmm, I don't have info on that yet. But I'd love to help! You can reach ${pd.personal.name} directly at 📧 <strong>${pd.contact.email}</strong> or via <a href="${pd.contact.linkedin}" target="_blank">LinkedIn</a> 💼 and he'll get back to you! ⚡`;
        }

        // ---- UTILITY FUNCTIONS ----
        function isGreeting(text) {
            const words = text.split(/\s+/);
            if (words.length <= 3) {
                const greetings = ["hi", "hello", "hey", "howdy", "sup", "yo", "hola", "good morning", "good evening", "good afternoon"];
                return greetings.some(g => text.includes(g));
            }
            return false;
        }

        function matches(text, keywords) {
            return keywords.some(k => text.includes(k));
        }

        function pickRandom(arr) {
            return arr[Math.floor(Math.random() * arr.length)];
        }
    }

});

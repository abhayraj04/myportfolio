/**
 * ABHAY RAJ — ASPIRING DATA ANALYST & DATA SCIENCE ENTHUSIAST
 * B.Tech CSE (2022–2026) | Dr. C. V. Raman University
 * Core Interactivity, Voice Engine, Project Filters, Live Preview Modal, SQL Copy & Abhay AI Assistant
 */

document.addEventListener('DOMContentLoaded', () => {

  // ========================================================
  // 1. DYNAMIC COPYRIGHT YEAR
  // ========================================================
  const copyrightYear = document.getElementById('copyrightYear');
  if (copyrightYear) {
    copyrightYear.textContent = new Date().getFullYear();
  }

  // ========================================================
  // 2. POINTER SPOTLIGHT (Desktop Mouse Tracking)
  // ========================================================
  const spotlight = document.getElementById('pointerSpotlight');
  if (spotlight && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });

    function animateSpotlight() {
      currentX += (mouseX - currentX) * 0.15;
      currentY += (mouseY - currentY) * 0.15;
      spotlight.style.transform = `translate(${currentX}px, ${currentY}px)`;
      requestAnimationFrame(animateSpotlight);
    }
    animateSpotlight();
  }

  // ========================================================
  // 3. FLOATING LUXURY NAVBAR, LIQUID CAPSULE & PROGRESS
  // ========================================================
  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  const navDock = document.querySelector('.nav-dock-container');
  const navPillIndicator = document.getElementById('navPillIndicator');
  const navProgressBar = document.getElementById('navProgressBar');
  const navItems = document.querySelectorAll('.nav-links .nav-item');
  const sections = document.querySelectorAll('section[id], header[id]');

  // Magnetic Liquid Pill Capsule Movement
  function moveIndicatorTo(element) {
    if (!navPillIndicator || !element || !navDock) return;
    const rect = element.getBoundingClientRect();
    const parentRect = navDock.getBoundingClientRect();
    const left = rect.left - parentRect.left;
    const width = rect.width;
    navPillIndicator.style.transform = `translateX(${left}px)`;
    navPillIndicator.style.width = `${width}px`;
    navPillIndicator.style.opacity = '1';
  }

  function resetIndicatorToActive() {
    const activeItem = document.querySelector('.nav-links .nav-item.active');
    if (activeItem) {
      moveIndicatorTo(activeItem);
    } else if (navPillIndicator) {
      navPillIndicator.style.opacity = '0';
    }
  }

  // Hover animations on nav links
  navItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      moveIndicatorTo(item);
    });
  });

  if (navDock) {
    navDock.addEventListener('mouseleave', () => {
      resetIndicatorToActive();
    });
  }

  // Real-Time Scroll Progress Line & Dock Elevation
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (navbar) {
      navbar.classList.toggle('scrolled', scrollY > 25);
    }

    // Progress Line calculation
    if (navProgressBar) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const percent = Math.min(Math.max((scrollY / docHeight) * 100, 0), 100);
        navProgressBar.style.width = `${percent}%`;
      }
    }

    updateActiveNav();
  }, { passive: true });

  // Mobile Menu Toggle & Morph
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navLinks.classList.toggle('show');
      menuToggle.classList.toggle('active', isOpen);
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navItems.forEach(item => {
      item.addEventListener('click', () => {
        navLinks.classList.remove('show');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
        navLinks.classList.remove('show');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  function updateActiveNav() {
    let currentId = 'home';
    const scrollPos = window.scrollY + 220;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = sec.id;
      }
    });

    let currentActive = null;
    navItems.forEach(link => {
      const target = link.getAttribute('data-nav');
      const isTarget = target === currentId;
      link.classList.toggle('active', isTarget);
      if (isTarget) {
        currentActive = link;
      }
    });

    if (currentActive && window.innerWidth > 1024) {
      moveIndicatorTo(currentActive);
    }
  }

  // Initialize indicator on page load and window resize
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1024) {
      resetIndicatorToActive();
    } else if (navPillIndicator) {
      navPillIndicator.style.opacity = '0';
    }
  });

  setTimeout(() => {
    resetIndicatorToActive();
  }, 350);

  // ========================================================
  // 4. VOICE INTRODUCTION (AUDIO PLAYER + WEB SPEECH ENGINE)
  // ========================================================
  const voiceButton = document.getElementById('voiceButton');
  const voiceIcon = document.getElementById('voiceIcon');
  const voiceText = document.getElementById('voiceText');
  const voiceTimer = document.getElementById('voiceTimer');
  const voiceProgress = document.getElementById('voiceProgress');
  const voiceProgressBar = document.getElementById('voiceProgressBar');
  const voiceAudio = document.getElementById('voiceAudio');
  const voiceCard = document.getElementById('voiceCard') || document.querySelector('.voice-card');

  let isVoicePlaying = false;
  let synthUtterance = null;
  let synthInterval = null;
  let synthStartTime = 0;
  const ESTIMATED_SPEECH_DURATION = 35; // seconds

  const playIconSvg = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5 3 19 12 5 21 5 3"></polygon>
    </svg>`;

  const pauseIconSvg = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <rect x="6" y="4" width="4" height="16" rx="1"></rect>
      <rect x="14" y="4" width="4" height="16" rx="1"></rect>
    </svg>`;

  function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  function setVoiceUIPlaying(playing, isCompleted = false) {
    isVoicePlaying = playing;
    if (voiceCard) {
      voiceCard.classList.toggle('is-playing', playing);
    }
    if (voiceIcon) {
      voiceIcon.innerHTML = playing ? pauseIconSvg : playIconSvg;
    }
    if (voiceText) {
      if (playing) {
        voiceText.textContent = 'Playing Introduction...';
      } else if (isCompleted) {
        voiceText.textContent = 'Listen Again';
      } else {
        voiceText.textContent = voiceAudio && voiceAudio.currentTime > 0 ? 'Resume Audio Introduction' : 'Listen to Audio Introduction';
      }
    }
    if (!playing && !isCompleted && !synthInterval) {
      // paused
    }
  }

  const introSpeechScript = 
    "Hello! Welcome to my portfolio. I'm Abhay Raj, an aspiring Data Scientist and Computer Science Engineering graduate from Dr. C. V. Raman University. " +
    "I'm open to work and actively seeking opportunities in Data Science, Machine Learning, and AI roles. " +
    "I build predictive models, analytics pipelines, and end-to-end intelligent applications using Python, SQL, and Scikit-learn. " +
    "Feel free to explore my featured projects like CricketIQ AI and Customer Churn Intelligence, or chat with my interactive AI assistant!";

  function playWithWebSpeech() {
    if (!('speechSynthesis' in window)) {
      showToast('Audio playback not supported in this browser.');
      setVoiceUIPlaying(false);
      return;
    }

    try {
      window.speechSynthesis.cancel();
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      synthUtterance = new SpeechSynthesisUtterance(introSpeechScript);
      synthUtterance.rate = 1.0;
      synthUtterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const naturalVoice = voices.find(v => v.lang && v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('David') || v.name.includes('Guy')));
      if (naturalVoice) {
        synthUtterance.voice = naturalVoice;
      }

      synthUtterance.onstart = () => {
        setVoiceUIPlaying(true);
        showToast('🎙️ Playing Abhay\'s voice introduction...');
        synthStartTime = Date.now();
        clearInterval(synthInterval);
        synthInterval = setInterval(() => {
          const elapsed = (Date.now() - synthStartTime) / 1000;
          const pct = Math.min((elapsed / ESTIMATED_SPEECH_DURATION) * 100, 100);
          if (voiceProgressBar) {
            voiceProgressBar.style.width = `${pct}%`;
          }
          if (voiceTimer) {
            voiceTimer.textContent = `${formatTime(elapsed)} / ${formatTime(ESTIMATED_SPEECH_DURATION)}`;
          }
        }, 100);
      };

      synthUtterance.onend = () => {
        clearInterval(synthInterval);
        if (voiceProgressBar) voiceProgressBar.style.width = '0%';
        if (voiceTimer) voiceTimer.textContent = `0:00 / ${formatTime(ESTIMATED_SPEECH_DURATION)}`;
        setVoiceUIPlaying(false, true);
      };

      synthUtterance.onerror = () => {
        clearInterval(synthInterval);
        setVoiceUIPlaying(false);
      };

      // Slight timeout for Chrome voice engine readiness
      setTimeout(() => {
        window.speechSynthesis.speak(synthUtterance);
      }, 50);

    } catch (e) {
      console.warn('SpeechSynthesis error:', e);
      setVoiceUIPlaying(false);
    }
  }

  // Audio element events
  if (voiceAudio) {
    voiceAudio.addEventListener('loadedmetadata', () => {
      if (voiceTimer && voiceAudio.duration) {
        voiceTimer.textContent = `0:00 / ${formatTime(voiceAudio.duration)}`;
      }
    });

    voiceAudio.addEventListener('timeupdate', () => {
      if (voiceAudio.duration) {
        const pct = (voiceAudio.currentTime / voiceAudio.duration) * 100;
        if (voiceProgressBar) {
          voiceProgressBar.style.width = `${pct}%`;
        }
        if (voiceTimer) {
          voiceTimer.textContent = `${formatTime(voiceAudio.currentTime)} / ${formatTime(voiceAudio.duration)}`;
        }
      }
    });

    voiceAudio.addEventListener('ended', () => {
      if (voiceProgressBar) voiceProgressBar.style.width = '0%';
      if (voiceTimer) voiceTimer.textContent = `0:00 / ${formatTime(voiceAudio.duration || 37)}`;
      setVoiceUIPlaying(false, true);
      showToast('✅ Audio introduction completed.');
    });

    voiceAudio.addEventListener('pause', () => {
      if (!voiceAudio.ended) {
        setVoiceUIPlaying(false);
      }
    });
  }

  // Interactive timeline scrubbing
  if (voiceProgress && voiceAudio) {
    voiceProgress.addEventListener('click', (e) => {
      const rect = voiceProgress.getBoundingClientRect();
      const clickPos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      if (voiceAudio.duration) {
        voiceAudio.currentTime = clickPos * voiceAudio.duration;
        if (voiceProgressBar) {
          voiceProgressBar.style.width = `${clickPos * 100}%`;
        }
      }
    });
  }

  // Play/Pause master toggle
  if (voiceButton) {
    voiceButton.addEventListener('click', async (e) => {
      e.stopPropagation();

      if (isVoicePlaying) {
        // PAUSE
        if (voiceAudio && !voiceAudio.paused) {
          voiceAudio.pause();
        }
        if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
          window.speechSynthesis.pause();
          clearInterval(synthInterval);
        }
        setVoiceUIPlaying(false);
        return;
      }

      // If speech synthesis was paused mid-way
      if ('speechSynthesis' in window && window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        setVoiceUIPlaying(true);
        return;
      }

      // ATTEMPT TO PLAY RECORDED WAV/MP3 AUDIO
      let audioSuccess = false;
      if (voiceAudio) {
        try {
          await voiceAudio.play();
          audioSuccess = true;
          setVoiceUIPlaying(true);
          showToast('🎙️ Playing Abhay\'s recorded voice introduction...');
        } catch (err) {
          console.warn('HTML5 Audio play failed, falling back to Web Speech API:', err);
          audioSuccess = false;
        }
      }

      // FALLBACK TO WEB SPEECH
      if (!audioSuccess) {
        playWithWebSpeech();
      }
    });
  }

  // ========================================================
  // 5. PROJECT CATEGORY FILTER TABS
  // ========================================================
  const filterTabs = document.querySelectorAll('.filter-tab');
  const projectCards = document.querySelectorAll('.project-showcase-card');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const filter = tab.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  // ========================================================
  // 6. IN-APP LIVE PROJECT PREVIEW MODAL
  // ========================================================
  const previewModal = document.getElementById('projectPreviewModal');
  const previewModalOverlay = document.getElementById('previewModalOverlay');
  const previewCloseBtn = document.getElementById('previewCloseBtn');
  const previewTitle = document.getElementById('previewModalTitle');
  const previewExternalLink = document.getElementById('previewExternalLink');
  const previewIframe = document.getElementById('previewIframe');
  const previewSpinner = document.getElementById('previewSpinner');
  const previewDesktopBtn = document.getElementById('previewDesktopBtn');
  const previewMobileBtn = document.getElementById('previewMobileBtn');
  const previewBtns = document.querySelectorAll('.preview-project-btn');

  function openPreviewModal(url, title) {
    if (!previewModal) return;
    previewTitle.textContent = title;
    previewExternalLink.href = url.replace('?embed=true', '');
    previewSpinner.classList.remove('is-hidden');
    previewModal.classList.add('is-active');
    previewModal.setAttribute('aria-hidden', 'false');

    previewIframe.src = url;
    previewIframe.onload = () => {
      previewSpinner.classList.add('is-hidden');
    };

    setTimeout(() => {
      previewSpinner.classList.add('is-hidden');
    }, 3200);
  }

  function closePreviewModal() {
    if (!previewModal) return;
    previewModal.classList.remove('is-active');
    previewModal.setAttribute('aria-hidden', 'true');
    previewIframe.src = 'about:blank';
  }

  previewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const url = btn.getAttribute('data-url');
      const title = btn.getAttribute('data-title');
      openPreviewModal(url, title);
    });
  });

  if (previewCloseBtn) previewCloseBtn.addEventListener('click', closePreviewModal);
  if (previewModalOverlay) previewModalOverlay.addEventListener('click', closePreviewModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && previewModal && previewModal.classList.contains('is-active')) {
      closePreviewModal();
    }
  });

  if (previewDesktopBtn && previewMobileBtn) {
    previewDesktopBtn.addEventListener('click', () => {
      previewDesktopBtn.classList.add('active');
      previewMobileBtn.classList.remove('active');
      previewIframe.classList.remove('mobile-mode');
    });

    previewMobileBtn.addEventListener('click', () => {
      previewMobileBtn.classList.add('active');
      previewDesktopBtn.classList.remove('active');
      previewIframe.classList.add('mobile-mode');
    });
  }

  // ========================================================
  // 7. COPY SQL CODE BUTTONS
  // ========================================================
  const copyCodeBtns = document.querySelectorAll('.copy-code-btn');
  copyCodeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-code-id');
      const codeElement = document.getElementById(targetId);
      if (codeElement) {
        navigator.clipboard.writeText(codeElement.textContent.trim()).then(() => {
          const originalText = btn.textContent;
          btn.textContent = 'Copied! ✓';
          showToast('📋 SQL query copied to clipboard');
          setTimeout(() => {
            btn.textContent = originalText;
          }, 2000);
        });
      }
    });
  });

  // ========================================================
  // 8. "ASK ABHAY AI" ASSISTANT ENGINE
  // ========================================================
  const aiWidgetTrigger = document.getElementById('aiWidgetTrigger');
  const aiChatWindow = document.getElementById('aiChatWindow');
  const aiCloseChatBtn = document.getElementById('aiCloseChatBtn');
  const aiClearChatBtn = document.getElementById('aiClearChatBtn');
  const aiVoiceToggleBtn = document.getElementById('aiVoiceToggleBtn');
  const aiVoiceIcon = document.getElementById('aiVoiceIcon');
  const aiChatForm = document.getElementById('aiChatForm');
  const aiChatInput = document.getElementById('aiChatInput');
  const aiChatMessages = document.getElementById('aiChatMessages');
  const openChatNavBtn = document.getElementById('openChatNavBtn');
  const heroChatBtn = document.getElementById('heroChatBtn');
  const aboutChatBtn = document.getElementById('aboutChatBtn');
  const askAiProjectBtns = document.querySelectorAll('.ask-ai-project-btn');

  let isSpeechOutputEnabled = true;

  function toggleChatWindow(show) {
    const isOpen = show !== undefined ? show : !aiChatWindow.classList.contains('is-open');
    aiChatWindow.classList.toggle('is-open', isOpen);
    aiChatWindow.setAttribute('aria-hidden', String(!isOpen));
    if (isOpen) {
      setTimeout(() => aiChatInput && aiChatInput.focus(), 250);
    }
  }

  if (aiWidgetTrigger) aiWidgetTrigger.addEventListener('click', () => toggleChatWindow());
  if (aiCloseChatBtn) aiCloseChatBtn.addEventListener('click', () => toggleChatWindow(false));
  if (openChatNavBtn) openChatNavBtn.addEventListener('click', () => toggleChatWindow(true));
  if (heroChatBtn) heroChatBtn.addEventListener('click', () => toggleChatWindow(true));
  if (aboutChatBtn) aboutChatBtn.addEventListener('click', () => toggleChatWindow(true));

  if (aiVoiceToggleBtn) {
    aiVoiceToggleBtn.addEventListener('click', () => {
      isSpeechOutputEnabled = !isSpeechOutputEnabled;
      if (aiVoiceIcon) {
        aiVoiceIcon.textContent = isSpeechOutputEnabled ? '🔊' : '🔇';
      }
      showToast(isSpeechOutputEnabled ? 'AI Voice read-out enabled' : 'AI Voice read-out muted');
    });
  }

  if (aiClearChatBtn) {
    aiClearChatBtn.addEventListener('click', () => {
      aiChatMessages.innerHTML = `
        <div class="chat-message ai-message">
          <div class="message-avatar">✨</div>
          <div class="message-bubble">
            <p><strong>Chat cleared!</strong> How can I assist you? Ask about Abhay's data analytics skills, SQL case studies, CricketIQ AI, Customer Churn Intelligence, or his resume.</p>
          </div>
        </div>
        <div class="ai-prompt-chips">
          <button class="chip-btn" data-prompt="What are Abhay's primary technical skills?">🛠️ Technical Skills</button>
          <button class="chip-btn" data-prompt="Tell me about the Customer Churn Intelligence Platform">📊 Churn Platform</button>
          <button class="chip-btn" data-prompt="Tell me about CricketIQ AI">🏏 CricketIQ AI</button>
          <button class="chip-btn" data-prompt="What is Abhay's data analysis workflow?">🔄 Problem-Solving Workflow</button>
          <button class="chip-btn" data-prompt="What SQL topics does Abhay know?">🗄️ SQL Case Studies</button>
          <button class="chip-btn" data-prompt="What roles is Abhay seeking?">💼 Career Objective & Roles</button>
        </div>
      `;
      setupPromptChips();
    });
  }

  askAiProjectBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const projectName = btn.getAttribute('data-project');
      toggleChatWindow(true);
      submitUserPrompt(`Tell me all about ${projectName}`);
    });
  });

  function setupPromptChips() {
    document.querySelectorAll('.chip-btn').forEach(chip => {
      chip.addEventListener('click', () => {
        const prompt = chip.getAttribute('data-prompt');
        submitUserPrompt(prompt);
      });
    });
  }
  setupPromptChips();

  if (aiChatForm) {
    aiChatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const message = aiChatInput.value.trim();
      if (!message) return;
      submitUserPrompt(message);
      aiChatInput.value = '';
    });
  }

  function submitUserPrompt(text) {
    appendMessage(text, 'user');
    showTypingIndicator();

    setTimeout(() => {
      removeTypingIndicator();
      const responseHtml = generateAiResponse(text);
      appendMessage(responseHtml, 'ai');

      if (isSpeechOutputEnabled && 'speechSynthesis' in window) {
        const plainText = responseHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        speakText(plainText.substring(0, 220));
      }
    }, 650);
  }

  function appendMessage(content, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-message ${sender}-message`;

    if (sender === 'user') {
      msgDiv.innerHTML = `
        <div class="message-avatar">👤</div>
        <div class="message-bubble"><p>${escapeHtml(content)}</p></div>
      `;
    } else {
      msgDiv.innerHTML = `
        <div class="message-avatar">✨</div>
        <div class="message-bubble">${content}</div>
      `;
    }

    aiChatMessages.appendChild(msgDiv);
    aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
  }

  function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message ai-message typing-indicator-msg';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = `
      <div class="message-avatar">✨</div>
      <div class="message-bubble">
        <div class="typing-dots">
          <span></span><span></span><span></span>
        </div>
      </div>
    `;
    aiChatMessages.appendChild(typingDiv);
    aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
  }

  function removeTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) indicator.remove();
  }

  function escapeHtml(string) {
    const div = document.createElement('div');
    div.textContent = string;
    return div.innerHTML;
  }

  function speakText(text) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  }

  // ========================================================
  // 9. INTELLIGENT KNOWLEDGE BASE & RESPONSE ENGINE
  // ========================================================
  function generateAiResponse(query) {
    const q = query.toLowerCase();

    // 1. Roles & Career Objective
    if (q.includes('role') || q.includes('objective') || q.includes('seeking') || q.includes('looking for') || q.includes('hire') || q.includes('opportunity')) {
      return `
        <p>🎯 <strong>Career Objective:</strong></p>
        <p>"I am seeking entry-level opportunities in <strong>Data Analytics or Data Science</strong> where I can apply my knowledge of Python, SQL, data analysis, visualization, and machine learning while learning from experienced professionals and contributing to meaningful projects."</p>
        <p><strong>Target Roles:</strong></p>
        <ul>
          <li>Entry-Level Data Analyst / Business Intelligence Analyst</li>
          <li>Junior Data Scientist / Machine Learning Engineer</li>
          <li>Python / Data Developer</li>
        </ul>
        <p>Immediate availability; open to Remote, Hybrid, or Relocation across India. Contact: <a href="mailto:abhayraj74315@gmail.com">abhayraj74315@gmail.com</a>.</p>
      `;
    }

    // 2. Technical Skills
    if (q.includes('skill') || q.includes('tech') || q.includes('stack') || q.includes('tools') || q.includes('language')) {
      return `
        <p>🛠️ <strong>Verified Technical Skills:</strong></p>
        <ul>
          <li><strong>Programming:</strong> Python, SQL</li>
          <li><strong>Data Analysis:</strong> Pandas, NumPy, Exploratory Data Analysis (EDA), Data Cleaning</li>
          <li><strong>Visualization:</strong> Matplotlib, Seaborn, Power BI, Excel</li>
          <li><strong>Machine Learning:</strong> Scikit-learn, Feature Engineering, Classification, Model Evaluation, Explainability (SHAP)</li>
          <li><strong>Databases:</strong> MySQL, MongoDB, Database Management, Joins, Subqueries, CRUD Operations</li>
          <li><strong>Tools:</strong> Jupyter Notebook, VS Code, Git, GitHub</li>
        </ul>
        <p><em>Abhay only includes tools and techniques he has practically used and can explain in an interview.</em></p>
      `;
    }

    // 3. Workflow & Problem-Solving Approach
    if (q.includes('workflow') || q.includes('approach') || q.includes('process') || q.includes('method') || q.includes('problem-solving')) {
      return `
        <p>🔄 <strong>Abhay's 7-Step Problem-Solving Approach:</strong></p>
        <ol>
          <li>Understand the problem and define the objective.</li>
          <li>Inspect the available data and assess its quality.</li>
          <li>Clean and preprocess the data carefully.</li>
          <li>Perform exploratory analysis and identify patterns.</li>
          <li>Build visualizations or predictive models where appropriate.</li>
          <li>Evaluate results and identify limitations.</li>
          <li>Communicate findings and possible next steps.</li>
        </ol>
      `;
    }

    // 4. SQL Case Studies
    if (q.includes('sql') || q.includes('query') || q.includes('database') || q.includes('join') || q.includes('subquer')) {
      return `
        <p>🗄️ <strong>Practical SQL Case Studies:</strong></p>
        <p>Abhay demonstrates practical SQL queries on the portfolio:</p>
        <ul>
          <li><strong>Customer Retention & Revenue at Risk:</strong> Aggregations, conditional sums, and window functions (<code>DENSE_RANK() OVER (PARTITION BY...)</code>) to identify revenue at risk by contract type.</li>
          <li><strong>Campus Placement Conversion:</strong> Multi-table <code>INNER JOIN</code> and <code>LEFT JOIN</code> queries calculating eligible candidate conversion rates by department.</li>
        </ul>
        <p>Check the <a href="#sql-cases">SQL Case Studies section</a> on the page to view and copy the full queries!</p>
      `;
    }

    // 5. Customer Churn Intelligence Platform
    if (q.includes('churn') || q.includes('retention') || q.includes('customer')) {
      return `
        <p>📊 <strong>Customer Churn Intelligence Platform:</strong></p>
        <p>A machine learning application built with <strong>Python, Streamlit, Scikit-learn, and SHAP</strong>:</p>
        <ul>
          <li><strong>Problem:</strong> Identifying subscription customer attrition before cancellations occur.</li>
          <li><strong>Evaluation:</strong> Evaluated using ROC-AUC (0.84 on Random Forest) and Recall to address class imbalance.</li>
          <li><strong>Explainability:</strong> Uses SHAP values to explain individual churn risk factors (tenure, contract type, charges).</li>
          <li><strong>Interactive Feature:</strong> What-If parameter simulator to explore retention offers.</li>
        </ul>
        <p>👉 <a href="https://customer-churn-intelligence-platform-h9fbshxjfay2vvvt4perax.streamlit.app/" target="_blank" rel="noopener">Launch Churn Platform Live</a></p>
      `;
    }

    // 6. CricketIQ AI
    if (q.includes('cricket') || q.includes('cricketiq')) {
      return `
        <p>🏏 <strong>CricketIQ AI:</strong></p>
        <p>An interactive cricket analytics and match prediction platform built with <strong>Python, Streamlit, XGBoost, and Plotly</strong>:</p>
        <ul>
          <li><strong>Historical Analysis:</strong> Bowler delivery clusters, wagon wheel trajectories, and phase-wise strike rates.</li>
          <li><strong>Prediction Functionality:</strong> Evaluates phase-by-phase win likelihood trends based on historical match state parameters.</li>
          <li><strong>Lineup Optimization:</strong> Solves optimal squad selection including Impact Player rule constraints.</li>
        </ul>
        <p>👉 <a href="https://cricketiq-ai-6v9zshmcx5xybirrsucsoh.streamlit.app/" target="_blank" rel="noopener">Launch CricketIQ AI Live</a></p>
      `;
    }

    // 7. Education & Background
    if (q.includes('education') || q.includes('college') || q.includes('university') || q.includes('degree') || q.includes('background') || q.includes('btech')) {
      return `
        <p>🎓 <strong>Education Background:</strong></p>
        <ul>
          <li><strong>B.Tech in Computer Science and Engineering</strong> (2022–2026), <strong>Dr. C. V. Raman University</strong>, Vaishali, Bihar.</li>
          <li><strong>Senior Secondary Education (Class XII):</strong> BSEB Patna, completed 2022 (Physics, Chemistry, Mathematics).</li>
          <li><strong>Secondary Education (Class X):</strong> CBSE, completed 2020.</li>
        </ul>
        <p>Coursework highlights: Data Structures, Database Management Systems, Machine Learning, and Statistical Analysis.</p>
      `;
    }

    // 8. Internship Experience
    if (q.includes('experience') || q.includes('intern') || q.includes('info era') || q.includes('work')) {
      return `
        <p>💼 <strong>Practical Experience:</strong></p>
        <ul>
          <li><strong>Web Development Intern:</strong> Info Era Software Services Pvt. Ltd., Patna (September – October 2025). Focus: Backend data handling, database connectivity, CRUD operations, and debugging.</li>
          <li><strong>Technical Project Lead:</strong> Academic Engineering Projects at Dr. C. V. Raman University.</li>
          <li><strong>Core Member:</strong> National Service Scheme (NSS), active in community social initiatives.</li>
        </ul>
      `;
    }

    // 9. All 4 Project Links
    if (q.includes('project') || q.includes('link') || q.includes('deploy')) {
      return `
        <p>🚀 <strong>Abhay's 4 Live Deployed Projects:</strong></p>
        <ol>
          <li>🏏 <a href="https://cricketiq-ai-6v9zshmcx5xybirrsucsoh.streamlit.app/" target="_blank">CricketIQ AI (Streamlit)</a></li>
          <li>📊 <a href="https://customer-churn-intelligence-platform-h9fbshxjfay2vvvt4perax.streamlit.app/" target="_blank">Customer Churn Intelligence Platform (Streamlit)</a></li>
          <li>🎓 <a href="https://campus-placement-portal-2663.onrender.com" target="_blank">Campus Placement Portal (Render)</a></li>
          <li>🕉️ <a href="https://india-pilgrimage.vercel.app/" target="_blank">India Pilgrimage Platform (Vercel)</a></li>
        </ol>
        <p>You can also use the <strong>"👁️ Quick Preview"</strong> button on the site to preview any of them directly in-app!</p>
      `;
    }

    // 10. Contact / Resume
    if (q.includes('contact') || q.includes('email') || q.includes('resume') || q.includes('phone') || q.includes('reach')) {
      return `
        <p>📬 <strong>Contact Information:</strong></p>
        <ul>
          <li><strong>Email:</strong> <a href="mailto:abhayraj74315@gmail.com">abhayraj74315@gmail.com</a></li>
          <li><strong>Phone / WhatsApp:</strong> <a href="https://wa.me/919031531991" target="_blank">+91 9031531991</a></li>
          <li><strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/abhay-raj-aa0928304" target="_blank">linkedin.com/in/abhay-raj-aa0928304</a></li>
          <li><strong>GitHub:</strong> <a href="https://github.com/abhayraj04" target="_blank">github.com/abhayraj04</a></li>
          <li><strong>Resume:</strong> <a href="Abhay_Raj.pdf" download="Abhay_Raj_Resume.pdf">Download Abhay_Raj.pdf</a></li>
        </ul>
      `;
    }

    // 11. Greetings
    if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
      return `
        <p>Hello! 👋 I'm Abhay's AI Portfolio Assistant.</p>
        <p>I'm here to help you learn about his <strong>data analytics skills</strong>, <strong>machine learning projects</strong> (CricketIQ AI, Churn Intelligence), <strong>SQL case studies</strong>, or how to get in touch!</p>
      `;
    }

    // Default Fallback
    return `
      <p>Thank you for asking! Abhay Raj is an <strong>Aspiring Data Scientist | AI & ML Developer</strong> (B.Tech CSE Graduate, Dr. C. V. Raman University).</p>
      <p>He is <strong>Open to Work</strong> and actively seeking entry-level roles in Data Science, Machine Learning, and AI. Would you like to explore:</p>
      <ul>
        <li><a href="#skills">His verified technical skills (Python, SQL, Scikit-learn, XGBoost, Power BI)</a></li>
        <li><a href="#projects">Flagship live deployed AI & ML projects</a></li>
        <li><a href="#sql-cases">Practical SQL Case Studies</a></li>
        <li><a href="#model-eval">Machine learning evaluation & SHAP insights</a></li>
        <li><a href="mailto:abhayraj74315@gmail.com">How to contact or schedule an interview</a></li>
      </ul>
    `;
  }

  // ========================================================
  // 10. CONTACT ACTIONS & TOAST NOTIFICATION
  // ========================================================
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const emailText = document.getElementById('emailText');
  const contactForm = document.getElementById('contactForm');
  const backToTop = document.getElementById('backToTop');

  if (copyEmailBtn && emailText) {
    copyEmailBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = emailText.textContent.trim();
      navigator.clipboard.writeText(email).then(() => {
        showToast('📋 Email copied to clipboard: ' + email);
      }).catch(() => {
        showToast('Email: ' + email);
      });
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('senderName').value;
      const email = document.getElementById('senderEmail').value;
      const subject = document.getElementById('senderSubject').value;
      const message = document.getElementById('senderMessage').value;

      const mailtoUrl = `mailto:abhayraj74315@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent("From: " + name + " (" + email + ")\n\n" + message)}`;
      window.location.href = mailtoUrl;

      showToast('🚀 Opening your email client to message Abhay...');
      contactForm.reset();
    });
  }

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function showToast(message) {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // ========================================================
  // 11. AMBIENT DATA CONSTELLATION CANVAS
  // ========================================================
  function initDataConstellationCanvas() {
    const canvas = document.getElementById('dataConstellationCanvas');
    if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }, { passive: true });

    // Generate node particles
    const nodeCount = Math.min(Math.floor((width * height) / 28000), 50);
    const nodes = [];
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 1.8 + 1,
        color: Math.random() > 0.5 ? 'rgba(99, 102, 241,' : 'rgba(6, 182, 212,'
      });
    }

    let mousePos = { x: -1000, y: -1000 };
    window.addEventListener('mousemove', (e) => {
      mousePos.x = e.clientX;
      mousePos.y = e.clientY;
    }, { passive: true });

    let isVisible = true;
    document.addEventListener('visibilitychange', () => {
      isVisible = !document.hidden;
    });

    function draw() {
      if (!isVisible) {
        requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Connect nodes
      const maxDist = 120;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];

        // Position update
        a.x += a.vx;
        a.y += a.vy;

        if (a.x < 0 || a.x > width) a.vx *= -1;
        if (a.y < 0 || a.y > height) a.vy *= -1;

        // Gentle interactive mouse displacement
        const dxMouse = a.x - mousePos.x;
        const dyMouse = a.y - mousePos.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        if (distMouse < 140) {
          const force = (140 - distMouse) / 140;
          a.x += (dxMouse / distMouse) * force * 1.2;
          a.y += (dyMouse / distMouse) * force * 1.2;
        }

        // Draw connections
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.22;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }

        // Draw particle node
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${a.color} 0.7)`;
        ctx.shadowBlur = 6;
        ctx.shadowColor = 'rgba(6, 182, 212, 0.4)';
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
  }
  initDataConstellationCanvas();

  // ========================================================
  // 12. SCROLL REVEAL CASCADE ANIMATIONS
  // ========================================================
  function initScrollReveal() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const revealSelectors = [
      '.section-header',
      '.recruiter-card',
      '.what-card',
      '.skill-category-card',
      '.workflow-step-card',
      '.project-showcase-card',
      '.sql-case-card',
      '.eval-card',
      '.code-feature-card',
      '.timeline-item',
      '.contact-card'
    ];

    const elementsToReveal = document.querySelectorAll(revealSelectors.join(', '));

    // Stagger cards inside parent grids
    const containers = document.querySelectorAll('.what-i-do-grid, .skills-categories-grid, .workflow-steps-grid, .projects-container, .sql-cases-grid, .eval-grid, .code-grid');
    containers.forEach(container => {
      const children = container.querySelectorAll('.what-card, .skill-category-card, .workflow-step-card, .project-showcase-card, .sql-case-card, .eval-card, .code-feature-card');
      children.forEach((child, idx) => {
        child.style.transitionDelay = `${(idx % 3) * 0.12}s`;
      });
    });

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    elementsToReveal.forEach(el => {
      el.classList.add('reveal-item');
      observer.observe(el);
    });
  }
  initScrollReveal();

  // ========================================================
  // 13. INTERACTIVE 3D PERSPECTIVE CARD TILT
  // ========================================================
  function initCardTilt() {
    if (!window.matchMedia('(pointer: fine)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const tiltTargets = document.querySelectorAll('.project-showcase-card, .sql-case-card, .eval-card, .what-card, .recruiter-card');
    tiltTargets.forEach(card => {
      card.classList.add('tilt-card');

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -4.5;
        const rotateY = ((x - centerX) / centerX) * 4.5;

        card.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.012, 1.012, 1.012)`;
        card.style.setProperty('--shimmer-x', `${x}px`);
        card.style.setProperty('--shimmer-y', `${y}px`);
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      });
    });
  }
  initCardTilt();

  // ========================================================
  // 14. ANIMATED STAT NUMBER COUNTERS
  // ========================================================
  function initNumberCounters() {
    const counterElements = document.querySelectorAll('.stat-number[data-target]');
    if (!counterElements.length) return;

    const counterObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.getAttribute('data-target'));
          const suffix = el.getAttribute('data-suffix') || '';
          const prefix = el.getAttribute('data-prefix') || '';
          const duration = 1800;
          const startTime = performance.now();

          function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const easeOutProgress = 1 - Math.pow(1 - progress, 3);
            const currentVal = Math.floor(easeOutProgress * target);

            el.textContent = `${prefix}${currentVal}${suffix}`;

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              el.textContent = `${prefix}${target}${suffix}`;
            }
          }

          requestAnimationFrame(updateCounter);
          obs.unobserve(el);
        }
      });
    }, {
      threshold: 0.3
    });

    counterElements.forEach(el => counterObserver.observe(el));
  }
  initNumberCounters();

  console.log('Abhay Raj Portfolio — Aspiring Data Scientist initialized.');
});

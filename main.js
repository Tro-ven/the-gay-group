document.addEventListener("DOMContentLoaded", () => {
    
    // --- Vanilla Tilt Initialization ---
    // Will be initialized automatically by the data-tilt attribute if the library is loaded, 
    // but we can ensure it's loaded properly.

    // --- WebAudio API SFX ---
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    let audioCtx;
    function playSfx(type) {
        if(!audioCtx) { try { audioCtx = new AudioContext(); } catch(e) { return; } }
        if(audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain); gain.connect(audioCtx.destination);
        const now = audioCtx.currentTime;

        if(type === 'objection') {
            osc.type = 'sawtooth'; osc.frequency.setValueAtTime(150, now); osc.frequency.exponentialRampToValueAtTime(40, now + 0.3);
            gain.gain.setValueAtTime(0.5, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
            osc.start(now); osc.stop(now + 0.3);
        } else if(type === 'rocket-up') {
            osc.type = 'sine'; osc.frequency.setValueAtTime(200, now); osc.frequency.exponentialRampToValueAtTime(800, now + 1.5);
            gain.gain.setValueAtTime(0, now); gain.gain.linearRampToValueAtTime(0.3, now + 0.5); gain.gain.linearRampToValueAtTime(0, now + 1.5);
            osc.start(now); osc.stop(now + 1.5);
        } else if(type === 'rocket-slam') {
            osc.type = 'square'; osc.frequency.setValueAtTime(100, now); osc.frequency.exponentialRampToValueAtTime(20, now + 0.5);
            gain.gain.setValueAtTime(0.8, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
            osc.start(now); osc.stop(now + 0.5);
        } else if(type === 'nuke') {
            osc.type = 'sawtooth'; osc.frequency.setValueAtTime(80, now); osc.frequency.linearRampToValueAtTime(20, now + 2);
            gain.gain.setValueAtTime(1, now); gain.gain.linearRampToValueAtTime(0.01, now + 2);
            osc.start(now); osc.stop(now + 2);
        } else if(type === 'sleep') {
            osc.type = 'sine'; osc.frequency.setValueAtTime(400, now); osc.frequency.exponentialRampToValueAtTime(100, now + 2);
            gain.gain.setValueAtTime(0.2, now); gain.gain.linearRampToValueAtTime(0, now + 2);
            osc.start(now); osc.stop(now + 2);
        } else if(type === 'error') {
            osc.type = 'triangle'; osc.frequency.setValueAtTime(150, now); osc.frequency.setValueAtTime(100, now + 0.1);
            gain.gain.setValueAtTime(0.5, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
            osc.start(now); osc.stop(now + 0.3);
        }
    }

    // --- Interactive Space Dust Engine ---
    const bgContainer = document.querySelector('.premium-bg');
    if(bgContainer) {
        const particles = [];
        const numParticles = 60;
        for(let i=0; i<numParticles; i++) {
            const p = document.createElement('div');
            p.className = 'space-dust';
            const size = Math.random() * 2 + 1;
            p.style.width = size + 'px'; p.style.height = size + 'px';
            bgContainer.appendChild(p);
            particles.push({
                el: p, x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight,
                vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5
            });
        }
        let mouseX = window.innerWidth/2, mouseY = window.innerHeight/2;
        window.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });
        function animateParticles() {
            particles.forEach(p => {
                p.x += p.vx; p.y += p.vy;
                const dx = p.x - mouseX, dy = p.y - mouseY;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if(dist < 150) {
                    const force = (150 - dist) / 150;
                    p.x += (dx / dist) * force * 5;
                    p.y += (dy / dist) * force * 5;
                }
                if(p.x < 0) p.x = window.innerWidth; if(p.x > window.innerWidth) p.x = 0;
                if(p.y < 0) p.y = window.innerHeight; if(p.y > window.innerHeight) p.y = 0;
                p.el.style.transform = `translate(${p.x}px, ${p.y}px)`;
            });
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }

    // --- Terminal Typewriter Effect ---
    const typeTargets = document.querySelectorAll('.lore-text, .quote');
    const typeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                const el = entry.target;
                if(!el.dataset.typed) {
                    el.dataset.typed = 'true';
                    const text = el.dataset.originalText || el.textContent;
                    el.textContent = '';
                    el.classList.add('typewriter-text');
                    let i = 0;
                    function typeChar() {
                        if(i < text.length) {
                            el.textContent += text.charAt(i); i++;
                            setTimeout(typeChar, Math.random() < 0.1 ? 60 : 15);
                        } else { el.classList.remove('typewriter-text'); }
                    }
                    setTimeout(typeChar, 300);
                }
            }
        });
    }, { threshold: 0.1 });
    typeTargets.forEach(target => {
        target.dataset.originalText = target.textContent;
        target.textContent = ''; 
        typeObserver.observe(target);
    });

    // --- 1. Rasphary (The AFK Dev - Sleep Mode) ---
    const raspharyCard = document.querySelector('.dev');
    if(raspharyCard) {
        let isSleeping = false;
        raspharyCard.addEventListener('dblclick', () => {
            if(isSleeping) return;
            isSleeping = true;
            
            playSfx('sleep');
            raspharyCard.classList.add('sleep-mode');
            
            const statusEl = raspharyCard.querySelector('.card-status');
            const fillEl = raspharyCard.querySelector('.ego-fill');
            const indicator = raspharyCard.querySelector('.status-indicator');
            const quoteEl = raspharyCard.querySelector('.quote');
            
            if(statusEl) statusEl.innerText = 'STATUS: ZZZ...';
            if(fillEl) fillEl.style.width = '0%';
            if(indicator) indicator.style.background = '#333';
            if(quoteEl) quoteEl.innerText = '"I\'ll fix the code tomorrow... maybe."';

            // Zzz particles
            setInterval(() => {
                const zzz = document.createElement('div');
                zzz.className = 'zzz-particle';
                zzz.innerText = 'Zzz';
                zzz.style.left = (40 + Math.random() * 40) + '%';
                zzz.style.top = '20%';
                raspharyCard.appendChild(zzz);
                setTimeout(() => zzz.remove(), 2000);
            }, 600);
        });
    }

    // --- 2. Khusra (The Pathological Liar - Ace Attorney Objection) ---
    const khusraCard = document.querySelector('.lawyer');
    if(khusraCard) {
        let slammed = false;
        khusraCard.addEventListener('click', () => {
            if(slammed) return;
            slammed = true;
            
            playSfx('objection');
            
            // Show the Ace Attorney SVG Starburst overlay
            const objScreen = document.getElementById('aa-objection');
            if(objScreen) objScreen.classList.remove('hidden');
            
            // Shake the entire screen
            document.body.classList.add('shake-screen');
            
            setTimeout(() => {
                document.body.classList.remove('shake-screen');
                
                // Keep the objection screen up for a bit, then hide
                setTimeout(() => {
                    if(objScreen) objScreen.classList.add('hidden');
                    
                    // Expose the lies in typical lore fashion
                    const quoteText = khusraCard.querySelector('.quote');
                    if(quoteText) {
                        quoteText.style.color = '#ef4444';
                        quoteText.style.borderColor = '#ef4444';
                        quoteText.innerText = '"OBJECTION! That\'s hearsay! I am literally the Harvey Specter of this group!"';
                    }
                }, 1500);
            }, 500); // Matches screen shake duration
        });
    }

    // --- 3. Varus (The Instigator - The Meltdown) ---
    const varusCard = document.querySelector('.betrayer');
    if(varusCard) {
        let rage = 0;
        let lastX = 0, lastY = 0;
        let lastTime = Date.now();
        const rageFill = varusCard.querySelector('.rage-fill');
        const rageMeter = varusCard.querySelector('.rage-meter');
        let hasMelted = false;

        varusCard.addEventListener('pointerenter', () => { if(!hasMelted) rageMeter.classList.remove('hidden'); });
        varusCard.addEventListener('pointerleave', () => { 
            if(hasMelted) return;
            rageMeter.classList.add('hidden'); 
            rage = 0; 
            rageFill.style.width='0%'; 
        });
        
        varusCard.addEventListener('pointermove', (e) => {
            if(hasMelted) return;
            const now = Date.now();
            const dt = now - lastTime;
            if (dt === 0) return;

            let dist = Math.sqrt(Math.pow(e.clientX - lastX, 2) + Math.pow(e.clientY - lastY, 2));
            let speed = dist / dt; // pixels per ms

            // If mouse moves frantically
            if(speed > 1.5) {
                rage += speed * 3; // Fill up based on vigorous shaking
                if(rage > 100) rage = 100;
                rageFill.style.width = rage + '%';
                
                if(rage >= 100) {
                    hasMelted = true;
                    nukeSequence();
                    rageMeter.classList.add('hidden');
                }
            }
            lastX = e.clientX;
            lastY = e.clientY;
            lastTime = now;
        });

        // Decrease rage over time if not moving
        setInterval(() => {
            if(rage > 0 && !hasMelted) { 
                rage -= 5; 
                rageFill.style.width = Math.max(0, rage) + '%'; 
            }
        }, 100);
    }

    function nukeSequence() {
        playSfx('nuke');
        if(varusCard.vanillaTilt) varusCard.vanillaTilt.destroy();
        document.body.classList.add('nuke-active');
        
        // Massive Banned Stamp
        const stamp = document.createElement('div');
        stamp.className = 'objection-stamp objection-slam';
        stamp.innerText = 'BANNED';
        varusCard.appendChild(stamp);
        
        // Set on fire
        varusCard.classList.add('on-fire');
        varusCard.querySelector('.quote').innerText = '"I\'VE BEEN PERMANENTLY BANNED FOR INSTIGATING!!!"';
    }

    // --- 4. Espada (The CR7 Fan - Hang Time) ---
    const espadaCard = document.querySelector('.cringe');
    if(espadaCard) {
        let triggered = false;
        const statContainer = espadaCard.querySelector('.stat-container');

        if(statContainer) {
            statContainer.style.cursor = 'pointer';
            statContainer.addEventListener('click', () => {
                if(triggered) return;
                triggered = true;
                
                if(espadaCard.vanillaTilt) espadaCard.vanillaTilt.destroy();
                
                playSfx('rocket-up');
                
                // Rocket Up
                espadaCard.classList.add('rocket-up');
                
                setTimeout(() => {
                    playSfx('rocket-slam');
                    
                    // Slam down
                    espadaCard.classList.remove('rocket-up');
                    espadaCard.classList.add('rocket-slam');
                    
                    // Show SIU overlay
                    const overlay = document.getElementById('siu-overlay');
                    if(overlay) overlay.classList.remove('hidden');
                    
                    document.body.classList.add('shake-screen');
                    
                    setTimeout(() => {
                        espadaCard.classList.remove('rocket-slam');
                        document.body.classList.remove('shake-screen');
                        if(overlay) overlay.classList.add('hidden');
                        
                        // Start hover transition listener to re-apply VanillaTilt if needed, 
                        // but it's okay to just leave it off if it has already been launched.
                        triggered = false; 
                    }, 2000);
                }, 1500); // 1.5s hang time
            });
        }
    }

    // --- 5. HumanZalien (Aura Repellent - 3s Hover/Hold) ---
    const hzCard = document.querySelector('.failrizz');
    if(hzCard) {
        let holdTimeout;
        
        const triggerAura = () => {
            document.querySelectorAll('.card').forEach(c => {
                if(c !== hzCard) {
                    // Calculate vector away from hzCard
                    const hzRect = hzCard.getBoundingClientRect();
                    const cRect = c.getBoundingClientRect();
                    const dx = cRect.left - hzRect.left;
                    const dy = cRect.top - hzRect.top;
                    const distance = Math.max(10, Math.sqrt(dx*dx + dy*dy));
                    
                    const moveX = (dx / distance) * 100;
                    const moveY = (dy / distance) * 100;
                    
                    c.style.transform = `translate(${moveX}px, ${moveY}px) scale(0.8)`;
                    c.classList.add('shrink-away');
                }
            });
        };

        const clearAura = () => {
            clearTimeout(holdTimeout);
            document.querySelectorAll('.card').forEach(c => {
                c.style.transform = '';
                c.classList.remove('shrink-away');
            });
        };

        hzCard.addEventListener('pointerenter', () => { holdTimeout = setTimeout(triggerAura, 2000); });
        hzCard.addEventListener('pointerleave', clearAura);
        
        hzCard.addEventListener('touchstart', () => { holdTimeout = setTimeout(triggerAura, 2000); });
        hzCard.addEventListener('touchend', clearAura);
        hzCard.addEventListener('touchcancel', clearAura);
    }

    // --- 6. Kiyansh (The Unc - Elderly Mode) ---
    const kiyanshCard = document.querySelector('.unc');
    if(kiyanshCard) {
        let isElderly = false;
        const statContainer = kiyanshCard.querySelector('.stat-container');
        
        if(statContainer) {
            statContainer.style.cursor = 'pointer';
            statContainer.addEventListener('click', () => {
                if(isElderly) return;
                isElderly = true;
                
                playSfx('error');
                kiyanshCard.classList.add('elderly-mode');
                
                const quoteText = kiyanshCard.querySelector('.quote');
                if(quoteText) {
                    quoteText.innerText = '"Back in my day, we didn\'t have these fancy glass panels... can I get a senior discount?"';
                }
            });
        }
    }

    // --- 7. Mukand (The Literal Follower) ---
    const mukandCard = document.getElementById('mukand-card');
    if(mukandCard) {
        let isFollowing = false;
        
        mukandCard.addEventListener('click', (e) => {
            if(isFollowing) return;
            isFollowing = true;
            
            // Kill tilt so it doesn't fight our fixed transform updates
            if(mukandCard.vanillaTilt) mukandCard.vanillaTilt.destroy();
            
            // Keep original geometry for seamless breakout
            const rect = mukandCard.getBoundingClientRect();
            mukandCard.style.width = rect.width + 'px';
            mukandCard.style.height = rect.height + 'px';
            mukandCard.style.left = '0px'; 
            mukandCard.style.top = '0px';
            mukandCard.style.transform = `translate(${rect.left}px, ${rect.top}px)`;
            
            // Allow a tiny frame delay so the inline styles apply before !important CSS shrinks it
            setTimeout(() => {
                mukandCard.classList.add('literal-follower', 'dog-mode');
                mukandCard.innerHTML = '🐕';
                
                // Make him perfectly track the cursor cleanly as a small dog
                window.addEventListener('mousemove', (ev) => {
                    mukandCard.style.transform = `translate(${ev.clientX + 15}px, ${ev.clientY + 15}px) scale(1)`;
                });
            }, 10);
        });
    }

    // --- Premium Spotlight Effect ---
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('pointermove', e => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
            card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
        });
    });

    // --- Smooth Page Transitions ---
    document.querySelectorAll('.navbar a').forEach(link => {
        link.addEventListener('click', e => {
            const targetUrl = link.getAttribute('href');
            // Don't animate if clicking exactly where we are
            if (targetUrl === window.location.pathname.split('/').pop() || targetUrl === '#') return;
            
            e.preventDefault(); // Stop immediate jump
            
            // Fade out the content smoothly
            const container = document.querySelector('.container');
            const header = document.querySelector('header');
            if(container) container.classList.add('page-exit');
            if(header) header.classList.add('page-exit');
            
            // Navigate after animation plays
            setTimeout(() => {
                window.location.href = targetUrl;
            }, 350); 
        });
    });

    // --- Interactive Arcs Timeline (index.html) ---
    const varusArc = document.querySelector('.varus-arc');
    const premiumBg = document.querySelector('.premium-bg');
    if(varusArc && premiumBg) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if(entry.isIntersecting) {
                    premiumBg.classList.add('bg-red-alert');
                } else {
                    premiumBg.classList.remove('bg-red-alert');
                }
            });
        }, { threshold: 0.75 });
        observer.observe(varusArc);
    }

    // --- Anti-Light Mode Easter Egg ---
    const themeToggle = document.getElementById('theme-toggle');
    if(themeToggle) {
        let toggleBroken = false;
        themeToggle.addEventListener('click', (e) => {
            e.preventDefault();
            if(toggleBroken) return;
            toggleBroken = true;
            
            playSfx('error');
            themeToggle.classList.add('broken-button');
            
            let toast = document.getElementById('toast-container');
            if(!toast) {
                toast = document.createElement('div');
                toast.id = 'toast-container';
                document.body.appendChild(toast);
            }
            toast.innerHTML = '⚠️ "The Gay Group" does not belong in the Light.';
            toast.classList.add('show');
            setTimeout(() => { toast.classList.remove('show'); }, 4000);
        });
    }

    // --- Secret Code Trigger ("VARUS") ---
    let keyBuffer = '';
    window.addEventListener('keydown', (e) => {
        keyBuffer += e.key.toUpperCase();
        if(keyBuffer.length > 5) keyBuffer = keyBuffer.slice(-5);
        
        if(keyBuffer === 'VARUS') {
            playSfx('nuke');
            document.body.classList.add('nuke-active');
            const overlay = document.getElementById('nuke-overlay');
            if(overlay) {
                overlay.classList.remove('hidden');
                overlay.classList.add('active');
                if(!overlay.innerHTML.includes('ADMIN OVERRIDE')) {
                    overlay.innerHTML += `<p style="color:#fff; margin-top: 20px;">ADMIN OVERRIDE DETECTED.</p>`;
                }
            }
            keyBuffer = '';
        }
    });

});
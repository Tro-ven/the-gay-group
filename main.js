// ==========================================
// 1. DYNAMIC 3D CARD TILT (MOUSE & TOUCH)
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        // Desktop Mouse Movement
        card.addEventListener('mousemove', handleMove);
        // Mobile Touch Movement
        card.addEventListener('touchmove', (e) => {
            handleMove(e.touches[0], card); // Pass the first finger touch
        });

        function handleMove(event, targetCard = card) {
            const rect = targetCard.getBoundingClientRect();
            const x = event.clientX - rect.left; 
            const y = event.clientY - rect.top;  
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -10; 
            const rotateY = ((x - centerX) / centerX) * 10;

            targetCard.style.transform = `perspective(1000px) scale(1.05) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            targetCard.style.transition = "none"; 
        }

        // Reset when mouse/finger leaves
        const resetCard = () => {
            card.style.transform = `perspective(1000px) scale(1) rotateX(0deg) rotateY(0deg)`;
            card.style.transition = "transform 0.5s ease";
        };

        card.addEventListener('mouseleave', resetCard);
        card.addEventListener('touchend', resetCard);
    });

    // ==========================================
    // 2. THE SECRET "UNC" CHEAT CODE
    // ==========================================
    const activateUNCMode = () => {
        alert("⚠️ UNC MODE ACTIVATED: Maximum Arthritis Achieved ⚠️");
        document.documentElement.style.setProperty('--neon-purple', '#ffcc00');
        document.documentElement.style.setProperty('--neon-cyan', '#ffcc00');
        document.body.style.filter = "sepia(0.5)";
    };

    // Desktop: Type 'u' 'n' 'c'
    let secretCode = "";
    document.addEventListener('keydown', (e) => {
        secretCode += e.key.toLowerCase();
        if (secretCode.length > 3) secretCode = secretCode.substring(1);
        if (secretCode === "unc") activateUNCMode();
    });

    // Mobile: Tap the main Header 5 times quickly
    let tapCount = 0;
    let tapTimer;
    const headers = document.querySelectorAll('h1');
    
    headers.forEach(header => {
        header.addEventListener('click', () => {
            tapCount++;
            clearTimeout(tapTimer);
            
            // If they don't tap again within 1.5 seconds, reset the counter
            tapTimer = setTimeout(() => { tapCount = 0; }, 1500); 
            
            if (tapCount === 5) {
                activateUNCMode();
                tapCount = 0; // Reset after activation
            }
        });
    });
});

// ==========================================
// 3. CUSTOM RIGHT-CLICK / LONG PRESS MENU
// ==========================================
const customMenu = document.createElement('div');
customMenu.id = "custom-menu";
customMenu.innerHTML = `
    <ul>
        <li onclick="alert('Snitching to Varus...')">Report to Varus 💀</li>
        <li onclick="alert('Aura +10,000')">Steal Aura ✨</li>
        <li onclick="location.reload()">Refresh Matrix 🔄</li>
    </ul>
`;
document.body.appendChild(customMenu);

document.addEventListener("contextmenu", (e) => {
    e.preventDefault(); 
    customMenu.style.display = "block";
    
    let x = e.pageX;
    let y = e.pageY;
    if (x + 200 > window.innerWidth) x = window.innerWidth - 200;
    
    customMenu.style.left = `${x}px`;
    customMenu.style.top = `${y}px`;
});

document.addEventListener("click", () => {
    customMenu.style.display = "none";
});

// ==========================================
// 4. THE DEVELOPER TERMINAL (EASTER EGG)
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const terminal = document.getElementById('terminal');
    const termInput = document.getElementById('terminal-input');
    const termOutput = document.getElementById('terminal-output');

    if(!terminal) return; // Failsafe agar kisi page pe HTML na ho

    // Toggle Terminal with ` or ~ key
    document.addEventListener('keydown', (e) => {
        if (e.key === '`' || e.key === '~') {
            e.preventDefault();
            terminal.classList.toggle('active');
            if (terminal.classList.contains('active')) {
                termInput.focus();
            }
        }
    });

    // Handle Commands when pressing Enter
    termInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = termInput.value.trim().toLowerCase();
            if (command !== '') {
                printOutput(`admin@gaygroup:~$ ${command}`);
                processCommand(command);
            }
            termInput.value = ''; // clear input field
        }
    });

    function printOutput(text, className = '') {
        const line = document.createElement('div');
        line.innerText = text;
        if (className) line.classList.add(className);
        termOutput.appendChild(line);
        termOutput.scrollTop = termOutput.scrollHeight; // Auto-scroll to bottom
    }

    // Command Processor
    function processCommand(cmd) {
        const args = cmd.split(' ');
        const baseCmd = args[0];

        switch(baseCmd) {
            case 'help':
                printOutput("AVAILABLE COMMANDS:");
                printOutput("  reveal logs   : Exposes hidden group chat lore.");
                printOutput("  ban [name]    : Permanently deletes a member's card (until refresh).");
                printOutput("  unblock all   : Attempts to bypass Varus's firewall.");
                printOutput("  clear         : Clears the terminal output.");
                break;
            case 'clear':
                termOutput.innerHTML = '';
                printOutput("[SYSTEM] Group Chat Archive OS v1.0");
                printOutput("Type 'help' for commands. Press '~' to close.");
                break;
            case 'reveal':
                if (args[1] === 'logs') {
                    const logs = [
                        "Log #142: Mukand spotted shadow-following Varus again.",
                        "Log #88: Espada sent another cringe Ronaldo reel.",
                        "Log #12: Khusra lied about his rank again. Shocking.",
                        "Log #01: The Beta Test server was purely unfiltered chaos."
                    ];
                    printOutput(logs[Math.floor(Math.random() * logs.length)], 'term-success');
                } else {
                    printOutput("Usage: reveal logs", 'term-error');
                }
                break;
            case 'unblock':
                if (args[1] === 'all') {
                    printOutput("ERROR: Varus's ego is too large to bypass the firewall.", 'term-error');
                } else {
                    printOutput("Usage: unblock all", 'term-error');
                }
                break;
            case 'ban':
                if (!args[1]) {
                    printOutput("Usage: ban [name]", 'term-error');
                } else {
                    const target = args[1];
                    const cards = document.querySelectorAll('.card');
                    let found = false;
                    
                    // Search for the card containing the name
                    cards.forEach(card => {
                        if (card.innerText.toLowerCase().includes(target)) {
                            card.style.display = 'none'; // Kicks them off the screen
                            found = true;
                        }
                    });
                    
                    if (found) {
                        printOutput(`[SUCCESS] '${target}' has been YEETED from the server.`, 'term-success');
                    } else {
                        printOutput(`[ERROR] User '${target}' not found. Are they already gone?`, 'term-error');
                    }
                }
                break;
            default:
                printOutput(`bash: ${baseCmd}: command not found. Type 'help'.`, 'term-error');
        }
    }
});
// ==========================================
// 5. THE KHUSRA "FAKE LAWYER" EASTER EGG
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    // 1. Create the Lawsuit HTML dynamically
    const lawsuitPopup = document.createElement('div');
    lawsuitPopup.id = "lawyer-popup";
    lawsuitPopup.innerHTML = `
        <h1>CEASE & DESIST</h1>
        <h3 style="margin: 0 0 20px 0;">FROM THE DESK OF HARVY SPECTER</h3>
        <p><b>WARNING:</b> U are being sued for 10 million dollars.</p>
        <p><b>Reason:</b> Defamation and putting me on the Wall of Shame without my permission.</p>
        <p>See u in court bro.</p>
        <br>
        <p style="color: #666; font-size: 0.75rem; font-style: italic;">(Please delete this bro my mom checks my phone and I have unit tests tomorrow)</p>
        <button id="dismiss-lawsuit">Dismiss Case</button>
    `;
    document.body.appendChild(lawsuitPopup);

    // 2. Logic to close the popup
    document.getElementById('dismiss-lawsuit').addEventListener('click', () => {
        lawsuitPopup.classList.remove('show');
    });

    // 3. Trigger Function
    const triggerLawsuit = () => {
        lawsuitPopup.classList.add('show');
    };

    // 4. DESKTOP TRIGGER: Type 's' 'u' 'e'
    let sueCode = "";
    document.addEventListener('keydown', (e) => {
        // Only track letters, and ignore if terminal is open
        if(e.key.length === 1 && !document.getElementById('terminal').classList.contains('active')) {
            sueCode += e.key.toLowerCase();
            if (sueCode.length > 3) sueCode = sueCode.substring(1);
            if (sueCode === "sue") triggerLawsuit();
        }
    });

    // 5. MOBILE TRIGGER: Tap Khusra's card 3 times fast
    const khusraCard = document.querySelector('.card.lawyer');
    if (khusraCard) {
        let khusraTapCount = 0;
        let khusraTapTimer;
        
        khusraCard.addEventListener('click', () => {
            khusraTapCount++;
            clearTimeout(khusraTapTimer);
            
            // Reset tap count if they wait longer than 1 second
            khusraTapTimer = setTimeout(() => { khusraTapCount = 0; }, 1000); 
            
            if (khusraTapCount === 3) {
                triggerLawsuit();
                khusraTapCount = 0; // Reset after it pops up
            }
        });
    }
});
// ==========================================
// 6. HUMANZALIEN "FAIL RIZZ" EASTER EGG
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    // Create the Chat HTML dynamically
    const rizzPopup = document.createElement('div');
    rizzPopup.id = "rizz-popup";
    rizzPopup.innerHTML = `
        <div class="chat-header">Chat with Varus 💀</div>
        <div class="chat-box">
            <div class="msg sent">Hey Varus...</div>
            <div class="msg sent">Are you a keyboard? Because you are exactly my type. 😉</div>
            <div class="msg received">Ew. Wtf.</div>
            <div class="msg system">You cannot send messages to this user. You have been blocked.</div>
        </div>
        <div id="wasted-text">RIZZ FAILED</div>
        <button class="close-rizz" id="dismiss-rizz">Tap to Respawn</button>
    `;
    document.body.appendChild(rizzPopup);

    document.getElementById('dismiss-rizz').addEventListener('click', () => {
        rizzPopup.classList.remove('show');
    });

    const triggerFailRizz = () => {
        // Need to clone and replace to reset CSS animations every time it opens
        const oldBox = document.querySelector('.chat-box');
        const newBox = oldBox.cloneNode(true);
        oldBox.parentNode.replaceChild(newBox, oldBox);
        
        rizzPopup.classList.add('show');
    };

    // DESKTOP TRIGGER: Type 'r' 'i' 'z' 'z'
    let rizzCode = "";
    document.addEventListener('keydown', (e) => {
        if(e.key.length === 1 && !document.getElementById('terminal')?.classList.contains('active')) {
            rizzCode += e.key.toLowerCase();
            if (rizzCode.length > 4) rizzCode = rizzCode.substring(1);
            if (rizzCode === "rizz") triggerFailRizz();
        }
    });

    // MOBILE TRIGGER: Tap HumanZalien's card 3 times fast
    const humanCard = document.querySelector('.card.failrizz');
    if (humanCard) {
        let humanTapCount = 0;
        let humanTapTimer;
        
        humanCard.addEventListener('click', () => {
            humanTapCount++;
            clearTimeout(humanTapTimer);
            
            humanTapTimer = setTimeout(() => { humanTapCount = 0; }, 1000); 
            
            if (humanTapCount === 3) {
                triggerFailRizz();
                humanTapCount = 0;
            }
        });
    }
});
// ==========================================
// 7. VARUS "THE GREAT BLOCK" EASTER EGG
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    // 1. Create the Nuke Screen dynamically
    const varusNuke = document.createElement('div');
    varusNuke.id = "varus-nuke";
    varusNuke.innerHTML = `
        <div class="nuke-text">FATAL ERROR: SERVER WIPED.</div>
        <div class="nuke-subtext">Varus got ragebaited and blocked everyone. The lore is gone.</div>
        <button class="nuke-btn" onclick="location.reload()">CREATE PART 2 (REBOOT)</button>
    `;
    document.body.appendChild(varusNuke);

    // 2. The Destruction Sequence
    const triggerVarusRage = () => {
        // Drop the actual website off the screen
        document.body.classList.add('site-wiped');
        
        // Start the red flashing error screen
        varusNuke.classList.add('active', 'phase-1');
        
        // Sequence the text appearing
        setTimeout(() => { varusNuke.classList.add('phase-2'); }, 1500);
        setTimeout(() => { varusNuke.classList.add('phase-3'); }, 3500);
    };

    // 3. DESKTOP TRIGGER: Type 'b' 'l' 'o' 'c' 'k'
    let blockCode = "";
    document.addEventListener('keydown', (e) => {
        if(e.key.length === 1 && !document.getElementById('terminal')?.classList.contains('active')) {
            blockCode += e.key.toLowerCase();
            if (blockCode.length > 5) blockCode = blockCode.substring(1);
            if (blockCode === "block") triggerVarusRage();
        }
    });

    // 4. MOBILE TRIGGER: Tap Varus's card 3 times fast
    const varusCard = document.querySelector('.card.betrayer');
    if (varusCard) {
        let varusTapCount = 0;
        let varusTapTimer;
        
        varusCard.addEventListener('click', () => {
            varusTapCount++;
            clearTimeout(varusTapTimer);
            
            varusTapTimer = setTimeout(() => { varusTapCount = 0; }, 1000); 
            
            if (varusTapCount === 3) {
                triggerVarusRage();
                varusTapCount = 0;
            }
        });
    }
});
// ==========================================
// 8. MUKAND "WHO?" EASTER EGG
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    // 1. Create the System Toast dynamically
    const toast = document.createElement('div');
    toast.id = 'system-toast';
    toast.innerHTML = `
        <div class="toast-header">System Notification</div>
        <div id="toast-msg" style="line-height: 1.4; color: #aaa;"></div>
    `;
    document.body.appendChild(toast);

    // 2. The Vanish Sequence
    const triggerMukandVanish = () => {
        const mukandCard = document.querySelector('.card.follower');
        
        // If the card doesn't exist or is already dusted, do nothing
        if(!mukandCard || mukandCard.classList.contains('fade-to-dust')) return;

        // Slide in the notification
        const msg = document.getElementById('toast-msg');
        msg.innerHTML = "Query: <span style='color: #fff;'>'Mukand'</span>...<br><br><span style='color: var(--neon-red);'>Error 404:</span> Entity only exists when Varus is present. Erasing from cache...";
        toast.classList.add('show');

        // Snap the card out of existence after reading the message
        setTimeout(() => {
            mukandCard.classList.add('fade-to-dust');
        }, 1500);

        // Hide the notification banner
        setTimeout(() => {
            toast.classList.remove('show');
        }, 6000);
    };

    // 3. DESKTOP TRIGGER: Type 'w' 'h' 'o'
    let whoCode = "";
    document.addEventListener('keydown', (e) => {
        if(e.key.length === 1 && !document.getElementById('terminal')?.classList.contains('active')) {
            whoCode += e.key.toLowerCase();
            if (whoCode.length > 3) whoCode = whoCode.substring(1);
            if (whoCode === "who") triggerMukandVanish();
        }
    });

    // 4. MOBILE TRIGGER: Tap Mukand's card 3 times fast
    const mukandCard = document.querySelector('.card.follower');
    if (mukandCard) {
        let mukandTapCount = 0;
        let mukandTapTimer;
        
        mukandCard.addEventListener('click', () => {
            mukandTapCount++;
            clearTimeout(mukandTapTimer);
            
            mukandTapTimer = setTimeout(() => { mukandTapCount = 0; }, 1000); 
            
            if (mukandTapCount === 3) {
                triggerMukandVanish();
                mukandTapCount = 0;
            }
        });
    }
});
// ==========================================
// 9. ESPADA "THE CR7 CURSE" EASTER EGG
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    // 1. Create the Call Screen
    const espadaCall = document.createElement('div');
    espadaCall.id = "espada-call";
    espadaCall.innerHTML = `
        <div class="caller-info">
            <div class="caller-pic">🐐</div>
            <div class="caller-name">Cristiano Ronaldo</div>
            <div class="caller-status">Incoming FaceTime...</div>
        </div>
        <div class="call-buttons">
            <button class="call-btn btn-accept" id="accept-call">📞</button>
            <button class="call-btn btn-decline" id="decline-call">📵</button>
        </div>
        <div style="color: #666; font-size: 0.7rem;">(Espada forwarded this to you)</div>
    `;
    document.body.appendChild(espadaCall);

    // 2. Create the SUIII Flash overlay
    const suiFlash = document.createElement('div');
    suiFlash.id = "sui-flash";
    suiFlash.innerText = "SIIIUUU";
    document.body.appendChild(suiFlash);

    // 3. The "Un-Clickable" Decline Button Logic
    const declineBtn = document.getElementById('decline-call');
    
    const dodgeCursor = () => {
        // Move the button to a random spot within the call popup
        const x = Math.random() * (espadaCall.clientWidth - 70) - (espadaCall.clientWidth / 2 - 35);
        const y = Math.random() * -300; // Moves it upwards randomly
        declineBtn.style.transform = `translate(${x}px, ${y}px)`;
    };

    // Works for both mouse and touch
    declineBtn.addEventListener('mouseover', dodgeCursor);
    declineBtn.addEventListener('touchstart', (e) => {
        e.preventDefault(); // Stop the tap
        dodgeCursor();
    });

    // 4. Accept Call Logic (The Punishment)
    document.getElementById('accept-call').addEventListener('click', () => {
        espadaCall.classList.remove('show');
        suiFlash.classList.add('show');
        
        // Hide the flash after 2 seconds
        setTimeout(() => {
            suiFlash.classList.remove('show');
        }, 2000);
    });

    const triggerEspadaCall = () => {
        declineBtn.style.transform = `translate(0px, 0px)`; // Reset position
        espadaCall.classList.add('show');
    };

    // 5. DESKTOP TRIGGER: Type 's' 'u' 'i' 'i'
    let suiCode = "";
    document.addEventListener('keydown', (e) => {
        if(e.key.length === 1 && !document.getElementById('terminal')?.classList.contains('active')) {
            suiCode += e.key.toLowerCase();
            if (suiCode.length > 4) suiCode = suiCode.substring(1);
            if (suiCode === "suii") triggerEspadaCall();
        }
    });

    // 6. MOBILE TRIGGER: Tap Espada's card 3 times fast
    const espadaCard = document.querySelector('.card.cringe');
    if (espadaCard) {
        let espadaTapCount = 0;
        let espadaTapTimer;
        
        espadaCard.addEventListener('click', () => {
            espadaTapCount++;
            clearTimeout(espadaTapTimer);
            
            espadaTapTimer = setTimeout(() => { espadaTapCount = 0; }, 1000); 
            
            if (espadaTapCount === 3) {
                triggerEspadaCall();
                espadaTapCount = 0;
            }
        });
    }
});
// ==========================================
// 10. LIVE SHAME FEED (FROM DISCORD BOT)
// ==========================================
async function loadShameData() {
    const display = document.getElementById('shame-display');
    if (!display) return; // Only run on the shame page

    try {
        // Fetch the JSON file generated by the Python bot
        const response = await fetch('./shame_data.json');
        const data = await response.json();

        if (data.length === 0) {
            display.innerHTML = `<div class="card" style="text-align:center; opacity:0.5;">No L's recorded... yet.</div>`;
            return;
        }

        // Clear "Coming Soon" or "Scanning" text
        display.innerHTML = '';

        // Create a card for every archived message
        data.reverse().forEach(entry => { // .reverse() puts newest first
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <span class="status-label">Busted on ${entry.timestamp}</span>
                <h3 class="name" style="color: var(--neon-cyan);">${entry.author}</h3>
                <p class="quote" style="border-top: none; padding-top: 0; font-size: 1.1rem; color: #eee;">
                    "${entry.content}"
                </p>
                <div style="font-size: 0.6rem; color: #444; margin-top: 10px;">ID: ${entry.id}</div>
            `;
            display.appendChild(card);
        });

    } catch (error) {
        console.log("No data found or bot hasn't run yet.");
    }
}

// Run the loader when page loads
document.addEventListener("DOMContentLoaded", loadShameData);
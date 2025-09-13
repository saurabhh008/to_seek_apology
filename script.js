(() => {
  const WA_NUMBER = "919548275350";
  const deepMessages = [
    "Hey {name}… pata hai, i messed up things but genuinely not intended so ❤️  .",
    "I saw your profile. Just one glance—and I smiled.",

"You looked cute. Not just pretty—something deeper.",

"I wanted to say hi. I wanted to say more.",

"But I messed up. Said the wrong things. dil se sorry for that 💌😊",
    "I didn’t plan to say anything. But here I am.",

"You seem like someone worth knowing. Not just scrolling past.",

"So here’s me, showing up with words instead of small talk.",

"If you’re into good conversations and unexpected connections…",

"I’d like to be the reason you smile at your screen.",

"No cheesy lines. Just genuine interest.",

"Let’s skip the ordinary. I think we could be something extraordinary.",

"If you’re curious too… maybe this is where it begins.",
    "Let’s turn this little glitch into a great story. 🎉"
  
  ];

  // Elements
  const gate = document.getElementById("gate");
  const app = document.getElementById("app");
  const nameForm = document.getElementById("nameForm");
  const nameInput = document.getElementById("nameInput");
  const nameBadge = document.getElementById("nameBadge");
  const chat = document.getElementById("chat");
  const btn = document.getElementById("revealBtn");
  const whatsBtn = document.getElementById("whatsBtn");
  const ps = document.getElementById("ps");
  const confettiCanvas = document.getElementById("confetti");
  const restartBtn = document.getElementById("restart");

  let herName = localStorage.getItem("herName") || "";
  let index = 0;
  let animating = false;

  // canvas resize
  const ctx = confettiCanvas.getContext("2d");
  function resize() {
    confettiCanvas.width = innerWidth * devicePixelRatio;
    confettiCanvas.height = innerHeight * devicePixelRatio;
    confettiCanvas.style.width = innerWidth + "px";
    confettiCanvas.style.height = innerHeight + "px";
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }
  resize();
  addEventListener("resize", resize);

  // helpers
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const el = (tag, cls, html) => {
    const d = document.createElement(tag);
    if (cls) d.className = cls;
    if (html !== undefined) d.innerHTML = html;
    return d;
  };

  // gate entry
  function openApp(name) {
    herName = (name || "you").trim();
    localStorage.setItem("herName", herName);
    gate.style.transition = "opacity .35s ease";
    gate.style.opacity = "0";
    setTimeout(() => (gate.style.display = "none"), 360);
    app.hidden = false;
    nameBadge.textContent = herName;
    chat.innerHTML = "";
    index = 0;
  }

  if (herName) {
    nameInput.value = herName;
    nameBadge.textContent = herName;
  }

  nameForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const v = nameInput.value.trim();
    if (!v) return nameInput.focus();
    openApp(v);
  });

  // create bubble (side: left/right)
  function createBubble(text, side = "left") {
    const bubble = el("div", "bubble " + side);
    bubble.textContent = text;
    // initial offscreen transform
    bubble.style.opacity = "0";
    bubble.style.transform = `translateX(${
      side === "left" ? -30 : 30
    }px) scale(.98)`;
    chat.appendChild(bubble);
    // scroll
    chat.scrollTop = chat.scrollHeight;
    // animate in
    requestAnimationFrame(() => {
      bubble.style.transition =
        "transform .5s cubic-bezier(.2,.9,.3,1), opacity .35s ease";
      bubble.style.transform = "translateX(0) scale(1)";
      bubble.style.opacity = "1";
    });
    return bubble;
  }

  // typing bubble (fake)
  async function showTyping(side = "left", duration = 900) {
    const bubble = el("div", "bubble " + side);
    const typ = el("span", "typing");
    bubble.appendChild(typ);
    bubble.style.opacity = "0";
    bubble.style.transform = `translateX(${
      side === "left" ? -30 : 30
    }px) scale(.98)`;
    chat.appendChild(bubble);
    requestAnimationFrame(() => {
      bubble.style.transition = "transform .35s ease, opacity .25s ease";
      bubble.style.transform = "translateX(0) scale(1)";
      bubble.style.opacity = "1";
    });
    chat.scrollTop = chat.scrollHeight;
    await sleep(duration);
    bubble.remove();
  }

  // reveal next message with typing effect then bubble slide in
  async function revealNext() {
    if (animating) return;
    if (index >= deepMessages.length) return;
    animating = true;
    const raw = deepMessages[index].replaceAll("{name}", herName || "you");
    const side = index % 2 === 0 ? "left" : "right";
    await showTyping(side, 700 + Math.random() * 500);
    // typing letter-by-letter inside bubble
    const bubble = el("div", "bubble " + side);
    chat.appendChild(bubble);
    chat.scrollTop = chat.scrollHeight;
    bubble.style.opacity = "1";
    bubble.style.transform = "translateX(0) scale(1)";
    // type
    for (let i = 0; i <= raw.length; i++) {
      bubble.textContent = raw.slice(0, i);
      chat.scrollTop = chat.scrollHeight;
      await sleep(18 + (i % 6));
    }
    index++;
    animating = false;

    // if last message (proposal) trigger celebration and show whatsapp after delay
    if (index >= deepMessages.length) {
      // heartbeat then celebration
      bubble.classList.add("heartTarget");
      await heartbeat(bubble);
      celebrate();
      floatingHearts(18);
      // hide reveal button
      btn.hidden = true;
      // show big heart pulse overlay
      await sleep(800);
      // show whatsapp after delay
      await sleep(1600);
      const prefill = `Hey  👋  ! ' 
      `;
      whatsBtn.href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
        prefill
      )}`;
      whatsBtn.hidden = false;
      whatsBtn.classList.add("show");
      // show PS
      await sleep(900);
      ps.textContent = `P.S. ${herName}, I made this just for you ✨`;
      ps.hidden = false;
      ps.style.opacity = "1";
    }
  }

  // heartbeat animation helper
  async function heartbeat(elm, times = 2) {
    for (let i = 0; i < times; i++) {
      elm.style.transition = "transform .18s ease";
      elm.style.transform = "scale(1.06)";
      await sleep(180);
      elm.style.transform = "scale(1)";
      await sleep(120);
    }
  }

  // confetti + canvas
  function celebrate(duration = 2600) {
    const ctx = confettiCanvas.getContext("2d");
    const W = confettiCanvas.width,
      H = confettiCanvas.height;
    const particles = [];
    const colors = [
      "#ff6b9a",
      "#ff8fb6",
      "#ffd1dc",
      "#fff1f6",
      "#25d366",
      "#ffd97a",
    ];
    for (let i = 0; i < 220; i++) {
      particles.push({
        x: Math.random() * W,
        y: -10 - Math.random() * 200,
        r: 6 + Math.random() * 8,
        s: 2 + Math.random() * 4,
        c: colors[Math.floor(Math.random() * colors.length)],
        t: Math.random() * Math.PI * 2,
        rot: Math.random() * 360,
      });
    }
    confettiCanvas.style.opacity = "1";
    let start = performance.now();
    let raf;
    function step(ts) {
      const elapsed = ts - start;
      ctx.clearRect(0, 0, W, H);
      particles.forEach((p) => {
        p.t += 0.04;
        p.x += Math.sin(p.t) * 1.2;
        p.y += p.s;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.t % 360) / 20 + (p.rot * Math.PI) / 180);
        ctx.fillStyle = p.c;
        ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 0.6);
        ctx.restore();
      });
      if (elapsed < duration) raf = requestAnimationFrame(step);
      else {
        confettiCanvas.style.opacity = "0";
        cancelAnimationFrame(raf);
        ctx.clearRect(0, 0, W, H);
      }
    }
    raf = requestAnimationFrame(step);
  }

  // floating hearts DOM
  function floatingHearts(n = 12) {
    for (let i = 0; i < n; i++) {
      setTimeout(() => {
        const h = el("div", "floatHeart");
        h.textContent = "❤";
        h.style.position = "fixed";
        h.style.left = 10 + Math.random() * 80 + "vw";
        h.style.bottom = "-8vh";
        h.style.fontSize = 18 + Math.random() * 30 + "px";
        h.style.opacity = "0.95";
        h.style.pointerEvents = "none";
        h.style.zIndex = 999;
        h.style.transition = "transform 3.2s ease-out, opacity 3.2s ease-out";
        document.body.appendChild(h);
        requestAnimationFrame(() => {
          h.style.transform = `translateY(-130vh) translateX(${
            Math.random() * 40 - 20
          }vw) rotate(${Math.random() * 80 - 40}deg)`;
          h.style.opacity = "0";
        });
        setTimeout(() => h.remove(), 3600);
      }, i * 120);
    }
  }

  // restart handler
  restartBtn.addEventListener("click", () => {
    localStorage.removeItem("herName");
    location.reload();
  });

  // attach reveal
  btn.addEventListener("click", () => revealNext(), { passive: true });
})();

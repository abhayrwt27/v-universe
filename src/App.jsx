import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sparkles, Heart, Gift, Flower2, Stars, Moon, Music2, VolumeX, Volume2, ArrowDown, X, Camera, WandSparkles } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const memories = [
  { icon: "☁️", title: "The random talks", text: "The conversations that start with nothing and somehow become the best part of the day." },
  { icon: "😂", title: "The uncontrollable laughs", text: "The silly jokes, the weird moments, and laughing until our cheeks hurt." },
  { icon: "🌷", title: "The little things", text: "The kindness you show without even noticing. Those things matter more than you know." },
];

const wishes = [
  "May your days feel soft, your heart feel light, and your dreams find their way to you.",
  "I hope life surprises you with the same kindness you give to everyone around you.",
  "On difficult days, remember: you are doing better than you think, and you matter more than you know.",
  "May you always find reasons to laugh loudly, dance badly, and be completely yourself.",
];

function StarField() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let w, h, stars = [], raf;
    const resize = () => {
      w = canvas.width = window.innerWidth * devicePixelRatio;
      h = canvas.height = window.innerHeight * devicePixelRatio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      stars = Array.from({ length: Math.min(180, Math.floor(window.innerWidth / 7)) }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        r: Math.random() * 1.7 + .3, a: Math.random() * .65 + .15,
        s: Math.random() * .012 + .003, p: Math.random() * Math.PI * 2
      }));
    };
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      stars.forEach(star => {
        star.p += star.s;
        const alpha = star.a * (.62 + Math.sin(star.p) * .38);
        ctx.beginPath(); ctx.arc(star.x, star.y, star.r * devicePixelRatio, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(238,224,255,${alpha})`; ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    resize(); draw();
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas className="star-canvas" ref={canvasRef} aria-hidden="true" />;
}

function App() {
  const pageRef = useRef(null);
  const heroRef = useRef(null);
  const [letterOpen, setLetterOpen] = useState(false);
  const [giftOpen, setGiftOpen] = useState(false);
  const [wishIndex, setWishIndex] = useState(0);
  const [musicOn, setMusicOn] = useState(false);
  const [name, setName] = useState("beautiful soul");
  const [nameEditing, setNameEditing] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
      intro.from(".nav", { y: -24, opacity: 0, duration: .8 })
        .from(".eyebrow, .hero-title, .hero-copy, .hero-actions", { y: 30, opacity: 0, stagger: .16, duration: .9 }, "-=.35")
        .from(".orbit-art", { scale: .75, opacity: 0, rotation: -12, duration: 1.5, ease: "back.out(1.3)" }, "-=1");
      gsap.to(".planet-main", { y: -16, duration: 3.8, yoyo: true, repeat: -1, ease: "sine.inOut" });
      gsap.to(".orbit-one", { rotation: 360, duration: 34, repeat: -1, ease: "none", transformOrigin: "50% 50%" });
      gsap.to(".orbit-two", { rotation: -360, duration: 48, repeat: -1, ease: "none", transformOrigin: "50% 50%" });
      gsap.to(".floaty", { y: -12, duration: 2.6, stagger: .35, yoyo: true, repeat: -1, ease: "sine.inOut" });

      gsap.utils.toArray(".reveal").forEach((el) => {
        gsap.fromTo(el, { y: 46, opacity: 0 }, {
          y: 0, opacity: 1, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 86%", once: true }
        });
      });
      gsap.from(".memory-card", {
        y: 50, opacity: 0, stagger: .18, duration: .8, ease: "power3.out",
        scrollTrigger: { trigger: ".memory-grid", start: "top 82%", once: true }
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  const burst = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    for (let i = 0; i < 12; i++) {
      const particle = document.createElement("span");
      particle.className = "burst-particle";
      particle.textContent = ["✦", "♡", "✧", "·"][i % 4];
      particle.style.left = `${e.clientX - rect.left}px`;
      particle.style.top = `${e.clientY - rect.top}px`;
      e.currentTarget.appendChild(particle);
      gsap.to(particle, {
        x: gsap.utils.random(-90, 90), y: gsap.utils.random(-100, 40),
        opacity: 0, scale: gsap.utils.random(.4, 1.5), rotation: gsap.utils.random(-90, 90),
        duration: gsap.utils.random(.7, 1.2), ease: "power2.out", onComplete: () => particle.remove()
      });
    }
  };

  const toggleMusic = () => {
    // Replace public/your-song.mp3 with a song you have permission to use.
    if (!audioRef.current) return;
    if (musicOn) audioRef.current.pause();
    else audioRef.current.play().catch(() => {});
    setMusicOn(!musicOn);
  };

  return (
    <main ref={pageRef}>
      <StarField />
      <div className="ambient ambient-a" /><div className="ambient ambient-b" />
      <audio ref={audioRef} loop src="/your-song.mp3" />
      <nav className="nav shell">
        <a className="brand" href="#home"><span className="brand-mark">✦</span> little universe</a>
        <div className="nav-links"><a href="#about">The feeling</a><a href="#memories">Little things</a><a href="#wish">A wish for you</a></div>
        <button className="music-button" onClick={toggleMusic} title="Toggle your added song">
          {musicOn ? <Volume2 size={16}/> : <VolumeX size={16}/>} <span>{musicOn ? "Music on" : "Music off"}</span>
        </button>
      </nav>

      <section className="hero shell" id="home" ref={heroRef}>
        <div className="hero-content">
          <div className="eyebrow"><span className="eyebrow-line"/> A SMALL CORNER OF THE COSMOS <Sparkles size={13}/></div>
          <h1 className="hero-title">Some people<br/>make life feel<br/><em>like magic.</em></h1>
          <p className="hero-copy">And this little universe? It's a reminder for one of them.<br className="desktop-break"/> A celebration of your laughter, your light, and the lovely human you are.</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#about" onClick={burst}>Explore your universe <ArrowDown size={16}/></a>
            <button className="text-button" onClick={() => setLetterOpen(true)}>A note for you <Heart size={15}/></button>
          </div>
          <div className="hero-footnote"><span className="tiny-heart">♥</span> Made with friendship, stardust & a little extra care</div>
        </div>
        <div className="orbit-art" aria-label="Illustration of a glowing planet and orbiting stars">
          <div className="orbit orbit-one"><i className="orbit-dot dot-a"/><i className="orbit-dot dot-b"/></div>
          <div className="orbit orbit-two"><i className="orbit-dot dot-c"/></div>
          <div className="planet-glow"/>
          <div className="planet-main"><div className="planet-shine"/><span>✦</span></div>
          <div className="floaty float-heart">♡</div><div className="floaty float-star">✧</div>
          <div className="floaty float-spark">✦</div><div className="planet-caption">YOU ARE A RARE<br/>KIND OF MAGIC</div>
        </div>
        <div className="scroll-cue"><span/> SCROLL TO WANDER</div>
      </section>

      <section className="intro-section shell section-pad" id="about">
        <div className="section-kicker reveal">01 / THE REASON</div>
        <div className="intro-layout">
          <div className="intro-heading reveal"><h2>Not every star<br/>needs to <em>shine loud.</em></h2></div>
          <div className="intro-text reveal">
            <p className="large-copy">Some just make the whole sky feel warmer.</p>
            <p>This is for the friend who makes ordinary moments memorable. The one whose presence can turn a random day into a story worth keeping.</p>
            <p>No big occasion. No special reason. Just a little reminder that you're appreciated — exactly as you are.</p>
            <button className="inline-link" onClick={() => setLetterOpen(true)}>There's a little note waiting <span>↗</span></button>
          </div>
        </div>
        <div className="quote-strip reveal"><span>“</span><p>In a universe full of billions of stars, I'm glad our paths crossed.</p><span>”</span></div>
      </section>

      <section className="memories-section section-pad" id="memories">
        <div className="shell">
          <div className="section-kicker reveal">02 / THE LITTLE THINGS</div>
          <div className="section-heading reveal"><h2>It's the little things<br/>that become <em>everything.</em></h2><p>Some moments don't need photographs to be remembered.</p></div>
          <div className="memory-grid">
            {memories.map((m, i) => <article className="memory-card" key={m.title}>
              <div className="card-number">0{i + 1}</div><div className="memory-icon">{m.icon}</div>
              <h3>{m.title}</h3><p>{m.text}</p><div className="card-star">✧</div>
            </article>)}
          </div>
        </div>
      </section>

      <section className="gift-section shell section-pad">
        <div className="gift-panel reveal">
          <div className="gift-copy"><div className="section-kicker">03 / A TINY SURPRISE</div><h2>A little box<br/>of <em>good things.</em></h2><p>There's no wrapping paper here. Just a few words I hope you'll keep.</p>
            <button className="button button-primary" onClick={(e) => { burst(e); setGiftOpen(true); }}>Open your surprise <Gift size={16}/></button>
          </div>
          <div className="gift-visual"><div className="gift-halo"/><div className="gift-box"><div className="gift-lid"/><div className="gift-ribbon-v"/><div className="gift-ribbon-h"/><span>✦</span></div><div className="gift-spark s1">✧</div><div className="gift-spark s2">♡</div><div className="gift-spark s3">✦</div></div>
        </div>
      </section>

      <section className="wish-section section-pad" id="wish">
        <div className="shell wish-inner reveal">
          <div className="wish-icon"><Moon size={24}/><Stars size={17}/></div>
          <div className="section-kicker">04 / A WISH FOR YOU</div>
          <h2>If I could send you<br/>one thing, it'd be <em>this.</em></h2>
          <p className="wish-text" key={wishIndex}>{wishes[wishIndex]}</p>
          <button className="button button-outline" onClick={() => setWishIndex((wishIndex + 1) % wishes.length)}>Another little wish <Sparkles size={15}/></button>
          <div className="wish-count">{String(wishIndex + 1).padStart(2, "0")} <span>/</span> 0{wishes.length}</div>
        </div>
      </section>

      <footer className="footer shell">
        <div className="footer-star">✦</div><p>To my favourite kind of human.</p><h2>Keep being <em>wonderful.</em></h2>
        <div className="footer-bottom"><span>MADE OF STARDUST & GOOD INTENTIONS</span><span>✧ &nbsp; WITH FRIENDSHIP &nbsp; ✧</span></div>
      </footer>

      {letterOpen && <div className="modal-backdrop" onClick={() => setLetterOpen(false)}>
        <div className="letter-modal" onClick={e => e.stopPropagation()}>
          <button className="modal-close" onClick={() => setLetterOpen(false)} aria-label="Close"><X size={18}/></button>
          <div className="letter-stamp">✦</div><div className="section-kicker">A NOTE FROM THE HEART</div>
          <h2>Hey, {name || "beautiful soul"}<span> ♡</span></h2>
          <p>Just in case nobody has reminded you lately: you're appreciated. Your kindness, your energy, your wonderfully unique way of being — it all matters.</p>
          <p>Thank you for the laughs, the random conversations, and all the little moments that make friendship feel like a gift.</p>
          <p>Keep growing, keep glowing, and never feel like you have to be anyone other than yourself.</p>
          <div className="letter-sign">Always cheering for you, <span>your friend ✨</span></div>
          <button className="inline-link edit-name" onClick={() => setNameEditing(!nameEditing)}>{nameEditing ? "Done editing" : "Personalise the greeting"} ↗</button>
          {nameEditing && <input className="name-input" value={name} onChange={e => setName(e.target.value)} placeholder="Type her name or nickname"/>}
        </div>
      </div>}

      {giftOpen && <div className="modal-backdrop" onClick={() => setGiftOpen(false)}>
        <div className="gift-modal" onClick={e => e.stopPropagation()}>
          <button className="modal-close" onClick={() => setGiftOpen(false)} aria-label="Close"><X size={18}/></button>
          <div className="gift-modal-icon">🌷</div><div className="section-kicker">YOUR SURPRISE</div>
          <h2>A bouquet of<br/><em>good wishes.</em></h2>
          <p>For the days you feel unstoppable — and especially for the days you don't. You're doing just fine. Take a breath, trust your journey, and remember that someone is always rooting for you.</p>
          <div className="flower-row">✿　❀　✿　❁　✿</div>
          <button className="button button-primary" onClick={() => setGiftOpen(false)}>Keep this close <Heart size={15}/></button>
        </div>
      </div>}
    </main>
  );
}

export default App;

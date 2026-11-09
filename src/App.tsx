import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Heart, Moon, Music2, Pause, Play, Sparkles, Sun } from 'lucide-react'
import { memories, parents, weddingSlides } from './data'

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: 'easeOut' as const } },
}

function getSilverAnniversaryDate(dateString: string) {
  const [year, month, day] = dateString.split('-').map(Number)
  return new Date(year + 25, month - 1, day)
}

function getCountdown(target: Date) {
  const totalSeconds = Math.max(0, Math.floor((target.getTime() - Date.now()) / 1000))
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  }
}

const silverAnniversaryDate = getSilverAnniversaryDate(parents.weddingDate)
type Theme = 'light' | 'dark'

function FloatingWeddingGallery({ isActive }: { isActive: boolean }) {
  const [active, setActive] = useState(0);

  const next = () => {
    setActive((current) =>
      (current + 1) % weddingSlides.length
    );
  };

  const previous = () => {
    setActive((current) =>
      (current - 1 + weddingSlides.length) % weddingSlides.length
    );
  };

  useEffect(() => {
    if (!isActive) return

    const timer = window.setInterval(next, 4800);
    return () => window.clearInterval(timer);
  }, [isActive]);

  return (
    <section className="floating-gallery">
      <div className="gallery-heading">
        <span>OUR JOURNEY · எங்கள் பயணம்</span>
        <h2>Moments that last forever.</h2>
        <p>அழகான நினைவுகள் என்றும் வாழும்</p>
      </div>

      <div className="gallery-stage">
        {weddingSlides.map((slide, index) => {
          const offset =
            (index - active + weddingSlides.length) %
            weddingSlides.length;

          const position =
            offset === 0
              ? 'center'
              : offset === 1
              ? 'right'
              : offset === weddingSlides.length - 1
              ? 'left'
              : 'hidden';

          return (
            <button
              key={slide.src}
              className={`floating-card ${position}`}
              onClick={() => setActive(index)}
              aria-label={`View ${slide.caption}`}
              tabIndex={position === 'hidden' ? -1 : 0}
            >
              <img src={slide.src} alt={slide.caption} />
              <div className="floating-card-caption">
                <span>{slide.caption}</span>
                <small>{slide.tamilCaption}</small>
              </div>
            </button>
          );
        })}
      </div>

      <div className="gallery-navigation">
        <button className="gallery-nav-button previous" onClick={previous} aria-label="Previous photo">
          <ArrowLeft size={17} strokeWidth={1.5} />
          <span>BACK</span>
        </button>

        <span>
          {String(active + 1).padStart(2, '0')}
          {' / '}
          {String(weddingSlides.length).padStart(2, '0')}
        </span>

        <button className="gallery-nav-button next" onClick={next} aria-label="Next photo">
          <ArrowRight size={17} strokeWidth={1.5} />
          <span>NEXT</span>
        </button>
      </div>

      <div className="gallery-progress">
        {weddingSlides.map((slide, index) => (
          <button
            key={slide.src}
            className={active === index ? 'selected' : ''}
            onClick={() => setActive(index)}
            aria-pressed={active === index}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

function App() {
  const [countdown, setCountdown] = useState(() => getCountdown(silverAnniversaryDate))
  const [theme, setTheme] = useState<Theme>(() => (
    localStorage.getItem('anniversary-theme') === 'light' ? 'light' : 'dark'
  ))
  const [hasEntered, setHasEntered] = useState(false)
  const [musicOn, setMusicOn] = useState(false)
  const [musicError, setMusicError] = useState('')
  const [showSlideshow, setShowSlideshow] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('anniversary-theme', theme)
  }, [theme])

  async function toggleMusic() {
    const audio = audioRef.current
    if (!audio) {
      setMusicError('The audio player is unavailable.')
      return
    }

    setMusicError('')
    if (!audio.paused) {
      audio.pause()
      setMusicOn(false)
      return
    }

    try {
      await audio.play()
      setMusicOn(true)
    } catch (error) {
      console.error('Unable to play the anniversary song:', error)
      setMusicOn(false)
      setMusicError('Could not play the song. Check that public/music/anniversary-song.mp3 exists and is a valid audio file.')
    }
  }

  async function enterStory() {
    const audio = audioRef.current
    if (!audio) {
      setMusicError('The audio player is unavailable.')
      setHasEntered(true)
      return
    }

    setMusicError('')
    try {
      await audio.play()
      setMusicOn(true)
    } catch (error) {
      console.error('Unable to start the anniversary song:', error)
      setMusicOn(false)
      setMusicError('Could not start the song. Check that public/music/anniversary-song.mp3 exists and is a valid audio file.')
    } finally {
      setHasEntered(true)
    }
  }

  useEffect(() => {
    const timer = window.setInterval(() => setCountdown(getCountdown(silverAnniversaryDate)), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const anniversaryDate = useMemo(
    () => silverAnniversaryDate.toLocaleDateString('en-IN', {
      day: 'numeric', month: 'long', year: 'numeric',
    }),
    [],
  )
  const anniversaryHeadingDate = useMemo(
    () => silverAnniversaryDate.toLocaleDateString('en-US', {
      day: 'numeric', month: 'long', year: 'numeric',
    }).toUpperCase(),
    [],
  )

  return (
    <main data-theme={theme}>
      <div className="paper-grain" aria-hidden="true" />
      <AnimatePresence>
        {!hasEntered && (
          <motion.section
            className="welcome-screen"
            aria-labelledby="welcome-title"
            aria-modal="true"
            role="dialog"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.65, ease: 'easeInOut' }}
          >
            <div className="welcome-frame">
              <div className="welcome-photo-wrap">
                <span className="welcome-tape" aria-hidden="true" />
                <img src="/images/parents-hero.jpeg" alt="Amma and Appa together" />
                <span className="welcome-photo-caption">a love through every season</span>
              </div>
              <div className="welcome-copy">
                <p className="welcome-eyebrow"><Sparkles size={13} /> A LITTLE SURPRISE FOR YOU</p>
                <h1 id="welcome-title">For Amma<br />& Appa, <em>with love.</em></h1>
                <p className="welcome-tamil">அன்பும் நினைவுகளும் நிறைந்த ஒரு பயணம்</p>
                <p className="welcome-message">Every page holds a memory. Every note comes from the heart.</p>
                <button className="welcome-enter-button" onClick={enterStory} autoFocus>
                  <Play size={15} fill="currentColor" />
                  <span>OPEN OUR STORY</span>
                  <Heart size={14} />
                </button>
                <span className="welcome-hint">TAP TO ENTER · MUSIC WILL BEGIN</span>
              </div>
              <span className="welcome-ornament" aria-hidden="true">✳</span>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
      <div className="site-content" inert={!hasEntered}>
      <nav className="topbar">
        <a className="brand" href="#home"><span className="brand-mark">✳</span> OUR LITTLE TIMELESS STORY</a>
        <div className="nav-links">
          <a href="#story">Our story</a>
          <a href="#memories">Memories</a>
          <a href="#letter">A letter</a>
        </div>
        <div className="topbar-actions">
          <button
            className="theme-button"
            onClick={() => setTheme((current) => current === 'light' ? 'dark' : 'light')}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
            <span>{theme === 'light' ? 'Dark mode' : 'Light mode'}</span>
          </button>
          <button className="music-button" onClick={toggleMusic} aria-label="Toggle music">
            {musicOn ? <Pause size={15} /> : <Play size={15} />}
            <span>{musicOn ? 'Pause music' : 'Our melody'}</span>
          </button>
        </div>
      </nav>
      <audio
        ref={audioRef}
        src="/music/anniversary-song.mp3"
        loop
        preload="none"
        onError={() => {
          setMusicOn(false)
          setMusicError('Could not load the song. Check that public/music/anniversary-song.mp3 exists and is a valid audio file.')
        }}
      />

      <section className="hero section-wrap" id="home">
        <motion.div className="hero-copy" initial="hidden" animate="visible" variants={fadeUp}>
          <p className="eyebrow"><Sparkles size={14} /> A scrapbook of love · அன்பின் நினைவுப் புத்தகம்</p>
          <h1>Some stories<br />are written <em>in the stars.</em></h1>
          <p className="hero-tamil">சில கதைகள் காலத்தால் அழியாதவை.</p>
          <p className="intro">
            A little collection of moments, memories and a love that keeps making
            every ordinary day feel extraordinary.
          </p>
          <a className="round-link" href="#story">TURN THE PAGE <ArrowDown size={15} /></a>
        </motion.div>

        <motion.div className="hero-art" initial={{ opacity: 0, rotate: 3, scale: .96 }} animate={{ opacity: 1, rotate: 0, scale: 1 }} transition={{ duration: 1 }}>
          <div className="tape tape-one" />
          <div className="photo-frame hero-photo">
            <img src="/images/parents-hero.jpeg" alt="A favourite photograph of Amma and Appa" />
            <span className="photo-caption">the beginning of forever</span>
          </div>
          <div className="handwritten hero-note">நீங்கள்தான்<br />எங்கள் உலகம் <Heart size={18} /></div>
          <div className="flower-stamp">LOVE<br /><span>always</span></div>
        </motion.div>
        <div className="hero-bottom">
          <span>EST. WITH LOVE</span>
          <a className="next-section-link" href="#story">SCROLL TO EXPLORE <ArrowDown size={13} /></a>
          <span>AMMA & APPA · FOREVER</span>
        </div>
      </section>

      <section className="intro-strip">
        <span className="tiny-star">✳</span>
        <p>ஒரு பயணம். இரண்டு இதயங்கள். எண்ணற்ற நினைவுகள்.</p>
        <span className="tiny-star">✳</span>
      </section>

      <section className="story section-wrap" id="story">
        <motion.div className="section-heading" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <p className="eyebrow">CHAPTER ONE · அத்தியாயம் ஒன்று</p>
          <h2>It was always<br /><em>meant to be.</em></h2>
          <p className="heading-tamil">இரு மனங்கள் இணைந்த அழகான பயணம்.</p>
        </motion.div>
        <div className="story-grid">
          <div className="story-image-wrap">
            <div className="tape tape-two" />
            <div className="photo-frame story-photo">
              <img src="/images/wedding-day.jpeg" alt="Wedding day memory" />
              <span className="photo-caption">a day to remember</span>
            </div>
            <span className="side-note">பாசத்துடன் என்றும்...</span>
          </div>
          <motion.div className="story-text" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <span className="big-quote">“</span>
            <p className="dropcap">Every great love story is made of little things: shared smiles, quiet strength, endless patience and choosing each other, every single day.</p>
            <p>Our story celebrates <strong>{parents.father} ({parents.fatherNickname})</strong> and <strong>{parents.mother} ({parents.motherNickname})</strong> — two wonderful people whose journey has given us a lifetime of memories and a home full of love.</p>
            <p className="tamil-paragraph">உங்கள் அன்பும், அரவணைப்பும், தியாகமும் எங்கள் வாழ்வின் மிகப்பெரிய பரிசு. நீங்கள் இருவரும் எங்களுக்கு என்றும் ஒரு அழகான முன்னுதாரணம்.</p>
            <span className="signature">With all our love, always.</span>
          </motion.div>
        </div>
        <div className="section-next">
          <a className="next-section-link" href="#memories">NEXT: OUR MEMORIES <ArrowDown size={13} /></a>
        </div>
      </section>

      <section className="memories-section" id="memories">
        <div className="section-wrap">
          <motion.div className="section-heading centered" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <p className="eyebrow">CHAPTER TWO · அத்தியாயம் இரண்டு</p>
            <h2>Little moments,<br /><em>big memories.</em></h2>
            <p className="heading-tamil">ஒவ்வொரு புகைப்படத்திலும் ஓர் அழகான கதை.</p>
          </motion.div>
          <div className="memory-grid">
            {memories.map((memory, index) => (
              <motion.article className={`memory-card card-${index + 1}`} key={memory.year}
                initial={{ opacity: 0, y: 35, rotate: index % 2 ? 3 : -3 }}
                whileInView={{ opacity: 1, y: 0, rotate: index % 2 ? 2 : -2 }}
                viewport={{ once: true }} transition={{ duration: .7, delay: index * .12 }}>
                <div className="tape card-tape" />
                <div className="polaroid">
                  <img src={memory.image} alt={memory.subtitle} />
                  <p>{memory.note}</p>
                </div>
                <div className="memory-copy">
                  <span className="memory-year">{memory.year}</span>
                  <h3>{memory.title}</h3>
                  <h4>{memory.subtitle}</h4>
                  <p>{memory.text}</p>
                </div>
              </motion.article>
            ))}
          </div>
          <p className="gallery-hint">YOUR PHOTOS WILL BRING THESE PAGES TO LIFE · உங்கள் நினைவுகள் இந்தப் பக்கங்களை உயிர்ப்பிக்கும்</p>
          <div className="section-next">
            <a className="next-section-link" href="#timeline">NEXT: A LIFETIME TOGETHER <ArrowDown size={13} /></a>
          </div>
        </div>
      </section>

      <section className="timeline-section section-wrap" id="timeline">
        <div className="timeline-title">
          <p className="eyebrow">CHAPTER THREE · அத்தியாயம் மூன்று</p>
          <h2>A lifetime<br /><em>side by side.</em></h2>
          <p>கை கோர்த்து நடந்த காலங்கள்...</p>
        </div>
        <div className="timeline">
          <div className="timeline-item"><span className="timeline-dot">✳</span><span className="timeline-label">THE FIRST HELLO</span><h3>ஒரு இனிய தொடக்கம்</h3><p>Two lives, one beautiful journey.</p></div>
          <div className="timeline-item"><span className="timeline-dot">♡</span><span className="timeline-label">A PROMISE FOR LIFE</span><h3>இணைந்த இதயங்கள்</h3><p>A promise to stand together, through everything.</p></div>
          <div className="timeline-item"><span className="timeline-dot">✿</span><span className="timeline-label">A FAMILY FULL OF LOVE</span><h3>அன்பான குடும்பம்</h3><p>Their love grew into the family we cherish.</p></div>
        </div>
        <div className="section-next">
          <a className="next-section-link" href="#letter">NEXT: A LETTER FOR YOU <ArrowDown size={13} /></a>
        </div>
      </section>

      <section className={`letter-section${showSlideshow ? ' is-slideshow-open' : ''}`} id="letter">
        <div className={`letter-composition${showSlideshow ? ' is-slideshow' : ''}`}>
          <FloatingWeddingGallery isActive={showSlideshow} />
          <div className="letter-paper" aria-hidden={showSlideshow}>
            <div className="letter-flower">✿</div>
            <h2>Dear Amma & Appa, <Heart size={20} fill="currentColor" /></h2>
            <p className="letter-tamil">அன்புள்ள அம்மா & அப்பா,</p>
            <p className="letter-body">Thank you for showing me what love looks like — not just in words, but in a lifetime of care, courage, patience and little sacrifices. Everything beautiful I know about family begins with you both.</p>
            <p className="letter-body tamil-body">என் வாழ்வின் ஒவ்வொரு அடியிலும் எனக்குத் துணையாக இருந்ததற்கு நன்றி. உங்கள் அன்பையும் உழைப்பையும் என்றும் மறக்க மாட்டேன். நீங்கள் இருவரும் ஆரோக்கியமாகவும் மகிழ்ச்சியாகவும் என்றும் ஒன்றாக வாழ வேண்டும் என்பதே என் ஆசை.</p>
            <p className="letter-sign">With endless love, <span>உங்கள் அன்பு...</span></p>
            <button className="letter-show-button" onClick={() => setShowSlideshow(true)}>
              <Play size={13} fill="currentColor" /> Begin the slideshow
            </button>
            <div className="letter-seal"><Heart size={19} fill="currentColor" /></div>
          </div>
        </div>
        <div className="section-next">
          <a className="next-section-link" href="#finale">NEXT: OUR WISH FOR YOU <ArrowDown size={13} /></a>
        </div>
      </section>

      <section className="finale section-wrap" id="finale">
        <div className="finale-spark">✳</div>
        <p className="eyebrow">{anniversaryHeadingDate} · நவம்பர் 10, 2027</p>
        <h2>And the best part<br />is that <em>it continues.</em></h2>
        <p className="finale-tamil">இனிய திருமண நாள் நல்வாழ்த்துகள் அம்மா & அப்பா!</p>
        <div className="countdown" aria-label="Countdown to the 25th anniversary">
          {([
            ['days', 'DAYS'],
            ['hours', 'HOURS'],
            ['minutes', 'MINS'],
            ['seconds', 'SECS'],
          ] as const).map(([unit, label]) => (
            <div className="countdown-unit" key={unit}>
              <span className="count-number">{String(countdown[unit]).padStart(2, '0')}</span>
              <span className="count-label">{label}</span>
            </div>
          ))}
        </div>
        <p className="date-line">COUNTING DOWN TO 25 YEARS OF LOVE · {anniversaryDate.toUpperCase()}</p>
        <div className="final-names">{parents.father} <span>&</span> {parents.mother}</div>
        <p className="nicknames">Vathiyar · Thaai Kizhavi</p>
        <Heart className="final-heart" size={22} fill="currentColor" />
        <div className="section-next">
          <a className="next-section-link" href="#home">BACK TO THE BEGINNING <ArrowDown size={13} /></a>
        </div>
      </section>

      <footer>
        <span>MADE WITH <Heart size={12} fill="currentColor" /> FOR AMMA & APPA</span>
        <span>ஒரு அழகான வாழ்க்கைக்கு, இன்னும் பல அழகான ஆண்டுகள்.</span>
        <a href="#home">BACK TO TOP ↑</a>
      </footer>

      {musicError && (
        <div className="music-toast">
          <Music2 size={16} /> {musicError}
          <button onClick={() => setMusicError('')} aria-label="Dismiss">×</button>
        </div>
      )}
      </div>
    </main>
  )
}

export default App

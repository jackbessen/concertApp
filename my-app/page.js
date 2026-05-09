import Link from 'next/link'
import './landing.css'

export default function Home() {
  return (
    <>
      <div className="noise" />

      <section className="hero">
        <div className="tag"><span className="tag-dot" /> Now in early access · New York City</div>
        <h1>Never miss a show from an artist you <em>actually</em> love.</h1>
        <p className="sub">Connect your Spotify. We'll watch the concert listings and alert you when your most-played artists are coming to NYC.</p>
        <div className="cta-group">
          <Link href="/api/auth/spotify" className="cta-btn">
            Connect Spotify
          </Link>
          <span className="cta-note">Free during beta · $5/mo when we launch</span>
        </div>
        <div className="scroll-hint">
          <span>scroll</span>
          <div className="scroll-line" />
        </div>
      </section>

      <div className="divider" />

      <section className="how">
        <p className="section-label">How it works</p>
        <div className="steps">
          <div className="step">
            <div className="step-num">01</div>
            <h3>Connect your Spotify</h3>
            <p>We read your top artists and listening frequency — the more you play someone, the higher they rank.</p>
          </div>
          <div className="step">
            <div className="step-num">02</div>
            <h3>We scan every NYC show</h3>
            <p>Clubs, arenas, rooftops — we track every venue and match upcoming dates against your taste profile.</p>
          </div>
          <div className="step">
            <div className="step-num">03</div>
            <h3>Get your weekly digest</h3>
            <p>Every Monday morning: your personalized show list, ranked by how obsessed you actually are with each artist.</p>
          </div>
        </div>
      </section>

      <section className="shows-section">
        <p className="section-label" style={{ marginBottom: '20px' }}>Your upcoming shows · this week</p>
        <div className="show-cards">
          <div className="show-card">
            <div className="show-date"><div className="month">May</div><div className="day">09</div></div>
            <div className="show-info"><div className="artist">Mk.gee</div><div className="venue">Brooklyn Steel</div></div>
            <div className="show-match">Your #2 artist</div>
          </div>
          <div className="show-card">
            <div className="show-date"><div className="month">May</div><div className="day">12</div></div>
            <div className="show-info"><div className="artist">Faye Webster</div><div className="venue">Terminal 5</div></div>
            <div className="show-match">Your #5 artist</div>
          </div>
          <div className="show-card">
            <div className="show-date"><div className="month">May</div><div className="day">17</div></div>
            <div className="show-info"><div className="artist">Men I Trust</div><div className="venue">Bowery Ballroom</div></div>
            <div className="show-match">Your #8 artist</div>
          </div>
          <div className="show-card" style={{ opacity: 0.4 }}>
            <div className="show-date"><div className="month">May</div><div className="day">21</div></div>
            <div className="show-info"><div className="artist">+ 4 more shows this month</div><div className="venue">Connect Spotify to see them all</div></div>
            <div className="show-match">Unlock all</div>
          </div>
        </div>
      </section>

      <div className="divider" />

      <section className="pricing">
        <h2>Simple pricing.</h2>
        <p className="sub">One plan. No tiers, no upsells. Just your shows.</p>
        <div className="price-card">
          <div className="price-amount">$5</div>
          <div className="price-period">per month</div>
          <ul className="price-features">
            <li><span className="check" />Spotify integration & weekly digest</li>
            <li><span className="check" />Ranked by your listening frequency</li>
            <li><span className="check" />All NYC venues covered</li>
            <li><span className="check" />Instant alerts for new announcements</li>
          </ul>
          <Link href="/api/auth/spotify" className="price-cta">
            Get early access — free
          </Link>
        </div>
      </section>

      <footer>
        <p>Built in <span>New York City</span> for people who actually go to shows.</p>
      </footer>
    </>
  )
}
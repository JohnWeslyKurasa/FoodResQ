import React, { useState } from 'react';
import {
  ChefHat,
  Cpu,
  QrCode,
  Heart,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  HelpCircle,
  ChevronDown,
  Building,
  Bike
} from 'lucide-react';

export default function HowItWorksPage({ onOpenAuth }) {
  const [openFaq, setOpenFaq] = useState(null);

  const steps = [
    {
      num: '01',
      title: 'Donors Log Surplus Food',
      subtitle: 'Fast, structured donation creation in <60 seconds',
      desc: 'Restaurants, hotels, caterers, and bakeries specify surplus portions, food category (Veg/Non-Veg/Bakery), preparation time, safe consumption window, and exact facility pickup door/gate.',
      details: [
        'Automatic allergen tagging (Gluten, Dairy, Nuts, Eggs)',
        'Precise portions & packaging classification',
        'Auto-calculated expiry & urgency countdown timer',
        'Direct door/kitchen map pin coordinates',
      ],
      icon: ChefHat,
      color: 'var(--primary-orange)',
      bg: 'var(--primary-orange-light)',
    },
    {
      num: '02',
      title: 'Explainable Smart Match Algorithm',
      subtitle: 'Transparent 5-factor scoring engine',
      desc: 'Instead of opaque claims, FoodResQ executes an explainable weighted compatibility calculation to rank and alert the most suitable verified recipients in real time.',
      details: [
        'Geographic Proximity (30% weight) — minimizes transit time',
        'Dietary Compatibility (25% weight) — matches recipient food needs',
        'Serving Capacity (20% weight) — ensures recipient can feed the quantity',
        'Pickup Urgency Window (15% weight) — prevents food spoilage',
        'Verification Trust Rating (10% weight) — prioritized vetted charities',
      ],
      icon: Cpu,
      color: 'var(--bright-green)',
      bg: 'var(--bright-green-light)',
    },
    {
      num: '03',
      title: 'Cryptographic OTP & QR Handover',
      subtitle: 'Zero double-booking, guaranteed authenticity',
      desc: 'When an NGO or volunteer claims a donation, a cryptographically generated 6-digit OTP and QR token is issued. Handover is physically verified on-site before release.',
      details: [
        'Single-use authentication token expires if unclaimed',
        'Eliminates phantom pickups and multiple claims',
        'Offline verification fallback code supported',
        'Timestamped chain of custody logged to audit trail',
      ],
      icon: QrCode,
      color: '#3B82F6',
      bg: '#EFF6FF',
    },
    {
      num: '04',
      title: 'Communities Fed & Verified Ledger',
      subtitle: 'Instant carbon offset and meal analytics',
      desc: 'The verified handover updates platform telemetry in real time. Meals served, kilograms diverted from landfills, and CO₂ offset credits are credited to the donor and charity.',
      details: [
        'Automatic EPA greenhouse gas offset calculation (2.5 kg CO₂/kg food)',
        'Downloadable ESG compliance & CSR impact certificates',
        'Real-time city impact heatmap updates',
        'Direct beneficiary feedback and safety ratings',
      ],
      icon: Heart,
      color: 'var(--deep-forest-green)',
      bg: 'var(--forest-green-surface)',
    },
  ];

  const faqs = [
    {
      q: 'Who is eligible to donate food on FoodResQ?',
      a: 'Any commercial food establishment with valid safety compliance can register: restaurants, hotels, banquet halls, corporate cafeterias, bakeries, grocery stores, and cloud kitchens.',
    },
    {
      q: 'How does FoodResQ guarantee food safety and hygiene?',
      a: 'Donors must declare preparation timestamps and safe consumption windows. All items must be packed hygienically. Listings reaching their expiry threshold are automatically marked critical and delisted if unsafe.',
    },
    {
      q: 'How are receiving NGOs and charities verified?',
      a: 'Our operations team vets every recipient organization, verifying registration certificates, serving facility addresses, daily beneficiary capacity, and operational credibility.',
    },
    {
      q: 'What role do volunteers play?',
      a: 'Volunteers provide critical last-mile logistics for large donations where the receiving shelter lacks its own transport. Volunteers accept dispatch alerts, collect the food using secure OTP, and transport it to the assigned shelter.',
    },
    {
      q: 'Is there any fee to use the FoodResQ platform?',
      a: 'No. FoodResQ is 100% free for charitable recipients, donors, and community rescue volunteers to ensure zero financial barriers to food redistribution.',
    },
  ];

  return (
    <div style={{ background: 'var(--cream-surface)', minHeight: '100vh', paddingBottom: '90px' }}>
      {/* Header Banner */}
      <section style={{ background: 'linear-gradient(135deg, #0F5132 0%, #166534 100%)', color: '#FFFFFF', padding: '64px 0 72px' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '780px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(8px)', padding: '6px 14px', borderRadius: 'var(--radius-full)', marginBottom: '16px', fontSize: '0.82rem', fontWeight: 700 }}>
            <Sparkles size={14} color="#FACC15" />
            <span>Closed-Loop Food Redistribution Network</span>
          </div>
          <h1 style={{ fontSize: '2.8rem', fontWeight: 800, color: '#FFFFFF', margin: '0 0 16px', letterSpacing: '-0.02em' }}>
            How FoodResQ Works
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'rgba(255, 255, 255, 0.88)', lineHeight: 1.6, margin: '0 auto 28px' }}>
            From commercial kitchens to community tables in under 3 hours. Powered by geospatial matching, cryptographic handover, and transparent impact verification.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => onOpenAuth ? onOpenAuth('register', 'donor') : null}
              className="btn-primary"
              style={{ padding: '12px 24px', fontSize: '0.95rem' }}
            >
              Join as Food Donor
            </button>
            <button
              onClick={() => onOpenAuth ? onOpenAuth('register', 'recipient') : null}
              className="btn-secondary"
              style={{ padding: '12px 24px', fontSize: '0.95rem', background: 'rgba(255,255,255,0.15)', color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.3)' }}
            >
              Register as NGO
            </button>
          </div>
        </div>
      </section>

      {/* 4 Pipeline Steps */}
      <div className="container" style={{ marginTop: '-36px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="card"
                style={{
                  padding: '36px',
                  display: 'grid',
                  gridTemplateColumns: 'minmax(280px, 1fr) minmax(300px, 1.2fr)',
                  gap: '36px',
                  alignItems: 'center',
                  borderLeft: `5px solid ${step.color}`,
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '14px',
                        background: step.bg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: step.color,
                      }}
                    >
                      <Icon size={24} />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: step.color, letterSpacing: '0.05em' }}>
                        PHASE {step.num}
                      </span>
                      <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--deep-forest-green)', margin: 0 }}>
                        {step.title}
                      </h3>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--primary-orange)', margin: '0 0 10px' }}>
                    {step.subtitle}
                  </p>
                  <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                    {step.desc}
                  </p>
                </div>

                <div
                  style={{
                    background: 'var(--cream-surface)',
                    padding: '24px',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <h4 style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--deep-forest-green)', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 12px' }}>
                    Key Capabilities & Safeguards
                  </h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {step.details.map((detail, dIdx) => (
                      <li key={dIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.88rem', color: 'var(--dark-text)' }}>
                        <CheckCircle2 size={16} color="var(--bright-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* 3 User Personas Quick Guide */}
        <div style={{ marginTop: '64px' }}>
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 36px' }}>
            <h2 style={{ fontSize: '2.1rem', color: 'var(--deep-forest-green)', margin: '0 0 8px' }}>
              Built for Every Stakeholder
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Designed with bespoke interfaces and tools for donors, charities, and rescue agents.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <div className="card" style={{ padding: '28px', borderTop: '4px solid var(--primary-orange)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <ChefHat size={24} color="var(--primary-orange)" />
                <h3 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--deep-forest-green)' }}>Food Donors</h3>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '16px' }}>
                Post daily surplus in seconds. Track pickup status, verify handovers with OTP, and generate downloadable ESG sustainability certificates.
              </p>
              <button
                onClick={() => onOpenAuth ? onOpenAuth('register', 'donor') : null}
                className="btn-outline btn-sm"
                style={{ width: '100%', borderColor: 'var(--primary-orange)', color: 'var(--primary-orange)' }}
              >
                Register as Donor →
              </button>
            </div>

            <div className="card" style={{ padding: '28px', borderTop: '4px solid var(--bright-green)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <Heart size={24} color="var(--bright-green)" />
                <h3 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--deep-forest-green)' }}>Verified NGOs</h3>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '16px' }}>
                Receive instant priority alerts when surplus matching your food categories is posted within your radius. Claim portions with 1 click.
              </p>
              <button
                onClick={() => onOpenAuth ? onOpenAuth('register', 'recipient') : null}
                className="btn-outline btn-sm"
                style={{ width: '100%', borderColor: 'var(--bright-green)', color: 'var(--bright-green)' }}
              >
                Register as NGO →
              </button>
            </div>

            <div className="card" style={{ padding: '28px', borderTop: '4px solid #3B82F6' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <Bike size={24} color="#3B82F6" />
                <h3 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--deep-forest-green)' }}>Rescue Volunteers</h3>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '16px' }}>
                Bridge the transport gap. Accept open delivery requests, navigate to pickup spots, and feed shelters across your city.
              </p>
              <button
                onClick={() => onOpenAuth ? onOpenAuth('register', 'volunteer') : null}
                className="btn-outline btn-sm"
                style={{ width: '100%', borderColor: '#3B82F6', color: '#3B82F6' }}
              >
                Join Volunteer Fleet →
              </button>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div style={{ marginTop: '70px', maxWidth: '780px', margin: '70px auto 0' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <h2 style={{ fontSize: '2.1rem', color: 'var(--deep-forest-green)', margin: '0 0 8px' }}>
              Frequently Asked Questions
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Everything you need to know about food safety, matching, and pickup protocols.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {faqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={i}
                  className="card"
                  style={{
                    padding: '20px 24px',
                    cursor: 'pointer',
                    transition: 'var(--transition)',
                  }}
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--deep-forest-green)', margin: 0 }}>
                      {faq.q}
                    </h4>
                    <ChevronDown
                      size={18}
                      color="var(--text-muted)"
                      style={{
                        transform: isOpen ? 'rotate(180deg)' : 'none',
                        transition: 'transform 0.2s',
                        flexShrink: 0,
                      }}
                    />
                  </div>
                  {isOpen && (
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: '14px 0 0', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

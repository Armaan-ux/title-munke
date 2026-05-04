import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Footer from "../Home/footer";
import Navbar from "../Home/navbar";

// ── helper: build a flat TOC from sections ──────────────────────────────────
const TOC = [
  { id: "s1", label: "1. Eligibility & Account Registration" },
  { id: "s2", label: "2. Description of Services" },
  { id: "s3", label: "3. Important Disclaimers" },
  { id: "s4", label: "4. Subscriptions, Fees & Payment" },
  { id: "s5", label: "5. License Grant & Intellectual Property" },
  { id: "s6", label: "6. Acceptable Use" },
  { id: "s7", label: "7. API Access & Rate Limits" },
  { id: "s8", label: "8. Third-Party Services & Data" },
  { id: "s9", label: "9. User Content & Submissions" },
  { id: "s10", label: "10. Copyright & DMCA Notices" },
  { id: "s11", label: "11. Confidentiality" },
  { id: "s12", label: "12. Export Controls & Sanctions" },
  { id: "s13", label: "13. Disclaimers of Warranties" },
  { id: "s14", label: "14. Limitation of Liability" },
  { id: "s15", label: "15. Indemnification" },
  { id: "s16", label: "16. Term & Termination" },
  { id: "s17", label: "17. Dispute Resolution" },
  { id: "s18", label: "18. General Provisions" },
  { id: "s19", label: "19. Contact" },
];

function scrollTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function TermsAndConditions() {
  const [active, setActive] = useState("s1");
  const [mobileOpen, setMobileOpen] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    TOC.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div
      style={{
        fontFamily: "'Poppins', sans-serif",
        background: "#fefefe",
        color: "#0a0a0a",
        minHeight: "100vh",
      }}
    >
      {/* ── NAV ── */}
      <Navbar />

      {/* ── HERO BAND ── */}
      <div
        style={{
          background:
            "linear-gradient(135deg, #3d2014 0%, #5d4135 60%, #987555 100%)",
          padding: "64px 40px 56px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            color: "#e8d0a7",
            fontSize: "13px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: "12px",
            fontWeight: 500,
          }}
        >
          Legal
        </p>
        <p
          style={{
            fontFamily: "'PT Serif', serif",
            fontSize: "clamp(32px,5vw,54px)",
            color: "#fff",
            margin: "0 0 16px",
            lineHeight: 1.15,
          }}
        >
          Terms &amp; Conditions
        </p>
        <p style={{ color: "#e8d0a7", fontSize: "14px", margin: 0 }}>
          Effective Date: May 1, 2026 &nbsp;·&nbsp; Last Updated: May 1, 2026
        </p>
      </div>

      {/* ── BODY ── */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "48px 24px 80px",
          display: "flex",
          gap: "48px",
          alignItems: "flex-start",
        }}
      >
        {/* Sidebar TOC */}
        <aside
          style={{
            width: "240px",
            flexShrink: 0,
            position: "sticky",
            top: "90px",
            maxHeight: "calc(100vh - 110px)",
            overflowY: "auto",
            paddingRight: "16px",
          }}
        >
          <p
            style={{
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#987555",
              marginBottom: "12px",
            }}
          >
            Contents
          </p>
          {TOC.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                padding: "6px 12px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                fontSize: "13px",
                lineHeight: 1.45,
                background: active === id ? "#f5f0ec" : "transparent",
                color: active === id ? "#3d2014" : "#737373",
                fontWeight: active === id ? 600 : 400,
                transition: "all 0.15s",
                marginBottom: "2px",
              }}
            >
              {label}
            </button>
          ))}
        </aside>

        {/* Content */}
        <main ref={contentRef} style={{ flex: 1, maxWidth: "760px" }}>
          <p
            style={{
              fontSize: "15px",
              lineHeight: 1.85,
              color: "#3d2014",
              marginBottom: "36px",
              padding: "20px 24px",
              background: "#f5f0ec",
              borderRadius: "10px",
              borderLeft: "4px solid #987555",
            }}
          >
            These Terms and Conditions (the "Terms") constitute a binding legal
            agreement between you ("you," "your," or "User") and Title Munke
            ("Title Munke," "we," "us," or "our") governing your access to and
            use of the Title Munke website located at{" "}
            <a href="https://titlemunke.com/" style={{ color: "#987555" }}>
              https://titlemunke.com/
            </a>{" "}
            and any related software, dashboards, data feeds, APIs, reports, and
            other services we make available (collectively, the "Services").By
            accessing or using the Services, creating an account, or clicking to
            accept these Terms, you agree to be bound by them. If you do not
            agree, you must not access or use the Services.
          </p>

          <Section id="s1" title="1. Eligibility and Account Registration">
            <Sub title="1.1 Eligibility">
              You must be at least 18 years old and legally capable of entering
              into a binding contract under the laws of your jurisdiction to use
              the Services. If you are using the Services on behalf of an entity
              (such as a law firm, title agency, real estate brokerage,
              investment fund, or other organization), you represent and warrant
              that you have authority to bind that entity to these Terms, and
              "you" refers to both you individually and that entity.
            </Sub>
            <Sub title="1.2 Account Creation">
              To access certain features, you must create an account. You agree
              to provide accurate, current, and complete information during
              registration and to keep that information updated. You are
              responsible for maintaining the confidentiality of your login
              credentials and for all activity that occurs under your
              account.You agree to notify us immediately of any unauthorized
              access or suspected breach.
            </Sub>
            <Sub title="1.3 One Account Per User">
              Unless otherwise agreed in writing, each individual user must
              maintain a separate account. Sharing of credentials across
              multiple individuals is prohibited and may result in account
              suspension or termination.
            </Sub>
          </Section>

          <Section id="s2" title="2. Description of Services">
            <p style={bodyStyle}>
              Title Munke provides a software platform that aggregates,
              organizes, and presents publicly available property and land
              records data from county recorders, sheriff's offices, tax
              assessment offices, and other governmental and third-party
              sources. The Services may include, without limitation:
            </p>
            <BulletList
              items={[
                "Search and retrieval of recorded deeds, mortgages, liens, judgments, assignments, releases, and other instruments;",
                "Property assessment, ownership, and tax data;",
                "Sheriff sale and foreclosure listings, including upset prices, judgment amounts, and related metadata;",
                "Title research workflows, report generation, and analytical dashboards;",
                "Data exports, integrations, and APIs.",
              ]}
            />
            <p style={bodyStyle}>
              The specific features available to you may depend on your
              subscription tier, role, and any separately negotiated agreement.
            </p>
            <Sub title="2.1 Service Modifications">
              We reserve the right to modify, suspend, or discontinue all or any
              part of the Services at any time, with or without notice. We will
              use reasonable efforts to provide advance notice of material
              changes that materially reduce the functionality available to paid
              subscribers.
            </Sub>
            <Sub title="2.2 Beta and Early-Access Features">
              From time to time we may make features available on a "beta,"
              "preview," "early access," "experimental," or similar basis (each
              a "Beta Feature"). Beta Features are provided "as is" and "as
              available," may contain bugs or errors, may produce inaccurate or
              unexpected results, may be modified or withdrawn at any time, and
              are excluded from any service-level commitment, support
              obligation, or refund right that would otherwise apply. Your use
              of a Beta Feature is voluntary, and you assume all risk associated
              with that use. We may collect additional telemetry from Beta
              Features to evaluate and improve them.
            </Sub>
            <Sub title="2.3 No Service-Level Commitment">
              Except as expressly set forth in a separately signed service-level
              agreement or order form, the Services are provided without any
              guaranteed level of availability, uptime, response time, or
              support. We use commercially reasonable efforts to keep the
              Services available but do not commit to any particular uptime
              percentage, and scheduled maintenance, third-party outages
              (including outages affecting county data sources, mapping
              providers, payment processors, or cloud infrastructure), and
              force-majeure events may interrupt access. Service credits,
              refunds, or other remedies for downtime are not available unless
              expressly provided in a separate written agreement.
            </Sub>
          </Section>

          <Section
            id="s3"
            title="3. Not a Substitute for Title Insurance, Legal Advice, or Professional Title Examination - Important Disclaimers"
          >
            <div
              style={{
                background: "#fff8f0",
                border: "1px solid #e8d0a7",
                borderRadius: "10px",
                padding: "16px 20px",
                marginBottom: "20px",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#550000",
                  letterSpacing: "0.03em",
                }}
              >
                PLEASE READ THIS SECTION CAREFULLY. IT LIMITS THE USE FOR WHICH
                OUR SERVICES ARE PROVIDED.
              </p>
            </div>
            <Sub title="3.1 Not a Title Insurance Company">
              Title Munke is not a title insurance company, title agency,
              abstracter, or settlement agent. We do not issue title insurance
              policies, title commitments, title binders, closing protection
              letters, or any other product regulated under Pennsylvania's Title
              Insurance Companies Act (40 P.S. § 910-1 et seq.) or the laws of
              any other jurisdiction. The Services do not constitute, and must
              not be relied upon as, a certified title search, title
              examination, abstract of title, or opinion of title.
            </Sub>
            <Sub title="3.2 Not Legal Advice">
              Title Munke is not a law firm and does not provide legal advice.
              No attorney-client relationship is formed by your use of the
              Services. The information provided through the Services is for
              informational and research purposes only and is not a substitute
              for the advice of a licensed attorney. You should consult an
              attorney licensed in the relevant jurisdiction before making any
              decision involving real property rights, title, foreclosure, lien
              priority, or related matters.
            </Sub>
            <Sub title="3.3 No Guarantee of Accuracy">
              The Services aggregate data from public records and third-party
              sources. We do not guarantee the accuracy, completeness, currency,
              or reliability of any data presented through the Services. Public
              records may contain errors, omissions, indexing mistakes,
              scrivener's errors, recording delays, missing instruments, or
              stale information. Information that appears in our system may not
              reflect the most recent activity at the relevant county recorder's
              office or court, and information that does not appear in our
              system may nevertheless exist of record. Off-record matters —
              including but not limited to unrecorded easements, boundary
              disputes, mechanics' liens not yet recorded, parties in
              possession, and matters disclosed by accurate survey — will not
              appear in the Services.
            </Sub>
            <Sub title="3.4 No Reliance for Closing or Underwriting">
              You agree that you will not rely on the Services as the sole basis
              for any real estate closing, title insurance underwriting
              decision, lending decision, foreclosure decision, sheriff sale
              bid, investment decision, or other transaction involving real
              property. Any decision made in reliance on the Services is made at
              your sole risk.
            </Sub>
            <Sub title="3.5 Independent Verification Required">
              You agree to independently verify all information obtained from
              the Services through primary sources (such as the official county
              recorder's office, prothonotary, court of common pleas, or tax
              assessment office) before taking any action in reliance on it.
            </Sub>
          </Section>

          <Section id="s4" title="4. Subscriptions, Fees, and Payment">
            <Sub title="4.1 Fees">
              Access to certain Services requires payment of fees. Fees, billing
              cycles, and included usage limits are set forth on the Site, in
              your order form, or in a separate written agreement. All fees are
              stated in U.S. dollars and are exclusive of applicable taxes,
              which you are responsible for paying.
            </Sub>
            <Sub title="4.2 Auto-Renewal and California Disclosures">
              <p style={bodyStyle}>
                Unless otherwise stated, subscriptions automatically renew at
                the end of each billing cycle for successive periods of the same
                length as your initial term, at the then-current rate, until you
                cancel. By starting a subscription, you authorize us (or our
                payment processor) to charge the payment method on file for each
                renewal term.{" "}
                <strong>
                  FOR CALIFORNIA RESIDENTS AND OTHERS WHERE REQUIRED BY LAW
                  (Cal. Bus. & Prof. Code § 17600 et seq.): Your subscription
                  will automatically renew at the end of each billing cycle. The
                  renewal charge will be billed to the payment method you
                  provided. The renewal price will be the rate then in effect
                  (which may differ from your initial promotional rate). You may
                  cancel at any time before your next renewal to avoid being
                  charged. To cancel, log in to your account and select "Cancel
                  Subscription" in your billing settings, or email
                </strong>{" "}
                <a
                  href="mailto:titlemunke@gmail.com"
                  style={{ color: "#987555" }}
                >
                  titlemunke@gmail.com{" "}
                </a>
                <strong>
                  with the subject "Cancel Subscription." Cancellation takes
                  effect at the end of your then-current billing period. Where
                  required by California Bus. & Prof. Code § 17602, we will
                  provide a renewal reminder by email (a) between three (3) and
                  twenty-one (21) days before any charge that follows a free or
                  promotional trial converting into a paid subscription, and (b)
                  between fifteen (15) and forty-five (45) days before any
                  automatic renewal of a subscription with a term of one (1)
                  year or longer.
                </strong>
              </p>
            </Sub>
            <Sub title="4.3 No Refunds">
              Except where required by law (including the EU/UK consumer rights
              described in Section 4.7) or expressly stated in a separate
              written agreement, all fees are non-refundable, including for
              partial billing periods, unused features, or accounts terminated
              for breach.
            </Sub>
            <Sub title="4.4 Late Payments">
              Past-due amounts accrue interest at the lesser of 1.5% per month
              or the maximum rate permitted by law. We may suspend access to the
              Services for any account with past-due amounts.
            </Sub>
            <Sub title="4.5 Price Changes">
              We may change pricing for any subscription tier upon at least
              thirty (30) days' notice. Price changes take effect at the start
              of the next renewal term following the notice period.
            </Sub>
            <Sub title="4.6 Free Trials and Promotional Access">
              <p style={bodyStyle}>
                Free trials and promotional access may be offered subject to
                additional terms posted at the time of the offer. Unless
                otherwise stated, at the end of a free trial your subscription
                will convert to a paid subscription at the then-current rate and
                your payment method will be charged. We reserve the right to
                modify or terminate free trials at any time.{" "}
                <strong>
                  FREE-TRIAL-TO-PAID CONVERSION DISCLOSURE (CALIFORNIA AND
                  OTHERS WHERE REQUIRED BY LAW): If you sign up for a free or
                  discounted trial that automatically converts into a paid
                  subscription, we will (a) clearly and conspicuously disclose
                  the trial offer terms — including the duration of the trial,
                  the price of the post-trial subscription, and the cancellation
                  method — at the point of sale, (b) obtain your affirmative
                  consent to the trial offer terms before charging you, and (c)
                  provide an acknowledgment of the trial offer terms in a manner
                  that is capable of being retained by you. You may cancel
                  before the trial ends to avoid being charged. To cancel,
                  follow the cancellation method described in Section 4.2.
                </strong>
              </p>
            </Sub>
            <Sub title="4.7 EU/UK Consumer Withdrawal Right">
              <p style={bodyStyle}>
                post-trial subscription, and the cancellation method — at the
                point of sale, (b) obtain your affirmative consent to the trial
                offer terms before charging you, and (c) provide an
                acknowledgment of the trial offer terms in a manner that is
                capable of being retained by you. You may cancel before the
                trial ends to avoid being charged. To cancel, follow the
                cancellation method described in Section 4.2.{" "}
                <a
                  href="mailto:titlemunke@gmail.com"
                  style={{ color: "#987555" }}
                >
                  titlemunke@gmail.com
                </a>{" "}
                with the subject "EU/UK Withdrawal" before the 14-day period
                expires.
                <br />
                Where you wish to access the Services during the 14-day
                withdrawal period, applicable EU and UK consumer law requires
                that you (i) make an express request that performance of the
                Services begin during the withdrawal period, and (ii)
                acknowledge that you will lose your right of withdrawal once the
                Services have been fully performed. We obtain this express
                request and acknowledgment from you at the point of subscription
                through a clear and conspicuous opt-in mechanism. If you have
                not provided that express request and acknowledgment,
                performance will not begin until the 14-day withdrawal period
                has expired.
                <br />
                If you withdraw after performance has begun at your express
                request, you must pay an amount proportionate to the Services
                provided up to the point of withdrawal. We will refund any
                remaining amount within fourteen (14) days of receiving your
                withdrawal notice, using the same means of payment used for the
                original transaction.
              </p>
            </Sub>
          </Section>

          <Section id="s5" title="5. License Grant and Intellectual Property">
            <Sub title="5.1 License to Use the Services">
              Subject to your compliance with these Terms and timely payment of
              all fees, Title Munke grants you a limited, non-exclusive,
              non-transferable, non-sublicensable, revocable license to access
              and use the Services for your internal business purposes (or for
              personal, non-commercial use, where applicable to your
              subscription tier).
            </Sub>
            <Sub title="5.2 Title Munke's Intellectual Property">
              The Services, including all software, code, dashboards, reports,
              user interfaces, designs, logos, trademarks, compilations,
              organization, presentation, and aggregation of data, are owned by
              Title Munke or its licensors and are protected by U.S. and
              international copyright, trademark, trade secret, and other
              intellectual property laws. Except for the limited license
              expressly granted above, no rights are granted to you, whether by
              implication, estoppel, or otherwise.
            </Sub>
            <Sub title="5.3 Restrictions on Use">
              <p style={bodyStyle}>
                You agree that you will not, and will not permit any third party
                to::
              </p>
              <BulletList
                items={[
                  "Copy, reproduce, modify, translate, or create derivative works of the Services or any data made available through the Services, except as expressly permitted.",
                  "Resell, sublicense, lease, rent, or commercially redistribute the Services or bulk data extracts to third parties.",
                  "Scrape, crawl, harvest, or use any automated means to extract data from the Services other than through APIs we make expressly available for that purpose.",
                  "Reverse engineer, decompile, or disassemble any portion of the Services, or attempt to derive source code from compiled code.",
                  "Use the Services to build a competing product or to benchmark for competitive purposes.",
                  "Remove, obscure, or alter any proprietary notices on the Services.",
                  "Use the Services in any manner that could disable, overburden, damage, or impair the Services or interfere with any other party's use.",
                  "Use the Services to violate the law or the rights of any third party.",
                ]}
              />
            </Sub>
            <Sub title="5.4 Output and Reports">
              Reports, exports, and analytical outputs you generate through the
              Services ("Outputs") may be used for your internal business
              purposes and lawful client deliverables, but may not be repackaged
              or resold as a standalone data product. Outputs may incorporate
              underlying public records data; your use of such data is subject
              to applicable public records laws.
            </Sub>
            <Sub title="5.5 Feedback">
              Reports, exports, and analytical outputs you generate through the
              Services ("Outputs") may be used for your internal business
              purposes and lawful client deliverables, but may not be repackaged
              or resold as a standalone data product. Outputs may incorporate
              underlying public records data; your use of such data is subject
              to applicable public records laws.
            </Sub>
            <Sub title="5.6 Publicity and Logo Use">
              Subject to any restrictions you communicate to us in writing, you
              grant Title Munke a limited, royalty-free, worldwide,
              non-exclusive license to use your name, logo, and trademarks
              solely to identify you as a customer of Title Munke on our Site,
              in customer lists, in pitch materials, and in similar marketing
              materials, in each case in accordance with any trademark usage
              guidelines you reasonably provide. You may revoke this permission
              at any time as to future use by emailing
              <a
                href="mailto:titlemunke@gmail.com"
                style={{ color: "#987555" }}
              >
                titlemunke@gmail.com
              </a>{" "}
              Subject to any restrictions you communicate to us in writing, you
              grant Title Munke a limited, royalty-free, worldwide,
              non-exclusive license to use your name, logo, and trademarks
              solely to identify you as a customer of Title Munke on our Site,
              in customer lists, in pitch materials, and in similar marketing
              materials, in each case in accordance with any trademark usage
              guidelines you reasonably provide. You may revoke this permission
              at any time as to future use by emailing
            </Sub>
          </Section>

          <Section id="s6" title="6. Acceptable Use">
            <p style={bodyStyle}>You agree not to use the Services to:</p>
            <BulletList
              items={[
                "Stalk, harass, defame, threaten, or harm any individual;",
                "Attempt to identify, locate, or compile profiles of individuals based on race, ethnicity, religion, immigration status, or other protected characteristics",
                "Engage in any activity that violates the Fair Credit Reporting Act (15 U.S.C. § 1681 et seq.), the Driver's Privacy Protection Act, the Pennsylvania Unfair Trade Practices and Consumer Protection Law, or other applicable consumer protection or privacy laws",
                "Make tenant screening, employment, credit, insurance underwriting, or similar consumer-impacting decisions in a manner that requires use of a 'consumer reporting agency' — Title Munke is not a consumer reporting agency, and the Services do not constitute 'consumer reports' as those terms are defined under the Fair Credit Reporting Act",
                "Engage in mortgage fraud, deed fraud, sheriff sale collusion, or any other unlawful real estate practice.",
                "Misrepresent your identity or affiliation with any person or entity.",
                "Transmit malware, viruses, or other harmful code.",
                "Probe, scan, or test the vulnerability of the Services or breach any security or authentication measures.",
              ]}
            />
            <p style={{ ...bodyStyle, marginTop: "12px" }}>
              Violation of this Section 6 is a material breach of these Terms
              and may result in immediate termination, in addition to any other
              remedies available at law
            </p>
          </Section>

          <Section id="s7" title="7. API Access, Rate Limits, and Fair Use">
            <p style={bodyStyle}>
              If you are granted access to any application programming interface
              ("API") that we make available, your use of that API is subject to
              these Terms and to any additional API documentation, rate limits,
              or developer policies we publish or otherwise provide to you.
            </p>
            <p style={bodyStyle}>You agree that you will:</p>
            <BulletList
              items={[
                "Access the API only with a valid API key issued to you and keep that key confidential",
                "Comply with all rate limits, quotas, and request-volume thresholds we publish or communicate to you",
                "Not attempt to circumvent rate limits, quotas, or other technical restrictions, including by rotating IP addresses, distributing requests across multiple accounts, or using automated retry patterns intended to disguise excess volume",
                "Cache API responses only as expressly permitted and refresh cached data within the timeframes we specify",
                "Identify yourself in a clear and accurate User-Agent string",
                "Not use the API in a way that imposes an unreasonable or disproportionately large load on the Services.",
              ]}
            />
            <p style={{ ...bodyStyle, marginTop: "12px" }}>
              We may throttle, suspend, or revoke API access if we determine
              that your use exceeds applicable limits, jeopardizes Service
              stability or security, or violates these Terms. We may modify API
              endpoints, parameters, response formats, and rate limits at any
              time and will provide reasonable advance notice of materially
              incompatible changes where practicable
            </p>
          </Section>

          <Section id="s8" title="8. Third-Party Services and Data">
            <p style={bodyStyle}>
              The Services rely on, integrate with, or display data from
              third-party sources, including county recorders, sheriff's
              offices, courts, tax assessment offices, mapping providers (such
              as Google Maps), and other data vendors. We do not control these
              third parties, are not responsible for their content or
              availability, and disclaim all liability for any errors, outages,
              or other issues arising from third-party services or data. Your
              use of third-party services may be subject to their own terms.
            </p>
          </Section>

          <Section id="s9" title="9. User Content and Submissions">
            <p style={bodyStyle}>
              The Services rely on, integrate with, or display data from
              third-party sources, including county recorders, sheriff's
              offices, courts, tax assessment offices, mapping providers (such
              as Google Maps), and other data vendors. We do not control these
              third parties, are not responsible for their content or
              availability, and disclaim all liability for any errors, outages,
              or other issues arising from third-party services or data. Your
              use of third-party services may be subject to their own terms.
            </p>
          </Section>

          <Section id="s10" title="10. Copyright and DMCA Notices">
            <p style={bodyStyle}>
              Title Munke respects the intellectual property rights of others
              and complies with the Digital Millennium Copyright Act ("DMCA"),
              17 U.S.C. § 512. If you believe that material accessible on or
              from the Services infringes your copyright, you may submit a
              notice of claimed infringement to our designated agent.
            </p>
            <Sub title="10.1 Designated DMCA Agent">
              <p style={bodyStyle}>
                Notices of claimed copyright infringement should be sent to:
              </p>

              <div
                style={{
                  background: "#f5f0ec",
                  borderRadius: "10px",
                  padding: "24px 28px",
                }}
              >
                <p
                  style={{
                    margin: "0 0 6px",
                    fontSize: "14px",
                    color: "#554536",
                  }}
                ></p>
                <p style={bodyStyle}>
                  <strong>DMCA Designated Agent — Title Munke</strong>
                  <br />
                  Email:{" "}
                  <a
                    href="mailto:titlemunke@gmail.com"
                    style={{ color: "#987555" }}
                  >
                    titlemunke@gmail.com
                  </a>{" "}
                  (subject: "DMCA Notice")
                  <br />
                  Mail: Title Munke, DMCA Agent, 2041 Lawfer Ave, Allentown, PA
                  18104
                </p>
              </div>
            </Sub>
            <Sub title="10.2 Contents of a DMCA Notice">
              <p style={bodyStyle}>
                To be effective, a DMCA notice must be in writing and include
                substantially the following:
              </p>
              <BulletList
                items={[
                  "A physical or electronic signature of the copyright owner or a person authorized to act on the owner's behalf",
                  "Identification of the copyrighted work claimed to have been infringed (or, if multiple works, a representative list)",
                  "Identification of the material claimed to be infringing, with sufficient detail to permit us to locate it (such as a URL)",
                  "Your contact information, including name, address, telephone number, and email",
                  "A statement that you have a good-faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law",
                  "A statement, made under penalty of perjury, that the information in the notice is accurate and that you are the owner of, or authorized to act on behalf of the owner of, the copyright that is allegedly infringed",
                ]}
              />
            </Sub>
            <Sub title="10.3 Counter-Notices">
              If material you submitted has been removed in response to a DMCA
              notice and you believe the removal was the result of mistake or
              misidentification, you may submit a counter-notice to the address
              above containing the elements required by 17 U.S.C. § 512(g)(3).
            </Sub>
            <Sub title="10.4 Repeat Infringers">
              We will, in appropriate circumstances and at our discretion,
              terminate accounts of users who are determined to be repeat
              infringers.
            </Sub>
          </Section>

          <Section id="s11" title="11. Confidentiality">
            <p style={bodyStyle}>
              Each party may have access to confidential information of the
              other in connection with the Services. The receiving party will
              use the disclosing party's confidential information only as
              necessary to perform under these Terms and will protect it using
              the same degree of care it uses for its own confidential
              information (and no less than reasonable care). Confidential
              information does not include information that is or becomes
              publicly available, was independently developed, was rightfully
              received from a third party without restriction, or is required to
              be disclosed by law (provided reasonable advance notice is given
              where permitted).
            </p>
          </Section>

          <Section id="s12" title="12. Export Controls and Sanctions">
            <p style={bodyStyle}>
              The Services are provided from the United States and may be
              subject to U.S. export control and economic sanctions laws and
              regulations, including the Export Administration Regulations and
              regulations administered by the U.S. Department of the Treasury's
              Office of Foreign Assets Control (OFAC).
            </p>
            <p style={bodyStyle}>
              You represent and warrant that you (and any entity you represent)
              are not: (a) located in, organized under the laws of, or
              ordinarily resident in any country or territory subject to
              comprehensive U.S. sanctions (currently including Cuba, Iran,
              North Korea, Syria, the Crimea, Donetsk, Luhansk, Kherson, and
              Zaporizhzhia regions of Ukraine, and any other jurisdiction
              subject to comprehensive sanctions during the term); (b) listed
              on, or owned 50% or more by parties listed on, the OFAC Specially
              Designated Nationals and Blocked Persons List, the U.S. Department
              of Commerce Denied Persons List or Entity List, or any equivalent
              restricted-party list; or (c) otherwise prohibited by U.S. or
              other applicable law from receiving the Services.
            </p>
            <p style={bodyStyle}>
              You agree not to export, re-export, transfer, or use the Services
              in violation of applicable export control or sanctions laws. We
              may suspend or terminate your access to the Services without
              liability if we determine, in our reasonable judgment, that
              continued provision of the Services would violate these laws.
            </p>
          </Section>

          <Section id="s13" title="13. Disclaimers of Warranties">
            <div
              style={{
                background: "#fff8f0",
                border: "1px solid #e8d0a7",
                borderRadius: "10px",
                padding: "20px 24px",
              }}
            >
              <p
                style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "#550000",
                  margin: "0 0 12px",
                  textTransform: "uppercase",
                  letterSpacing: "0.03em",
                }}
              >
                Important — Please Read
              </p>
              <p
                style={{
                  fontSize: "14px",
                  lineHeight: 1.7,
                  margin: 0,
                  color: "#3d2014",
                }}
              >
                THE SERVICES ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE"
                BASIS, AND YOUR USE OF THE SERVICES IS AT YOUR OWN RISK. THE
                SERVICES ARE PROVIDED WITHOUT WARRANTIES OF ANY KIND, EITHER
                EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMITTED BY LAW,
                TITLE MUNKE DISCLAIMS ALL WARRANTIES, INCLUDING WITHOUT
                LIMITATION:
              </p>
              <BulletList
                items={[
                  "WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT",
                  "WARRANTIES OF ACCURACY, COMPLETENESS, CURRENCY, OR RELIABILITY OF ANY DATA OR REPORTS",
                  "WARRANTIES THAT THE SERVICES WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS",
                  "WARRANTIES ARISING FROM COURSE OF DEALING, COURSE OF PERFORMANCE, OR USAGE OF TRADE",
                ]}
              />
              <p
                style={{
                  fontSize: "14px",
                  lineHeight: 1.7,
                  margin: 0,
                  color: "#3d2014",
                }}
              >
                WITHOUT LIMITING THE FOREGOING, TITLE MUNKE MAKES NO
                REPRESENTATION OR WARRANTY THAT THE SERVICES WILL IDENTIFY ALL
                TITLE DEFECTS, LIENS, ENCUMBRANCES, OR ADVERSE INTERESTS
                AFFECTING ANY PROPERTY.
              </p>
              <p style={bodyStyle}>
                Some jurisdictions do not allow the exclusion of certain
                warranties, so some of the above may not apply to you.
              </p>
            </div>
          </Section>

          <Section id="s14" title="14. Limitation of Liability">
            <p style={bodyStyle}>TO THE FULLEST EXTENT PERMITTED BY LAW:</p>
            <Sub title="14.1 Exclusion of Indirect Damages">
              TITLE MUNKE WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
              SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, INCLUDING
              WITHOUT LIMITATION LOSS OF PROFITS, REVENUE, BUSINESS, GOODWILL,
              DATA, OR OPPORTUNITY, ARISING OUT OF OR RELATING TO THESE TERMS OR
              THE SERVICES, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
            </Sub>
            <Sub title="14.2 Cap on Direct Damages">
              TITLE MUNKE'S TOTAL CUMULATIVE LIABILITY ARISING OUT OF OR
              RELATING TO THESE TERMS OR THE SERVICES, REGARDLESS OF THE FORM OF
              ACTION (CONTRACT, TORT, STATUTE, OR OTHERWISE), WILL NOT EXCEED
              THE GREATER OF (A) THE AMOUNT YOU PAID TO TITLE MUNKE IN THE
              TWELVE (12) MONTHS PRECEDING THE EVENT GIVING RISE TO THE CLAIM,
              OR (B) ONE HUNDRED U.S. DOLLARS ($100).
            </Sub>
            <Sub title="14.3 Specific Exclusion for Property Decisions">
              WITHOUT LIMITING SECTIONS 14.1 AND 14.2, TITLE MUNKE WILL NOT BE
              LIABLE FOR ANY DAMAGES ARISING FROM YOUR DECISION TO PURCHASE, BID
              ON, FINANCE, INSURE, OR OTHERWISE TRANSACT IN ANY REAL PROPERTY,
              INCLUDING WITHOUT LIMITATION DAMAGES ARISING FROM UNDISCLOSED
              LIENS, MORTGAGES, JUDGMENTS, EASEMENTS, ENCROACHMENTS, OR OTHER
              TITLE DEFECTS.
            </Sub>
            <Sub title="14.4 Basis of the Bargain">
              You acknowledge that the limitations in this Section 14 are a
              fundamental basis of the bargain between you and Title Munke and
              that the fees we charge would be substantially higher if these
              limitations did not apply. Some jurisdictions do not allow certain
              limitations on liability, so portions of this section may not
              apply to you.
            </Sub>
          </Section>

          <Section id="s15" title="15. Indemnification">
            <p style={bodyStyle}>
              You agree to defend, indemnify, and hold harmless Title Munke, its
              founders, officers, employees, contractors, and agents from and
              against any and all claims, damages, losses, liabilities, costs,
              and expenses (including reasonable attorneys' fees) arising out of
              or relating to: (a) your use of the Services; (b) your User
              Content; (c) your violation of these Terms; (d) your violation of
              any law or third-party right; or (e) any decision you make in
              reliance on data obtained from the Services. Title Munke will
              provide you reasonable notice of any claim and may, at its option,
              control the defense of any matter for which you have indemnity
              obligations.
            </p>
          </Section>

          <Section id="s16" title="16. Term and Termination">
            <Sub title="16.1 Term">
              These Terms apply from the date you first accept them and continue
              for as long as you use the Services or maintain an account.
            </Sub>
            <Sub title="16.2 Termination by You">
              You may terminate your account at any time through your account
              settings or by contacting us. Termination does not entitle you to
              a refund of prepaid fees, except as provided in Section 4.7 (EU/UK
              consumer withdrawal) or as otherwise required by law.
            </Sub>
            <Sub title="16.3 Termination by Title Munke">
              We may suspend or terminate your access to the Services, with or
              without notice, if: (a) you breach these Terms; (b) we are
              required to do so by law; (c) your account has been inactive for
              an extended period; or (d) we discontinue the Services.
            </Sub>
            <Sub title="16.4 Account Inactivity">
              If your account remains inactive (no logins, no API calls, and no
              billing activity) for a continuous period of twenty-four (24)
              months, we may, after providing at least thirty (30) days' email
              notice to the address on file, suspend or terminate the account
              and delete or anonymize associated User Content. Inactive paid
              accounts may be downgraded to a free tier (if available) or
              terminated at our discretion. Reactivation of a previously
              inactive account is at our discretion and may require
              re-acceptance of the then-current Terms.
            </Sub>
            <Sub title="16.5 Effect of Termination and Data Deletion">
              Upon termination, your right to access and use the Services ends
              immediately. Provisions that by their nature should survive
              termination — including Sections 3, 5.2, 5.3, 5.4, 5.5, 5.6, 9,
              10, 11, 12, 13, 14, 15, 17, and 18 — will survive. Following
              termination, we will delete or anonymize User Content within
              ninety (90) days, subject to (i) up to thirty (30) additional days
              for deletion to propagate through encrypted backup systems, and
              (ii) longer retention where required by law, ongoing legal
              proceedings, or legitimate fraud-prevention or security purposes.
              You may request export of your User Content (in a machine-readable
              format we reasonably support) at any time before deletion takes
              effect.
            </Sub>
          </Section>

          <Section
            id="s17"
            title="17. Dispute Resolution; Governing Law; Arbitration"
          >
            <Sub title="17.1 Governing Law">
              These Terms are governed by the laws of the Commonwealth of
              Pennsylvania, without regard to its conflict of laws principles.
              The United Nations Convention on Contracts for the International
              Sale of Goods does not apply. Notwithstanding the foregoing, if
              you are a consumer (i.e., acting outside your trade, business,
              craft, or profession) resident in the European Union, the United
              Kingdom, or another jurisdiction whose laws confer mandatory
              consumer protections that cannot be derogated from by agreement,
              the choice of Pennsylvania law in the preceding paragraph does not
              deprive you of the protection afforded to you by such mandatory
              provisions.
            </Sub>
            <Sub title="17.2 Informal Resolution">
              Before initiating any formal proceeding, the parties agree to
              attempt to resolve any dispute informally by contacting the other
              party in writing and engaging in good-faith negotiations for at
              least thirty (30) days.
            </Sub>
            <Sub title="17.3 Binding Arbitration">
              <div
                style={{
                  background: "#f5f0ec",
                  borderRadius: "10px",
                  padding: "24px 28px",
                }}
              >
                <p
                  style={{
                    margin: "0 0 6px",
                    fontSize: "14px",
                    color: "#554536",
                  }}
                >
                  <strong>
                    Any dispute, claim, or controversy arising out of or
                    relating to these Terms or the Services that is not resolved
                    informally will be resolved exclusively through binding
                    individual arbitration{" "}
                  </strong>
                  administered by the American Arbitration Association (AAA)
                  under its Commercial Arbitration Rules. The arbitration will
                  be conducted in Lehigh County, Pennsylvania, or by
                  videoconference at the parties' election. Judgment on the
                  award may be entered in any court of competent jurisdiction.
                </p>
              </div>
            </Sub>
            <Sub title="17.4 Class Action Waiver">
              <div
                style={{
                  background: "#f5f0ec",
                  borderRadius: "10px",
                  padding: "24px 28px",
                }}
              >
                <p
                  style={{
                    margin: "0 0 6px",
                    fontSize: "14px",
                    color: "#554536",
                  }}
                >
                  <strong>
                    YOU AND TITLE MUNKE AGREE THAT EACH MAY BRING CLAIMS AGAINST
                    THE OTHER ONLY IN AN INDIVIDUAL CAPACITY AND NOT AS A
                    PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS,
                    COLLECTIVE, OR REPRESENTATIVE PROCEEDING.
                  </strong>{" "}
                  The arbitrator may not consolidate more than one party's
                  claims and may not preside over any form of representative or
                  class proceeding.
                </p>
              </div>
              <p style={{ ...bodyStyle, marginTop: "20px" }}>
                <strong>Non-Severability of Class Action Waiver.</strong>
                The class action waiver in this Section 17.4 is a material and
                non-severable part of the parties' agreement to arbitrate. If a
                court of competent jurisdiction determines that the class action
                waiver is unenforceable as to any claim, dispute, or
                controversy, then the entirety of Section 17.3 (Binding
                Arbitration) is null and void as to that claim, dispute, or
                controversy, and that claim, dispute, or controversy will be
                resolved exclusively in the courts identified in Section 17.5.
                The parties expressly disclaim any intent to permit class
                arbitration. The remainder of Section 17 will remain in full
                force and effect.
              </p>
            </Sub>
            <Sub title="17.5 Exceptions">
              Notwithstanding the above, either party may (a) bring an
              individual action in small claims court, or (b) seek injunctive or
              equitable relief in a court of competent jurisdiction located in
              Lehigh County, Pennsylvania to protect its intellectual property
              or confidential information. You and Title Munke consent to the
              exclusive jurisdiction and venue of state and federal courts
              located in Lehigh County, Pennsylvania for such matters.
            </Sub>
            <Sub title="17.6 Opt-Out">
              <p style={bodyStyle}>
                You may opt out of the arbitration provisions in this Section 17
                by sending a written notice to Title Munke within thirty (30)
                days of first accepting these Terms. The notice must include
                your full name, the email address associated with your account,
                and an unequivocal statement that you wish to opt out of
                arbitration. The notice must be sent by either:
              </p>

              <div
                style={{
                  background: "#f5f0ec",
                  borderRadius: "10px",
                  padding: "24px 28px",
                }}
              >
                <p
                  style={{
                    margin: "0 0 6px",
                    fontSize: "14px",
                    color: "#554536",
                  }}
                >
                  <strong>Email:</strong>{" "}
                  <a
                    href="mailto:titlemunke@gmail.com"
                    style={{ color: "#987555" }}
                  >
                    titlemunke@gmail.com with the subject line 'Arbitration
                    Opt-Out'
                  </a>
                </p>
                <p style={{ margin: 0, fontSize: "14px", color: "#554536" }}>
                  <strong>Mail:</strong> Title Munke, Attn: Arbitration Opt-Out,
                  2041 Lawfer Ave, Allentown
                </p>
              </div>
              <p style={bodyStyle}>
                A timely and properly delivered opt-out notice will be effective
                only as to the individual sender, will not affect any other
                provision of these Terms, and will not affect any prior or
                subsequent arbitration agreements between you and Title Munke.
                We will acknowledge receipt of a valid opt-out notice in
                writing.
              </p>
            </Sub>
            <Sub title="17.7 Limitation Period">
              Any claim arising out of or relating to these Terms or the
              Services must be filed within one (1) year after the cause of
              action arises; otherwise, the claim is permanently barred.
            </Sub>
          </Section>

          <Section id="s18" title="18. General Provisions">
            <Sub title="18.1 Entire Agreement">
              These Terms, together with any order forms, subscription
              agreements, and policies referenced herein (including our Privacy
              Policy), constitute the entire agreement between you and Title
              Munke regarding the Services and supersede any prior agreements on
              the subject.
            </Sub>
            <Sub title="18.2 Modifications">
              We may update these Terms from time to time. Material changes will
              be communicated via email or through the Services at least fifteen
              (15) days before they take effect. Your continued use of the
              Services after the effective date constitutes acceptance of the
              updated Terms. If you do not agree, you must stop using the
              Services.
            </Sub>
            <Sub title="18.3 Assignment">
              You may not assign or transfer these Terms or any rights hereunder
              without our prior written consent. Any attempted assignment
              without consent is void. We may assign these Terms freely,
              including in connection with a merger, acquisition, or sale of
              assets.
            </Sub>
            <Sub title="18.4 No Waiver">
              Our failure to enforce any provision of these Terms is not a
              waiver of our right to do so later.
            </Sub>
            <Sub title="18.5 Severability">
              If any provision of these Terms is found unenforceable, the
              remaining provisions will remain in full force and effect, and the
              unenforceable provision will be modified to the minimum extent
              necessary to make it enforceable. Notwithstanding the foregoing,
              the non-severability rule in Section 17.4 (Class Action Waiver)
              controls over this Section 18.5, and an unenforceable class action
              waiver will not be modified to permit class arbitration.
            </Sub>
            <Sub title="18.6 Force Majeure">
              Neither party is liable for any failure or delay in performance
              caused by circumstances beyond its reasonable control, including
              acts of God, natural disasters, fire, flood, earthquake, severe
              weather, war, terrorism, civil unrest, government action,
              embargoes, sanctions, labor disputes, internet,
              telecommunications, or utility outages, third-party cloud,
              hosting, or API service outages or degradations (including outages
              affecting county data sources, mapping providers, payment
              processors, or cloud infrastructure), cyberattacks,
              denial-of-service attacks, ransomware, supply-chain disruptions,
              epidemic, and pandemic.
            </Sub>
            <Sub title="18.7 Independent Contractors">
              The parties are independent contractors. Nothing in these Terms
              creates a partnership, joint venture, agency, or employment
              relationship.
            </Sub>
            <Sub title="18.8 Notices">
              Notices to Title Munke must be sent in writing to the contact
              address below. Notices to you may be sent to the email address
              associated with your account or posted within the Services.
            </Sub>
            <Sub title="18.9 Headings">
              Section headings are for convenience only and do not affect
              interpretation.
            </Sub>
          </Section>

          <Section id="s19" title="19. Contact">
            <p style={bodyStyle}>
              Section headings are for convenience only and do not affect
              interpretation.
            </p>
            <div
              style={{
                background: "#f5f0ec",
                borderRadius: "10px",
                padding: "24px 28px",
              }}
            >
              <p
                style={{
                  fontFamily: "'PT Serif', serif",
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "#3d2014",
                  marginBottom: "12px",
                }}
              >
                Title Munke
              </p>
              <p
                style={{
                  margin: "0 0 6px",
                  fontSize: "14px",
                  color: "#554536",
                }}
              >
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:titlemunke@gmail.com"
                  style={{ color: "#987555" }}
                >
                  titlemunke@gmail.com
                </a>
              </p>
              <p style={{ margin: 0, fontSize: "14px", color: "#554536" }}>
                <strong>Mailing Address:</strong> 2041 Lawfer Ave, Allentown, PA
                18104
              </p>
            </div>
            <p style={{ ...bodyStyle, marginTop: "20px" }}>
              By using the Services, you acknowledge that you have read,
              understood, and agreed to these Terms and Conditions.
            </p>
          </Section>
        </main>
      </div>

      {/* ── FOOTER ── */}
      <Footer />
    </div>
  );
}

/* ─── Sub-components ─────────────────────────────────────────── */

const bodyStyle = {
  fontSize: "15px",
  lineHeight: 1.8,
  color: "#3d2b1f",
  margin: "0 0 12px",
};

function Section({ id, title, children }) {
  return (
    <section id={id} style={{ marginBottom: "48px", scrollMarginTop: "90px" }}>
      <h2
        style={{
          fontFamily: "'PT Serif', serif",
          fontSize: "22px",
          fontWeight: 700,
          color: "#3d2014",
          marginBottom: "20px",
          paddingBottom: "10px",
          borderBottom: "2px solid #e8d0a7",
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

function Sub({ title, children }) {
  return (
    <div style={{ marginBottom: "18px" }}>
      <h3
        style={{
          fontFamily: "'PT Serif', serif",
          fontSize: "16px",
          fontWeight: 700,
          color: "#554536",
          marginBottom: "8px",
        }}
      >
        {title}
      </h3>
      {typeof children === "string" ? (
        <p style={bodyStyle}>{children}</p>
      ) : (
        children
      )}
    </div>
  );
}

function BulletList({ items }) {
  return (
    <ul style={{ margin: "0 0 12px", paddingLeft: "20px" }}>
      {items.map((item, i) => (
        <li
          key={i}
          style={{
            fontSize: "15px",
            lineHeight: 1.75,
            color: "#3d2b1f",
            marginBottom: "6px",
          }}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Footer from "../Home/footer";
import Navbar from "../Home/navbar";

const TOC = [
  { id: "s1", label: "1. Scope" },
  { id: "s2", label: "2. Information We Collect" },
  { id: "s3", label: "3. How We Use Information" },
  { id: "s4", label: "4. How We Share Information" },
  { id: "s5", label: "5. Data Retention" },
  { id: "s6", label: "6. Cookies & Tracking Technologies" },
  { id: "s7", label: "7. Data Security" },
  { id: "s8", label: "8. Your Privacy Rights" },
  { id: "s9", label: "9. Public Records Corrections" },
  { id: "s10", label: "10. Children's Privacy" },
  { id: "s11", label: "11. Third-Party Links & Integrations" },
  { id: "s12", label: "12. International Data Transfers" },
  { id: "s13", label: "13. Changes to This Policy" },
  { id: "s14", label: "14. Contact Us" },
];

function scrollTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function PrivacyPolicy() {
  const [active, setActive] = useState("s1");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        }),
      { rootMargin: "-20% 0px -70% 0px" },
    );
    TOC.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="font-poppins">
      {/* ── NAV ── */}
      <Navbar />

      {/* ── HERO BAND ── */}
      <div
        style={{
          background:
            "linear-gradient(135deg, #550000 0%, #3d2014 50%, #987555 100%)",
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
        <h1
          style={{
            fontFamily: "'PT Serif', serif",
            fontSize: "clamp(32px,5vw,54px)",
            color: "#fff",
            margin: "0 0 16px",
            lineHeight: 1.15,
          }}
        >
          Privacy Policy
        </h1>
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
        <main style={{ flex: 1, maxWidth: "760px" }}>
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
            Title Munke ("Title Munke," "we," "us," or "our") respects your
            privacy. This Privacy Policy describes how we collect, use,
            disclose, and safeguard information when you visit our website{" "}
            <a href="https://titlemunke.com/" style={{ color: "#987555" }}>
              https://titlemunke.com/
            </a>{" "}
            or use any of our software platforms, dashboards, APIs, or related
            services (collectively, the "Services"). By using the Services, you
            consent to the practices described in this Privacy Policy. If you do
            not agree, please do not use the Services. This Privacy Policy
            should be read together with our
            <Link to="/terms-and-conditions" style={{ color: "#987555" }}>
              Terms and Conditions
            </Link>
            .
          </p>

          <Section id="s1" title="1. Scope">
            <p style={bodyStyle}>
              This Privacy Policy applies to information we collect:
            </p>
            <BulletList
              items={[
                "Through the Site and the Services;",
                "Through email, text, and other electronic communications between you and Title Munke;",
                "When you interact with our advertising or applications on third-party websites, if those applications include links to this policy.",
              ]}
            />
            <p style={bodyStyle}>
              This Privacy Policy does <strong>not</strong> apply to:
            </p>
            <BulletList
              items={[
                "Public records data. The Services are built around publicly available property and land records sourced from county recorders, sheriff's offices, courts, tax assessment offices, and other governmental sources. Information about property owners, lienholders, mortgagors, judgment debtors, and others contained in those records is presented as it appears in the underlying public records and is governed by the laws applicable to those records, not by this Privacy Policy. If you believe public records data displayed in the Services is inaccurate, please follow the process described in Section 9.",
                "Information collected by third parties to whom we do not share your personal information (other than as described below).",
                "Information collected by your employer or organization that provisioned your access, which may be governed by that organization's privacy practices.",
              ]}
            />
          </Section>

          <Section id="s2" title="2. Information We Collect">
            <p style={bodyStyle}>
              We collect several categories of information.
            </p>
            <Sub title="2.1 Information You Provide Directly">
              <BulletList
                items={[
                  "Account information: name, email address, phone number, business name, job title, mailing address, and login credentials.",
                  "Billing information: payment card details, billing address, and tax identification information. Payment card details are processed by Stripe and are not stored on our servers.",
                  "Communications: information you provide when you contact us for support, submit feedback, request a demo, respond to surveys, or otherwise communicate with us.",
                  "User Content: notes, tags, custom search criteria, uploaded files, attachments, and other content you submit to the Services.",
                  "Professional information: information about your role, your firm or employer, your area of practice, and your use case for the Services.",
                ]}
              />
            </Sub>
            <Sub title="2.2 Information Collected Automatically">
              <p style={bodyStyle}>
                When you use the Services, we and our service providers
                automatically collect:
              </p>
              <BulletList
                items={[
                  "Device and connection information: IP address, device type, operating system, browser type and version, language settings, and unique device identifiers.",
                  "Usage information: pages viewed, features used, search queries entered (including property addresses, parcel numbers, and owner names), reports generated, files downloaded, time spent, click paths, and referring URLs.",
                  "Log data: server logs that record access times, error reports, and similar diagnostic information.",
                  "Location information: approximate location derived from IP address. We do not collect precise geolocation unless you explicitly grant permission.",
                  "Cookies and similar technologies: see Section 6 below.",
                ]}
              />
            </Sub>
            <Sub title="2.3 Information from Third Parties">
              <p style={bodyStyle}>
                We may receive information about you from:
              </p>
              <BulletList
                items={[
                  "Public sources: professional directories, business registries, and public social media profiles.",
                  "Service providers and partners: analytics providers, payment processors, identity verification providers, and marketing partners.",
                  "Referrals: if another user invites you to the Services or refers you to us.",
                  "Single sign-on providers: if you log in using Google, Microsoft, or another SSO provider, we receive basic profile information from that provider.",
                ]}
              />
            </Sub>
            <Sub title="2.4 Search Queries Are Not Background Checks">
              We want to be explicit: when you use the Services to search for
              property records, the data returned reflects publicly available
              real estate records. The Services are not designed or authorized
              to be used as a consumer report, tenant screening report,
              employment background check, or similar consumer-impacting
              product. Searches you conduct must comply with the restrictions in
              our Terms and Conditions.
            </Sub>
          </Section>

          <Section id="s3" title="3. How We Use Information">
            <p style={bodyStyle}>We use the information we collect to:</p>
            <BulletList
              items={[
                "Provide, operate, maintain, and improve the Services;",
                "Authenticate users and secure accounts;",
                "Process transactions, send invoices, and manage subscriptions;",
                "Respond to inquiries, provide customer support, and send service-related communications (such as notices about updates, security alerts, and policy changes)",
                "Personalize your experience, including remembering your preferences and saved searches",
                "Analyze usage trends, monitor performance, debug issues, and develop new features",
                "Train, validate, and improve internal models and tooling that power the Services (using aggregated, de-identified, or sample data; see Section 3.1)",
                "Detect, prevent, and respond to fraud, abuse, security incidents, and violations of our Terms;",
                "Send marketing communications about our products (subject to your opt-out rights);",
                "Comply with legal obligations, court orders, and lawful requests from government authorities;",
                "Establish, exercise, or defend legal claims.",
              ]}
            />
            <Sub title="3.1 Use for Model Training and Product Improvement">
              We may use aggregated, anonymized, or de-identified data —
              including search patterns, query structures, and corrections
              submitted by users — to train and improve internal machine
              learning models and search algorithms. We do not use the contents
              of your User Content to train models available to other customers
              without first applying anonymization or aggregation, and we do not
              sell your personal information for model training purposes.
            </Sub>
            <Sub title="3.2 Automated Decision-Making and Profiling">
              <p style={bodyStyle}>
                The Services use automated processes — including machine
                learning models — to surface, rank, and score property records
                (for example, equity calculations on sheriff sale listings,
                lien-priority assessments, and search result ranking). These
                automated outputs are intended as research aids for your own
                decision-making and are not used to make decisions that produce
                legal or similarly significant effects on you as an individual.
              </p>
              <p style={bodyStyle}>
                We do not engage in automated decision-making within the meaning
                of Article 22 of the GDPR with respect to users of the Services.
                If you have questions about how an automated process generated a
                particular output, or wish to request human review of an output
                that materially affects you, contact us at the address in
                Section 14.
              </p>
            </Sub>
          </Section>

          <Section id="s4" title="4. How We Share Information">
            <div
              style={{
                background: "#f5f0ec",
                borderRadius: "10px",
                padding: "14px 18px",
                marginBottom: "20px",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#3d2014",
                }}
              >
                We do not sell your personal information. We share information
                only as described below.
              </p>
            </div>
            <Sub title="4.1 Service Providers and Subprocessors">
              <p style={bodyStyle}>
                We share information with vendors and service providers that
                perform services on our behalf. Categories include:
              </p>
              <BulletList
                items={[
                  "Cloud hosting and infrastructure: Amazon Web Services (AWS), Google Cloud Platform.",
                  "Payment processing: Stripe.",
                  "Email and communications: transactional and marketing email providers.",
                  "Analytics and product telemetry: Google Analytics or equivalent.",
                  "Error monitoring and observability: error-tracking and logging providers.",
                  "Mapping and geocoding: Google Maps Platform (Maps, Geocoding, Places, Street View).",
                  "Identity and authentication: Google and Microsoft single sign-on providers.",
                  "•	County and court data sources: CivilView, county recorder of deeds offices, prothonotary offices, sheriff's offices, and tax assessment offices for the counties we cover.",
                ]}
              />
              <p style={{ ...bodyStyle, marginTop: "8px" }}>
                These providers are bound by contractual obligations to use
                information only as needed to provide their services. A current
                list of material subprocessors is available on request by
                emailing{" "}
                <a
                  href="mailto:titlemunke@gmail.com"
                  style={{ color: "#987555" }}
                >
                  titlemunke@gmail.com
                </a>{" "}
                with subject "Subprocessor List."
              </p>
            </Sub>
            <Sub title="4.2 Within Your Organization">
              If Title Munke is involved in a merger, acquisition, financing,
              reorganization, bankruptcy, or sale of assets, your information
              may be transferred to the successor entity, subject to standard
              confidentiality protections and applicable law. We will provide
              notice before your information is transferred and becomes subject
              to a different privacy policy.
            </Sub>
            <Sub title="4.3 Business Transfers">
              If Title Munke is involved in a merger, acquisition, financing,
              reorganization, bankruptcy, or sale of assets, your information
              may be transferred to the successor entity, subject to standard
              confidentiality protections and applicable law. We will provide
              notice before your information is transferred and becomes subject
              to a different privacy policy.
            </Sub>
            <Sub title="4.4 Legal and Safety">
              We may disclose information if we believe in good faith that doing
              so is necessary to: (a) comply with applicable law, regulation,
              subpoena, court order, or other legal process; (b) enforce our
              Terms; (c) protect the rights, property, or safety of Title Munke,
              our users, or others; or (d) detect or prevent fraud, abuse, or
              security issues.
            </Sub>
            <Sub title="4.5 With Your Consent">
              We may share information for any other purpose disclosed to you
              with your consent.
            </Sub>
            <Sub title="4.6 Aggregated and De-Identified Data">
              We may share aggregated or de-identified data that cannot
              reasonably be used to identify you for any lawful business
              purpose, including market research, industry reporting, and
              product development.
            </Sub>
          </Section>

          <Section id="s5" title="5. Data Retention">
            <p style={bodyStyle}>
              We retain personal information for as long as necessary to provide
              the Services and fulfill the purposes described in this Privacy
              Policy, including to comply with legal obligations, resolve
              disputes, and enforce our agreements. Specifically:
            </p>
            <BulletList
              items={[
                "Account information is retained while your account is active and for up to seven years after termination for tax, audit, and dispute-resolution purposes.",
                "Billing records are retained for at least the period required by applicable tax and accounting laws.",
                "Server logs and usage data are typically retained for 12 to 24 months.",
                "Marketing data is retained until you opt out or we determine it is no longer needed.",
                "User Content is retained while your account is active and may be deleted within a reasonable period after termination, subject to backup retention windows described below.",
              ]}
            />
            <p style={bodyStyle}>
              When information is no longer needed, we securely delete or
              anonymize it. Following account termination, we will delete or
              anonymize User Content within ninety (90) days, subject to (i) up
              to thirty (30) additional days for deletion to propagate through
              encrypted backup systems, and (ii) longer retention where required
              by law, ongoing legal proceedings, or legitimate fraud-prevention
              or security purposes.
            </p>
          </Section>

          <Section id="s6" title="6. Cookies and Tracking Technologies">
            <p style={bodyStyle}>
              We and our service providers use cookies, web beacons, pixel tags,
              local storage, and similar technologies to operate the Site,
              remember your preferences, analyze usage, and (where applicable)
              deliver advertising.
            </p>
            <p style={bodyStyle}>Categories of cookies we use:</p>
            <BulletList
              items={[
                "Strictly necessary cookies: required for the Site and Services to function (e.g., authentication, session management, security). These cannot be disabled.",
                "Analytics cookies: help us understand how the Services are used (e.g., Google Analytics).",
                "Functional cookies: remember preferences and settings.",
                "Marketing cookies: used to measure the effectiveness of marketing campaigns.",
              ]}
            />
            <Sub title="6.1 Managing Your Cookie Preferences">
              <p style={bodyStyle}>
                We and our service providers use cookies, web beacons, pixel
                tags, local storage, and similar technologies to operate the
                Site, remember your preferences, analyze usage, and (where
                applicable) deliver advertising.
              </p>
              <p style={bodyStyle}>
                You can also control cookies through your browser settings. Most
                browsers allow you to refuse new cookies, delete existing
                cookies, or be notified when new cookies are set. Disabling
                certain cookies may affect functionality. We currently do not
                respond to "Do Not Track" browser signals, but we honor opt-out
                preferences sent through Global Privacy Control (GPC) signals
                where required by law
              </p>
            </Sub>
          </Section>

          <Section id="s7" title="7. Data Security">
            <p style={bodyStyle}>
              We implement reasonable administrative, technical, and physical
              safeguards designed to protect personal information against
              unauthorized access, alteration, disclosure, or destruction. These
              include encryption of data in transit (TLS), encryption of
              sensitive data at rest, access controls, audit logging, and
              regular security reviews.
            </p>
            <p style={bodyStyle}>
              No method of transmission or storage is 100% secure. We cannot
              guarantee absolute security and are not responsible for
              unauthorized access to your account caused by your failure to
              safeguard your credentials. If you believe your account has been
              compromised, contact us immediately.
            </p>
            <Sub title="7.1 Data Breach Notification">
              In the event of a confirmed data breach affecting your personal
              information, we will notify you and applicable regulators in
              accordance with applicable law. Where the GDPR or UK GDPR applies,
              we will notify the competent supervisory authority within
              seventy-two (72) hours of becoming aware of a qualifying breach,
              and we will notify affected individuals without undue delay where
              the breach is likely to result in a high risk to their rights and
              freedoms. Where U.S. state breach-notification laws apply, we will
              provide notice within the timeframes those laws require, which
              generally do not exceed forty-five (45) to sixty (60) days after
              discovery. Notice will describe, to the extent known, the nature
              of the breach, the categories of information involved, the likely
              consequences, and the measures we are taking in response.
            </Sub>
          </Section>

          <Section id="s8" title="8. Your Privacy Rights">
            <p style={bodyStyle}>
              Depending on your jurisdiction, you may have the following rights
              regarding your personal information:
            </p>
            <BulletList
              items={[
                "Access — request a copy of the personal information we hold about you.",
                "Correction — request that we correct inaccurate or incomplete information.",
                "Deletion — request that we delete your personal information, subject to certain exceptions (such as legal recordkeeping obligations).",
                "Portability — receive a copy of your personal information in a portable format.",
                "Objection or restriction — object to or restrict certain processing.",
                "Withdrawal of consent — withdraw consent where processing is based on consent.",
                "Opt-out of marketing — unsubscribe from marketing communications using the link in any marketing email or by contacting us.",
                "Non-discrimination — exercise these rights without facing discriminatory treatment.",
              ]}
            />
            <Sub title="8.1 How to Exercise Your Rights">
              <p style={bodyStyle}>
                You may submit a privacy-rights request through any of the
                following channels:
              </p>
              <BulletList
                items={[
                  "Online form: https://titlemunke.com/privacy-request",
                  'Email: titlemunke@gmail.com with subject "Privacy Rights Request"',
                  'Mail: Title Munke, 2041 Lawfer Ave, Allentown, PA 18104, attention "Privacy Rights Request"',
                ]}
              />
              <p style={{ ...bodyStyle, marginTop: "8px" }}>
                We will verify your identity before responding (which may
                require you to confirm information already on file or provide
                reasonable proof of identity). Authorized agents may submit
                requests on your behalf with proof of authorization.
              </p>
              <BulletList
                items={[
                  "GDPR / UK GDPR: within one (1) month of receipt, extendable by up to two (2) additional months for complex or numerous requests, with notice to you.",
                  "California (CCPA/CPRA) and other U.S. state privacy laws: within forty-five (45) days of receipt, extendable once by an additional forty-five (45) days where reasonably necessary, with notice to you.",
                ]}
              />
              <p style={{ ...bodyStyle, marginTop: "8px" }}>
                You may also have the right to lodge a complaint with a data
                protection authority.
              </p>
            </Sub>
            <Sub title="8.2 California Residents (CCPA / CPRA)">
              <p style={bodyStyle}>
                If you are a California resident, you have the rights described
                above and the additional rights provided under the California
                Consumer Privacy Act and California Privacy Rights Act. We do
                not "sell" personal information as that term is traditionally
                understood, and we do not "share" personal information for
                cross-context behavioral advertising in a way that would require
                an opt-out under California law. Because we do not sell or share
                personal information for cross-context behavioral advertising,
                we do not display a "Do Not Sell or Share My Personal
                Information" link. We do not knowingly collect personal
                information of consumers under 16. We do not use or disclose
                sensitive personal information for purposes other than those
                permitted under California Civil Code § 1798.121, and
                accordingly do not provide a separate "Limit the Use of My
                Sensitive Personal Information" link.
              </p>
              <p style={bodyStyle}>
                Categories of personal information we have collected in the
                preceding 12 months: identifiers, commercial information,
                internet/network activity, geolocation (approximate),
                professional information, and inferences drawn from the
                foregoing.
              </p>
            </Sub>
            <Sub title="8.3 Other U.S. State Residents">
              <p style={bodyStyle}>
                If you are a resident of a state with a comprehensive consumer
                privacy law — including, as of the Effective Date, Virginia
                (VCDPA), Colorado (CPA), Connecticut (CTDPA), Utah (UCPA), Texas
                (TDPSA), Oregon (OCPA), Montana Consumer Data Privacy Act (MT
                MCDPA), Iowa (ICDPA), Delaware (DPDPA), New Hampshire (NHPA),
                New Jersey (NJDPA), Tennessee (TIPA), Indiana (INCDPA),
                Minnesota Consumer Data Privacy Act (MN MCDPA), Maryland
                (MODPA), Nebraska (NDPA), Kentucky (KCDPA), and Rhode Island —
                you may exercise the rights provided under your state's law
                (including, where applicable, rights of access, correction,
                deletion, portability, and opt-out of targeted advertising,
                sale, or certain profiling).To exercise those rights, use the
                channels in Section 8.1. You may also have a right to appeal a
                denial of your request; appeals may be submitted by replying to
                our response or emailing titlemunke@gmail.com with the subject
                "Privacy Rights Appeal."
              </p>
              <p style={bodyStyle}>
                Pennsylvania has not enacted a comprehensive consumer privacy
                law as of the Effective Date. Pennsylvania residents may
                nevertheless exercise the rights described in this Section 8 to
                the extent we extend them voluntarily or as otherwise required
                by sectoral laws.
              </p>
            </Sub>
            <Sub title="8.4 EU/UK/Swiss Residents (GDPR / UK GDPR)">
              If you are in the European Economic Area, the United Kingdom, or
              Switzerland, our legal bases for processing personal information
              include: (a) performance of a contract with you; (b) compliance
              with legal obligations; (c) our legitimate interests (such as
              operating, securing, and improving the Services); and (d) consent,
              where applicable. You have rights of access, rectification,
              erasure, restriction, portability, and objection, and the right to
              lodge a complaint with your local supervisory authority.
            </Sub>
            <Sub title="8.5 EU and UK Representative">
              Where required by Article 27 of the GDPR or the UK GDPR, we will
              designate a representative in the European Union and/or the United
              Kingdom to act as a point of contact for supervisory authorities
              and data subjects. As of the Effective Date, Title Munke does not
              currently direct its marketing or its Services to data subjects in
              the EEA or the UK and does not believe its activities trigger the
              appointment requirement under Article 27. We will reassess this
              position periodically and will update this Privacy Policy to
              identify a representative and their contact details if and when
              our activities trigger the requirement. EEA and UK residents may
              in the meantime contact us using the channels in Section 8.1, and
              we will respond to verified rights requests in accordance with
              Section 8.1.
            </Sub>
          </Section>

          <Section id="s9" title="9. Public Records Corrections">
            <p style={bodyStyle}>
              The Services display data sourced from public records. If you
              believe information about a property or owner displayed in the
              Services is inaccurate as compared to the underlying public
              record, you may submit a correction request to the email address
              in Section 14. We will review the request and, where appropriate,
              update our display.
            </p>
            <p style={bodyStyle}>
              We cannot alter or remove information that accurately reflects the
              underlying public record. To correct the public record itself, you
              must contact the relevant county recorder, prothonotary, court, or
              other government office that maintains the original record.
            </p>
          </Section>

          <Section id="s10" title="10. Children's Privacy">
            <p style={bodyStyle}>
              The Services are intended for users 18 and older and are not
              directed to children. We do not knowingly collect personal
              information from children under 13 (or the equivalent minimum age
              in the relevant jurisdiction). If we learn that we have collected
              such information without verified parental consent, we will delete
              it promptly.
            </p>
          </Section>

          <Section id="s11" title="11. Third-Party Links and Integrations">
            <p style={bodyStyle}>
              The Services contain links to third-party websites and integrate
              with third-party services. Material third parties whose services
              may be invoked when you use the Services include Google Maps
              Platform (mapping, geocoding, Places, and Street View), Stripe
              (payment processing), Google and Microsoft (authentication via
              single sign-on), Google Analytics (usage analytics), Amazon Web
              Services and Google Cloud Platform (cloud hosting and
              infrastructure), and county recorder, prothonotary, sheriff, and
              tax assessment offices and their data vendors (including
              CivilView). We are not responsible for the privacy practices of
              these third parties. We encourage you to review their privacy
              policies before providing them with personal information.
            </p>
          </Section>

          <Section id="s12" title="12. International Data Transfers">
            <p style={bodyStyle}>
              Title Munke is based in the United States. If you access the
              Services from outside the United States, your information will be
              transferred to, stored, and processed in the United States and
              possibly other countries where we or our service providers
              operate. These countries may have data protection laws that differ
              from those in your jurisdiction. Where required for transfers from
              the EEA, the United Kingdom, or Switzerland to the United States,
              we rely on appropriate safeguards, which may include the European
              Commission's Standard Contractual Clauses (and the UK
              International Data Transfer Addendum or UK IDTA, where
              applicable), our service providers' certifications under the
              EU-U.S. Data Privacy Framework (and the UK Extension and
              Swiss-U.S. Data Privacy Framework, where applicable), and
              supplementary measures as required by applicable law. Copies of
              the relevant transfer mechanisms are available on request using
              the contact details in Section 14.
            </p>
          </Section>

          <Section id="s13" title="13. Changes to This Privacy Policy">
            <p style={bodyStyle}>
              We may update this Privacy Policy from time to time. The
              "Effective Date" and "Last Updated" dates above reflect the latest
              revision. We will notify you of material changes by email or
              through a prominent notice on the Services before the changes take
              effect. Your continued use of the Services after the effective
              date constitutes acceptance of the updated policy.
            </p>
          </Section>

          <Section id="s14" title="14. Contact Us">
            <p style={bodyStyle}>
              For questions, requests, or concerns about this Privacy Policy or
              our privacy practices, contact us at:
            </p>
            <div
              style={{
                background: "#f5f0ec",
                borderRadius: "10px",
                padding: "24px 28px",
                marginBottom: "20px",
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
              <p
                style={{
                  margin: "0 0 6px",
                  fontSize: "14px",
                  color: "#554536",
                }}
              >
                <strong>Mailing Address:</strong> 2041 Lawfer Ave, Allentown, PA
                18104
              </p>
              <p style={{ margin: 0, fontSize: "14px", color: "#554536" }}>
                <strong>Privacy-rights portal:</strong>{" "}
                <a
                  href="https://titlemunke.com/privacy-request"
                  style={{ color: "#987555" }}
                >
                  https://titlemunke.com/privacy-request
                </a>
              </p>
            </div>
            <p style={bodyStyle}>
              For privacy-rights requests, please use the subject line "Privacy
              Rights Request" and include sufficient information to verify your
              identity and the nature of your request.
            </p>
            <p style={bodyStyle}>
              By using the Services, you acknowledge that you have read and
              understood this Privacy Policy.
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

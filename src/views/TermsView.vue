<template>
  <div class="terms">
    <section class="terms-hero">
      <div class="terms-hero-inner">
        <h1>Terms of Use</h1>
        <p class="lead">
          Please read these terms carefully before using AcroHub.
        </p>
      </div>
    </section>

    <section class="terms-body">
      <div class="terms-content">
        <div class="terms-section">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using AcroHub ("the Service"), you agree to be bound by these Terms of Use.
            If you do not agree to these terms, you should not use the Service.
          </p>
        </div>

        <div class="terms-section">
          <h2>2. Educational Content Only</h2>
          <p>
            The acrobatic moves, videos, and related materials provided on AcroHub are for
            <strong>informational and educational purposes only</strong>. Acrobatic and athletic activities
            carry inherent risks.
          </p>
          <p>
            You are responsible for determining whether you have the appropriate experience, supervision,
            equipment, and environment to attempt any move shown on the Service.
          </p>
        </div>

        <div class="terms-section">
          <h2>3. Assumption of Risk and Liability Disclaimer</h2>
          <p>By using the Service and attempting any acrobatic moves demonstrated, you acknowledge and accept that:</p>
          <ul>
            <li>Acrobatic activities may result in <strong>serious injury or death</strong>.</li>
            <li>You participate <strong>entirely at your own risk</strong>.</li>
            <li>
              The creator and operator of AcroHub shall
              <strong>not be liable for any injury, loss, or damages</strong> arising from attempts to
              replicate any move or training method shown on the platform.
            </li>
          </ul>
          <p>
            To the fullest extent permitted by law, AcroHub and its operator disclaim all liability for
            any direct, indirect, incidental, or consequential damages resulting from use of the Service.
          </p>
        </div>

        <div class="terms-section">
          <h2>4. Proper Training and Supervision</h2>
          <p>
            Users are strongly encouraged to attempt acrobatic activities
            <strong>only with appropriate coaching, spotting, safety equipment, and training facilities</strong>.
          </p>
          <p>Nothing on the Service should be interpreted as professional coaching or certification.</p>
        </div>

        <div class="terms-section">
          <h2>5. Intellectual Property</h2>
          <p>
            All videos, move descriptions, graphics, and other content available on AcroHub are the
            <strong>intellectual property of AcroHub or its licensors</strong>, unless otherwise stated.
          </p>
        </div>

        <div class="terms-section">
          <h2>6. Restrictions on Use</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Download, copy, reproduce, or redistribute videos or other content from the Service without permission.</li>
            <li>Host, mirror, or republish AcroHub content on other platforms.</li>
            <li>Use automated tools to scrape or bulk-download content.</li>
            <li>Use the content for commercial purposes without explicit permission.</li>
          </ul>
        </div>

        <div class="terms-section">
          <h2>7. Account Access</h2>
          <p>
            If the Service requires an account, you are responsible for maintaining the confidentiality
            of your login credentials and for all activity that occurs under your account.
          </p>
        </div>

        <div class="terms-section">
          <h2>8. Changes to the Service</h2>
          <p>
            AcroHub may modify, suspend, or discontinue any part of the Service at any time without prior notice.
          </p>
        </div>

        <div class="terms-section">
          <h2>9. Changes to These Terms</h2>
          <p>
            These Terms may be updated from time to time. Continued use of the Service after changes are
            published constitutes acceptance of the revised Terms.
          </p>
        </div>

        <div class="terms-section">
          <h2>10. Governing Law</h2>
          <p>
            These Terms shall be governed by and interpreted in accordance with applicable law.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
</script>

<style scoped>
.terms-hero {
  background: linear-gradient(135deg, var(--color-dark-blue) 0%, var(--color-darkest) 100%);
  color: var(--color-white);
  padding: 4rem 1.5rem;
  text-align: center;
}

.terms-hero-inner {
  max-width: 700px;
  margin: 0 auto;
}

.terms-hero h1 {
  font-size: 2.5rem;
  margin: 0 0 1rem;
}

.lead {
  font-size: 1.1rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.85);
  margin: 0;
}

.terms-body {
  padding: 3rem 1.5rem;
}

.terms-content {
  max-width: 780px;
  margin: 0 auto;
}

.terms-section {
  margin-bottom: 2.5rem;
}

.terms-section h2 {
  color: var(--color-dark-blue);
  font-size: 1.5rem;
  margin: 0 0 0.75rem;
}

.terms-section p,
.terms-section ul {
  color: #333;
  line-height: 1.75;
  margin: 0 0 0.75rem;
}

.terms-section p:last-child {
  margin-bottom: 0;
}

.terms-section ul {
  padding-left: 1.5rem;
  margin-top: 0.5rem;
}

.terms-section ul li {
  margin-bottom: 0.4rem;
}
</style>

import React from "react";
import { withRouter } from "react-router-dom";

const Privacy = () => {
  return (
    <div className="terms-of-use-wrapper">
      <h3 className="terms-of-use-header">Privacy Policy</h3>
      <div className="terms-of-use-content">
        <p>
          This Privacy Policy explains how PlanShare ("we", "us", "our")
          collects, uses, and protects your personal data when you visit and use
          PlanShare.io ("website", "service").
        </p>

        <p>
          We may update this policy at any time, and any changes will be posted
          here. We encourage you to check this page periodically for updates.
        </p>

        <h4>1. Data We Collect</h4>
        <p>When you use PlanShare, we may collect the following information:</p>
        <ul>
          <li>Your first name, username, and email address.</li>
          <li>Subscription preferences and other information you provide.</li>
          <li>Usage data, such as browsing behavior on our website.</li>
        </ul>

        <h4>2. How We Use Your Data</h4>
        <p>We collect your data to:</p>
        <ul>
          <li>Enhance and personalize your user experience.</li>
          <li>Improve our services and website functionality.</li>
          <li>Analyze website traffic and user behavior.</li>
          <li>
            Communicate updates, promotions, or important notices (only if you
            opt-in).
          </li>
        </ul>

        <h4>3. Data Protection & Security</h4>
        <p>
          We take data security seriously and use industry-standard measures to
          prevent unauthorized access, data breaches, and misuse of your
          personal information.
        </p>

        <h4>4. Third-Party Links</h4>
        <p>
          Our website may contain links to third-party websites. We are not
          responsible for their privacy policies or practices. We recommend
          reviewing their privacy policies before providing any personal
          information.
        </p>

        <h4>5. Controlling Your Personal Data</h4>
        <p>You have the right to limit the collection and use of your data:</p>
        <ul>
          <li>
            When filling out forms, check for opt-out options where available.
          </li>
          <li>
            If you have previously shared your data and wish to restrict its
            use, contact us, and we will accommodate your request.
          </li>
          <li>
            We do not sell, lease, or distribute your personal information to
            third parties unless legally required.
          </li>
        </ul>

        <p>
          By using PlanShare, you acknowledge and agree to this Privacy Policy.
          If you have any questions or concerns, please contact us at{" "}
          <a href="mailto:admin@planshare.io">admin@planshare.io</a>.
        </p>
      </div>
    </div>
  );
};

export default withRouter(Privacy);

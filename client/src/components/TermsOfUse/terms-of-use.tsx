import React from "react";

interface ITermsOfUseProps {
  setIsTermsOfUseDialogDisplayed: (value: boolean) => void;
  setTermsOfUseAcknowledged: (value: boolean) => void;
}

const TermsOfUseDialog = (
  props: { dismissTermsOfUseDialog: () => void } & ITermsOfUseProps
) => {
  const { dismissTermsOfUseDialog, setTermsOfUseAcknowledged } = props;

  const handleDeclineTerms = () => {
    setTermsOfUseAcknowledged(false);
    dismissTermsOfUseDialog();
  };

  const handleAcceptTerms = () => {
    setTermsOfUseAcknowledged(true);
    dismissTermsOfUseDialog();
  };

  return (
    <div className="terms-of-use-container">
      <div className="terms-of-use-dialog">
        <div className="terms-of-use-wrapper">
          <h3 className="terms-of-use-header">Terms of Use</h3>
          <div className="terms-of-use-content">
            <p>
              Welcome to PlanShare! By using our website (PlanShare.io), you
              agree to the following Terms of Use. Please read them carefully.
              If you do not agree, do not use our services.
            </p>

            <h4>1. About PlanShare</h4>
            <p>
              PlanShare is a <strong>classifieds platform</strong> where users
              can post and find cost-sharing opportunities for subscriptions,
              group deliveries, and other shared services.{" "}
              <strong>
                We do not facilitate payments or enforce agreements between
                users.
              </strong>
            </p>

            <h4>2. User Responsibilities</h4>
            <ul>
              <li>
                <strong>Compliance with Provider Terms:</strong> Some service
                providers restrict sharing (e.g., streaming services). Users
                must ensure their listings comply with provider terms. PlanShare
                is not responsible for violations.
              </li>
              <li>
                <strong>Honest and Legal Use:</strong> Users must not post
                false, misleading, or illegal listings.
              </li>
              <li>
                <strong>Independent Transactions:</strong> Payments, agreements,
                and disputes must be handled directly between users. PlanShare
                does not process payments or mediate disputes.
              </li>
            </ul>

            <h4>3. Privacy Policy</h4>
            <p>
              Before using PlanShare, please review our{" "}
              <a href="/privacy" target="_blank" rel="noopener noreferrer">
                Privacy Policy
              </a>{" "}
              to understand how we handle your data.
            </p>

            <h4>4. Content Ownership & Copyright</h4>
            <ul>
              <li>
                All content on PlanShare (text, images, logos, etc.) belongs to
                PlanShare or respective content creators.
              </li>
              <li>
                By posting content, users grant PlanShare a{" "}
                <strong>non-exclusive, royalty-free, worldwide license</strong>{" "}
                to use, modify, and display it.
              </li>
            </ul>

            <h4>5. Communications</h4>
            <p>
              By using PlanShare, you consent to receive{" "}
              <strong>electronic communications</strong> from us, including
              emails and notices on our website.
            </p>

            <h4>6. Acceptable Use Policy</h4>
            <p>
              Users may <strong>not</strong> post content that is:
            </p>
            <ul>
              <li>
                Illegal, defamatory, or infringing on intellectual property
                rights.
              </li>
              <li>Spam, commercial solicitations, or malware.</li>
              <li>Threatening, abusive, or harassing to others.</li>
            </ul>
            <p>
              We reserve the right to{" "}
              <strong>remove content or suspend accounts</strong> that violate
              these terms.
            </p>

            <h4>7. Account Security</h4>
            <p>
              Users are responsible for maintaining the{" "}
              <strong>confidentiality</strong> of their account credentials.
              PlanShare is not liable for unauthorized account access.
            </p>

            <h4>8. Disputes & Liability</h4>
            <ul>
              <li>
                PlanShare is <strong>not responsible</strong> for user
                transactions, agreements, or disputes.
              </li>
              <li>
                Users agree that any disputes related to PlanShare will be{" "}
                <strong>governed by U.S. law</strong> and handled in applicable
                state or federal courts.
              </li>
            </ul>

            <h4>9. Changes to Terms</h4>
            <p>
              We may update these Terms of Use at any time. Continued use of
              PlanShare after changes constitutes acceptance of the new terms.
            </p>

            <p>
              <strong>By clicking "Accept," you agree to these terms.</strong>{" "}
              If you do not agree, click "Decline" and discontinue use of
              PlanShare.
            </p>
          </div>

          <div className="terms-of-use-buttons">
            <button
              className="terms-of-use-button"
              onClick={handleDeclineTerms}
            >
              Decline
            </button>
            <button className="terms-of-use-button" onClick={handleAcceptTerms}>
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const TermsOfUse = (props: ITermsOfUseProps) => {
  const { setIsTermsOfUseDialogDisplayed, setTermsOfUseAcknowledged } = props;

  const dismissTermsOfUseDialog = () => {
    setIsTermsOfUseDialogDisplayed(false);
  };

  return (
    <div>
      <div className="overlay" onClick={dismissTermsOfUseDialog}></div>
      <TermsOfUseDialog
        dismissTermsOfUseDialog={dismissTermsOfUseDialog}
        setIsTermsOfUseDialogDisplayed={setIsTermsOfUseDialogDisplayed}
        setTermsOfUseAcknowledged={setTermsOfUseAcknowledged}
      />
    </div>
  );
};

export default TermsOfUse;

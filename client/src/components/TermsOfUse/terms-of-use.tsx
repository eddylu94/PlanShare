import React from "react";
import { Link } from "react-router-dom";

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
              Please read these terms of service ("terms", "terms of service")
              carefully before using PlanShare.io (the "service") operated by
              Planshare ("us", 'we", "our").
            </p>

            <p className="b">Conditions of Use</p>

            <p>
              We will provide their services to you, which are subject to the
              conditions stated below in this document. Every time you visit
              this website and use its services, you accept the following
              conditions. This is why we urge you to read them carefully.
            </p>

            <p>
              <Link to="/info" target="_blank" rel="noopener noreferrer">
                Certain subscription providers
              </Link>{" "}
              restrict sharing of their services. It is the user's responsiblity
              to ensure that their subscription listings do not violate their
              provider's terms of use. PlanShare is not responsible for any
              users that violate agreements with their subscription providers.
            </p>

            <p className="b">Privacy Policy</p>

            <p>
              Before you continue using our website we advise you to read our{" "}
              <Link to="/privacy" target="_blank" rel="noopener noreferrer">
                privacy policy
              </Link>{" "}
              regarding our user data collection. It will help you better
              understand our practices.
            </p>

            <p className="b">Copyright</p>

            <p>
              Content published on this website (digital downloads, images,
              texts, graphics, logos) is the property of PlanShare and/or its
              content creators.
            </p>

            <p className="b">Communications</p>

            <p>
              The entire communication with us is electronic. Every time you
              send us an email or visit our website, you are going to be
              communicating with us. You hereby consent to receive
              communications from us. If you subscribe to the news on our
              website, you are going to receive regular emails from us. We will
              continue to communicate with you by posting notices on our website
              and by sending you emails. You also agree that all notices,
              disclosures, agreements and other communications we provide to you
              electronically meet the legal requirements that such
              communications be in writing.
            </p>

            <p className="b">Applicable Law</p>

            <p>
              By visiting this website, you agree that the laws of the United
              States, without regard to principles of conflict laws, will govern
              these terms of service, or any dispute of any sort that might come
              between PlanShare and you, or its business partners and
              associates.
            </p>

            <p className="b">Disputes</p>

            <p>
              Any dispute related in any way to your visit to this website or to
              products you purchase from us shall be arbitrated by state or
              federal court United States and you consent to exclusive
              jurisdiction and venue of such courts.
            </p>

            <p className="b">Comments, Reviews, and Emails</p>

            <p>
              Visitors may post content as long as it is not obscene, illegal,
              defamatory, threatening, infringing of intellectual property
              rights, invasive of privacy or injurious in any other way to third
              parties. Content has to be free of software viruses, political
              campaign, and commercial solicitation.
            </p>

            <p>
              We reserve all rights (but not the obligation) to remove and/or
              edit such content. When you post your content, you grant PlanShare
              non-exclusive, royalty-free and irrevocable right to use,
              reproduce, publish, modify such content throughout the world in
              any media.
            </p>

            <p className="b">License and Site Access</p>

            <p>
              We grant you a limited license to access and make personal use of
              this website. You are not allowed to download or modify it. This
              may be done only with written consent from us.
            </p>

            <p className="b">User Account</p>

            <p>
              If you are an owner of an account on this website, you are solely
              responsible for maintaining the confidentiality of your private
              user details (username and password). You are responsible for all
              activities that occur under your account or password.
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

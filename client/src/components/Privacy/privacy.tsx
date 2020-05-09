import React from "react";
import { withRouter } from "react-router-dom";

const Privacy = () => {
  return (
    <div className="terms-of-use-wrapper">
      <h3 className="terms-of-use-header">Privacy Policy</h3>
      <div className="terms-of-use-content">
        <p>
          This privacy policy ("policy") will help you understand how PlanShare
          ("us", "we", "our") uses and protects the data you provide to us when
          you visit and use PlanShare.io ("website", "service").
        </p>

        <p>
          We reserve the right to change this policy at any given time, of which
          you will be promptly updated. If you want to make sure that you are up
          to date with the latest changes, we advise you to frequently visit
          this page.
        </p>

        <p className="b">What User Data We Collect</p>

        <p>When you visit the website, we may collect the following data:</p>

        <p>
          Your first name, username, and email address. Other information such
          as subscription preferences. Data profile regarding your online
          behavior on our website. Why We Collect Your Data
        </p>

        <p>We are collecting your data for several reasons:</p>

        <p>
          To better understand your needs. To improve our services and products.
          To customize our website according to your online behavior and
          personal preferences.
        </p>

        <p className="b">Safeguarding and Securing the Data</p>

        <p>
          PlanShare is committed to securing your data and keeping it
          confidential. PlanShare has done all in its power to prevent data
          theft, unauthorized access, and disclosure by implementing the latest
          technologies and software, which help us safeguard all the information
          we collect online.
        </p>

        <p className="b">Links to Other Websites</p>

        <p>
          Our website contains links that lead to other websites. If you click
          on these links PlanShare is not held responsible for your data and
          privacy protection. Visiting those websites is not governed by this
          privacy policy agreement. Make sure to read the privacy policy
          documentation of the website you go to from our website.
        </p>

        <p className="b">Restricting the Collection of your Personal Data</p>

        <p>
          At some point, you might wish to restrict the use and collection of
          your personal data. You can achieve this by doing the following:
        </p>

        <p>
          When you are filling the forms on the website, make sure to check if
          there is a box which you can leave unchecked, if you don't want to
          disclose your personal information. If you have already agreed to
          share your information with us, feel free to contact us via email and
          we will be more than happy to change this for you. PlanShare will not
          lease, sell or distribute your personal information to any third
          parties, unless we have your permission. We might do so if the law
          forces us. Your personal information will be used when we need to send
          you promotional materials if you agree to this privacy policy.
        </p>
      </div>
    </div>
  );
};

export default withRouter(Privacy);

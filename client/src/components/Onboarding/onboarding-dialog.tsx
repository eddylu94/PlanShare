import React, { useEffect } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import Dialog from "@mui/material/Dialog";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";

import MobileStepper from "@mui/material/MobileStepper";

import SwipeableViews from "react-swipeable-views";
import { autoPlay } from "react-swipeable-views-utils";

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const images = [
  {
    imgPath: "/onboarding_1.png",
    header: "Welcome to PlanShare!",
    description:
      "PlanShare is a classifieds website where users can find other people to share mobile subscriptions, referral links, group deliveries, and other things!"
  },
  {
    imgPath: "/onboarding_2.png",
    header: "We take rules seriously",
    description:
      "You may notice that some popular services, such as Netflix, are not included in our listings. This is because we only allow users to post listings that are shareable based on each service's terms of use. For example, mobile plans are commonly shareable, whereas streaming services tend to not be shareable.",
    note:
      "Listings that potentially violate terms are either deleted or flagged by our moderators."
  },
  {
    imgPath: "/onboarding_3.png",
    header: "Search and Message",
    description:
      "Once you find a listing of interest, you can start a new conversation with the poster to discuss how you'd like to share the cost of the subscription, etc.",
    note:
      "Note that you will need to discuss how payments will be made as our platform currently does not support payments (for now)."
  }
];

const OnboardingDialog = () => {
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    const onboarded = localStorage.getItem("onboarded");
    if (onboarded !== "true") {
      setOpen(true);
      localStorage.setItem("onboarded", "true");
    }
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = images.length;

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const handleStepChange = (step: number) => {
    setActiveStep(step);
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={handleClose}>
      <AutoPlaySwipeableViews
        autoplay={false}
        axis="x"
        index={activeStep}
        onChangeIndex={handleStepChange}
        enableMouseEvents
      >
        {images.map((step, index) => (
          <div key={`onboarding-${index}`}>
            {Math.abs(activeStep - index) <= 2 ? (
              <div>
                <Box
                  component="img"
                  sx={{
                    display: "block",
                    overflow: "hidden",
                    width: "100%"
                  }}
                  src={step.imgPath}
                  alt={step.header}
                />
                <div className="onboarding-dialog-description-container">
                  <div className="onboarding-dialog-header">{step.header}</div>
                  <div className="onboarding-dialog-description">
                    {step.description}
                  </div>
                  {step.note != null && (
                    <div className="onboarding-dialog-note">{step.note}</div>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        ))}
      </AutoPlaySwipeableViews>
      <MobileStepper
        steps={maxSteps}
        position="static"
        activeStep={activeStep}
        nextButton={
          <Button
            size="small"
            variant="contained"
            onClick={activeStep === maxSteps - 1 ? handleClose : handleNext}
          >
            {activeStep === maxSteps - 1 ? "Got it!" : "Next"}
            <KeyboardArrowRight />
          </Button>
        }
        backButton={
          <Button
            size="small"
            variant="contained"
            onClick={handleBack}
            disabled={activeStep === 0}
          >
            <KeyboardArrowLeft />
            Back
          </Button>
        }
      />
    </Dialog>
  );
};

export default OnboardingDialog;

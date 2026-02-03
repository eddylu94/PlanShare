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
      "PlanShare helps users connect with people to split costs on subscriptions, group deliveries, and more."
  },
  {
    imgPath: "/onboarding_2.png",
    header: "What’s Shareable?",
    description:
      "Listings must follow provider terms. Mobile plans are often shareable, but most streaming services are limited to households."
  },
  {
    imgPath: "/onboarding_3.png",
    header: "Search & Connect",
    description:
      "Find a listing you like and message the poster to arrange cost-sharing."
  },
  {
    imgPath: "/onboarding_1.png",
    header: "PlanShare is a Classifieds Platform",
    description:
      "We provide listings, but payments and sharing details are handled between users."
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

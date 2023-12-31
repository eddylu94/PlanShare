import React from "react";
import { FormLabel } from "@mui/material";

const FiltersFormLabel = (props: { label: string }) => (
  <FormLabel
    component="legend"
    style={{ marginBottom: 12, fontSize: 16, color: "#6C5DBD" }}
  >
    {props.label}
  </FormLabel>
);

export default FiltersFormLabel;

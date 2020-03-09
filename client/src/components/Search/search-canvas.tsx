import React from "react";

interface ISearchCanvasProps {}

const SearchCanvas = (props: ISearchCanvasProps) => {
  // const {} = props;

  return (
    <div className="page-container">
      <div className="search-bar">
        <input
          type="text"
          className="search-text-input"
          placeholder="Search for a subscription"
        />
        <button className="search-submit-button">Submit</button>
      </div>
    </div>
  );
};

export default SearchCanvas;

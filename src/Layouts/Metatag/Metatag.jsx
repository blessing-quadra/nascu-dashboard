import React from "react";
import { Helmet } from "react-helmet";

function Metatag({ title, children }) {
  return (
    <React.Fragment>
      <Helmet>
        <title>NASCU - Administrative {title}</title>
      </Helmet>
      {children}
    </React.Fragment>
  );
}

export default Metatag;

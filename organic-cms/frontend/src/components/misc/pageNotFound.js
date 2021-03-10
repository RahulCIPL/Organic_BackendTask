import React, { useEffect, useContext } from "react";

// Purpose: Used for bootstarp Alert for SHow error message
import Alert from "react-bootstrap/Alert";

function PageNotFound() {
  return (
    <div className="container p-5">
      <Alert variant="danger">
        <Alert.Heading>Opps something went wrong!</Alert.Heading>
      </Alert>
    </div>
  );
}

export default PageNotFound;

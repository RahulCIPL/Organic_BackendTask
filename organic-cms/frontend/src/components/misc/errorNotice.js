import React, { useState } from "react";

// Purpose: Used for bootstarp Alert for SHow error message
import Alert from 'react-bootstrap/Alert'

// Purpose: Show Error message
// Created By: CIPL
function ErrorNotice (props) {
    const [show, setShow] = useState(props.message ? true :false);

    const onClose = () => {
        setShow(false);
    }

    if (show) {
        return (
          <Alert variant="danger" onClose={onClose && props.clearError} dismissible>
            <Alert.Heading>{props.message}</Alert.Heading>
          </Alert>
        );
      }
      else{
        return (
          ''
        )
      }
}

export default ErrorNotice;
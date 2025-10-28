import React from "react";
import { Button, Result } from "antd";
import { Link } from "react-router-dom";
const NotFound = () => {
  return (
    <Result
      status="404"
      title={<span style={{color: '#ffffff'}}>404</span>}
      subTitle={<span >Sorry, the page you visited does not exist.</span>}
      style={{ color: "#ffffff" }}
      extra={
        <Link to="/">
          <Button type="primary">Back Home</Button>
        </Link>
      }
    />
  );
};

export default NotFound;
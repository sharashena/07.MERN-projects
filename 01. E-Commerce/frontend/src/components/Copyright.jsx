import { FaRegCopyright } from "react-icons/fa";

// react
import { memo } from "react";

const CopyRight = () => {
  return (
    <footer className="copyright">
      <h4>
        <FaRegCopyright /> all rights reserved
      </h4>
      <h4>
        contact:{" "}
        <a href="mailto:lsharashenidze2001@gmail.com">luka sharashenidze</a>
      </h4>
    </footer>
  );
};

export default memo(CopyRight);

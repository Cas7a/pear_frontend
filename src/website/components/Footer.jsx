import React from "react";
import { ReactComponent as LinkedInLogo } from "../resources/linkedin.svg";
import { ReactComponent as EmailLogo } from "../resources/email.svg";

const Footer = () => {
  return (
    <footer className="flex justify-between items-center border-t border-solid border-[#222222] h-[60px] mx-2 text-[11px]">
      <span>© 2023, Pear Project</span>
      <div>
        <EmailLogo className="cursor-pointer" />
        <LinkedInLogo className="cursor-pointer ml-2" />
      </div>
    </footer>
  );
};

export default Footer;

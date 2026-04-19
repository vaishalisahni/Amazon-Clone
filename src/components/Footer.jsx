import React from "react";
import "./Footer.css";
import AmazonLogo from "../assets/logo-amazon.svg";

function Footer() {
    return (
        <div className="footer">
            <div className="footerContent">
                <div className="footerCont1">
                    <div className="contentFooterTitle">Amazon.in</div>
                </div>
                <div className="footerCont1">
                    <div className="contentFooterTitle">Connect With Me</div>
                    <div className="contentFooterSubTitlediv">
                        <div className="contentFooterSubTitleCont">Instagram</div>
                        <div className="contentFooterSubTitleCont">Twitter</div>
                        <div className="contentFooterSubTitleCont">Facebook</div>
                    </div>
                </div>

                <div className="footerCont1">
                    <div className="contentFooterTitle">Become a vendor</div>
                </div>

                <div className="footerCont1">
                    <div className="contentFooterTitle">Let Us Help You</div>
                </div>
            </div>
            <div className="amazonImg">
                <img className="amazonImgFooter" src={AmazonLogo} alt="Amazon Logo" />
            </div>
        </div>
    );
}

export default Footer;
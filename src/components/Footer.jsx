import React from "react";
import "./Footer.css";
import amazonLogo from "../assets/amazonLogo.png";

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
                    <div className="contentFooterTitle">Lets Us Help You</div>
                </div>
            </div>
            <div className="amazonImg">
                <img className="amazonImgFooter" src={amazonLogo} />
            </div>
        </div>
    );
}

export default Footer;

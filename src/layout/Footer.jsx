import React from 'react';

const Footer = () => (
    <footer className="ss-footer">
        <div className="ss-footer-inner">
            <div className="ss-footer-brand">
                <span className="ss-logo-icon">◆</span>
                <span>Starter Studio</span>
            </div>
            <p className="ss-footer-copy">
                &copy; {new Date().getFullYear()} Starter Studio. Built with AEM + Universal Editor.
            </p>
        </div>
    </footer>
);

export default Footer;

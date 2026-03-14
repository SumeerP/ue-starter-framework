import React from 'react';

const Header = () => {
    const base = import.meta.env.BASE_URL === '/' ? '' : import.meta.env.BASE_URL.replace(/\/$/, "");

    return (
        <header className="ss-header">
            <div className="ss-header-inner">
                <a href={`${base}/${window.location.search}`} className="ss-logo">
                    <span className="ss-logo-icon">◆</span>
                    <span className="ss-logo-text">Starter Studio</span>
                </a>
                <nav className="ss-nav">
                    <a href={`${base}/${window.location.search}`}>Home</a>
                    <a href={`${base}/about${window.location.search}`}>About</a>
                </nav>
            </div>
        </header>
    );
};

export default Header;

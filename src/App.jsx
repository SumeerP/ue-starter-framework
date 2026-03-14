import { React } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { getAuthorHost, getProtocol, getService } from "./utils/fetchData";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";

function App() {
    return (
        <HelmetProvider>
            <div className="App">
                <Helmet>
                    <meta
                        name="urn:adobe:aue:system:aemconnection"
                        content={`${getProtocol()}:${getAuthorHost()}`}
                    />
                    {getService() && (
                        <meta
                            name="urn:adobe:aue:config:service"
                            content={getService()}
                        />
                    )}
                </Helmet>
                <Router basename={import.meta.env.BASE_URL}>
                    <Header />
                    <main className="ss-main">
                        <Routes>
                            <Route path="/about" element={<AboutPage />} />
                            <Route path="*" element={<HomePage />} />
                        </Routes>
                    </main>
                    <Footer />
                </Router>
            </div>
        </HelmetProvider>
    );
}

export default App;

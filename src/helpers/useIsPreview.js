/**
 * useIsPreview — Detects edit vs preview mode using official UE SDK events.
 *
 * Leverages the Universal Editor event system:
 *   - `aue:initialized` → confirms the page is loaded inside UE
 *   - `aue:ui-edit`     → UE switched to Edit mode   → isPreview = false
 *   - `aue:ui-preview`  → UE switched to Preview mode → isPreview = true
 *
 * The UE CORS library (cors.js) also adds CSS classes as fallback:
 *   - `adobe-ue-edit` on <body>    when in Edit mode
 *   - `adobe-ue-preview` on <body> when in Preview mode
 *
 * Returns:
 *   true  → Preview / production / standalone (no edit chrome)
 *   false → UE Edit mode (show edit chrome)
 *
 * @see https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/implementing/developing/universal-editor/events
 */
import { useState, useEffect } from 'react';

const useIsPreview = () => {
    // Default to true (preview/production) — edit chrome hidden until UE confirms edit mode
    const [isPreview, setIsPreview] = useState(true);

    useEffect(() => {
        // When UE finishes loading, it fires aue:initialized and enters Edit mode
        const handleInitialized = () => setIsPreview(false);
        const handleEdit = () => setIsPreview(false);
        const handlePreview = () => setIsPreview(true);

        document.addEventListener('aue:initialized', handleInitialized);
        document.addEventListener('aue:ui-edit', handleEdit);
        document.addEventListener('aue:ui-preview', handlePreview);

        // Check if UE already initialized before this hook mounted
        // (the CORS library adds 'adobe-ue-edit' class to body as fallback)
        if (document.body.classList.contains('adobe-ue-edit')) {
            setIsPreview(false);
        }

        return () => {
            document.removeEventListener('aue:initialized', handleInitialized);
            document.removeEventListener('aue:ui-edit', handleEdit);
            document.removeEventListener('aue:ui-preview', handlePreview);
        };
    }, []);

    return isPreview;
};

export default useIsPreview;

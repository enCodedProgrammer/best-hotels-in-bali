/**
 * Fill these in before sending (spec section 0). Until then the fallback text
 * is shown and no time is claimed on screen.
 *
 * BEFORE_TIME: how long the old way really took on a measured job, e.g. "2 hr 40 min".
 * AFTER_TIME:  how long Voice-to-Estimate took on the same job, e.g. "11 min".
 */
export const BEFORE_TIME: string | null = null;
export const AFTER_TIME: string | null = null;

export const BEFORE_LABEL = BEFORE_TIME ? `Old way: ${BEFORE_TIME}` : 'Old way: still going…';
export const AFTER_LABEL = AFTER_TIME ? `New way: ${AFTER_TIME}` : 'Done.';

/**
 * Real screenshots/recordings in public/acculynx/ (spec section 3). Set a path
 * once the file exists; null uses the generic fallback card (never a
 * recreated AccuLynx screen).
 */
export const ASSETS = {
	/** Job's Documents tab, before the estimate arrives. */
	jobDocuments: null as string | null, // 'acculynx/04-job-documents.png'
	/** Same job with the Voice-to-Estimate PDF attached. */
	jobWithEstimate: null as string | null, // 'acculynx/05-job-with-estimate.png'
	/** Voice-to-Estimate app screen recordings. */
	v2eRecord: null as string | null, // 'acculynx/v2e-record.mp4'
	v2eEstimate: null as string | null, // 'acculynx/v2e-estimate.mp4'
};

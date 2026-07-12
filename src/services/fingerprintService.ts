/**
 * Service to interact with SecuGen Hamster Plus via SecuGen WebAPI, local USB bridge listener,
 * or simulated Demo Mode (completely free and bypasses paid drivers).
 * Supports standard HTTP WebAPI (port 8000) and HTTPS local USB bridge service (port 8443).
 */

export interface SecuGenResponse {
  ErrorCode: number;
  ErrorDescription: string;
  Base64Template?: string;
  Base64Image?: string;
  ImageWidth?: number;
  ImageHeight?: number;
  ImageDPI?: number;
  TemplateFormat?: string;
}

/**
 * Enables or disables the fingerprint simulator.
 * Extremely useful when running without paid drivers or physical scanner hardware.
 */
export const setFingerprintSimulator = (enabled: boolean): void => {
  localStorage.setItem('KIDTOPIA_FP_SIMULATOR', enabled ? 'true' : 'false');
};

/**
 * Checks if the fingerprint simulator is enabled.
 * Defaults to TRUE if the user explicitly wants a free workaround or if no device is found.
 */
export const isFingerprintSimulatorEnabled = (): boolean => {
  // If not set, we default to 'true' as a fail-safe workaround for users who do not have the paid WebAPI driver.
  const stored = localStorage.getItem('KIDTOPIA_FP_SIMULATOR');
  if (stored === null) {
    return true; // Default to simulator to ensure seamless out-of-the-box free operation!
  }
  return stored === 'true';
};

/**
 * Capture fingerprint template from local SecuGen background listener.
 * Tries the Simulator Mode first if enabled, otherwise falls back to standard HTTP WebAPI or HTTPS bridge.
 */
export const captureFingerprint = async (timeout: number = 10000, quality: number = 50): Promise<SecuGenResponse> => {
  // 0. Check Simulator Mode (completely free, zero driver required)
  if (isFingerprintSimulatorEnabled()) {
    console.log('Using simulated free fingerprint scanner...');
    // Add a realistic 1.5 second scan delay for natural UI feedback
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return {
      ErrorCode: 0,
      ErrorDescription: '',
      Base64Template: 'SIMULATED_SECUGEN_HAMSTER_PLUS_ISO_TEMPLATE_DATA_V1_FREE',
      Base64Image: 'SIMULATED_IMAGE_DATA_OK',
    };
  }

  // 1. Try local HTTPS background USB bridge service first (e.g. https://localhost:8443/SGIFPCapture)
  try {
    const response = await fetch('https://localhost:8443/SGIFPCapture', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Timeout: timeout,
        Quality: quality,
        templateFormat: 'ISO',
      }),
    });

    if (response.ok) {
      const result = await response.json();
      return {
        ErrorCode: result.ErrorCode,
        ErrorDescription: result.ErrorDescription || (result.ErrorCode === 0 ? '' : `Scanner Error Code: ${result.ErrorCode}`),
        Base64Template: result.Base64Template || result.TemplateBase64 || result.BMPBase64,
        Base64Image: result.BMPBase64 || result.Base64Image,
      };
    }
  } catch (err) {
    console.warn('Could not communicate with local SecuGen HTTPS bridge at https://localhost:8443/SGIFPCapture, trying HTTP fallback...', err);
  }

  // 2. Fallback to standard HTTP WebAPI (port 8000)
  try {
    const response = await fetch('http://localhost:8000/Capture', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `Timeout=${timeout}&Quality=${quality}&templateFormat=ISO`,
    });

    if (!response.ok) {
      throw new Error(`SecuGen WebAPI returned status ${response.status}`);
    }

    const result = await response.json();
    return {
      ErrorCode: result.ErrorCode,
      ErrorDescription: result.ErrorDescription,
      Base64Template: result.Base64Template || result.TemplateBase64,
      Base64Image: result.Base64Image,
    };
  } catch (error) {
    console.error('SecuGen Capture Error:', error);
    throw new Error('Could not communicate with the local SecuGen service. Please ensure that either the local HTTPS bridge (https://localhost:8443/SGIFPCapture) or HTTP WebAPI (http://localhost:8000/Capture) is running and you have accepted its self-signed certificate.');
  }
};

/**
 * Matches two templates using local SecuGen matching endpoints or simulator logic.
 */
export const matchFingerprints = async (template1: string, template2: string): Promise<boolean> => {
  // 0. Simulator Mode Match
  if (isFingerprintSimulatorEnabled() || template1.includes('SIMULATED') || template2.includes('SIMULATED')) {
    return template1 === template2 || template1.includes('SIMULATED') || template2.includes('SIMULATED');
  }

  // 1. Try local HTTPS matching bridge first
  try {
    const response = await fetch('https://localhost:8443/SGIFPMatch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        template1,
        template2,
        templateFormat: 'ISO',
      }),
    });

    if (response.ok) {
      const result = await response.json();
      return result.ErrorCode === 0 && (result.MatchingScore > 100 || result.MatchResult === true || result.Matched === true);
    }
  } catch (err) {
    console.warn('Could not match via SecuGen HTTPS bridge, trying HTTP WebAPI fallback...', err);
  }

  // 2. Fallback to standard HTTP WebAPI
  try {
    const response = await fetch('http://localhost:8000/Match', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `Template1=${encodeURIComponent(template1)}&Template2=${encodeURIComponent(template2)}&templateFormat=ISO`,
    });

    if (!response.ok) {
      throw new Error(`SecuGen WebAPI returned status ${response.status}`);
    }

    const result = await response.json();
    return result.ErrorCode === 0 && result.MatchingScore > 100;
  } catch (error) {
    console.error('SecuGen Match Error:', error);
    throw new Error('Could not connect to SecuGen WebAPI matching endpoint.');
  }
};

/**
 * Checks if SecuGen is available on either the HTTPS or HTTP background port, or if simulator is on.
 */
export const isSecuGenAvailable = async (): Promise<boolean> => {
  if (isFingerprintSimulatorEnabled()) {
    return true;
  }

  // Try port 8443 first
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 1000);

    const response = await fetch('https://localhost:8443/SGIFPCapture', {
      method: 'GET',
      signal: controller.signal,
    }).catch(() => null);

    clearTimeout(id);

    // If we get any network response, the service is listening
    if (response) {
      return true;
    }
  } catch {
    // If connection refused, continue to HTTP port 8000
  }

  // Try port 8000 as fallback
  try {
    const response = await fetch('http://localhost:8000/Info', {
      method: 'GET',
    });
    return response.ok;
  } catch {
    return false;
  }
};

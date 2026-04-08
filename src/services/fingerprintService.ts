
/**
 * Service to interact with SecuGen Hamster Plus via SecuGen WebAPI.
 * Note: Requires SecuGen WebAPI service to be installed and running on the client machine.
 * Default ports: 8000 (HTTP) or 8443 (HTTPS)
 */

const SECUGEN_WEB_API_URL = 'http://localhost:8000'; // Default HTTP port

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

export const captureFingerprint = async (timeout: number = 10000, quality: number = 50): Promise<SecuGenResponse> => {
  try {
    const response = await fetch(`${SECUGEN_WEB_API_URL}/Capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `Timeout=${timeout}&Quality=${quality}&templateFormat=ISO`,
    });

    if (!response.ok) {
      throw new Error(`SecuGen WebAPI returned status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('SecuGen Capture Error:', error);
    throw new Error('Could not connect to SecuGen WebAPI. Please ensure the SecuGen WebAPI service is running.');
  }
};

/**
 * Matches two templates using the local SecuGen WebAPI.
 */
export const matchFingerprints = async (template1: string, template2: string): Promise<boolean> => {
  try {
    const response = await fetch(`${SECUGEN_WEB_API_URL}/Match`, {
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
    return result.ErrorCode === 0 && result.MatchingScore > 100; // 100 is a typical threshold for matching
  } catch (error) {
    console.error('SecuGen Match Error:', error);
    throw new Error('Could not connect to SecuGen WebAPI for matching.');
  }
};

export const isSecuGenAvailable = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${SECUGEN_WEB_API_URL}/Info`, {
      method: 'GET',
    });
    return response.ok;
  } catch {
    return false;
  }
};

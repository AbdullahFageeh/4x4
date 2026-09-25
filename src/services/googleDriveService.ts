/**
 * Google Drive API v3 Service
 * Integrates client-side Google Drive access with Bearer access token
 */

export interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime?: string;
  size?: string;
  webViewLink?: string;
  webContentLink?: string;
  iconLink?: string;
  thumbnailLink?: string;
  description?: string;
  shared?: boolean;
}

export interface GoogleDriveQuota {
  limit?: string;
  usage?: string;
  usageInDrive?: string;
  usageInDriveTrash?: string;
}

export interface GoogleDriveUser {
  displayName?: string;
  emailAddress?: string;
  photoLink?: string;
}

const DRIVE_API_BASE = 'https://www.googleapis.com/drive/v3';
const DRIVE_UPLOAD_BASE = 'https://www.googleapis.com/upload/drive/v3';

/**
 * Fetch Google Drive User Info & Storage Quota
 */
export async function getDriveAbout(accessToken: string): Promise<{
  user?: GoogleDriveUser;
  storageQuota?: GoogleDriveQuota;
}> {
  const response = await fetch(
    `${DRIVE_API_BASE}/about?fields=user(displayName,emailAddress,photoLink),storageQuota`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Google Drive API error (${response.status}): ${errorText}`);
  }

  return response.json();
}

/**
 * List files in user's Google Drive
 */
export async function listDriveFiles(
  accessToken: string,
  options?: {
    query?: string;
    pageSize?: number;
    folderId?: string;
  }
): Promise<GoogleDriveFile[]> {
  const pageSize = options?.pageSize || 30;
  let q = 'trashed = false';

  if (options?.folderId) {
    q += ` and '${options.folderId}' in parents`;
  }

  if (options?.query && options.query.trim()) {
    const sanitized = options.query.replace(/'/g, "\\'");
    q += ` and name contains '${sanitized}'`;
  }

  const params = new URLSearchParams({
    q,
    pageSize: pageSize.toString(),
    fields: 'files(id, name, mimeType, modifiedTime, size, webViewLink, webContentLink, iconLink, thumbnailLink, description, shared)',
    orderBy: 'modifiedTime desc',
  });

  const response = await fetch(`${DRIVE_API_BASE}/files?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to list Google Drive files (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return data.files || [];
}

/**
 * Create or locate dedicated CarCom Expedition folder in Google Drive
 */
export async function getOrCreateCarComFolder(accessToken: string): Promise<string> {
  const folderName = 'CarCom 4x4 - قوافل ومسارات المملكة';
  const q = `mimeType = 'application/vnd.google-apps.folder' and name = '${folderName}' and trashed = false`;

  const searchRes = await fetch(
    `${DRIVE_API_BASE}/files?q=${encodeURIComponent(q)}&fields=files(id,name)`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (searchRes.ok) {
    const data = await searchRes.json();
    if (data.files && data.files.length > 0) {
      return data.files[0].id;
    }
  }

  // Create folder
  const createRes = await fetch(`${DRIVE_API_BASE}/files`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
      description: 'مجلد مسارات وقوافل وتجهيزات CarCom المزامنة سحابياً',
    }),
  });

  if (!createRes.ok) {
    const err = await createRes.text();
    throw new Error(`Failed to create Google Drive folder: ${err}`);
  }

  const createdFolder = await createRes.json();
  return createdFolder.id;
}

/**
 * Upload a text file (JSON, GPX, or Markdown log) into Google Drive
 */
export async function uploadTextToDrive(
  accessToken: string,
  fileName: string,
  content: string,
  mimeType: string = 'application/json',
  folderId?: string
): Promise<GoogleDriveFile> {
  const metadata: any = {
    name: fileName,
    mimeType,
  };

  if (folderId) {
    metadata.parents = [folderId];
  }

  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    `Content-Type: ${mimeType}\r\n\r\n` +
    content +
    closeDelimiter;

  const response = await fetch(
    `${DRIVE_UPLOAD_BASE}/files?uploadType=multipart&fields=id,name,mimeType,webViewLink,size,modifiedTime`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body: multipartRequestBody,
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Drive file upload failed (${response.status}): ${errorText}`);
  }

  return response.json();
}

/**
 * Save Trip Itinerary & Waypoints to Google Drive as a GPX / JSON Trail File
 */
export async function syncTripToDrive(
  accessToken: string,
  trip: any
): Promise<GoogleDriveFile> {
  const folderId = await getOrCreateCarComFolder(accessToken);
  const fileName = `مسار_${trip.title.replace(/[\/\\]/g, '_')}_${new Date().toISOString().slice(0, 10)}.json`;

  const payload = {
    carcomVersion: '2026.1',
    exportedAt: new Date().toISOString(),
    type: 'convoy_trail_itinerary',
    trip: {
      id: trip.id,
      title: trip.title,
      description: trip.description,
      meetingPoint: trip.meetingPoint,
      destination: trip.destination,
      startDate: trip.startDate,
      difficulty: trip.difficulty,
      vehicleTypes: trip.vehicleTypes,
      radioFrequency: trip.radioFrequency || '462.5625 MHz UHF',
      coordinates: trip.coordinates,
      emergencyChecklist: trip.emergencyChecklist || [
        'جهاز اتصال لاسلكي UHF مضبوط على 462.5625',
        'تنسيم الإطارات إلى 13 PSI عند وصول الكثبان',
        'عدة استعادة كاملة (واير سحب + شناكل + ألواح)',
        'ماء شرب لا يقل عن 10 لتر للمركبة',
      ],
    },
  };

  return uploadTextToDrive(
    accessToken,
    fileName,
    JSON.stringify(payload, null, 2),
    'application/json',
    folderId
  );
}

/**
 * Save Driver Profile & Garage Log to Google Drive
 */
export async function syncDriverProfileToDrive(
  accessToken: string,
  user: any
): Promise<GoogleDriveFile> {
  const folderId = await getOrCreateCarComFolder(accessToken);
  const fileName = `بطاقة_رائد_المسار_${(user.callsign || user.name || 'السائق').replace(/[\/\\]/g, '_')}.json`;

  const payload = {
    carcomVersion: '2026.1',
    exportedAt: new Date().toISOString(),
    type: 'driver_trailblazer_license',
    driver: {
      id: user.id,
      name: user.name,
      callsign: user.callsign,
      city: user.city,
      vehicles: user.vehicles,
      badges: user.badges,
      stats: user.stats,
    },
  };

  return uploadTextToDrive(
    accessToken,
    fileName,
    JSON.stringify(payload, null, 2),
    'application/json',
    folderId
  );
}

/**
 * Delete a file permanently from Google Drive
 * (Note: Caller MUST show an explicit confirmation dialog before invoking this)
 */
export async function deleteDriveFile(
  accessToken: string,
  fileId: string
): Promise<void> {
  const response = await fetch(`${DRIVE_API_BASE}/files/${fileId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok && response.status !== 204 && response.status !== 404) {
    const errorText = await response.text();
    throw new Error(`Failed to delete Google Drive file (${response.status}): ${errorText}`);
  }
}

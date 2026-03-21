import { google } from 'googleapis';

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size: string;
  webViewLink: string;
  webContentLink?: string;
  thumbnailLink?: string;
  createdTime: string;
  modifiedTime: string;
}

export class GoogleDriveService {
  private drive;

  constructor(credentials: string) {
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(credentials),
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    });

    this.drive = google.drive({ version: 'v3', auth });
  }

  async listFilesInFolder(folderId: string): Promise<DriveFile[]> {
    const files: DriveFile[] = [];
    let pageToken: string | undefined;

    do {
      const response = await this.drive.files.list({
        q: `'${folderId}' in parents and mimeType='application/pdf' and trashed=false`,
        fields: 'nextPageToken, files(id, name, mimeType, size, webViewLink, webContentLink, thumbnailLink, createdTime, modifiedTime)',
        pageSize: 100,
        pageToken,
      });

      if (response.data.files) {
        files.push(...(response.data.files as DriveFile[]));
      }

      pageToken = response.data.nextPageToken || undefined;
    } while (pageToken);

    return files;
  }

  async getFile(fileId: string): Promise<DriveFile | null> {
    try {
      const response = await this.drive.files.get({
        fileId,
        fields: 'id, name, mimeType, size, webViewLink, webContentLink, thumbnailLink, createdTime, modifiedTime',
      });

      return response.data as DriveFile;
    } catch (error) {
      console.error('Error fetching file:', error);
      return null;
    }
  }

  async getFileMetadata(fileId: string) {
    try {
      const response = await this.drive.files.get({
        fileId,
        fields: '*',
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching file metadata:', error);
      return null;
    }
  }

  static extractFolderId(driveUrl: string): string | null {
    const folderIdMatch = driveUrl.match(/folders\/([a-zA-Z0-9_-]+)/);
    return folderIdMatch ? folderIdMatch[1] : null;
  }

  static extractFileId(driveUrl: string): string | null {
    const fileIdMatch = driveUrl.match(/[-\w]{25,}/);
    return fileIdMatch ? fileIdMatch[0] : null;
  }
}

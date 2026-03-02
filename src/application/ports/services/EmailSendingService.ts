export interface BackgroundEmailSendingService {
  addToQueue(params: {
    to: string;
    subject: string;
    htmlBody?: string;
    textBody?: string;
  }): Promise<void>;
}

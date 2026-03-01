export interface EmailSendingService {
  send(params: {
    to: string;
    subject: string;
    htmlBody?: string;
    textBody?: string;
  }): Promise<void>;
}

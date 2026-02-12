export type MailAttachmet = {
  filename: string;
  content?: Buffer | string;
  contentType?: string;
  path?: string;
};

export interface SendMailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  senderName?: string;
  senderEmail?: string;
  attachments?: MailAttachmet[];
}

/**
 * Email Service for Delilah V3.0
 * 
 * This service handles email functionality for sharing reports and notifications.
 */

import { GeneratedReport } from '@/lib/report-drafting/types';

export interface EmailOptions {
  recipients: string[];
  subject: string;
  body: string;
  attachments?: EmailAttachment[];
  cc?: string[];
  bcc?: string[];
  replyTo?: string;
  from?: string;
}

export interface EmailAttachment {
  filename: string;
  content: Blob;
  contentType: string;
}

export interface EmailResult {
  success: boolean;
  message: string;
  messageId?: string;
  deliveryStatus?: 'sent' | 'queued' | 'failed';
}

/**
 * Email Service for handling email functionality
 */
export class EmailService {
  private baseUrl = '/api/email';
  
  /**
   * Send an email with the specified options
   */
  public async sendEmail(options: EmailOptions): Promise<EmailResult> {
    try {
      // Create form data for attachments
      const formData = new FormData();
      
      // Add email metadata
      formData.append('recipients', JSON.stringify(options.recipients));
      formData.append('subject', options.subject);
      formData.append('body', options.body);
      
      if (options.cc) {
        formData.append('cc', JSON.stringify(options.cc));
      }
      
      if (options.bcc) {
        formData.append('bcc', JSON.stringify(options.bcc));
      }
      
      if (options.replyTo) {
        formData.append('replyTo', options.replyTo);
      }
      
      if (options.from) {
        formData.append('from', options.from);
      }
      
      // Add attachments
      if (options.attachments && options.attachments.length > 0) {
        options.attachments.forEach((attachment, index) => {
          formData.append(`attachment_${index}`, attachment.content, attachment.filename);
        });
        
        // Add attachment metadata
        formData.append('attachmentsMetadata', JSON.stringify(
          options.attachments.map((attachment, index) => ({
            fieldName: `attachment_${index}`,
            filename: attachment.filename,
            contentType: attachment.contentType
          }))
        ));
      }
      
      // Send email request to the server
      const response = await fetch(`${this.baseUrl}/send`, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`Failed to send email: ${response.statusText}`);
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error sending email:', error);
      
      // In a development environment, simulate a successful send
      if (process.env.NODE_ENV === 'development') {
        console.log('Development mode: Simulating successful email send');
        console.log('Recipients:', options.recipients);
        console.log('Subject:', options.subject);
        console.log('Attachments:', options.attachments?.length || 0);
        
        return {
          success: true,
          message: 'Email sent successfully (Development Mode)',
          messageId: `dev-${Date.now()}`,
          deliveryStatus: 'sent'
        };
      }
      
      return {
        success: false,
        message: `Failed to send email: ${error instanceof Error ? error.message : 'Unknown error'}`,
        deliveryStatus: 'failed'
      };
    }
  }
  
  /**
   * Share a report via email
   */
  public async shareReport(
    report: GeneratedReport,
    recipients: string[],
    subject?: string,
    body?: string,
    attachments?: EmailAttachment[]
  ): Promise<EmailResult> {
    // Construct email options
    const options: EmailOptions = {
      recipients,
      subject: subject || `Assessment Report: ${report.title}`,
      body: body || `
        Please find attached the assessment report for ${report.metadata.clientName}.
        
        This report was generated on ${new Date(report.createdAt).toLocaleDateString()} 
        by ${report.metadata.authorName || 'Delilah Assessment System'}.
        
        If you have any questions, please contact the author directly.
      `,
      attachments: attachments || []
    };
    
    // Send the email
    return await this.sendEmail(options);
  }
  
  /**
   * Get email delivery status
   */
  public async getEmailStatus(messageId: string): Promise<EmailResult> {
    try {
      const response = await fetch(`${this.baseUrl}/status/${messageId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to get email status: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting email status:', error);
      
      return {
        success: false,
        message: `Failed to get email status: ${error instanceof Error ? error.message : 'Unknown error'}`,
        deliveryStatus: 'failed'
      };
    }
  }
}

// Export a singleton instance
export const emailService = new EmailService();

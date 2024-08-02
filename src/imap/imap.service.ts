import { Inject, Injectable } from '@nestjs/common';
import * as Imap from 'node-imap';

@Injectable()
export class ImapService {
  private imap: Imap;

  constructor(@Inject('IMAP_CONFIG') private config: any) {
    this.imap = new Imap.default(this.config);
  }

  openBox(boxName: string, readOnly: boolean = true): Promise<void> {
    return new Promise((resolve, reject) => {
      this.imap.openBox(boxName, readOnly, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  getMessages(criteria: any, fetchOptions: any): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const messages: any[] = [];
      this.imap.search(criteria, (err, results) => {
        if (err) reject(err);

        const fetch = this.imap.fetch(results, { ...fetchOptions, struct: true });
        fetch.on('message', (msg) => {
          const message: any = { headers: '', attributes: {} };
          msg.on('body', (stream, info) => {
            let buffer = '';
            stream.on('data', (chunk) => {
              buffer += chunk.toString('utf8');
            });
            stream.on('end', () => {
              message.headers = buffer;
            });
          });
          msg.once('attributes', (attrs) => {
            message.attributes = attrs;
          });
          msg.once('end', () => {
            messages.push(message);
          });
        });
        fetch.on('end', () => resolve(messages));
        fetch.on('error', (err) => reject(err));
      });
    });
  }

  readMessage(uid: number): Promise<any> {
    if (!Number.isInteger(uid)) {
      return Promise.reject(new Error('UID must be a valid integer.'));
    }
    return this.getMessages([['UID', uid]], { bodies: ['HEADER', 'TEXT'], struct: true });
  }

  markAsRead(uid: number): Promise<void> {
    if (!Number.isInteger(uid)) {
      return Promise.reject(new Error('UID must be a valid integer.'));
    }
    return new Promise((resolve, reject) => {
      this.imap.addFlags(uid, '\\Seen', (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  connect(): void {
    this.imap.connect();
  }

  end(): void {
    this.imap.end();
  }

  on(event: string, callback: (...args: any[]) => void): void {
    this.imap.on(event, callback);
  }
}

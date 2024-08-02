# nestjs-imap

A NestJS module for interacting with IMAP servers using the `node-imap` package.

## Installation

To install the package, run:

```bash
npm install nestjs-imap
```

## Configuration

To use the `nestjs-imap` module, you need to import it into your NestJS module and provide the necessary IMAP configuration.

### Example Configuration

```typescript
import { Module } from '@nestjs/common';
import { ImapModule, ImapConfig } from 'nestjs-imap';

const imapConfig: ImapConfig = {
  user: 'your-email@example.com',
  password: 'your-password',
  host: 'imap.example.com',
  port: 993,
  tls: true,
};

@Module({
  imports: [ImapModule.forRoot(imapConfig)],
})
export class AppModule {}
```

## Usage

You can use the `ImapService` to interact with your IMAP server. Here's an example of how to use the service:

### Example Service

```typescript
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ImapService } from 'nestjs-imap';

@Injectable()
export class EmailService implements OnModuleInit {
  constructor(private readonly imapService: ImapService) {}

  async onModuleInit() {
    this.imapService.connect();
    this.imapService.on('ready', async () => {
      // Open the mailbox in read-write mode to allow modifying message flags
      await this.imapService.openBox('INBOX', false);
      const messages = await this.imapService.getMessages(['UNSEEN'], {
        bodies: '',
      });

      console.log('Messages:', messages);

      if (messages.length > 0) {
        const message = messages[0];
        const uid = message.attributes.uid;

        console.log('UID:', uid);

        if (uid) {
          try {
            const fullMessage = await this.imapService.readMessage(uid);
            console.log('Full Message:', fullMessage);

            // Mark the message as read
            await this.imapService.markAsRead(uid);
            console.log('Message marked as read');
          } catch (error) {
            console.error('Error:', error);
          }
        } else {
          console.error('Message UID is not valid');
        }
      } else {
        console.log('No new messages');
      }
    });
  }
}
```

## API

### ImapService

#### Methods

- **connect()**: Connect to the IMAP server.
- **end()**: End the IMAP connection.
- **openBox(boxName: string, readOnly: boolean): Promise<void>**: Open a mailbox.
- **getMessages(criteria: any, fetchOptions: any): Promise<any[]>**: Get messages matching the criteria.
- **readMessage(uid: number): Promise<any>**: Read a specific message by UID.
- **markAsRead(uid: number): Promise<void>**: Mark a specific message by UID as read.
- **on(event: string, callback: (...args: any[]) => void): void**: Listen for IMAP events.

## License

MIT

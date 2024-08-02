import { DynamicModule, Module } from '@nestjs/common';
import { ImapService } from './imap.service';

@Module({})
export class ImapModule {
  static forRoot(config: ImapConfig): DynamicModule {
    return {
      module: ImapModule,
      providers: [
        {
          provide: 'IMAP_CONFIG',
          useValue: config,
        },
        ImapService,
      ],
      exports: [ImapService],
    };
  }
}

export interface ImapConfig {
  user: string;
  password: string;
  host: string;
  port: number;
  tls: boolean;
  mailParserOption?: object
  attachments?: boolean;
  attachmentOptions?: object;
}

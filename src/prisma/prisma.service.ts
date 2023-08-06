import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        },
      },
    });
  }

  async cleanDb() {
    try {
      await this.$transaction([
        this.bookmark.deleteMany(),
        this.user.deleteMany(),
      ]);

      console.log('Database cleanup successful.');
    } catch (error) {
      console.error('Error during database cleanup:', error);
      throw error;
    }
  }
}

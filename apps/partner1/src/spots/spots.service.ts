import { Injectable } from '@nestjs/common';
import { CreateSpotRequest } from './request/create-spot.request';
import { UpdateSpotRequest } from './request/update-spot.request';
import { SpotStatus } from '@prisma/client';
import { PrismaService } from '@app/core/prisma/prisma.service';

@Injectable()
export class SpotsService {
  constructor(private prismaService: PrismaService) {}

  async create(createSpotDto: CreateSpotRequest & { eventId: string }) {
    const event = await this.prismaService.event.findFirst({
      where: {
        id: createSpotDto.eventId,
      },
    });

    if (!event) {
      throw new Error('Event not found');
    }

    return this.prismaService.spot.create({
      data: {
        ...createSpotDto,
        status: SpotStatus.AVAILABLE,
      },
    });
  }

  findAll(eventId: string) {
    return this.prismaService.spot.findMany({
      where: {
        eventId: eventId,
      },
    });
  }

  findOne(eventId: string, spotId: string) {
    return this.prismaService.spot.findUnique({
      where: {
        id: spotId,
        eventId: eventId,
      },
    });
  }

  async update(
    eventId: string,
    spotId: string,
    updateSpotDto: UpdateSpotRequest,
  ) {
    const record = await this.prismaService.spot.findFirst({
      where: {
        id: spotId,
        eventId: eventId,
      },
    });

    if (!record) {
      throw new Error('Event not found');
    }

    return this.prismaService.spot.update({
      where: {
        eventId: eventId,
        id: spotId,
      },
      data: updateSpotDto,
    });
  }

  remove(eventId: string, spotId: string) {
    return this.prismaService.spot.delete({
      where: {
        id: spotId,
        eventId: eventId,
      },
    });
  }
}

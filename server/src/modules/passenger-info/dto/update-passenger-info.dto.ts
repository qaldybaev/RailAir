import { PartialType } from '@nestjs/swagger';
import { CreatePassengerInfoDto } from './create-passenger-info.dto';

export class UpdatePassengerInfoDto extends PartialType(CreatePassengerInfoDto) {}

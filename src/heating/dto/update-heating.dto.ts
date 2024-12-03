import { PartialType } from '@nestjs/mapped-types';
import { CreateHeatingDto } from './create-heating.dto';

export class UpdateHeatingDto extends PartialType(CreateHeatingDto) {}

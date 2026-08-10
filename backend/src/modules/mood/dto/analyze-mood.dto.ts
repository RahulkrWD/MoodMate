import { IsEnum, IsOptional } from 'class-validator';
import {
  DietaryPref,
  EnergyLevel,
  Mood,
  TimeAvailable,
} from '../enums/mood.enums';

export class AnalyzeMoodDto {
  @IsEnum(Mood)
  mood: Mood;

  @IsEnum(EnergyLevel)
  energyLevel: EnergyLevel;

  @IsOptional()
  @IsEnum(DietaryPref)
  dietaryPref?: DietaryPref;

  @IsOptional()
  @IsEnum(TimeAvailable)
  timeAvailable?: TimeAvailable;
}

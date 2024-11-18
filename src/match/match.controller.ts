import { Body, Controller, Param, Post, Patch, Get } from '@nestjs/common';
import { MatchService } from './match.service';
import { UpdateMatchResultDto } from './dto/update-match-result.dto';

@Controller('matches')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Post(':championshipId/generate')
  async generateMatches(
    @Param('championshipId') championshipId: string,
    @Body('startDate') startDate: Date,
  ) {
    return this.matchService.generateMatches(championshipId, startDate);
  }

  @Patch(':matchId/result')
  async updateMatchResult(
    @Param('matchId') matchId: string,
    @Body() updateDto: UpdateMatchResultDto,
  ) {
    return this.matchService.updateResult(matchId, updateDto);
  }

  @Get('championship/:championshipId/standings')
  async getStandings(@Param('championshipId') championshipId: string) {
    return this.matchService.getStandings(championshipId);
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match, MatchStatus } from './entities/match.entity';
import { Championship } from 'src/championship/entities/championship.entity';
import { Team } from 'src/maintainers/team/entities/team.entity';
import { UpdateMatchResultDto } from './dto/update-match-result.dto';
import { ChampionshipStanding } from './interfaces/championship-standing.interface';

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
    @InjectRepository(Championship)
    private readonly championshipRepository: Repository<Championship>,
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
  ) {}

  async generateMatches(
    championshipId: string,
    startDate: Date,
  ): Promise<Match[]> {
    const championship = await this.championshipRepository.findOne({
      where: { id: championshipId },
      relations: ['divisions', 'divisions.teams'],
    });

    if (!championship) {
      throw new NotFoundException('Championship not found');
    }

    // Obtener todos los equipos del campeonato
    const teams = championship.divisions.flatMap((division) => division.teams);
    if (teams.length < 2) {
      throw new NotFoundException('Not enough teams to generate matches');
    }

    const matches: Match[] = [];
    const matchDate = new Date(startDate);

    // Generar todos los partidos (ida)
    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        const match = this.matchRepository.create({
          homeTeam: teams[i],
          awayTeam: teams[j],
          championship,
          date: new Date(matchDate), // Fecha incremental
          status: MatchStatus.PENDING,
        });
        matches.push(match);

        // Incrementar fecha
        matchDate.setDate(matchDate.getDate() + 7); // Una semana después
      }
    }

    // Guardar todos los partidos en la base de datos
    return this.matchRepository.save(matches);
  }

  async updateResult(
    matchId: string,
    updateDto: UpdateMatchResultDto,
  ): Promise<Match> {
    const match = await this.matchRepository.findOne({
      where: { id: matchId },
    });

    if (!match) {
      throw new NotFoundException('Match not found');
    }

    match.homeScore = updateDto.homeScore ?? match.homeScore;
    match.awayScore = updateDto.awayScore ?? match.awayScore;

    return this.matchRepository.save(match);
  }

  async getStandings(championshipId: string): Promise<ChampionshipStanding[]> {
    // Obtener todos los partidos del campeonato
    const matches = await this.matchRepository.find({
      where: { championship: { id: championshipId } },
      relations: ['homeTeam', 'awayTeam'],
    });

    if (!matches.length) {
      throw new NotFoundException('No matches found for this championship');
    }

    // Inicializar la tabla de posiciones
    const standings: Record<string, ChampionshipStanding> = {};

    matches.forEach((match) => {
      const { homeTeam, awayTeam, homeScore, awayScore } = match;

      // Asegurar que ambos equipos existan en la tabla
      if (!standings[homeTeam.id]) {
        standings[homeTeam.id] = this.initializeTeamStanding(
          homeTeam.id,
          homeTeam.name,
        );
      }
      if (!standings[awayTeam.id]) {
        standings[awayTeam.id] = this.initializeTeamStanding(
          awayTeam.id,
          awayTeam.name,
        );
      }

      // Si hay resultado registrado, actualizar la tabla
      if (homeScore !== null && awayScore !== null) {
        this.updateTeamStanding(standings[homeTeam.id], homeScore, awayScore);
        this.updateTeamStanding(standings[awayTeam.id], awayScore, homeScore);
      }
    });

    // Convertir a un arreglo y ordenar por puntos y diferencia de goles
    return Object.values(standings).sort((a, b) =>
      b.points !== a.points
        ? b.points - a.points
        : b.goalDifference - a.goalDifference,
    );
  }

  private initializeTeamStanding(
    teamId: string,
    teamName: string,
  ): ChampionshipStanding {
    return {
      teamId,
      teamName,
      matchesPlayed: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
    };
  }

  private updateTeamStanding(
    team: ChampionshipStanding,
    goalsFor: number,
    goalsAgainst: number,
  ): void {
    team.matchesPlayed += 1;
    team.goalsFor += goalsFor;
    team.goalsAgainst += goalsAgainst;
    team.goalDifference = team.goalsFor - team.goalsAgainst;

    if (goalsFor > goalsAgainst) {
      // Victoria
      team.wins += 1;
      team.points += 3;
    } else if (goalsFor === goalsAgainst) {
      // Empate
      team.draws += 1;
      team.points += 1;
    } else {
      // Derrota
      team.losses += 1;
    }
  }
}

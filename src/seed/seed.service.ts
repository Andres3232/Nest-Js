import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios, { AxiosInstance } from 'axios';
import { Model } from 'mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { PokemonService } from 'src/pokemon/pokemon.service';
import { PokeResponse } from './interfaces/poke-resp.interface';


@Injectable()
export class SeedService {

  private readonly axios: AxiosInstance = axios

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonService: Model<PokemonService>

  ) { }

  async executedSeed() {

    await this.pokemonService.deleteMany()
    const { data } = await this.axios.get<PokeResponse>(`https://pokeapi.co/api/v2/pokemon/?limit=10`);

    const pokemonInstert: {name:string, no: number}[] = []

    data.results.map(async ({ name, url }) => {

      const segment = url.split('/');
      const no = +segment[segment.length - 2];

      pokemonInstert.push({ name,no });

    });
    await this.pokemonService.insertMany(pokemonInstert);
    return `Seed executed`;
  }
}

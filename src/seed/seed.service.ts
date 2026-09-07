import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';
@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,

    private readonly http: AxiosAdapter,
  ) {}

  // private readonly axios: AxiosInstance = axios;

  async excuteSeed() {
    await this.pokemonModel.deleteMany({});

    // const { data } = await this.axios.get<PokeResponse>(
    const data = await this.http.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=650',
    );

    // const insertPromisesArray: Promise<Pokemon>[] = [];

    // for (const { name, url } of data.results) {
    //   const segments = url.split('/');
    //   const no = Number(segments[segments.length - 2]);

    //   console.log({ name, no });

    //   const pokemon = this.pokemonModel.create({ name, no });

    //   insertPromisesArray.push(pokemon);
    // }

    // await Promise.all(insertPromisesArray);

    const pokemonToInsert: { name: string; no: number }[] = [];

    data.results.forEach(({ name, url }) => {
      const segments = url.split('/');
      const no = Number(segments[segments.length - 2]);

      pokemonToInsert.push({ name, no });
    });

    await this.pokemonModel.insertMany(pokemonToInsert);

    return 'Seed executed';
  }
}

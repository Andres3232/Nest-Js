import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-resp.interface';


@Injectable()
export class SeedService {

  private readonly axios:AxiosInstance = axios;

  async executedSeed(){

    const {data} = await this.axios.get<PokeResponse>(`https://pokeapi.co/api/v2/pokemon/?limit=1`)

    data.results.map(({name,url})=>{

      const segment = url.split('/');
      const no = segment[ segment.length - 2 ];
      console.log({name,no})

    })
    return data.results
  }
}

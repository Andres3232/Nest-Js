import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';

@Injectable()
export class PokemonService {

  private defaultLimit: number;

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService
  ) {
     
    this.defaultLimit = configService.get<number>('defaultLimit');
     
   }


  async create(createPokemonDto: CreatePokemonDto) {

    try {

      createPokemonDto.name = createPokemonDto.name.toLowerCase()

      const pokemon = await this.pokemonModel.create(createPokemonDto)

      return pokemon

    } catch (error) {
      this.handleExceptions( error );
    }
  }

  findAll(paginationDto: PaginationDto) {

    const { limit = this.defaultLimit, offset = 0} = paginationDto;

    return this.pokemonModel.find()
      .limit( limit )
      .skip( offset )
      .sort({
        no: 1
      })
      .select('-__v');
  }

  async findOne(term: string) {

    let pokemon: Pokemon;

    //find by no
    if (!isNaN(+term))
      pokemon = await this.pokemonModel.findOne({ no: term });

    //find by mongo Id 
    if (!pokemon && isValidObjectId(term))
      pokemon = await this.pokemonModel.findById(term);

    //find by name
    if (!pokemon)
      pokemon = await this.pokemonModel.findOne({ name: term.toLowerCase().trim() })


    if (!pokemon)
      throw new NotFoundException(`Pokemon with id, name, no "${term}" no exist`);

    return pokemon;

  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {

    const pokemon = await this.findOne(term);

    if (updatePokemonDto.name)
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase().trim();

    try {

      await pokemon.updateOne(updatePokemonDto);

      return { ...pokemon.toJSON(), ...updatePokemonDto };

    } catch (error) {
      this.handleExceptions( error );
    }
  }

  async remove(id: string) {

    // let pokemon = await this.findOne( id );
    // await pokemon.deleteOne()

    const { deletedCount } = await this.pokemonModel.deleteOne({ _id:id });
    if( deletedCount === 0 )
      throw new BadRequestException(`Pokemon with "${id}" not found`);

    return;

  }

  private handleExceptions(error: any) {

    if (error.code === 11000)
      throw new BadRequestException(`Pokemon exist in db ${JSON.stringify(error.keyValue)}`)

    console.log(error)
    throw new InternalServerErrorException(`Can't create Pokemon - check server logs`)
  }
}

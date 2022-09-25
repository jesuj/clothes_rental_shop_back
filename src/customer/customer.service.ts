import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Repository } from 'typeorm';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';
import { validate as isUUID } from "uuid";

@Injectable()
export class CustomerService {

  private readonly logger = new Logger('CustomerService');

  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository:Repository<Customer>
  ){}

  async create(createCustomerDto: CreateCustomerDto) {
    try {
      const customer = this.customerRepository.create(createCustomerDto);
      await this.customerRepository.save(customer);
      return customer;
    } catch (error) {
      this.logger.error(error)
      throw new InternalServerErrorException('Unexpected error, check server logs');
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit, offset} = paginationDto;
    const customers = await this.customerRepository.find({
      take: limit,
      skip: offset
    }) 
    return customers;
  }

  async findOne(term: string) {
    let customer: Customer;
    if (isUUID(term)) {
      customer = await this.customerRepository.findOneBy({id: term});
    } else {
      const queryBuilder = this.customerRepository.createQueryBuilder('customer');
      customer = await queryBuilder
        .where(`UPPER(name) =:name or phone_number =:phone_number`, {
          name: term.toUpperCase(),
          phone_number: term
        })
        .getOne();
    }
    if (!customer) {
      throw new NotFoundException(`Customer with search term: ${term} not found`)
    }
    return customer;
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto) {
    let customer = await this.customerRepository.preload({id, ...updateCustomerDto});
    if (!customer) {
      throw new NotFoundException(`Customer whit id: ${id} not found`);
    }
    customer = await this.customerRepository.save(customer);
    return customer;
  }

  async remove(id: string) {
    const customer = await this.findOne(id);
    await this.customerRepository.remove(customer) ;
  }
}

import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'customers'})
export class Customer {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('varchar',{
        length: 40
    })
    name: string;

    @Column('varchar',{
        length: 15,
        nullable: true,
    })
    phone_number?: string;

    @Column('bool',{
        default: false,
    })
    have_ci: boolean;

}

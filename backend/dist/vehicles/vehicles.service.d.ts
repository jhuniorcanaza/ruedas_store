import { Repository } from 'typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { AutoDetail } from './entities/auto-detail.entity';
import { MotoDetail } from './entities/moto-detail.entity';
import { MaquinariaDetail } from './entities/maquinaria-detail.entity';
import { Specification } from '../specifications/entities/specification.entity';
import { User } from '../users/entities/user.entity';
import { Setting } from '../users/entities/setting.entity';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
export declare class VehiclesService {
    private readonly vehicleRepository;
    private readonly autoRepository;
    private readonly motoRepository;
    private readonly maquinariaRepository;
    private readonly specificationRepository;
    private readonly userRepository;
    private readonly settingRepository;
    constructor(vehicleRepository: Repository<Vehicle>, autoRepository: Repository<AutoDetail>, motoRepository: Repository<MotoDetail>, maquinariaRepository: Repository<MaquinariaDetail>, specificationRepository: Repository<Specification>, userRepository: Repository<User>, settingRepository: Repository<Setting>);
    findAll(query: {
        categoria?: string;
        condicion?: string;
        destacado?: string;
        search?: string;
    }): Promise<Vehicle[]>;
    findMyListings(userId: string): Promise<Vehicle[]>;
    findOne(id: string): Promise<Vehicle>;
    create(createVehicleDto: CreateVehicleDto, creator: any): Promise<Vehicle>;
    update(id: string, updateVehicleDto: any, user?: any): Promise<Vehicle>;
    remove(id: string, user?: any): Promise<{
        message: string;
    }>;
    findLiquidations(): Promise<Vehicle[]>;
    updateCommissionPayment(id: string, body: {
        comisionPagada: boolean;
        notasLiquidacion?: string;
    }): Promise<Vehicle>;
}

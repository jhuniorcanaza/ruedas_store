import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
export declare class VehiclesController {
    private readonly vehiclesService;
    constructor(vehiclesService: VehiclesService);
    findAll(categoria?: string, condicion?: string, destacado?: string, search?: string): Promise<import("./entities/vehicle.entity").Vehicle[]>;
    findMyListings(req: any): Promise<import("./entities/vehicle.entity").Vehicle[]>;
    findOne(id: string): Promise<import("./entities/vehicle.entity").Vehicle>;
    create(req: any, createVehicleDto: CreateVehicleDto): Promise<import("./entities/vehicle.entity").Vehicle>;
    update(id: string, req: any, updateVehicleDto: any): Promise<import("./entities/vehicle.entity").Vehicle>;
    findLiquidations(): Promise<import("./entities/vehicle.entity").Vehicle[]>;
    updateCommissionPayment(id: string, body: {
        comisionPagada: boolean;
        notasLiquidacion?: string;
    }): Promise<import("./entities/vehicle.entity").Vehicle>;
    remove(id: string, req: any): Promise<{
        message: string;
    }>;
}

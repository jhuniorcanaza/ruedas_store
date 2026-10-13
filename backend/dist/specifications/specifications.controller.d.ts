import { SpecificationsService } from './specifications.service';
import { CreateGroupDto, CreateSpecificationDto, UpdateGroupDto, UpdateSpecificationDto } from './dto/create-spec.dto';
export declare class SpecificationsController {
    private readonly specsService;
    constructor(specsService: SpecificationsService);
    findAllGroups(): Promise<import("./entities/specification-group.entity").SpecificationGroup[]>;
    findAllSpecs(): Promise<import("./entities/specification.entity").Specification[]>;
    createGroup(createGroupDto: CreateGroupDto): Promise<import("./entities/specification-group.entity").SpecificationGroup>;
    updateGroup(id: number, updateGroupDto: UpdateGroupDto): Promise<import("./entities/specification-group.entity").SpecificationGroup>;
    deleteGroup(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
    createSpec(createSpecDto: CreateSpecificationDto): Promise<import("./entities/specification.entity").Specification>;
    updateSpec(id: number, updateSpecDto: UpdateSpecificationDto): Promise<import("./entities/specification.entity").Specification>;
    deleteSpec(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
}

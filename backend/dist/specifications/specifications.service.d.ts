import { Repository } from 'typeorm';
import { Specification } from './entities/specification.entity';
import { SpecificationGroup } from './entities/specification-group.entity';
import { CreateGroupDto, CreateSpecificationDto, UpdateGroupDto, UpdateSpecificationDto } from './dto/create-spec.dto';
export declare class SpecificationsService {
    private readonly specRepository;
    private readonly groupRepository;
    constructor(specRepository: Repository<Specification>, groupRepository: Repository<SpecificationGroup>);
    createGroup(createGroupDto: CreateGroupDto): Promise<SpecificationGroup>;
    findAllGroups(): Promise<SpecificationGroup[]>;
    findGroupById(id: number): Promise<SpecificationGroup>;
    updateGroup(id: number, updateGroupDto: UpdateGroupDto): Promise<SpecificationGroup>;
    deleteGroup(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
    createSpec(createSpecDto: CreateSpecificationDto): Promise<Specification>;
    findAllSpecs(): Promise<Specification[]>;
    findSpecById(id: number): Promise<Specification>;
    updateSpec(id: number, updateSpecDto: UpdateSpecificationDto): Promise<Specification>;
    deleteSpec(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
}

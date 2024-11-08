// GetProfilePictureByUserUuidUseCase.ts
import { ProfilePictureRepository } from "../domain/ProfilePictureRepository";
import { ProfilePicture } from "../domain/ProfilePicture";

export class GetProfilePictureByUserUuidUseCase {
    constructor(private readonly profilePictureRepository: ProfilePictureRepository) {}

    async run(userUuid: string): Promise<ProfilePicture | null> {
        const profilePicture = await this.profilePictureRepository.getByUserUuid(userUuid);
        if (!profilePicture) return null;
        
        // Asegúrate de devolver un objeto con el campo `url`
        return profilePicture;
    }
}




/*// GetProfilePictureByUserUuidUseCase.ts
import { ProfilePictureRepository } from "../domain/ProfilePictureRepository";
import { ProfilePicture } from "../domain/ProfilePicture";

export class GetProfilePictureByUserUuidUseCase {
    constructor(private readonly profilePictureRepository: ProfilePictureRepository) {}

    async run(userUuid: string): Promise<ProfilePicture | null> {
        return this.profilePictureRepository.getByUserUuid(userUuid);
    }
}*/

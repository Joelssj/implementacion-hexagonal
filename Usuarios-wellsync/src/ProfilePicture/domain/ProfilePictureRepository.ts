import { ProfilePicture } from "./ProfilePicture";

export interface ProfilePictureRepository {
    save(profilePicture: ProfilePicture): Promise<void>;
    getByUserUuid(userUuid: string): Promise<ProfilePicture | null>;
    delete(profilePictureId: string): Promise<void>;
    getByUuid(uuid: string): Promise<string | null>; 
}

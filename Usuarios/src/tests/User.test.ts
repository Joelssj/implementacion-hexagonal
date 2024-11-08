/*import { CreateUserAndSendTokenUseCase } from '../User/application/CreateUserAndSendTokenUseCase';
import { UsersRepository } from '../User/domain/UsersRepository';
import { TokenRepository } from '../Token/domain/TokenRepository';
import { LeadsRepository } from '../../Lead/domain/LeadsRepository';
import { TwilioAdapter } from '../Notifications/infraestructure/adapters/TwilioAdapter';
import bcrypt from 'bcrypt';

describe('CreateUserAndSendTokenUseCase', () => {
    let createUserAndSendTokenUseCase: CreateUserAndSendTokenUseCase;
    let mockUsersRepository: Partial<UsersRepository>;
    let mockTokenRepository: Partial<TokenRepository>;
    let mockLeadsRepository: Partial<LeadsRepository>;
    let mockTwilioAdapter: Partial<TwilioAdapter>;

    beforeEach(() => {
        mockUsersRepository = {
            saveUser: jest.fn(),
        };
        mockTokenRepository = {
            saveToken: jest.fn(),
        };
        mockLeadsRepository = {
            getByEmail: jest.fn().mockResolvedValue({
                uuid: '123456789',
                nombre: 'Joel',
                correo: 'joelssj93@gmail.com',
                numero: '9661130883',
            }),
        };
        mockTwilioAdapter = {
            sendMessage: jest.fn(),
        };

        createUserAndSendTokenUseCase = new CreateUserAndSendTokenUseCase(
            mockUsersRepository as UsersRepository,
            mockTokenRepository as TokenRepository,
            mockLeadsRepository as LeadsRepository,
            mockTwilioAdapter as TwilioAdapter
        );
    });

    it('should create a user and send a verification token via WhatsApp', async () => {
        const correo = 'test@example.com';
        const password = 'securePassword';

        await createUserAndSendTokenUseCase.run(correo, password);

        expect(mockLeadsRepository.getByEmail).toHaveBeenCalledWith(correo);
        expect(mockUsersRepository.saveUser).toHaveBeenCalled();
        expect(mockTokenRepository.saveToken).toHaveBeenCalled();
        expect(mockTwilioAdapter.sendMessage).toHaveBeenCalled();
    });

    it('should hash the password before saving the user', async () => {
        const correo = 'test@example.com';
        const password = 'securePassword';

        await createUserAndSendTokenUseCase.run(correo, password);

        const savedUser = (mockUsersRepository.saveUser as jest.Mock).mock.calls[0][0];
        const isPasswordHashed = await bcrypt.compare(password, savedUser.password);
        expect(isPasswordHashed).toBe(true);
    });
});
*/
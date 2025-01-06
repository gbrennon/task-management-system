import { UserRepository } from "@user-management/domain/ports/user.repository";
import { LoginService } from "./login.service";
import { PasswordComparer } from "@user-management/domain/ports/password.comparer";
import { TokenGenerator } from "@user-management/domain/ports/token.generator";
import { instance, mock, when, deepEqual } from "ts-mockito";
import { User } from "@user-management/domain/entities/user";


describe('LoginService', () => {
  let loginService: LoginService;
  let userRepository: UserRepository;
  let passwordComparer: PasswordComparer;
  let tokenGenerator: TokenGenerator;
  const user = new User(
    '1',
    'John Doe',
    'john@email.com',
    'hashed-password'
  );


  beforeEach(() => {
    userRepository = mock<UserRepository>();
    passwordComparer = mock<PasswordComparer>();
    tokenGenerator = mock<TokenGenerator>();
    loginService = new LoginService(
      instance(userRepository),
      instance(passwordComparer),
      instance(tokenGenerator)
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe('execute', () => {
    it('should return token and user when login is successful', async () => {
      const loginInput = {
        email: user.email,
        password: 'password'
      };
      when(userRepository.findByEmail(user.email)).thenResolve(user);
      when(passwordComparer.compare(deepEqual({
        plainTextPassword: loginInput.password,
        encryptedPassword: user.password
      }))).thenResolve(true);
      when(tokenGenerator.generate(user.id)).thenReturn('token');

      const loginOutput = await loginService.execute(loginInput);

      expect(loginOutput.token).toBeDefined();
      expect(loginOutput.user).toEqual({
        id: user.id,
        name: user.name,
        email: user.email
      });
    });

    it('should throw an error when user is not found', async () => {
      const input = {
        email: user.email,
        password: 'password'
      };
      when(userRepository.findByEmail(user.email)).thenResolve(null);

      await expect(
        loginService.execute(input)
      ).rejects.toThrow('User not found');
    });

    it('should throw an error when password is incorrect', async () => {
      const input = {
        email: user.email,
        password: 'password'
      };
      when(userRepository.findByEmail(user.email)).thenResolve(user);
      when(passwordComparer.compare(deepEqual({
        plainTextPassword: input.password,
        encryptedPassword: user.password
      }))).thenResolve(false);
    });
  });
});
